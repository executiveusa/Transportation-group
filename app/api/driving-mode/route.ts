import { NextRequest, NextResponse } from "next/server";
import { getDrivingMode, setDrivingMode } from "@/lib/db";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  // If no secret configured, allow (development mode)
  if (!secret) return true;
  const provided = request.headers.get("x-admin-secret");
  return provided === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const enabled = await getDrivingMode();
    return NextResponse.json({ enabled });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[driving-mode GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { enabled: boolean };

    if (typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { error: "Body must contain { enabled: boolean }" },
        { status: 400 }
      );
    }

    await setDrivingMode(body.enabled);

    return NextResponse.json({
      enabled: body.enabled,
      message: body.enabled
        ? "Driving mode ON — AI is handling all calls and bookings"
        : "Driving mode OFF — calls forwarded directly to driver",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[driving-mode POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
