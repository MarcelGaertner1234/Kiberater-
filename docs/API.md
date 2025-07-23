# API Documentation

## Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.ki-beratung.de/v1
```

## Authentication
Die API verwendet JWT (JSON Web Tokens) für die Authentifizierung.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "Max",
  "lastName": "Mustermann",
  "companyName": "TechCorp GmbH",
  "industry": "ecommerce"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Max",
      "lastName": "Mustermann"
    },
    "token": "jwt-token"
  }
}
```

#### Login
```http
POST /auth/login
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### OAuth Login
```http
GET /auth/google
GET /auth/github
GET /auth/apple
```

### User Management

#### Get User Profile
```http
GET /users/profile
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Max",
    "lastName": "Mustermann",
    "companyName": "TechCorp GmbH",
    "industry": "ecommerce",
    "subscription": {
      "plan": "premium",
      "status": "active",
      "validUntil": "2025-12-31"
    }
  }
}
```

#### Update User Profile
```http
PUT /users/profile
```

### Assessment

#### Start Assessment
```http
POST /assessments/start
```

Response:
```json
{
  "success": true,
  "data": {
    "assessmentId": "uuid",
    "questions": [
      {
        "id": "q1",
        "type": "scale",
        "question": "Wie digital ist Ihr Unternehmen?",
        "min": 1,
        "max": 10
      }
    ]
  }
}
```

#### Submit Assessment
```http
POST /assessments/{assessmentId}/submit
```

Request Body:
```json
{
  "answers": [
    {
      "questionId": "q1",
      "value": 7
    }
  ]
}
```

#### Get Assessment Results
```http
GET /assessments/{assessmentId}/results
```

Response:
```json
{
  "success": true,
  "data": {
    "score": 78,
    "categories": {
      "dataReadiness": 85,
      "technology": 82,
      "organization": 75
    },
    "recommendations": [
      {
        "title": "Chatbot Implementation",
        "priority": "high",
        "estimatedROI": "187%"
      }
    ],
    "pdfUrl": "https://..."
  }
}
```

### Projects

#### List Projects
```http
GET /projects
```

Query Parameters:
- `status`: active, completed, on-hold
- `page`: Page number
- `limit`: Items per page

#### Create Project
```http
POST /projects
```

Request Body:
```json
{
  "name": "Chatbot Implementation",
  "description": "Customer Service Automation",
  "budget": 15000,
  "startDate": "2025-04-01",
  "estimatedDuration": "3 months"
}
```

#### Update Project
```http
PUT /projects/{projectId}
```

#### Get Project Details
```http
GET /projects/{projectId}
```

### Learning Content

#### Get Courses
```http
GET /courses
```

Query Parameters:
- `category`: Category filter
- `level`: beginner, intermediate, advanced
- `industry`: Industry-specific courses

#### Get Course Progress
```http
GET /courses/{courseId}/progress
```

#### Update Course Progress
```http
POST /courses/{courseId}/progress
```

Request Body:
```json
{
  "moduleId": "module1",
  "completed": true,
  "timeSpent": 1800
}
```

### Communication

#### Get Messages
```http
GET /messages
```

#### Send Message
```http
POST /messages
```

Request Body:
```json
{
  "recipientId": "consultant-uuid",
  "content": "Ich habe eine Frage zur API Integration",
  "projectId": "project-uuid"
}
```

### Analytics

#### Get User Analytics
```http
GET /analytics/user
```

Response:
```json
{
  "success": true,
  "data": {
    "learningProgress": 67,
    "projectsCompleted": 3,
    "totalTimeSpent": 28800,
    "achievements": ["first_project", "quick_learner"]
  }
}
```

### Admin Endpoints

#### Get All Clients (Admin Only)
```http
GET /admin/clients
```

#### Get Platform Analytics (Admin Only)
```http
GET /admin/analytics
```

#### Assign Consultant (Admin Only)
```http
POST /admin/projects/{projectId}/assign
```

Request Body:
```json
{
  "consultantId": "consultant-uuid"
}
```

## Error Responses

Standard error format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Error Codes
- `UNAUTHORIZED`: No valid authentication
- `FORBIDDEN`: No permission for resource
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

- Default: 100 requests per 15 minutes
- Authenticated: 1000 requests per 15 minutes
- Admin: 5000 requests per 15 minutes

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Available Webhooks
- `user.created`
- `assessment.completed`
- `project.status_changed`
- `subscription.updated`
- `payment.successful`

### Webhook Payload
```json
{
  "event": "assessment.completed",
  "timestamp": "2025-03-24T10:30:00Z",
  "data": {
    "userId": "uuid",
    "assessmentId": "uuid",
    "score": 78
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { KIBeratungAPI } from '@ki-beratung/sdk';

const api = new KIBeratungAPI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Login
const { token } = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Get assessment results
const results = await api.assessments.getResults('assessment-id');
```

### cURL Examples
```bash
# Login
curl -X POST https://api.ki-beratung.de/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get profile with auth
curl -X GET https://api.ki-beratung.de/v1/users/profile \
  -H "Authorization: Bearer your-jwt-token"
```