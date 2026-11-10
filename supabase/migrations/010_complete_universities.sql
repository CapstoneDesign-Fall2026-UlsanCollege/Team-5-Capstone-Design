-- Migration 010: Complete Universities Catalog Parity
-- Ensures database `public.universities` includes every country and institution
-- listed in the frontend academic catalog (Bhutan, Maldives, Other / International,
-- plus additional institutions in Nepal, India, Bangladesh, Pakistan, Sri Lanka, and South Asia).
-- Safe & idempotent: uses ON CONFLICT (country, name) DO NOTHING.

INSERT INTO public.universities (country, name) VALUES
    -- Nepal (addition)
    ('Nepal', 'Agriculture and Forestry University'),

    -- India (addition)
    ('India', 'National Institute of Technology (NIT Trichy / Surathkal)'),

    -- Bangladesh (addition)
    ('Bangladesh', 'Jahangirnagar University'),

    -- Pakistan (additions)
    ('Pakistan', 'University of the Punjab'),
    ('Pakistan', 'COMSATS University Islamabad'),

    -- Sri Lanka (additions)
    ('Sri Lanka', 'University of Kelaniya'),
    ('Sri Lanka', 'Sri Lanka Institute of Information Technology (SLIIT)'),

    -- Bhutan
    ('Bhutan', 'Royal University of Bhutan'),
    ('Bhutan', 'Sherubtse College'),
    ('Bhutan', 'College of Science and Technology (CST)'),
    ('Bhutan', 'Other institution in Bhutan'),

    -- Maldives
    ('Maldives', 'The Maldives National University'),
    ('Maldives', 'Villa College'),
    ('Maldives', 'Other institution in Maldives'),

    -- South Asia (canonical & regional entries)
    ('South Asia', 'Tribhuvan University (TU)'),
    ('South Asia', 'Kathmandu University (KU)'),
    ('South Asia', 'Pokhara University (PU)'),
    ('South Asia', 'Purbanchal University (PU)'),
    ('South Asia', 'Indian Institute of Technology (IIT)'),
    ('South Asia', 'Bangladesh University of Engineering and Technology (BUET)'),
    ('South Asia', 'National University of Sciences and Technology (NUST)'),
    ('South Asia', 'Royal University of Bhutan'),
    ('South Asia', 'The Maldives National University'),

    -- Other / International
    ('Other / International', 'International College / University'),
    ('Other / International', 'Online / Distance Learning Institution')
ON CONFLICT (country, name) DO NOTHING;
