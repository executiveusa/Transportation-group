import { NextRequest, NextResponse } from "next/server";
import { listBookings, saveBooking } from "@/lib/db";
import type { ServiceType } from "@/lib/types";

export async function GET() {
  try {
    const bookings = await listBookings(100);
    return NextResponse.json({ bookings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[bookings GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface BookingBody {
  name?: string;
  phone: string;
  service: ServiceType;
  date?: string;
  time?: string;
  passengers?: number;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingBody;

    if (!body.phone || !body.service) {
      return NextResponse.json(
        { error: "Missing required fields: phone and service" },
        { status: 400 }
      );
    }

    const phone = body.phone.replace(/\s/g, "");
    const whatsappNumber = "523221175350";
    const prefilledText = encodeURIComponent(
      `Hi Bones, I'd like to book: ${body.service}${body.date ? ` on ${body.date}` : ""}${body.notes ? `. Notes: ${body.notes}` : ""}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledText}`;

    const booking = await saveBooking({
      phone_number: phone,
      name: body.name,
      service: body.service,
      date: body.date,
      time: body.time,
      passengers: body.passengers ?? 1,
      notes: body.notes,
      status: "confirmed",
    });

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking received. Bones will confirm via WhatsApp shortly.",
      whatsappUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[bookings POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
