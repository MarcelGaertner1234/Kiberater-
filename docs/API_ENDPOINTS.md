# API Endpoints Documentation

## Authentication Endpoints

### POST /api/auth/register
**Description:** User registration endpoint

**Request Body:**
```json
{
  "name": "string (min 2 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars, contains uppercase, lowercase, number)",
  "companyName": "string (optional)",
  "companySize": "enum (optional): freelancer|startup|small|medium|large",
  "industry": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Benutzer erfolgreich erstellt",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "companyName": "string",
    "companySize": "enum",
    "industry": "string",
    "role": "user",
    "locale": "de",
    "timezone": "Europe/Berlin",
    "emailVerified": false,
    "onboardingCompleted": false,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- 400: Validation error or user already exists
- 500: Internal server error

### GET|POST /api/auth/[...nextauth]
**Description:** NextAuth.js authentication endpoints

**Supported Providers:**
- Credentials (email/password)
- Google OAuth

**Automatic Redirects:**
- Success: `/dashboard`
- Error: `/auth/error`

## Protected Routes

### Middleware Protection
The following routes require authentication:
- `/dashboard/*`
- `/projects/*`
- `/assessment/*`
- `/admin/*`

### Public Routes
- `/auth/login`
- `/auth/register`
- `/auth/error`
- `/` (landing page)

## Session Management

### Session Structure
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "image": "string",
    "role": "user|advisor|admin"
  },
  "expires": "timestamp"
}
```

### Authentication Flow
1. User submits credentials via login form
2. NextAuth validates against Prisma database
3. JWT token created with user info
4. Middleware protects routes based on token
5. Logout clears session and redirects to home

## Übersicht
RESTful API für die KI-Beratungsplattform. Alle Endpoints folgen REST-Konventionen und verwenden JSON für Request/Response.

## Base URL
- Development: `http://localhost:3001/api/v1`
- Production: `https://api.ki-beratung.de/v1`

## Authentifizierung
JWT Bearer Token in Authorization Header:
```
Authorization: Bearer <token>
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2024-01-20T10:00:00Z",
    "version": "1.0"
  }
}
```

## Error Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": []
  }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Neue Benutzerregistrierung
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Max Mustermann",
  "company_name": "Mustermann GmbH",
  "company_size": "small",
  "locale": "de"
}

// Response
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Max Mustermann"
  },
  "tokens": {
    "access_token": "jwt...",
    "refresh_token": "jwt...",
    "expires_in": 3600
  }
}
```

#### POST /auth/login
Benutzer-Login
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response: Gleich wie register
```

#### POST /auth/oauth/:provider
OAuth Login initiieren
- Providers: google, github, apple
- Redirect zu OAuth Provider

#### POST /auth/oauth/:provider/callback
OAuth Callback verarbeiten

#### POST /auth/refresh
Token erneuern
```json
// Request
{
  "refresh_token": "jwt..."
}
```

#### POST /auth/logout
Benutzer ausloggen (Token invalidieren)

#### POST /auth/forgot-password
Passwort-Reset anfordern
```json
{
  "email": "user@example.com"
}
```

### User Management

#### GET /users/me
Aktuellen Benutzer abrufen
```json
// Response
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Max Mustermann",
  "company_name": "Mustermann GmbH",
  "role": "user",
  "subscription": {
    "plan": "professional",
    "status": "active"
  }
}
```

#### PUT /users/me
Profil aktualisieren
```json
// Request
{
  "name": "Max Mustermann",
  "company_name": "Neue Firma GmbH",
  "industry": "technology"
}
```

#### POST /users/me/avatar
Avatar hochladen (multipart/form-data)

### Assessment

#### GET /assessments/questions/:type
Fragen für Assessment abrufen
- Types: quick (5 Fragen), detailed (15 Fragen)
```json
// Response
{
  "questions": [
    {
      "id": "q1",
      "question": {
        "de": "Wie groß ist Ihr Unternehmen?",
        "en": "What is your company size?"
      },
      "type": "single_choice",
      "options": [
        {"value": "freelancer", "label": {"de": "Freelancer", "en": "Freelancer"}},
        {"value": "startup", "label": {"de": "Startup", "en": "Startup"}}
      ],
      "required": true
    }
  ]
}
```

#### POST /assessments
Assessment einreichen
```json
// Request
{
  "type": "quick",
  "responses": [
    {
      "question_id": "q1",
      "answer": "startup"
    }
  ]
}

// Response
{
  "id": "uuid",
  "score": 65,
  "maturity_level": "intermediate",
  "recommendations": [
    {
      "title": "KI-Strategie entwickeln",
      "priority": "high",
      "description": "..."
    }
  ]
}
```

#### GET /assessments
Alle Assessments des Users

#### GET /assessments/:id
Einzelnes Assessment mit Details

### Roadmaps

#### GET /roadmaps
Roadmaps des Benutzers

#### GET /roadmaps/:id
Einzelne Roadmap mit Meilensteinen

#### POST /roadmaps/generate
Roadmap aus Assessment generieren
```json
// Request
{
  "assessment_id": "uuid",
  "focus_areas": ["automation", "customer_service"]
}
```

### Projects

#### GET /projects
Projekte mit Filterung und Pagination
```
GET /projects?status=active&page=1&limit=20
```

#### POST /projects
Neues Projekt erstellen
```json
// Request
{
  "title": "Chatbot Implementation",
  "description": "KI-Chatbot für Kundenservice",
  "roadmap_id": "uuid",
  "start_date": "2024-02-01"
}
```

#### GET /projects/:id
Einzelnes Projekt mit Tasks

#### PUT /projects/:id
Projekt aktualisieren

#### DELETE /projects/:id
Projekt archivieren (Soft Delete)

### Tasks

#### GET /projects/:projectId/tasks
Alle Tasks eines Projekts

#### POST /projects/:projectId/tasks
Neue Task erstellen
```json
{
  "title": "Anforderungen definieren",
  "description": "...",
  "status": "todo",
  "position": 1
}
```

#### PUT /tasks/:id
Task aktualisieren (inkl. Status-Änderung)

#### PUT /tasks/:id/move
Task Position ändern (Drag & Drop)
```json
{
  "status": "in_progress",
  "position": 3
}
```

#### DELETE /tasks/:id
Task löschen

### Messages

#### GET /messages
Nachrichten abrufen (mit Pagination)
```
GET /messages?page=1&limit=50&unread=true
```

#### POST /messages
Nachricht senden
```json
{
  "recipient_id": "advisor-uuid",
  "content": "Ich habe eine Frage zum Assessment...",
  "project_id": "uuid" // optional
}
```

#### PUT /messages/:id/read
Nachricht als gelesen markieren

#### GET /messages/conversations
Konversations-Übersicht (gruppiert nach Gesprächspartner)

### Subscriptions

#### GET /subscriptions/plans
Verfügbare Pläne mit Preisen
```json
{
  "plans": [
    {
      "id": "starter",
      "name": {"de": "Starter", "en": "Starter"},
      "price": {
        "monthly": 49,
        "currency": "EUR"
      },
      "features": ["email_support", "basic_dashboard"]
    }
  ]
}
```

#### POST /subscriptions/checkout
Stripe Checkout Session erstellen
```json
// Request
{
  "plan": "professional",
  "billing_cycle": "monthly"
}

// Response
{
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_..."
}
```

#### POST /subscriptions/webhook
Stripe Webhook Handler (internal)

#### GET /subscriptions/current
Aktuelle Subscription Details

#### POST /subscriptions/cancel
Subscription kündigen

### Analytics (nur für User)

#### GET /analytics/dashboard
Dashboard-Metriken
```json
{
  "projects_count": 5,
  "completed_tasks": 23,
  "active_tasks": 7,
  "roi_estimate": 15000,
  "time_saved_hours": 120
}
```

#### GET /analytics/progress
Fortschritts-Tracking
```json
{
  "roadmap_progress": 65,
  "monthly_activity": [...],
  "achievements": [...]
}
```

### Admin Endpoints (role: admin/advisor)

#### GET /admin/users
Alle Benutzer (mit Filterung)

#### GET /admin/users/:id
Benutzer-Details für Berater

#### PUT /admin/users/:id/assign-advisor
Berater zuweisen
```json
{
  "advisor_id": "uuid"
}
```

#### GET /admin/analytics
Platform-weite Analytics

#### POST /admin/broadcast
Nachricht an mehrere User

## Rate Limiting

- Unauthenticated: 10 requests/minute
- Authenticated: 100 requests/minute
- Premium: 500 requests/minute

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642680000
```

## Pagination

Standard-Parameter:
- `page`: Seitennummer (default: 1)
- `limit`: Einträge pro Seite (default: 20, max: 100)

Response Meta:
```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 145,
      "pages": 8
    }
  }
}
```

## Filtering & Sorting

### Filtering
```
GET /projects?status=active&priority=high
```

### Sorting
```
GET /tasks?sort=-created_at,title
```
- `-` prefix für DESC
- Ohne prefix für ASC

## Websocket Events (für später)

Wenn Socket.io implementiert wird:
```javascript
// Events
'message:new'
'task:updated'
'project:status_changed'
'advisor:typing'
```

## API Versionierung

- Version in URL: `/api/v1/`
- Bei Breaking Changes: neue Version `/api/v2/`
- Deprecation Notice in Headers
- 6 Monate Übergangszeit

## Security Headers

Alle Responses enthalten:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

## CORS

Erlaubte Origins:
- Development: `http://localhost:3000`
- Production: `https://app.ki-beratung.de`

## Testing

### Postman Collection
- Import: `/docs/postman/ki-beratung-api.json`
- Environment Variables für Auth Tokens

### Example cURL
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get Projects
curl -X GET http://localhost:3001/api/v1/projects \
  -H "Authorization: Bearer <token>"
```