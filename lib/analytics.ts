import type { AnalyticsEvent, DailySummary } from "./types";

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return; // Fail silently if not configured

    const supabase = createClient(url, key);
    const { getDriverConfig } = await import("./driver-config");
    const driver = getDriverConfig();

    // Resolve driver_id from slug
    const { data: driverRow } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("slug", driver.slug)
      .single();

    await supabase.from("site_analytics").insert({
      driver_id: driverRow?.id,
      event_type: event.eventType,
      page: event.page,
      referrer: event.referrer,
      session_id: event.sessionId,
      metadata: event.metadata ?? {},
    });
  } catch {
    // Analytics must never throw — swallow everything
  }
}

export async function getDailySummary(date: string): Promise<DailySummary> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return emptyDay(date);

    const supabase = createClient(url, key);

    const dayStart = `${date}T00:00:00Z`;
    const dayEnd = `${date}T23:59:59Z`;

    const [{ count: pageViews }, { count: waClicks }, bookingsResult] =
      await Promise.all([
        supabase
          .from("site_analytics")
          .select("id", { count: "exact", head: true })
          .eq("event_type", "page_view")
          .gte("created_at", dayStart)
          .lte("created_at", dayEnd),
        supabase
          .from("site_analytics")
          .select("id", { count: "exact", head: true })
          .eq("event_type", "whatsapp_click")
          .gte("created_at", dayStart)
          .lte("created_at", dayEnd),
        supabase
          .from("bookings")
          .select("duration, service")
          .gte("created_at", dayStart)
          .lte("created_at", dayEnd),
      ]);

    const bookings = bookingsResult.data ?? [];
    const revenue = bookings.reduce((sum, b) => {
      const hrs = b.duration ?? 2;
      const rate =
        b.service === "airport" ? 42.5 : b.service === "night_out" ? 50 : 45;
      return sum + hrs * rate;
    }, 0);

    return {
      date,
      pageViews: pageViews ?? 0,
      whatsappClicks: waClicks ?? 0,
      newBookings: bookings.length,
      revenueUsd: revenue,
    };
  } catch {
    return emptyDay(date);
  }
}

function emptyDay(date: string): DailySummary {
  return { date, pageViews: 0, whatsappClicks: 0, newBookings: 0, revenueUsd: 0 };
}
