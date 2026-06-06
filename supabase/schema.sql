-- Supabase schema for Selam Platform (Without Supabase Auth)

-- Profiles
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT CHECK (role IN ('client', 'doctor', 'agent')),
  full_name TEXT,
  language TEXT DEFAULT 'en',
  avatar_url TEXT,
  blood_type TEXT,
  phone TEXT UNIQUE,
  pin_hash TEXT, -- Storing pin hash since not using Supabase auth
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient Records
CREATE TABLE patient_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  qr_uid TEXT UNIQUE NOT NULL,
  blood_type TEXT,
  allergies TEXT[],
  conditions TEXT[],
  medications TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diagnoses
CREATE TABLE diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  diagnosis_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Contacts
CREATE TABLE emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  blood_type TEXT,
  relationship TEXT
);

-- Wellness Sessions
CREATE TABLE wellness_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('ai', 'live')),
  anonymous BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Wellness Messages
CREATE TABLE wellness_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES wellness_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood Logs
CREATE TABLE mood_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INT CHECK (score >= 1 AND score <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Awareness Posts
CREATE TABLE awareness_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT,
  title_en TEXT,
  title_am TEXT,
  title_ti TEXT,
  title_om TEXT,
  body_en TEXT,
  body_am TEXT,
  body_ti TEXT,
  body_om TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitals
CREATE TABLE hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  lat FLOAT,
  lng FLOAT,
  phone TEXT,
  type TEXT,
  region TEXT
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free', 'premium', 'doctor')),
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
);
