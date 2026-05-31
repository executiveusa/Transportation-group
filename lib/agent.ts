import OpenAI from "openai";
import type { AgentBookingResult, ServiceType } from "./types";
import { getDriverConfig } from "./driver-config";

const driver = getDriverConfig();

const SYSTEM_PROMPT = `You are ${driver.name}'s personal booking assistant — a private driver service based in ${driver.area}.

${driver.name} offers these services:
- Airport transfers: $35-50 depending on location
- Hourly rate: $45/hour (minimum 2 hours)
- Full night out: $50/hour (4-hour minimum)
- Shopping tour: $40/hour
- Day trips (secret beaches, Las Animas, Yelapa, Colomitos): $45/hour (full day minimum 8 hrs)
- Custom routes: $45/hour

Cancellation policy:
- Cancel 24hrs+ before: full refund
- Cancel 4-12hrs before: 50% charge
- Cancel <4hrs before: 100% charge
- Bookings of 4+ hours: 20% retention fee if canceled

When someone contacts you, extract booking details and respond with valid JSON:
{
  "service": "airport|shopping|business|night_out|hotel|events|day_trip|custom",
  "date": "YYYY-MM-DD or natural language like 'tomorrow'",
  "time": "HH:MM or descriptive",
  "duration": number_of_hours_or_null,
  "passengers": number_or_1,
  "name": "customer name or null",
  "notes": "any special requests",
  "confirmation_message": "Friendly reply in English. Include booking details, rate estimate, and a warm local touch. Keep under 180 words. Sign as ${driver.name}."
}

If you cannot determine a field, set it to null. Always include confirmation_message.
Respond ONLY with valid JSON. No markdown fences.`;

function getPplxClient(): OpenAI {
  const apiKey = process.env.PPLX_API_KEY;
  if (!apiKey) throw new Error("Missing env var: PPLX_API_KEY");
  return new OpenAI({ apiKey, baseURL: "https://api.perplexity.ai" });
}

export async function processBookingMessage(
  phoneNumber: string,
  message: string
): Promise<AgentBookingResult> {
  const client = getPplxClient();

  const completion = await client.chat.completions.create({
    model: "llama-3.1-sonar-small-128k-online",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Customer phone: ${phoneNumber}\nMessage: ${message}` },
    ],
    temperature: 0.2,
    max_tokens: 600,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  try {
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");
    return JSON.parse(cleaned) as AgentBookingResult;
  } catch {
    return {
      notes: message,
      confirmation_message: `Got your message! ${driver.name} will confirm your booking shortly.\n\nThanks for reaching out — looking forward to showing you around.`,
    };
  }
}

export function mapServiceLabel(service: string): ServiceType {
  const map: Record<string, ServiceType> = {
    airport: "airport",
    shopping: "shopping",
    business: "business",
    night_out: "night_out",
    nightout: "night_out",
    night: "night_out",
    hotel: "hotel",
    events: "events",
    event: "events",
    day_trip: "day_trip",
    daytrip: "day_trip",
    day: "day_trip",
    beach: "day_trip",
    tour: "day_trip",
    custom: "custom",
  };
  return map[service?.toLowerCase()] ?? "custom";
}
