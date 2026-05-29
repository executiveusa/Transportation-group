import { NextRequest, NextResponse } from "next/server";
import { getDrivingMode } from "@/lib/db";
import {
  buildTwimlDial,
  buildTwimlGather,
  validateTwilioSignature,
} from "@/lib/twilio";

const DRIVER_PHONE = process.env.DRIVER_PHONE ?? "+523221175350";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = Object.fromEntries(new URLSearchParams(body));

    // Validate Twilio signature
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) {
      const signature = request.headers.get("x-twilio-signature") ?? "";
      const url = `${appUrl}/api/voice`;
      if (!validateTwilioSignature(signature, url, params)) {
        return new NextResponse(buildTwimlDial(DRIVER_PHONE), {
          status: 403,
          headers: { "Content-Type": "text/xml" },
        });
      }
    }

    const from = params.From ?? params.from ?? "";

    const drivingModeEnabled = await getDrivingMode();

    if (drivingModeEnabled) {
      // AI handles the call — gather voice input and record
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? `https://${request.headers.get("host")}`;
      const actionUrl = `${baseUrl}/api/voice`;
      const twiml = buildTwimlGather(actionUrl);

      return new NextResponse(twiml, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    } else {
      // Forward directly to Bones
      const twiml = buildTwimlDial(DRIVER_PHONE);
      console.info(`[voice] Forwarding call from ${from} to ${DRIVER_PHONE}`);

      return new NextResponse(twiml, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[voice]", message);

    // Always return TwiML even on error — forward to driver as fallback
    const twiml = buildTwimlDial(DRIVER_PHONE);
    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
}

// Handle transcription callbacks from Twilio recording
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const transcript = url.searchParams.get("TranscriptionText") ?? "";
  const from = url.searchParams.get("From") ?? "";

  if (transcript && from) {
    // Fire-and-forget: process the voice booking in background
    import("@/lib/agent")
      .then(({ processBookingMessage, mapServiceLabel }) =>
        processBookingMessage(from, transcript).then(async (result) => {
          const { saveBooking } = await import("@/lib/db");
          const { sendWhatsApp } = await import("@/lib/twilio");

          await saveBooking({
            phone_number: from,
            name: result.name,
            service: mapServiceLabel(result.service ?? "custom"),
            date: result.date,
            time: result.time,
            duration: result.duration,
            passengers: result.passengers ?? 1,
            notes: result.notes,
            raw_message: transcript,
            ai_response: result.confirmation_message,
            status: "confirmed",
          });

          if (result.confirmation_message) {
            await sendWhatsApp(from, result.confirmation_message);
          }
        })
      )
      .catch((e) => console.error("[voice-transcript]", e));
  }

  return NextResponse.json({ received: true });
}
