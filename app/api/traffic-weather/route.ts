import { NextRequest, NextResponse } from "next/server";
import { getTrafficAndWeather } from "@/lib/gemini";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.searchParams.get("origin") ?? "";
  const destination = url.searchParams.get("destination") ?? "";

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Query params 'origin' and 'destination' are required" },
      { status: 400 }
    );
  }

  try {
    const data = await getTrafficAndWeather(origin, destination);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[traffic-weather]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
