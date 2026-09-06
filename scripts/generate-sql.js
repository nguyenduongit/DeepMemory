import fs from 'node:fs';
import path from 'node:path';

const numbersPath = path.resolve('supabase_100_numbers.json');
const numbers = JSON.parse(fs.readFileSync(numbersPath, 'utf8'));

let sql = `-- ==============================================================================
-- AIO MEMORY TRAINER - SUPABASE DATABASE INITIALIZATION & MIGRATION SCRIPT
-- ==============================================================================
-- Target Supabase Project: enehanbjjoofswlcawik
-- Architecture: Universal Multi-Module Learning & Brain Training Platform
-- ==============================================================================

-- 1. DROP ALL OLD LEGACY TABLES & PREVIOUS OBJECTS
DROP TABLE IF EXISTS practice_answers CASCADE;
DROP TABLE IF EXISTS competition_sessions CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;
DROP TABLE IF EXISTS keep_alive CASCADE;
DROP TABLE IF EXISTS number_memories CASCADE;

-- Drop prior tables if any to ensure clean idempotent recreation
DROP TABLE IF EXISTS session_answers CASCADE;
DROP TABLE IF EXISTS item_progress CASCADE;
DROP TABLE IF EXISTS module_progress CASCADE;
DROP TABLE IF EXISTS best_times CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS training_sessions CASCADE;
DROP TABLE IF EXISTS module_items CASCADE;
DROP TABLE IF EXISTS module_groups CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- 2. CREATE UNIVERSAL MULTI-MODULE CORE SCHEMA

-- Table: modules (Universal catalog of all training modules)
CREATE TABLE modules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3b82f6',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: module_groups (Training subsets / groups per module)
CREATE TABLE module_groups (
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (module_id, id)
);

-- Table: module_items (Universal entities / items across all modules)
CREATE TABLE module_items (
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    id TEXT NOT NULL,
    code TEXT,
    name TEXT NOT NULL,
    subname TEXT,
    image_url TEXT,
    audio_url TEXT,
    group_id TEXT,
    tags TEXT[] DEFAULT '{}',
    attributes JSONB DEFAULT '{}'::jsonb,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (module_id, id)
);

CREATE INDEX idx_module_items_module ON module_items(module_id);
CREATE INDEX idx_module_items_group ON module_items(module_id, group_id);
CREATE INDEX idx_module_items_code ON module_items(module_id, code);

-- Table: training_sessions (Historical records of training runs)
CREATE TABLE training_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'guest',
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    mode_id TEXT NOT NULL,
    group_id TEXT,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    wrong_answers INTEGER NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    duration_ms INTEGER NOT NULL,
    average_reaction_ms INTEGER,
    completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_training_sessions_user_module ON training_sessions(user_id, module_id);
CREATE INDEX idx_training_sessions_completed ON training_sessions(completed_at DESC);

-- Table: item_progress (Individual item mastery tracking: 0-24 New, 25-49 Learning, 50-79 Familiar, 80-100 Mastered)
CREATE TABLE item_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'guest',
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    seen_count INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    wrong_count INTEGER NOT NULL DEFAULT 0,
    accuracy NUMERIC(5, 2) NOT NULL DEFAULT 0,
    average_reaction_ms INTEGER,
    mastery_score INTEGER NOT NULL DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
    mastery_level TEXT NOT NULL DEFAULT 'new' CHECK (mastery_level IN ('new', 'learning', 'familiar', 'mastered')),
    last_practiced_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, module_id, item_id)
);

CREATE INDEX idx_item_progress_user_module ON item_progress(user_id, module_id);

-- Table: module_progress (Aggregated statistics per module)
CREATE TABLE module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'guest',
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    mastery_score INTEGER NOT NULL DEFAULT 0,
    mastery_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
    completed_sessions INTEGER NOT NULL DEFAULT 0,
    total_answers INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    best_time_ms INTEGER,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, module_id)
);

-- Table: best_times (Speed & accuracy leaderboards / personal bests)
CREATE TABLE best_times (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'guest',
    record_key TEXT NOT NULL,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    mode_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    question_count INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    achieved_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_best_times_rank ON best_times(module_id, mode_id, duration_ms ASC);
CREATE INDEX idx_best_times_key ON best_times(user_id, record_key);

-- Table: user_settings (Application preferences)
CREATE TABLE user_settings (
    user_id TEXT PRIMARY KEY DEFAULT 'guest',
    theme TEXT DEFAULT 'dark',
    sound_enabled BOOLEAN DEFAULT true,
    reduced_motion BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ROW LEVEL SECURITY (RLS) CONFIGURATION
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES
-- Modules & Content Catalog (Read: Public, Write: Service Role)
CREATE POLICY "Public read modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Admin write modules" ON modules FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read module_groups" ON module_groups FOR SELECT USING (true);
CREATE POLICY "Admin write module_groups" ON module_groups FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read module_items" ON module_items FOR SELECT USING (true);
CREATE POLICY "Admin write module_items" ON module_items FOR ALL USING (auth.role() = 'service_role');

-- Training Sessions (Allow read and insert)
CREATE POLICY "Allow read training_sessions" ON training_sessions FOR SELECT USING (true);
CREATE POLICY "Allow insert training_sessions" ON training_sessions FOR INSERT WITH CHECK (true);

-- Item Progress (Allow read, insert, update)
CREATE POLICY "Allow read item_progress" ON item_progress FOR SELECT USING (true);
CREATE POLICY "Allow write item_progress" ON item_progress FOR ALL USING (true) WITH CHECK (true);

-- Module Progress (Allow read, insert, update)
CREATE POLICY "Allow read module_progress" ON module_progress FOR SELECT USING (true);
CREATE POLICY "Allow write module_progress" ON module_progress FOR ALL USING (true) WITH CHECK (true);

-- Best Times (Allow read and insert/upsert)
CREATE POLICY "Allow read best_times" ON best_times FOR SELECT USING (true);
CREATE POLICY "Allow insert best_times" ON best_times FOR INSERT WITH CHECK (true);

-- User Settings (Allow read and update)
CREATE POLICY "Allow read user_settings" ON user_settings FOR SELECT USING (true);
CREATE POLICY "Allow write user_settings" ON user_settings FOR ALL USING (true) WITH CHECK (true);

-- 5. SEED DATA

-- Modules Catalog
INSERT INTO modules (id, name, category, description, icon, color, is_active, display_order, tags, metadata)
VALUES
  ('numbers-00-99', 'Nhớ số 00–99', 'memory', 'Luyện phản xạ và ghi nhớ 100 hình ảnh tương ứng với các số từ 00 đến 99 theo phương pháp Major System / Hình ảnh liên tưởng.', 'Hash', '#3b82f6', true, 1, ARRAY['trí nhớ', 'số học', 'phản xạ'], '{"totalItems": 100}'::jsonb),
  ('flags-world', 'Quốc kỳ thế giới', 'geography', 'Nhận diện quốc kỳ của hơn 195 quốc gia và vùng lãnh thổ trên toàn cầu.', 'Flag', '#10b981', false, 2, ARRAY['địa lý', 'quốc kỳ'], '{"totalItems": 195, "comingSoon": true}'::jsonb),
  ('periodic-table', 'Bảng tuần hoàn Hóa học', 'science', 'Ghi nhớ 118 nguyên tố hóa học, ký hiệu, số nguyên tử và nhóm.', 'Atom', '#8b5cf6', false, 3, ARRAY['hóa học', 'khoa học'], '{"totalItems": 118, "comingSoon": true}'::jsonb),
  ('kanji-n5', 'Kanji N5 Căn bản', 'language', 'Học và luyện nhớ hơn 100 chữ Hán căn bản kỳ thi JLPT N5.', 'Languages', '#f59e0b', false, 4, ARRAY['tiếng nhật', 'kanji'], '{"totalItems": 103, "comingSoon": true}'::jsonb),
  ('vietnam-dynasties', 'Triều đại Việt Nam', 'history', 'Ghi nhớ các triều đại lịch sử Việt Nam, niên đại và các vị vua kiệt xuất.', 'Crown', '#ef4444', false, 5, ARRAY['lịch sử', 'việt nam'], '{"totalItems": 20, "comingSoon": true}'::jsonb);

-- Module Groups for numbers-00-99
INSERT INTO module_groups (module_id, id, name, description, sort_order)
VALUES
  ('numbers-00-99', '00-09', '00–09', '10 số đầu tiên (00 đến 09)', 1),
  ('numbers-00-99', '10-19', '10–19', 'Nhóm 10 số (10 đến 19)', 2),
  ('numbers-00-99', '20-29', '20–29', 'Nhóm 10 số (20 đến 29)', 3),
  ('numbers-00-99', '30-39', '30–39', 'Nhóm 10 số (30 đến 39)', 4),
  ('numbers-00-99', '40-49', '40–49', 'Nhóm 10 số (40 đến 49)', 5),
  ('numbers-00-99', '50-59', '50–59', 'Nhóm 10 số (50 đến 59)', 6),
  ('numbers-00-99', '60-69', '60–69', 'Nhóm 10 số (60 đến 69)', 7),
  ('numbers-00-99', '70-79', '70–79', 'Nhóm 10 số (70 đến 79)', 8),
  ('numbers-00-99', '80-89', '80–89', 'Nhóm 10 số (80 đến 89)', 9),
  ('numbers-00-99', '90-99', '90–99', 'Nhóm 10 số (90 đến 99)', 10),
  ('numbers-00-99', '00-49', '00–49', 'Nửa đầu: 50 số (00 đến 49)', 11),
  ('numbers-00-99', '50-99', '50–99', 'Nửa sau: 50 số (50 đến 99)', 12),
  ('numbers-00-99', '00-99', '00–99', 'Tất cả: trọn bộ 100 số', 13);

-- Seed 100 Items for numbers-00-99
INSERT INTO module_items (module_id, id, code, name, image_url, group_id, tags, attributes, sort_order)
VALUES
`;

const values = numbers.map((n) => {
  const code = n.number_code;
  const num = parseInt(code, 10);
  const startDecade = Math.floor(num / 10) * 10;
  const endDecade = startDecade + 9;
  const groupId = String(startDecade).padStart(2, '0') + '-' + String(endDecade).padStart(2, '0');
  const escapedName = n.name.replace(/'/g, "''");
  const imgUrl = n.image_path;
  return `  ('numbers-00-99', '${n.id}', '${code}', '${escapedName}', '${imgUrl}', '${groupId}', ARRAY['numbers', 'digit'], '{"sortOrder": ${n.sort_order}}'::jsonb, ${n.sort_order})`;
});

sql += values.join(',\n') + ';\n';

const outPath = path.resolve('supabase/schema.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Successfully generated', outPath, 'Size:', fs.statSync(outPath).size, 'bytes');
