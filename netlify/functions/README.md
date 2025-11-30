# Infinite Grammar API Documentation

## Base URL

**Local Development:** `http://localhost:8888/.netlify/functions/`
**Production:** `https://your-site.netlify.app/.netlify/functions/`

With the redirect in `netlify.toml`, you can also use `/api/` as a shorter path.

---

## Endpoints

### 📚 **Exercises**

#### `GET /api/exercises`

Get exercises filtered by level, topic, or grammar section.

**Query Parameters:**
- `level` (required): `A1`, `A2`, `B1`, `B2`, or `C1`
- `topic` (optional): `verben`, `artikel`, `adjektive`, `praepositionen`, `satzbau`, `nomen`
- `grammarSection` (optional): Grammar section ID (takes priority over topic)
- `random` (optional): `true` to return a single random exercise, `false` for all (default)

**Example Request:**
```bash
GET /api/exercises?level=A2&topic=verben&random=true
```

**Example Response:**
```json
{
  "exercises": {
    "id": "a2_zeiten_perfekt_alltag_1",
    "level": "A2",
    "grammar_section_id": "tempora_praesens_perfekt",
    "grammar_section_name": "Zeitformen: Präsens und Perfekt",
    "content_topic": "Alltag und Familie",
    "model": "mvp-static",
    "text": "Normalerweise stehe ich unter der Woche früh auf...",
    "gaps": [
      {
        "id": "uuid",
        "gap_number": 1,
        "correct_answer": "geschlafen",
        "distractors": ["schlafen", "schlief", "verschlafen"],
        "explanation": "Für das Perfekt von „schlafen" verwendet man „haben"..."
      }
    ]
  },
  "count": 1,
  "filters": { "level": "A2", "topic": "verben", "random": true }
}
```

---

### 📖 **Grammar Sections**

#### `GET /api/grammar-sections`

Get grammar sections filtered by level and/or topic.

**Query Parameters:**
- `level` (optional): `A1`, `A2`, `B1`, `B2`, or `C1`
- `topic` (optional): `verben`, `artikel`, etc.

**Example Request:**
```bash
GET /api/grammar-sections?level=B1&topic=verben
```

**Example Response:**
```json
{
  "sections": [
    {
      "id": "tempus_perfekt_praeteritum",
      "level": "B1",
      "category": "verben",
      "name": "Perfekt und Präteritum im Alltag",
      "description": "Wiederholung der Perfektbildung...",
      "order_in_level": 2,
      "topics": ["verben"],
      "exercise_count": 3
    }
  ],
  "byLevel": {
    "B1": [...]
  },
  "count": 5,
  "filters": { "level": "B1", "topic": "verben" }
}
```

---

### ✅ **Exercise Completions**

#### `POST /api/exercise-completions`

Submit an exercise completion and update user progress.

**Request Body:**
```json
{
  "user_id": "uuid",
  "exercise_id": "a2_zeiten_perfekt_alltag_1",
  "correct_answers": 4,
  "total_answers": 5,
  "time_spent_seconds": 120
}
```

**Response:**
```json
{
  "success": true,
  "completion": {
    "id": "uuid",
    "completed_at": "2025-11-30T12:34:56Z"
  },
  "streak": 3
}
```

---

### 👤 **Authentication**

#### `POST /api/auth/register`

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-11-30T12:00:00Z"
  }
}
```

#### `POST /api/auth/login`

Login user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-11-30T12:00:00Z",
    "last_login": "2025-11-30T15:30:00Z",
    "stats": {
      "total_exercises_completed": 15,
      "total_correct_answers": 67,
      "total_answers": 75,
      "accuracy": 89,
      "current_streak": 3,
      "last_streak_date": "2025-11-30"
    }
  }
}
```

---

### 📊 **User Progress**

#### `GET /api/user-progress`

Get user's progress across all grammar sections.

**Query Parameters:**
- `user_id` (required): User UUID
- `level` (optional): Filter by level

**Example Request:**
```bash
GET /api/user-progress?user_id=uuid&level=A2
```

**Example Response:**
```json
{
  "progress": [
    {
      "section_id": "tempora_praesens_perfekt",
      "section_name": "Zeitformen: Präsens und Perfekt",
      "level": "A2",
      "category": "verben",
      "total_exercises": 5,
      "completed_exercises": 3,
      "last_completed_exercise_order": 3,
      "total_completions": 5,
      "total_correct": 14,
      "last_completed_at": "2025-11-30T12:00:00Z",
      "completion_percentage": 60
    }
  ],
  "byLevel": {
    "A2": [...]
  },
  "overallStats": {
    "total_sections": 10,
    "completed_sections": 2,
    "in_progress_sections": 5,
    "total_exercises": 50,
    "completed_exercises": 15,
    "total_completions": 20
  }
}
```

---

### 📈 **User Stats**

#### `GET /api/user-stats`

Get detailed user statistics and recent activity.

**Query Parameters:**
- `user_id` (required): User UUID

**Example Request:**
```bash
GET /api/user-stats?user_id=uuid
```

**Example Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-11-30T12:00:00Z",
    "last_login": "2025-11-30T15:30:00Z"
  },
  "stats": {
    "total_exercises_completed": 15,
    "total_correct_answers": 67,
    "total_answers": 75,
    "accuracy": 89,
    "current_streak": 3,
    "last_streak_date": "2025-11-30"
  },
  "recentCompletions": [...],
  "progressByLevel": [...],
  "activityByDay": [...]
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created (register)
- `400` - Bad Request (missing parameters)
- `404` - Not Found
- `405` - Method Not Allowed
- `409` - Conflict (user already exists)
- `500` - Internal Server Error

---

## CORS

All endpoints support CORS with `Access-Control-Allow-Origin: *` for development. Update this in production for security.

---

## Environment Variables

Required in Netlify:
- `DATABASE_URL` or `NETLIFY_DATABASE_URL` - Neon database connection string
- Automatically set by Netlify Neon integration

---

## Testing Locally

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Start local dev server:
   ```bash
   netlify dev
   ```

3. Functions will be available at:
   ```
   http://localhost:8888/.netlify/functions/[function-name]
   http://localhost:8888/api/[function-name]
   ```

---

## Deployment

Functions automatically deploy when you push to your connected Git repository. Netlify handles:
- Building TypeScript functions
- Setting environment variables
- SSL/HTTPS
- CDN distribution
