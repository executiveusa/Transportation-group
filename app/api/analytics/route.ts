import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import type { AnalyticsEvent } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<AnalyticsEvent>;
    if (!body.eventType) {
      return NextResponse.json({ error: "eventType required" }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const referrer = request.headers.get("referer") ?? undefined;

    await trackEvent({
      eventType: body.eventType,
      page: body.page,
      referrer: body.referrer ?? referrer,
      sessionId: body.sessionId,
      metadata: { ...body.metadata, ip: forwardedFor ?? "unknown" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Analytics errors must never surface to client
    console.error("[analytics]", err);
    return NextResponse.json({ ok: true });
  }
}
