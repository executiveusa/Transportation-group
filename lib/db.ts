import { createClient } from "@supabase/supabase-js";
import type { Booking, DrivingModeState } from "./types";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key);
}

export async function saveBooking(
  booking: Omit<Booking, "id" | "created_at" | "updated_at">
): Promise<Booking> {
  const supabase = getSupabaseClient();

  // Apply cancellation policy label for 4+ hour bookings
  // 4+ hour bookings carry an additional 20% retention fee on top of the standard policy
  const policy =
    booking.duration && booking.duration >= 4
      ? "Cancel 24hrs+: full refund. 4-12hrs: 50% charge. <4hrs: 100% charge. Note: 20% retention fee applies to bookings of 4+ hours."
      : "Cancel 24hrs+: full refund. 4-12hrs: 50% charge. <4hrs: 100% charge.";

  const { data, error } = await supabase
    .from("bookings")
    .insert({ ...booking, cancellation_policy: policy, status: "confirmed" })
    .select()
    .single();

  if (error) throw new Error(`Failed to save booking: ${error.message}`);
  return data as Booking;
}

export async function listBookings(limit = 50): Promise<Booking[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to list bookings: ${error.message}`);
  return (data as Booking[]) ?? [];
}

export async function getDrivingMode(): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("driving_mode")
    .select("enabled")
    .eq("id", 1)
    .single();

  if (error) {
    // Row may not exist yet — default to disabled
    return false;
  }
  return (data as Pick<DrivingModeState, "enabled">).enabled;
}

export async function setDrivingMode(enabled: boolean): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("driving_mode").upsert({
    id: 1,
    enabled,
    started_at: enabled ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  });

  if (error)
    throw new Error(`Failed to set driving mode: ${error.message}`);
}
