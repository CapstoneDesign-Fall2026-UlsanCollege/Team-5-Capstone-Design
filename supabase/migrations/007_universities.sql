-- Migration 007: Comprehensive University Catalog, Academic Hierarchy & Onboarding Schema
-- Adds academic hierarchy columns to student profiles and seeds universities with RLS policies.

-- 1. Extend profiles table with academic profile fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS faculty TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS major TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- 2. Update automatic profile initialization trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, country, university, faculty, major, onboarding_completed)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'country', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'university', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'faculty', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'major', ''),
        COALESCE((NEW.raw_user_meta_data ->> 'onboarding_completed')::boolean, false)
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        country = EXCLUDED.country,
        university = EXCLUDED.university,
        faculty = EXCLUDED.faculty,
        major = EXCLUDED.major,
        onboarding_completed = EXCLUDED.onboarding_completed,
        updated_at = now();
    RETURN NEW;
END;
$$;

-- 3. Universities Table
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT universities_country_name_unique UNIQUE (country, name)
);

ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS university TEXT NOT NULL DEFAULT '';

-- 4. Seed accredited universities
INSERT INTO public.universities (country, name) VALUES
    -- South Korea
    ('South Korea', 'Ulsan College'),
    ('South Korea', 'Ulsan National Institute of Science and Technology (UNIST)'),
    ('South Korea', 'Seoul National University (SNU)'),
    ('South Korea', 'Korea Advanced Institute of Science and Technology (KAIST)'),
    ('South Korea', 'Korea University'),
    ('South Korea', 'Yonsei University'),
    ('South Korea', 'Pusan National University'),
    ('South Korea', 'Sungkyunkwan University (SKKU)'),
    ('South Korea', 'Hanyang University'),
    ('South Korea', 'Other institution in South Korea'),

    -- Nepal
    ('Nepal', 'Tribhuvan University (TU)'),
    ('Nepal', 'Kathmandu University (KU)'),
    ('Nepal', 'Pokhara University (PU)'),
    ('Nepal', 'Purbanchal University (PU)'),
    ('Nepal', 'Mid-Western University'),
    ('Nepal', 'Far-Western University'),
    ('Nepal', 'Nepal Open University'),
    ('Nepal', 'Other institution in Nepal'),

    -- India
    ('India', 'Indian Institute of Technology (IIT Bombay / Delhi / Madras)'),
    ('India', 'University of Delhi'),
    ('India', 'University of Mumbai'),
    ('India', 'Jawaharlal Nehru University (JNU)'),
    ('India', 'Anna University'),
    ('India', 'Vellore Institute of Technology (VIT)'),
    ('India', 'Other institution in India'),

    -- Bangladesh
    ('Bangladesh', 'University of Dhaka'),
    ('Bangladesh', 'Bangladesh University of Engineering and Technology (BUET)'),
    ('Bangladesh', 'North South University'),
    ('Bangladesh', 'BRAC University'),
    ('Bangladesh', 'Other institution in Bangladesh'),

    -- Pakistan
    ('Pakistan', 'National University of Sciences and Technology (NUST)'),
    ('Pakistan', 'Quaid-i-Azam University'),
    ('Pakistan', 'Lahore University of Management Sciences (LUMS)'),
    ('Pakistan', 'Other institution in Pakistan'),

    -- Sri Lanka
    ('Sri Lanka', 'University of Colombo'),
    ('Sri Lanka', 'University of Peradeniya'),
    ('Sri Lanka', 'University of Moratuwa'),
    ('Sri Lanka', 'Other institution in Sri Lanka'),

    -- Regional aliases for backward compatibility
    ('South Asia', 'Tribhuvan University'),
    ('South Asia', 'Kathmandu University'),
    ('South Asia', 'Pokhara University'),
    ('South Asia', 'University of Dhaka'),
    ('South Asia', 'University of Colombo'),
    ('South Asia', 'University of Delhi'),
    ('South Asia', 'University of Mumbai'),
    ('South Asia', 'Other South Asian university or college')
ON CONFLICT (country, name) DO NOTHING;

-- 5. Row Level Security on universities
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS universities_select_authenticated ON public.universities;
CREATE POLICY universities_select_authenticated ON public.universities
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS universities_select_anon ON public.universities;
CREATE POLICY universities_select_anon ON public.universities
    FOR SELECT USING (true);
