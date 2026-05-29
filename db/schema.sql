-- Bones Driver Platform — Database Schema
-- Run this in your Supabase SQL editor to initialize the database.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  name TEXT,
  service VARCHAR(50) NOT NULL,
  date DATE,
  time TIME,
  duration INTEGER,
  passengers INTEGER DEFAULT 1,
  notes TEXT,
  cancellation_policy TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  raw_message TEXT,
  ai_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Driving mode table (single row, upserted)
CREATE TABLE IF NOT EXISTS driving_mode (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the single driving mode row
INSERT INTO driving_mode (id, enabled) VALUES (1, FALSE)
  ON CONFLICT (id) DO NOTHING;

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('social_posting_enabled', 'false'),
  ('ai_voice_enabled', 'true'),
  ('cancellation_policy_hours_full_refund', '24'),
  ('cancellation_policy_hours_half_charge', '4'),
  ('cancellation_policy_retention_percent', '20')
ON CONFLICT (key) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone_number);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
