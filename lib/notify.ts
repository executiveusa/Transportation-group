import { sendWhatsApp } from "./twilio";
import { getDriverConfig } from "./driver-config";
import type { Booking, DailySummary } from "./types";

const driver = getDriverConfig();

export async function notifyBookingReceived(booking: Booking): Promise<void> {
  const service = booking.service?.replace("_", " ").toUpperCase() ?? "CUSTOM";
  const when = booking.date
    ? `${booking.date}${booking.time ? " at " + booking.time : ""}`
    : "date TBD";

  const msg =
    `New booking just came in!\n\n` +
    `Service: ${service}\n` +
    `When: ${when}\n` +
    `Passengers: ${booking.passengers ?? 1}\n` +
    `Duration: ${booking.duration ? booking.duration + " hrs" : "TBD"}\n` +
    `From: ${booking.phone_number}\n` +
    (booking.name ? `Name: ${booking.name}\n` : "") +
    (booking.notes ? `Notes: ${booking.notes}\n` : "") +
    `\nConfirmation was sent to the client automatically.`;

  await sendWhatsApp(driver.notifyPhone, msg);
}

export async function notifyDailySummary(summary: DailySummary): Promise<void> {
  const msg =
    `Good morning! Here is your summary for ${summary.date}:\n\n` +
    `Site visitors: ${summary.pageViews}\n` +
    `WhatsApp taps: ${summary.whatsappClicks}\n` +
    `New bookings: ${summary.newBookings}\n` +
    `Est. revenue: $${summary.revenueUsd.toFixed(0)} USD\n\n` +
    `Have a great day out there.`;

  await sendWhatsApp(driver.notifyPhone, msg);
}

export async function notifyLeadReceived(
  name: string,
  phone: string,
  message: string
): Promise<void> {
  const msg =
    `New inquiry from your website!\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Message: ${message}\n\n` +
    `Reply to this WhatsApp to follow up.`;

  await sendWhatsApp(driver.notifyPhone, msg);
}

export async function silentNotify(msg: string): Promise<void> {
  try {
    await sendWhatsApp(driver.notifyPhone, msg);
  } catch {
    // Never let notification failures crash the main flow
  }
}
