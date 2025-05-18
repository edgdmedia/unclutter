
-- USERS TABLE
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- USER FEATURE TOGGLES (modular feature access)
CREATE TABLE user_features (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    feature_name TEXT, -- e.g. 'journal', 'mood_tracker', 'expense_manager', etc.
    enabled INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- NOTEBOOKS TABLE
CREATE TABLE notebooks (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    description TEXT,
    cover_img_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- MOOD TRACKER TABLE
CREATE TABLE mood_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    date TEXT,
    mood TEXT, -- e.g. emoji or scale
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- EXPENSE MANAGER TABLES
CREATE TABLE expenses (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    category TEXT,
    amount REAL,
    note TEXT,
    date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE income (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    category TEXT,
    amount REAL,
    note TEXT,
    date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- BOOK READER TABLE
CREATE TABLE books (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    author TEXT,
    cover_img_url TEXT,
    progress INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- DAILY PLANNER & VISION BOARD TABLES
CREATE TABLE planner_tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    description TEXT,
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE vision_board (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    category TEXT,
    note TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- JOURNAL ENTRIES TABLE
CREATE TABLE journal_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    notebook_id TEXT,
    title TEXT,
    content TEXT,
    mood TEXT,
    tags TEXT,
    shared INTEGER DEFAULT 0,
    anonymous INTEGER DEFAULT 0,
    locked_until TEXT,
    prompt_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (notebook_id) REFERENCES notebooks(id)
);

-- PROMPTS TABLE
CREATE TABLE prompts (
    id TEXT PRIMARY KEY,
    text TEXT,
    category TEXT,
    challenge_id TEXT
);

-- PROMPT CHALLENGES TABLE
CREATE TABLE prompt_challenges (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    duration_days INTEGER
);

-- USER PROMPT PROGRESS TABLE
CREATE TABLE user_prompt_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    challenge_id TEXT,
    prompt_id TEXT,
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- COMMUNITY REACTIONS TABLE
CREATE TABLE reactions (
    id TEXT PRIMARY KEY,
    entry_id TEXT,
    user_id TEXT,
    reaction_type TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES journal_entries(id)
);

-- COMMENTS TABLE
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    entry_id TEXT,
    user_id TEXT,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES journal_entries(id)
);

-- IMMERSION THEMES TABLE
CREATE TABLE immersion_presets (
    id TEXT PRIMARY KEY,
    name TEXT,
    audio_url TEXT,
    video_url TEXT,
    description TEXT
);
