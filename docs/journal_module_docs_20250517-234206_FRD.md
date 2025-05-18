
# 📓 Modular Wellness App – Functional Requirements Document (FRD)

## Modular Architecture
- Each feature/module (Journal, Mood Tracker, Expense Manager, Book Reader, Planner/Vision Board) can be enabled/disabled per user
- Modules work independently or together (single backend, modular frontend)
- User feature toggles stored in DB
- All modules are offline-first and sync when online

## Core Functionality

### 1. Journal Entry
- CRUD operations
- Fields: title, content, mood, tags, notebook_id, locked_until, shared, anonymous

### 2. Mood Tracker
- CRUD daily mood logs
- Fields: mood (emoji/scale), notes, date
- View mood trends (weekly/monthly charts)

### 2. Community
- View public entries
- React to entries (❤️, 👏, 🌱)
- Add comments

### 3. Prompts & Challenges
- Fetch daily prompt
- Track prompt challenge progress per user
- Support recurring and user-defined prompts

### 4. Notebooks
- List user-created notebooks
- Add, edit, delete notebooks
- Associate entries with notebooks

### 5. Immersion Mode
- Load background audio, image/video
- Start journaling timer
- Auto-save journal progress

### Planned Modules
- Expense Manager: CRUD expenses/income, categorize transactions, monthly summary, budget goals
- Book Reader: Track reading progress, add books/authors/notes, bookmarks
- Daily Planner & Vision Board: CRUD tasks/events, calendar views, vision board with notes/images

---

## API Endpoints (Conceptual)

- `GET /entries`
- `POST /entries`
- `PATCH /entries/{id}`
- `DELETE /entries/{id}`

- `GET /prompts/daily`
- `POST /challenges/join`
- `POST /community/react`
- `POST /entries/comment`

- `GET /immersion/themes`

---

## Sync & Offline Support
- All modules use local DB (SQLite or WatermelonDB)
- Background sync on reconnect for all modules
- Conflict resolution for updates across modules
- Data export/import for backup
