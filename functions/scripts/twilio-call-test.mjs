import twilio from "twilio";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function readEnv(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : undefined;
}

function tryLoadDotEnv() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "functions/.env"),
    path.resolve(__dirname, "../.env"),
  ];

  const envPath = candidates.find((p) => fs.existsSync(p));
  if (!envPath) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function requireEnv(name) {
  const v = readEnv(name);
  if (!v) throw new Error(`Missing ${name} in environment`);
  return v;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (!val || val.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = val;
      i++;
    }
  }
  return args;
}

function getSpeechRate() {
  const v = (readEnv("ALERT_SPEECH_RATE") || "normal").toLowerCase();
  return v === "slow" || v === "fast" || v === "normal" ? v : "normal";
}

function nativePauseSeconds(rate) {
  if (rate === "slow") return 2;
  if (rate === "fast") return 0;
  return 1;
}

function ssmlProsodyRate(rate) {
  if (rate === "slow") return "x-slow";
  if (rate === "fast") return "x-fast";
  return "medium";
}

function buildAlertText({ deviceId, aqi }) {
  return {
    main: `Alert from AriGo Air Guard Pro. The air quality index is ${aqi || "above safe levels"} for device ${deviceId}. Please wear the mask attached to your device and reduce outdoor activity.`,
    outro: "Stay safe. Goodbye.",
  };
}

function buildAlertTwiml({ deviceId, aqi }) {
  const twiml = new twilio.twiml.VoiceResponse();
  const voice = readEnv("ALERT_VOICE") || "woman";
  const rate = getSpeechRate();
  const { main, outro } = buildAlertText({ deviceId, aqi });

  const isPolly = voice.startsWith("Polly.");
  if (isPolly) {
    const ssmlMain = `<speak><prosody rate="${ssmlProsodyRate(rate)}">${main}</prosody></speak>`;
    const ssmlOutro = `<speak><prosody rate="${ssmlProsodyRate(rate)}">${outro}</prosody></speak>`;
    twiml.say({ voice, language: "en-US" }, ssmlMain);
    twiml.pause({ length: 1 });
    twiml.say({ voice, language: "en-US" }, ssmlOutro);
    twiml.hangup();
    return twiml.toString();
  }

  twiml.say(
    { voice, language: "en-US" },
    main,
  );
  twiml.pause({ length: nativePauseSeconds(rate) });
  twiml.say(
    { voice, language: "en-US" },
    outro,
  );
  twiml.hangup();
  return twiml.toString();
}

async function main() {
  tryLoadDotEnv();

  const args = parseArgs(process.argv);

  const accountSid = requireEnv("TWILIO_ACCOUNT_SID");
  const authToken = requireEnv("TWILIO_AUTH_TOKEN");
  const from = requireEnv("TWILIO_PHONE_NUMBER");

  const to = args.to || readEnv("ALERT_TO_NUMBER") || "+919372797798";
  const deviceId = args.deviceId || "ARIGO_001";
  const aqi = args.aqi || "55";

  if (args.voice) process.env.ALERT_VOICE = String(args.voice);
  if (args.rate) process.env.ALERT_SPEECH_RATE = String(args.rate);

  const client = twilio(accountSid, authToken);

  const call = await client.calls.create({
    to,
    from,
    twiml: buildAlertTwiml({ deviceId, aqi }),
  });

  console.log(JSON.stringify({ sid: call.sid, to, from, deviceId, aqi }, null, 2));
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
