import OpenAI from "openai";
import type { AgentBookingResult, ServiceType } from "./types";

const SYSTEM_PROMPT = `You are Bones' personal booking assistant for a private driver service in Puerto Vallarta, Mexico.

Bones offers these services:
- Airport transfers: $35-50 depending on location
- Hourly rate: $45/hour (minimum 2 hours)
- Full night out: $50/hour (4-hour minimum recommended)
- Shopping tour: $40/hour

Cancellation policy:
- Cancel 24hrs+ before: full refund
- Cancel 4-12hrs before: 50% charge
- Cancel <4hrs before: 100% charge
- For bookings 4+ hours: 20% retention fee if canceled

When someone contacts you for a booking, extract the following from their message and respond with a JSON object:
{
  "service": "airport|shopping|business|night_out|hotel|events|custom",
  "date": "YYYY-MM-DD or descriptive like 'tomorrow'",
  "time": "HH:MM in 24h or descriptive like '10am'",
  "duration": number_of_hours_or_null,
  "passengers": number_or_1,
  "name": "customer name or null",
  "notes": "any special requests",
  "confirmation_message": "A friendly confirmation message in English and Spanish to send back to the customer. Keep it under 200 words. Include the booking details and rate estimate."
}

If you cannot determine a field, set it to null. Always include a confirmation_message.
Respond ONLY with valid JSON. No markdown fences.`;

function getPplxClient(): OpenAI {
  const apiKey = process.env.PPLX_API_KEY;
  if (!apiKey) {
    throw new Error("Missing env var: PPLX_API_KEY");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://api.perplexity.ai",
  });
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
      {
        role: "user",
        content: `Customer phone: ${phoneNumber}\nMessage: ${message}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 600,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  try {
    // Strip markdown fences if the model wraps output despite instructions
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");
    const parsed = JSON.parse(cleaned) as AgentBookingResult;
    return parsed;
  } catch {
    // Fallback: return minimal result with raw text as note
    return {
      notes: message,
      confirmation_message:
        "Thanks for reaching out! Bones will confirm your booking shortly.\n\nGracias por comunicarte. Bones confirmará tu reserva pronto.",
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
    custom: "custom",
  };
  return map[service?.toLowerCase()] ?? "custom";
}
