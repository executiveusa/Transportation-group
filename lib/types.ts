export type ServiceType =
  | "airport"
  | "shopping"
  | "business"
  | "night_out"
  | "hotel"
  | "events"
  | "day_trip"
  | "custom";

export type BookingStatus = "pending" | "confirmed" | "completed" | "canceled";

export interface Booking {
  id?: string;
  phone_number: string;
  name?: string;
  service: ServiceType;
  date?: string;
  time?: string;
  duration?: number;
  passengers?: number;
  notes?: string;
  cancellation_policy?: string;
  status?: BookingStatus;
  raw_message?: string;
  ai_response?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DrivingModeState {
  id: number;
  enabled: boolean;
  started_at?: string;
  updated_at: string;
}

export interface TrafficWeatherResponse {
  origin: string;
  destination: string;
  weather?: {
    description: string;
    temperature?: number;
    humidity?: number;
  };
  traffic?: {
    duration_minutes?: number;
    distance_km?: number;
    condition: string;
  };
  error?: string;
}

export interface AgentBookingResult {
  service?: ServiceType;
  date?: string;
  time?: string;
  duration?: number;
  passengers?: number;
  name?: string;
  phone?: string;
  notes?: string;
  confirmation_message?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
}

export interface AnalyticsEvent {
  eventType: "page_view" | "whatsapp_click" | "blog_view" | "booking_start";
  page?: string;
  referrer?: string;
  sessionId?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface DailySummary {
  date: string;
  pageViews: number;
  whatsappClicks: number;
  newBookings: number;
  revenueUsd: number;
}

export interface DriverConfig {
  slug: string;
  name: string;
  phone: string;
  whatsapp: string;
  area: string;
  tagline: string;
  notifyPhone: string;
}
