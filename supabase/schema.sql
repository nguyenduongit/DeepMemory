-- ==============================================================================
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
  ('numbers-00-99', '00', '00', 'Quả trứng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/00.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 0}'::jsonb, 0),
  ('numbers-00-99', '01', '01', 'Cây dù', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/01.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 1}'::jsonb, 1),
  ('numbers-00-99', '02', '02', 'Con vịt', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/02.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 2}'::jsonb, 2),
  ('numbers-00-99', '03', '03', 'Trái tim', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/03.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 3}'::jsonb, 3),
  ('numbers-00-99', '04', '04', 'Cái ghế', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/04.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 4}'::jsonb, 4),
  ('numbers-00-99', '05', '05', 'Quả táo', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/05.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 5}'::jsonb, 5),
  ('numbers-00-99', '06', '06', 'Vỏ ốc', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/06.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 6}'::jsonb, 6),
  ('numbers-00-99', '07', '07', 'Cái rìu', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/07.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 7}'::jsonb, 7),
  ('numbers-00-99', '08', '08', 'Người tuyết', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/08.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 8}'::jsonb, 8),
  ('numbers-00-99', '09', '09', 'Hươu cao cổ', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/09.webp', '00-09', ARRAY['numbers', 'digit'], '{"sortOrder": 9}'::jsonb, 9),
  ('numbers-00-99', '10', '10', 'Con heo', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/10.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 10}'::jsonb, 10),
  ('numbers-00-99', '11', '11', 'Cái thang', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/11.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 11}'::jsonb, 11),
  ('numbers-00-99', '12', '12', 'Cá mập', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/12.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 12}'::jsonb, 12),
  ('numbers-00-99', '13', '13', 'Con bướm', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/13.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 13}'::jsonb, 13),
  ('numbers-00-99', '14', '14', 'Thuyền buồm', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/14.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 14}'::jsonb, 14),
  ('numbers-00-99', '15', '15', 'Túi tiền', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/15.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 15}'::jsonb, 15),
  ('numbers-00-99', '16', '16', 'Con ốc sên', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/16.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 16}'::jsonb, 16),
  ('numbers-00-99', '17', '17', 'Nốt nhạc', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/17.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 17}'::jsonb, 17),
  ('numbers-00-99', '18', '18', 'Đèn giao thông', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/18.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 18}'::jsonb, 18),
  ('numbers-00-99', '19', '19', 'Con chó', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/19.webp', '10-19', ARRAY['numbers', 'digit'], '{"sortOrder": 19}'::jsonb, 19),
  ('numbers-00-99', '20', '20', 'Quả bom', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/20.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 20}'::jsonb, 20),
  ('numbers-00-99', '21', '21', 'Cây nến', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/21.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 21}'::jsonb, 21),
  ('numbers-00-99', '22', '22', 'Thiên nga', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/22.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 22}'::jsonb, 22),
  ('numbers-00-99', '23', '23', 'Con công', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/23.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 23}'::jsonb, 23),
  ('numbers-00-99', '24', '24', 'Con sóc', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/24.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 24}'::jsonb, 24),
  ('numbers-00-99', '25', '25', 'Cần cẩu', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/25.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 25}'::jsonb, 25),
  ('numbers-00-99', '26', '26', 'Gà trống', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/26.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 26}'::jsonb, 26),
  ('numbers-00-99', '27', '27', 'Con chuột', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/27.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 27}'::jsonb, 27),
  ('numbers-00-99', '28', '28', 'Cà rốt và thỏ', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/28.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 28}'::jsonb, 28),
  ('numbers-00-99', '29', '29', 'Chuột máy tính', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/29.webp', '20-29', ARRAY['numbers', 'digit'], '{"sortOrder": 29}'::jsonb, 29),
  ('numbers-00-99', '30', '30', 'Núi và mặt trời', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/30.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 30}'::jsonb, 30),
  ('numbers-00-99', '31', '31', 'Bóng đèn', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/31.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 31}'::jsonb, 31),
  ('numbers-00-99', '32', '32', 'Vòi sen', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/32.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 32}'::jsonb, 32),
  ('numbers-00-99', '33', '33', 'Cúc áo', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/33.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 33}'::jsonb, 33),
  ('numbers-00-99', '34', '34', 'Kim cương', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/34.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 34}'::jsonb, 34),
  ('numbers-00-99', '35', '35', 'Đu đủ', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/35.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 35}'::jsonb, 35),
  ('numbers-00-99', '36', '36', 'Hoa hồng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/36.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 36}'::jsonb, 36),
  ('numbers-00-99', '37', '37', 'Loa cầm tay', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/37.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 37}'::jsonb, 37),
  ('numbers-00-99', '38', '38', 'Nhẫn kim cương', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/38.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 38}'::jsonb, 38),
  ('numbers-00-99', '39', '39', 'Tê giác', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/39.webp', '30-39', ARRAY['numbers', 'digit'], '{"sortOrder": 39}'::jsonb, 39),
  ('numbers-00-99', '40', '40', 'Bút chì', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/40.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 40}'::jsonb, 40),
  ('numbers-00-99', '41', '41', 'Bình cứu hỏa', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/41.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 41}'::jsonb, 41),
  ('numbers-00-99', '42', '42', 'Cây diều', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/42.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 42}'::jsonb, 42),
  ('numbers-00-99', '43', '43', 'Người lướt sóng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/43.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 43}'::jsonb, 43),
  ('numbers-00-99', '44', '44', 'Rừng thông', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/44.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 44}'::jsonb, 44),
  ('numbers-00-99', '45', '45', 'Nam châm', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/45.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 45}'::jsonb, 45),
  ('numbers-00-99', '46', '46', 'Cung tên', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/46.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 46}'::jsonb, 46),
  ('numbers-00-99', '47', '47', 'Cầu thang', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/47.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 47}'::jsonb, 47),
  ('numbers-00-99', '48', '48', 'Doremon', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/48.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 48}'::jsonb, 48),
  ('numbers-00-99', '49', '49', 'Cái ly', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/49.webp', '40-49', ARRAY['numbers', 'digit'], '{"sortOrder": 49}'::jsonb, 49),
  ('numbers-00-99', '50', '50', 'Xe đạp', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/50.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 50}'::jsonb, 50),
  ('numbers-00-99', '51', '51', 'Sư tử', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/51.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 51}'::jsonb, 51),
  ('numbers-00-99', '52', '52', 'Xe hơi', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/52.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 52}'::jsonb, 52),
  ('numbers-00-99', '53', '53', 'Răng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/53.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 53}'::jsonb, 53),
  ('numbers-00-99', '54', '54', 'Người phục vụ', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/54.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 54}'::jsonb, 54),
  ('numbers-00-99', '55', '55', 'Găng đấm bốc', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/55.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 55}'::jsonb, 55),
  ('numbers-00-99', '56', '56', 'Phao cứu sinh', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/56.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 56}'::jsonb, 56),
  ('numbers-00-99', '57', '57', 'Cổng thành', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/57.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 57}'::jsonb, 57),
  ('numbers-00-99', '58', '58', 'Chú hề', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/58.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 58}'::jsonb, 58),
  ('numbers-00-99', '59', '59', 'Con mèo', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/59.webp', '50-59', ARRAY['numbers', 'digit'], '{"sortOrder": 59}'::jsonb, 59),
  ('numbers-00-99', '60', '60', 'Con cua', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/60.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 60}'::jsonb, 60),
  ('numbers-00-99', '61', '61', 'Kẹo mút', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/61.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 61}'::jsonb, 61),
  ('numbers-00-99', '62', '62', 'Điện thoại', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/62.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 62}'::jsonb, 62),
  ('numbers-00-99', '63', '63', 'Xe máy', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/63.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 63}'::jsonb, 63),
  ('numbers-00-99', '64', '64', 'Người lính', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/64.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 64}'::jsonb, 64),
  ('numbers-00-99', '65', '65', 'Cú mèo', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/65.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 65}'::jsonb, 65),
  ('numbers-00-99', '66', '66', 'Tai nghe', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/66.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 66}'::jsonb, 66),
  ('numbers-00-99', '67', '67', 'Con cá', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/67.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 67}'::jsonb, 67),
  ('numbers-00-99', '68', '68', 'Bình hoa', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/68.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 68}'::jsonb, 68),
  ('numbers-00-99', '69', '69', 'Bát quái', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/69.webp', '60-69', ARRAY['numbers', 'digit'], '{"sortOrder": 69}'::jsonb, 69),
  ('numbers-00-99', '70', '70', 'Sầu riêng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/70.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 70}'::jsonb, 70),
  ('numbers-00-99', '71', '71', 'Lá cờ', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/71.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 71}'::jsonb, 71),
  ('numbers-00-99', '72', '72', 'Con ma', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/72.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 72}'::jsonb, 72),
  ('numbers-00-99', '73', '73', 'Con trâu', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/73.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 73}'::jsonb, 73),
  ('numbers-00-99', '74', '74', 'Con đường', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/74.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 74}'::jsonb, 74),
  ('numbers-00-99', '75', '75', 'Xe tăng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/75.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 75}'::jsonb, 75),
  ('numbers-00-99', '76', '76', 'Nước mía', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/76.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 76}'::jsonb, 76),
  ('numbers-00-99', '77', '77', 'Khẩu súng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/77.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 77}'::jsonb, 77),
  ('numbers-00-99', '78', '78', 'Cà chua', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/78.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 78}'::jsonb, 78),
  ('numbers-00-99', '79', '79', 'Trái dừa', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/79.webp', '70-79', ARRAY['numbers', 'digit'], '{"sortOrder": 79}'::jsonb, 79),
  ('numbers-00-99', '80', '80', 'Dấu chân', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/80.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 80}'::jsonb, 80),
  ('numbers-00-99', '81', '81', 'Loa thùng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/81.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 81}'::jsonb, 81),
  ('numbers-00-99', '82', '82', 'Cá sấu', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/82.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 82}'::jsonb, 82),
  ('numbers-00-99', '83', '83', 'Bạch tuộc', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/83.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 83}'::jsonb, 83),
  ('numbers-00-99', '84', '84', 'Cây kéo', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/84.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 84}'::jsonb, 84),
  ('numbers-00-99', '85', '85', 'Hạt đậu', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/85.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 85}'::jsonb, 85),
  ('numbers-00-99', '86', '86', 'Chùm nho', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/86.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 86}'::jsonb, 86),
  ('numbers-00-99', '87', '87', 'Kính thiên văn', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/87.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 87}'::jsonb, 87),
  ('numbers-00-99', '88', '88', 'Còng tay', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/88.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 88}'::jsonb, 88),
  ('numbers-00-99', '89', '89', 'Thuốc nổ', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/89.webp', '80-89', ARRAY['numbers', 'digit'], '{"sortOrder": 89}'::jsonb, 89),
  ('numbers-00-99', '90', '90', 'Dao và thớt', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/90.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 90}'::jsonb, 90),
  ('numbers-00-99', '91', '91', 'Sóng biển', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/91.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 91}'::jsonb, 91),
  ('numbers-00-99', '92', '92', 'Bóng bay', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/92.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 92}'::jsonb, 92),
  ('numbers-00-99', '93', '93', 'Cúp vàng', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/93.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 93}'::jsonb, 93),
  ('numbers-00-99', '94', '94', 'Gốc cây', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/94.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 94}'::jsonb, 94),
  ('numbers-00-99', '95', '95', 'Bác sĩ', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/95.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 95}'::jsonb, 95),
  ('numbers-00-99', '96', '96', 'Cái trống', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/96.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 96}'::jsonb, 96),
  ('numbers-00-99', '97', '97', 'Con dê', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/97.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 97}'::jsonb, 97),
  ('numbers-00-99', '98', '98', 'Con ong', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/98.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 98}'::jsonb, 98),
  ('numbers-00-99', '99', '99', 'Vợt cầu lông', 'https://enehanbjjoofswlcawik.supabase.co/storage/v1/object/public/number-images/99.webp', '90-99', ARRAY['numbers', 'digit'], '{"sortOrder": 99}'::jsonb, 99);
