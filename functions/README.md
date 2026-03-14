# AriGo AirGuard Pro — Cloud Functions

## What this does
- Watches Realtime Database `airguard_devices/{deviceId}/latest_reading`.
- If AQI crosses above 50, places a Twilio voice call to the configured number and speaks a safety alert.

## Required env vars
These can be provided either as Firebase **secrets** (for cloud deploy) or as normal environment variables (for local emulator / local scripts).

Required:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` (Twilio number)

Optional:
- `ALERT_TO_NUMBER` (default `+919372797798`)
- `ALERT_SECRET` (shared secret used only by the deployed `alertVoice` endpoint)

## Local test (no Blaze required)

### 1) Install
```bash
npm --prefix functions install
```

### 2) Provide env vars (recommended: use a local `.env` file)
Create `functions/.env` (it is gitignored):

```bash
cp functions/.env.example functions/.env
```

Fill in the required values in `functions/.env`:
```bash
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
ALERT_TO_NUMBER=+919372797798

# Optional modulation
ALERT_VOICE=woman         # native: woman|man (female/male)
ALERT_SPEECH_RATE=normal  # slow|normal|fast
```

### 3) Option A — Direct Twilio call (fastest)
From the repo root:
```bash
npm run functions:call:test -- --aqi 55 --deviceId AIRGUARD_001 --to +919372797798
```

With different modulation:
```bash
npm run functions:call:test -- --aqi 55 --deviceId AIRGUARD_001 --to +919372797798 --voice woman --rate slow
```

Or from inside `functions/`:
```bash
npm run call:test -- --aqi 55 --deviceId AIRGUARD_001 --to +919372797798
```

### 3) Option B — Emulator + threshold trigger
Start emulators (Functions + RTDB):
From the repo root:
```bash
npm run functions:serve
```

Or from inside `functions/`:
```bash
npm run serve
```

In another terminal, trigger an upward crossing in the RTDB *emulator* (default RTDB emulator port is usually `9000`):
```bash
curl -sS -X PUT -H 'Content-Type: application/json' \
	--data '{"After aqi":45}' \
	'http://127.0.0.1:9000/airguard_devices/AIRGUARD_001/latest_reading.json?ns=test-1-eee0e'

curl -sS -X PUT -H 'Content-Type: application/json' \
	--data '{"After aqi":55}' \
	'http://127.0.0.1:9000/airguard_devices/AIRGUARD_001/latest_reading.json?ns=test-1-eee0e'
```

## Deploy (requires Blaze plan)

## Deploy
```bash
## Prerequisite: Blaze plan
# Cloud Functions deployment and Functions secrets require the Blaze (pay-as-you-go) plan.

# One-time CLI login
npx -y firebase-tools login

# Install functions deps
npm --prefix functions install

# Set secrets (will prompt you to paste values)
npx -y firebase-tools --project test-1-eee0e functions:secrets:set TWILIO_ACCOUNT_SID
npx -y firebase-tools --project test-1-eee0e functions:secrets:set TWILIO_AUTH_TOKEN
npx -y firebase-tools --project test-1-eee0e functions:secrets:set TWILIO_PHONE_NUMBER
npx -y firebase-tools --project test-1-eee0e functions:secrets:set ALERT_SECRET

# Optional: set `ALERT_TO_NUMBER` as a runtime env var in Cloud Functions/Cloud Run
# (or just keep the default number hardcoded in the function)

npm --prefix functions run deploy
```

## Notes
- Calls are triggered only on upward crossing (<= 50 → > 50).
- A 15-minute cooldown prevents spam if values bounce around the threshold.
