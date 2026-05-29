import twilio from "twilio";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      "Missing Twilio env vars: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN"
    );
  }

  return twilio(accountSid, authToken);
}

export async function sendWhatsApp(
  to: string,
  body: string
): Promise<void> {
  const client = getTwilioClient();
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!from) throw new Error("Missing env var: TWILIO_PHONE_NUMBER");

  // Normalize to WhatsApp format
  const toWa = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const fromWa = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;

  await client.messages.create({ from: fromWa, to: toWa, body });
}

export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return false;
  return twilio.validateRequest(authToken, signature, url, params);
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build a TwiML response for voice calls.
 * Returns XML string that Twilio can consume.
 */
export function buildTwimlSay(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${xmlEscape(message)}</Say>
</Response>`;
}

/**
 * TwiML to forward a call to Bones' direct number.
 */
export function buildTwimlDial(number: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>${xmlEscape(number)}</Dial>
</Response>`;
}

/**
 * TwiML to record the caller's message and transcribe it.
 * The transcription is sent to actionUrl as a GET with TranscriptionText query param.
 */
export function buildTwimlGather(actionUrl: string): string {
  const safeUrl = xmlEscape(actionUrl);
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Hi, you have reached Bones private driver service in Puerto Vallarta.
    Please leave your name, requested service, date, and time after the tone,
    and we will confirm your booking via WhatsApp shortly.
  </Say>
  <Record action="${safeUrl}" maxLength="60" transcribe="true" transcribeCallback="${safeUrl}" />
</Response>`;
}
