import { NextRequest, NextResponse } from "next/server";
import { notifyLeadReceived } from "@/lib/notify";
import { trackEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim() ?? "Unknown";
    const phone = body.phone?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Save to Supabase if configured
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (url && key) {
        const supabase = createClient(url, key);
        await supabase.from("leads").insert({ name, phone, email: email || null, message, source: "contact_form" });
      }
    } catch {
      // DB save failure is non-fatal
    }

    trackEvent({ eventType: "booking_start", page: "contact_form" }).catch(() => {});
    await notifyLeadReceived(name, phone || email || "no contact provided", message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[leads]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
