-- SQL Schema for Ujian Sekolah 2026 Portal
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/vcilycmqgvoxpnytwkyx/sql)

-- 1. Create Majors Table
CREATE TABLE IF NOT EXISTS majors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    major_id TEXT REFERENCES majors(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    link TEXT NOT NULL,
    token TEXT NOT NULL,
    duration TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Settings Table (Single Row)
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    school_name TEXT NOT NULL DEFAULT 'SMK Negeri Digital',
    title TEXT NOT NULL DEFAULT 'Ujian Sekolah Utama 2026',
    status TEXT NOT NULL DEFAULT 'Aktif',
    CONSTRAINT one_row CHECK (id = 1)
);

-- 4. Insert Initial Data
INSERT INTO settings (id, school_name, title, status)
VALUES (1, 'SMK Negeri Digital', 'Ujian Sekolah Utama 2026', 'Aktif')
ON CONFLICT (id) DO NOTHING;

INSERT INTO majors (id, name) VALUES 
('tkj', 'Teknik Komputer & Jaringan'),
('rpl', 'Rekayasa Perangkat Lunak'),
('akl', 'Akuntansi'),
('otkp', 'Perkantoran')
ON CONFLICT (id) DO NOTHING;

INSERT INTO exams (id, major_id, subject, link, token, duration) VALUES
('tkj-1', 'tkj', 'Dasar Desain Grafis', 'https://forms.google.com', 'DDG2026', '90'),
('tkj-2', 'tkj', 'Administrasi Sistem Jaringan', 'https://forms.google.com', 'ASJ2026', '120'),
('rpl-1', 'rpl', 'Pemrograman Berorientasi Objek', 'https://forms.google.com', 'PBO2026', '120'),
('rpl-2', 'rpl', 'Basis Data', 'https://forms.google.com', 'BD2026', '90')
ON CONFLICT (id) DO NOTHING;

-- 5. Enable Realtime (Optional but recommended)
ALTER PUBLICATION supabase_realtime ADD TABLE majors;
ALTER PUBLICATION supabase_realtime ADD TABLE exams;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;
