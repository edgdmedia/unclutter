# Therapy Module API Endpoints

This document outlines the API endpoints for the Unclutter Therapy Module, providing a comprehensive reference for developers integrating with the system.

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses follow a consistent format:

```json
{
  "status": "success" | "error",
  "message": "Human-readable message",
  "data": { /* Response data object */ } | null,
  "errors": [ /* Array of error objects */ ] | null
}
```

## Endpoints

### Therapist Management

#### List Therapists

```
GET /api/v1/therapists
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `specialty` (optional): Filter by specialty
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "status": "success",
  "message": "Therapists retrieved successfully",
  "data": {
    "therapists": [
      {
        "id": "uuid",
        "userId": "uuid",
        "bio": "Therapist bio",
        "specialties": ["anxiety", "depression"],
        "credentials": ["Ph.D.", "Licensed Psychologist"],
        "isActive": true,
        "createdAt": "2025-05-01T12:00:00Z",
        "updatedAt": "2025-05-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 20,
      "pages": 2,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### Get Therapist Details

```
GET /api/v1/therapists/:id
```

**Response:**
```json
{
  "status": "success",
  "message": "Therapist retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "bio": "Detailed professional bio",
    "specialties": ["anxiety", "depression", "trauma"],
    "credentials": ["Ph.D.", "Licensed Psychologist"],
    "isActive": true,
    "calendarIntegration": {
      "provider": "google",
      "calendarId": "calendar_id"
    },
    "meta": {},
    "createdAt": "2025-05-01T12:00:00Z",
    "updatedAt": "2025-05-01T12:00:00Z"
  }
}
```

#### Create Therapist Profile

```
POST /api/v1/therapists
```

**Request Body:**
```json
{
  "userId": "uuid",
  "bio": "Detailed professional bio",
  "specialties": ["anxiety", "depression"],
  "credentials": ["Ph.D.", "Licensed Psychologist"],
  "isActive": true,
  "calendarIntegration": {
    "provider": "google",
    "calendarId": "calendar_id"
  },
  "meta": {}
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Therapist profile created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "bio": "Detailed professional bio",
    "specialties": ["anxiety", "depression"],
    "credentials": ["Ph.D.", "Licensed Psychologist"],
    "isActive": true,
    "calendarIntegration": {
      "provider": "google",
      "calendarId": "calendar_id"
    },
    "meta": {},
    "createdAt": "2025-05-01T12:00:00Z",
    "updatedAt": "2025-05-01T12:00:00Z"
  }
}
```

#### Update Therapist Profile

```
PUT /api/v1/therapists/:id
```

**Request Body:**
```json
{
  "bio": "Updated professional bio",
  "specialties": ["anxiety", "depression", "trauma"],
  "credentials": ["Ph.D.", "Licensed Psychologist"],
  "isActive": true,
  "calendarIntegration": {
    "provider": "google",
    "calendarId": "updated_calendar_id"
  },
  "meta": {}
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Therapist profile updated successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "bio": "Updated professional bio",
    "specialties": ["anxiety", "depression", "trauma"],
    "credentials": ["Ph.D.", "Licensed Psychologist"],
    "isActive": true,
    "calendarIntegration": {
      "provider": "google",
      "calendarId": "updated_calendar_id"
    },
    "meta": {},
    "createdAt": "2025-05-01T12:00:00Z",
    "updatedAt": "2025-05-01T12:30:00Z"
  }
}
```

### Session Management

#### List Sessions

```
GET /api/v1/sessions
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `therapistId` (optional): Filter by therapist
- `clientId` (optional): Filter by client
- `status` (optional): Filter by status
- `startDate` (optional): Filter by start date (format: YYYY-MM-DD)
- `endDate` (optional): Filter by end date (format: YYYY-MM-DD)

