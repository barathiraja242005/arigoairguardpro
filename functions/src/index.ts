import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { onValueWritten } from "firebase-functions/v2/database";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import twilio from "twilio";

function projectIdFromEnv(): string | undefined {
  const direct = process.env.GCLOUD_PROJECT;
  if (direct && direct.trim()) return direct.trim();

  const cfg = process.env.FIREBASE_CONFIG;
  if (!cfg) return undefined;
  try {
    const parsed = JSON.parse(cfg) as { projectId?: string };
    return parsed.projectId;
  } catch {
    return undefined;
  }
}

const adminApp = (() => {
  const runningInEmulator = process.env.FUNCTIONS_EMULATOR === "true" || !!process.env.FIREBASE_EMULATOR_HUB;
  if (!runningInEmulator) return initializeApp();

  const projectId = projectIdFromEnv();
  const host = process.env.FIREBASE_DATABASE_EMULATOR_HOST || "127.0.0.1:9000";
  const databaseURL = projectId ? `http://${host}?ns=${projectId}` : `http://${host}`;
  return initializeApp({ databaseURL });
})();

const THRESHOLD_AQI = 50;
const DEFAULT_TO_NUMBER = "+919372797798";
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes
const REGION = "us-central1";

// Secrets (stored in Google Secret Manager via `firebase functions:secrets:set`)
const TWILIO_ACCOUNT_SID = defineSecret("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = defineSecret("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = defineSecret("TWILIO_PHONE_NUMBER");
const ALERT_SECRET = defineSecret("ALERT_SECRET");

function readFromEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

function readSecretOrEnv(secret: { value: () => string }, envName: string): string {
  try {
    const v = secret.value();
    if (v && v.trim()) return v.trim();
  } catch {
    // ignore
  }

  const env = readFromEnv(envName);
  if (env) return env;

  throw new Error(`Missing ${envName}`);
}

function readOptionalSecretOrEnv(
  secret: { value: () => string },
  envName: string,
): string | undefined {
  try {
    const v = secret.value();
    if (v && v.trim()) return v.trim();
  } catch {
    // ignore
  }

  return readFromEnv(envName);
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function extractAqi(reading: any): number | undefined {
  if (!reading) return undefined;
  return (
    toNumber(reading["After aqi"]) ??
    toNumber(reading.aqi) ??
    toNumber(reading.AQI)
  );
}

function getTwilioClient() {
  const accountSid = readSecretOrEnv(TWILIO_ACCOUNT_SID, "TWILIO_ACCOUNT_SID");
  const authToken = readSecretOrEnv(TWILIO_AUTH_TOKEN, "TWILIO_AUTH_TOKEN");
  return twilio(accountSid, authToken);
}

function getFromNumber(): string {
  return readSecretOrEnv(TWILIO_PHONE_NUMBER, "TWILIO_PHONE_NUMBER");
}

function getToNumber(): string {
  return readFromEnv("ALERT_TO_NUMBER") ?? DEFAULT_TO_NUMBER;
}

type SpeechRate = "slow" | "normal" | "fast";

function getVoice(): string {
  return readFromEnv("ALERT_VOICE") ?? "woman";
}

function getSpeechRate(): SpeechRate {
  const v = (readFromEnv("ALERT_SPEECH_RATE") ?? "normal").toLowerCase();
  if (v === "slow" || v === "fast" || v === "normal") return v;
  return "normal";
}

function isEmulator(): boolean {
  return process.env.FUNCTIONS_EMULATOR === "true" || !!process.env.FIREBASE_EMULATOR_HUB;
}

function getAdminDb() {
  return getDatabase(adminApp);
}

function buildAlertText(deviceId: string, aqi: number | string): { main: string; outro: string } {
  return {
    main: `Alert from AriGo Air Guard Pro. The air quality index is ${aqi || "above safe levels"} for device ${deviceId}. Please wear the mask attached to your device and reduce outdoor activity.`,
    outro: "Stay safe. Goodbye.",
  };
}

function nativePauseSeconds(rate: SpeechRate): number {
  if (rate === "slow") return 2;
  if (rate === "fast") return 0;
  return 1;
}

function ssmlProsodyRate(rate: SpeechRate): "x-slow" | "medium" | "x-fast" {
  if (rate === "slow") return "x-slow";
  if (rate === "fast") return "x-fast";
  return "medium";
}

function buildAlertTwiml(deviceId: string, aqi: number | string): string {
  const twiml = new twilio.twiml.VoiceResponse();
  const voice = getVoice();
  const rate = getSpeechRate();
  const { main, outro } = buildAlertText(deviceId, aqi);

  const isPolly = voice.startsWith("Polly.");
  if (isPolly) {
    const ssmlMain = `<speak><prosody rate="${ssmlProsodyRate(rate)}">${main}</prosody></speak>`;
    const ssmlOutro = `<speak><prosody rate="${ssmlProsodyRate(rate)}">${outro}</prosody></speak>`;
    twiml.say({ voice: voice as any, language: "en-US" }, ssmlMain);
    twiml.pause({ length: 1 });
    twiml.say({ voice: voice as any, language: "en-US" }, ssmlOutro);
    twiml.hangup();
    return twiml.toString();
  }

  twiml.say(
    { voice: voice as any, language: "en-US" },
    main,
  );
  twiml.pause({ length: nativePauseSeconds(rate) });
  twiml.say(
    { voice: voice as any, language: "en-US" },
    outro,
  );
  twiml.hangup();
  return twiml.toString();
}

export const alertVoice = onRequest({ region: REGION, secrets: [ALERT_SECRET] }, (req, res) => {
  // Basic shared secret to prevent random public usage
  const secret = readOptionalSecretOrEnv(ALERT_SECRET, "ALERT_SECRET");
  if (secret && req.query.secret !== secret) {
    res.status(403).send("Forbidden");
    return;
  }

  const deviceId = (req.query.deviceId as string) || "ARIGO_001";
  const aqi = (req.query.aqi as string) || "";

  res.status(200).type("text/xml").send(buildAlertTwiml(deviceId, aqi));
});

export const aqiAlertCall = onValueWritten(
  {
    ref: "/airguard_devices/{deviceId}/latest_reading",
    region: REGION,
    secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, ALERT_SECRET],
  },
  async (event) => {
    const deviceId = event.params.deviceId as string;

    const beforeReading = event.data.before.val();
    const afterReading = event.data.after.val();

    const testId = typeof afterReading?.__test_id === "string" ? (afterReading.__test_id as string) : undefined;

    const beforeAqi = extractAqi(beforeReading);
    const afterAqi = extractAqi(afterReading);

    if (afterAqi === undefined) return;

    const wasOver = (beforeAqi ?? -Infinity) > THRESHOLD_AQI;
    const isOver = afterAqi > THRESHOLD_AQI;

    // Trigger only on crossing upward into the unsafe zone
    if (!isOver || wasOver) return;

    const db = getAdminDb();
    const metaRef = db.ref(`airguard_devices/${deviceId}/alerts/aqi_over_50`);
    const metaSnap = await metaRef.get();
    const lastCalledAt = metaSnap.child("last_called_at").val() as string | null;

    if (lastCalledAt) {
      const lastMs = Date.parse(lastCalledAt);
      if (Number.isFinite(lastMs) && Date.now() - lastMs < COOLDOWN_MS) {
        logger.info("Skipping call due to cooldown", { deviceId, afterAqi });
        return;
      }
    }

    const client = getTwilioClient();
    const from = getFromNumber();
    const to = getToNumber();

    logger.info("Placing alert call", { deviceId, to, afterAqi, emulator: isEmulator(), testId });

    const call = await (async () => {
      if (isEmulator()) {
        return client.calls.create({
          to,
          from,
          twiml: buildAlertTwiml(deviceId, afterAqi),
        });
      }

      const projectId = process.env.GCLOUD_PROJECT;
      if (!projectId) {
        throw new Error("Missing GCLOUD_PROJECT in runtime environment");
      }

      const url = new URL(`https://${REGION}-${projectId}.cloudfunctions.net/alertVoice`);
      const secret = readOptionalSecretOrEnv(ALERT_SECRET, "ALERT_SECRET");
      if (secret) url.searchParams.set("secret", secret);
      url.searchParams.set("deviceId", deviceId);
      url.searchParams.set("aqi", String(afterAqi));

      return client.calls.create({
        to,
        from,
        url: url.toString(),
        method: "GET",
      });
    })();

    await metaRef.update({
      last_called_at: new Date().toISOString(),
      last_called_aqi: afterAqi,
      last_call_sid: call.sid,
      threshold: THRESHOLD_AQI,
      ...(testId ? { last_test_id: testId } : {}),
    });
  },
);
