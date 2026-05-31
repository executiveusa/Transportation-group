import { NextRequest, NextResponse } from "next/server";
import { getDailySummary } from "@/lib/analytics";
import { notifyDailySummary } from "@/lib/notify";

// Called by Vercel Cron at 8 AM Mexico City time daily
export async function GET(request: NextRequest) {
  // Protect with CRON_SECRET or ADMIN_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET ?? process.env.ADMIN_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = yesterday.toISOString().split("T")[0];

  const summary = await getDailySummary(date);
  await notifyDailySummary(summary);

  return NextResponse.json({ sent: true, summary });
}