**Response:**
```json
{
  "status": "success",
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "therapistId": "uuid",
        "clientId": "uuid",
        "startTime": "2025-05-15T14:00:00Z",
        "endTime": "2025-05-15T15:00:00Z",
        "status": "scheduled",
        "type": "regular",
        "format": "video",
        "createdAt": "2025-05-01T12:00:00Z",
        "updatedAt": "2025-05-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "pages": 3,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### Get Session Details

```
GET /api/v1/sessions/:id
```

**Response:**
```json
{
  "status": "success",
  "message": "Session retrieved successfully",
  "data": {
    "id": "uuid",
    "therapistId": "uuid",
    "clientId": "uuid",
    "startTime": "2025-05-15T14:00:00Z",
    "endTime": "2025-05-15T15:00:00Z",
    "status": "scheduled",
    "type": "regular",
    "format": "video",
    "privateNotes": "Therapist private notes",
    "sharedNotes": "Notes shared with client",
    "meta": {},
    "createdAt": "2025-05-01T12:00:00Z",
    "updatedAt": "2025-05-01T12:00:00Z"
  }
}
```

#### Create Session

```
POST /api/v1/sessions
```

**Request Body:**
```json
{
  "therapistId": "uuid",
  "clientId": "uuid",
  "startTime": "2025-05-15T14:00:00Z",
  "endTime": "2025-05-15T15:00:00Z",
  "type": "regular",
  "format": "video",
  "meta": {}
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Session created successfully",
  "data": {
    "id": "uuid",
    "therapistId": "uuid",
    "clientId": "uuid",
    "startTime": "2025-05-15T14:00:00Z",
    "endTime": "2025-05-15T15:00:00Z",
    "status": "scheduled",
    "type": "regular",
    "format": "video",
    "meta": {},
    "createdAt": "2025-05-01T12:00:00Z",
    "updatedAt": "2025-05-01T12:00:00Z"
  }
}
```

### Forms & Assessments

#### List Forms

```
GET /api/v1/forms
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `type` (optional): Filter by form type
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "status": "success",
  "message": "Forms retrieved successfully",
  "data": {
    "forms": [
      {
        "id": "uuid",
        "title": "Initial Assessment",
        "description": "Form description",
        "type": "pre_session",
        "isActive": true,
        "createdAt": "2025-05-01T12:00:00Z",
        "updatedAt": "2025-05-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "pages": 2,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### Get Form Details

```
GET /api/v1/forms/:id
```

**Response:**
```json
{
  "status": "success",
  "message": "Form retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Initial Assessment",
    "description": "Comprehensive initial assessment form",
    "type": "pre_session",
    "fields": [
      {
        "id": "field_1",
        "label": "What brings you to therapy?",
        "type": "textarea",
        "required": true,
        "helpText": "Please describe your reasons for seeking therapy"
      },
      {
        "id": "field_2",
        "label": "Rate your current stress level",
        "type": "scale",
        "required": true,
        "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        "helpText": "1 = No stress, 10 = Extreme stress"
      }
    ],
    "isActive": true,
    "meta": {},
    "createdAt": "2025-05-01T12:00:00Z",
    "updatedAt": "2025-05-01T12:00:00Z"
  }
}
```

### Resources

#### List Resources

```
GET /api/v1/resources
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `therapistId` (optional): Filter by therapist
- `type` (optional): Filter by resource type
- `tags` (optional): Filter by tags (comma-separated)

**Response:**
```json
{
  "status": "success",
  "message": "Resources retrieved successfully",
  "data": {
    "resources": [
      {
        "id": "uuid",
        "therapistId": "uuid",
        "title": "Mindfulness Techniques",
        "description": "Guide to mindfulness practices",
        "type": "pdf",
        "url": "https://storage.unclutter.com/resources/mindfulness-guide.pdf",
        "isPublic": true,
        "tags": ["mindfulness", "anxiety", "stress"],
        "createdAt": "2025-05-01T12:00:00Z",
        "updatedAt": "2025-05-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 30,
      "pages": 3,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### Assign Resource

```
POST /api/v1/resources/:id/assign
```

**Request Body:**
```json
{
  "clientId": "uuid",
  "dueDate": "2025-05-20T23:59:59Z",
  "notes": "Please review this resource before our next session"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Resource assigned successfully",
  "data": {
    "id": "uuid",
    "resourceId": "uuid",
    "clientId": "uuid",
    "assignedAt": "2025-05-01T12:30:00Z",
    "dueDate": "2025-05-20T23:59:59Z",
    "status": "assigned",
    "notes": "Please review this resource before our next session",
    "meta": {}
  }
}
```

## Error Responses

### Validation Error

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    },
    {
      "field": "password",
      "message": "Must be at least 8 characters long"
    }
  ],
  "data": null
}
```

### Authentication Error

```json
{
  "status": "error",
  "message": "Authentication failed",
  "errors": [
    {
      "code": "invalid_token",
      "message": "Invalid or expired token"
    }
  ],
  "data": null
}
```

### Authorization Error

```json
{
  "status": "error",
  "message": "Authorization failed",
  "errors": [
    {
      "code": "insufficient_permissions",
      "message": "You do not have permission to access this resource"
    }
  ],
  "data": null
}
```

### Resource Not Found

```json
{
  "status": "error",
  "message": "Resource not found",
  "errors": [
    {
      "code": "not_found",
      "message": "The requested resource could not be found"
    }
  ],
  "data": null
}
```
