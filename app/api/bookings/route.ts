import { NextResponse } from "next/server";
import { listBookings } from "@/lib/db";

export async function GET() {
  try {
    const bookings = await listBookings(100);
    return NextResponse.json({ bookings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[bookings]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
