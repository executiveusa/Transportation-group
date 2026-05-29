import { NextRequest, NextResponse } from "next/server";
import { processBookingMessage, mapServiceLabel } from "@/lib/agent";
import { saveBooking } from "@/lib/db";
import { sendWhatsApp, validateTwilioSignature } from "@/lib/twilio";
import type { Booking } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Twilio sends form-encoded data
    const body = await request.text();
    const params = Object.fromEntries(new URLSearchParams(body));

    // Validate Twilio signature to reject spoofed requests
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) {
      const signature = request.headers.get("x-twilio-signature") ?? "";
      const url = `${appUrl}/api/whatsapp`;
      if (!validateTwilioSignature(signature, url, params)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const phone = params.From ?? params.phone ?? "";
    const message = params.Body ?? params.message ?? "";

    if (!phone || !message) {
      return NextResponse.json(
        { error: "Missing phone or message" },
        { status: 400 }
      );
    }

    // Process booking via AI agent
    const result = await processBookingMessage(phone, message);

    // Persist booking
    const booking: Omit<Booking, "id" | "created_at" | "updated_at"> = {
      phone_number: phone,
      name: result.name ?? undefined,
      service: mapServiceLabel(result.service ?? "custom"),
      date: result.date ?? undefined,
      time: result.time ?? undefined,
      duration: result.duration ?? undefined,
      passengers: result.passengers ?? 1,
      notes: result.notes ?? undefined,
      raw_message: message,
      ai_response: result.confirmation_message ?? undefined,
      status: "confirmed",
    };

    const saved = await saveBooking(booking);

    // Send confirmation back via WhatsApp
    if (result.confirmation_message) {
      await sendWhatsApp(phone, result.confirmation_message);
    }

    return NextResponse.json({ status: "booked", booking: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[whatsapp]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
