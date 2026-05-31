-- ============================================================
-- Bones Driver Platform — Schema v2
-- Run AFTER schema.sql (or include both in sequence)
-- ============================================================

-- Driver profiles (multi-driver framework)
CREATE TABLE IF NOT EXISTS driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  area TEXT NOT NULL DEFAULT 'Puerto Vallarta',
  tagline TEXT,
  bio TEXT,
  years_experience INTEGER DEFAULT 1,
  total_rides INTEGER DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 5.0,
  facebook_page TEXT,
  instagram TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Bones as default driver
INSERT INTO driver_profiles (slug, name, phone, whatsapp, area, tagline, bio, years_experience)
VALUES (
  'bones',
  'Bones',
  '+523221175350',
  '+523221175350',
  'Puerto Vallarta and surrounding',
  'Your insider in Puerto Vallarta',
  'Been in Puerto Vallarta my whole life. I know every street, every hidden beach, every spot the tourists don''t get to. I''m not a company — I''m a person who takes pride in what I do.',
  15
) ON CONFLICT (slug) DO NOTHING;

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES driver_profiles(id),
  slug VARCHAR(200) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- Site analytics (page views, conversions)
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES driver_profiles(id),
  event_type VARCHAR(50) NOT NULL, -- 'page_view' | 'whatsapp_click' | 'blog_view' | 'booking_start'
  page TEXT,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_driver_date ON site_analytics(driver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON site_analytics(event_type, created_at DESC);

-- Daily summaries (sent to driver via WhatsApp)
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES driver_profiles(id),
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  whatsapp_clicks INTEGER DEFAULT 0,
  new_bookings INTEGER DEFAULT 0,
  total_revenue_usd NUMERIC(10,2) DEFAULT 0,
  summary_text TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(driver_id, date)
);

-- Leads (people who visited but haven't booked yet)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES driver_profiles(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  source VARCHAR(50) DEFAULT 'contact_form',
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_driver ON leads(driver_id, created_at DESC);

-- Notification log (track messages sent to driver)
CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES driver_profiles(id),
  channel VARCHAR(20) DEFAULT 'whatsapp',
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
