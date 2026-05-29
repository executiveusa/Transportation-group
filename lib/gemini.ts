import type { TrafficWeatherResponse } from "./types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

export async function getTrafficAndWeather(
  origin: string,
  destination: string
): Promise<TrafficWeatherResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      origin,
      destination,
      error: "Missing env var: GEMINI_API_KEY",
      weather: { description: "Data unavailable" },
      traffic: { condition: "Unknown" },
    };
  }

  const prompt = `You are a local traffic and weather assistant for Puerto Vallarta, Mexico.

Provide a brief real-time estimate for:
- Origin: ${origin}
- Destination: ${destination}
- Current date/time: ${new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })}

Respond ONLY with this JSON (no markdown, no code fences):
{
  "weather": {
    "description": "brief description like 'Sunny, 28C'",
    "temperature": number_in_celsius,
    "humidity": percent_number
  },
  "traffic": {
    "duration_minutes": estimated_minutes,
    "distance_km": estimated_km,
    "condition": "Light | Moderate | Heavy"
  }
}`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned ${res.status}`);
    }

    const data = (await res.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(text) as Omit<
      TrafficWeatherResponse,
      "origin" | "destination"
    >;
    return { origin, destination, ...parsed };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return {
      origin,
      destination,
      error: `Could not fetch traffic/weather data: ${msg}`,
      weather: { description: "Data unavailable" },
      traffic: { condition: "Unknown" },
    };
  }
}
