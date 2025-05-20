# Unclutter Therapy Module Specification

## 1. Overview

The Unclutter Therapy Module provides a comprehensive system for mental wellness therapy services within the Unclutter platform. This module focuses on four core components: Therapist Management, Session Management, Forms & Assessments, and Resource Management.

## 2. Core Components

### 2.1 Therapist Management

- **Profile Management**: Detailed therapist profiles with credentials, specialties, bio, and photo
- **Availability Management**: Flexible scheduling with calendar integration
- **Currently focused on single-therapist implementation with future support for multi-therapist organizations**

### 2.2 Session Management

- **Session Types**: Initial consultation, regular sessions, follow-up sessions
- **Session Formats**: Video, audio, chat, in-person, hybrid options
- **Booking System**: Calendar-based booking with Google Calendar integration
- **Session Notes**: Both private notes and shareable notes with clients

### 2.3 Forms & Assessments

- **Dynamic Forms**: Customizable forms for different stages (pre-session, in-session, post-session)
- **Assessment Tools**: Standardized and custom assessment instruments
- **Progress Tracking**: Tools to monitor client progress over time
- **Response Management**: Secure storage and analysis of client responses

### 2.4 Resource Management

- **Resource Library**: Therapist-created resources for clients
- **Multiple Formats**: Support for PDF, video, links, and other media
- **Assignment System**: Ability to assign specific resources to clients
- **Progress Tracking**: Monitor client engagement with assigned resources

## 3. Data Model

### 3.1 Therapists

```typescript
interface Therapist {
  id: string;              // UUID
  userId: string;          // Reference to User model
  bio: string;             // Detailed professional bio
  specialties: string[];   // Array of specialization areas
  credentials: string[];   // Professional credentials
  isActive: boolean;       // Active status
  calendarIntegration?: {  // Optional calendar integration
    provider: string;      // e.g., "google", "outlook"
    calendarId: string;    // External calendar identifier
  };
  meta: Record<string, any>; // Extensible metadata
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Sessions

```typescript
interface TherapySession {
  id: string;              // UUID
  therapistId: string;     // Reference to Therapist
  clientId: string;        // Reference to User (client)
  startTime: Date;         // Session start time
  endTime: Date;           // Session end time
  status: SessionStatus;   // enum: scheduled, completed, canceled, etc.
  type: SessionType;       // enum: initial, regular, followUp
  format: SessionFormat;   // enum: video, audio, chat, inPerson, hybrid
  privateNotes?: string;   // Notes visible only to therapist
  sharedNotes?: string;    // Notes shared with client
  meta: Record<string, any>; // Extensible metadata
  createdAt: Date;
  updatedAt: Date;
}

enum SessionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show'
}

enum SessionType {
  INITIAL = 'initial',
  REGULAR = 'regular',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency'
}

enum SessionFormat {
  VIDEO = 'video',
  AUDIO = 'audio',
  CHAT = 'chat',
  IN_PERSON = 'in_person',
  HYBRID = 'hybrid'
}
```

### 3.3 Forms & Assessments

```typescript
interface TherapyForm {
  id: string;              // UUID
  title: string;           // Form title
  description?: string;    // Optional description
  type: FormType;          // enum: pre-session, in-session, post-session, assessment
  fields: FormField[];     // Array of form fields
  isActive: boolean;       // Active status
  meta: Record<string, any>; // Extensible metadata
  createdAt: Date;
  updatedAt: Date;
}

interface FormField {
  id: string;              // Field identifier
  label: string;           // Display label
  type: FieldType;         // enum: text, textarea, select, radio, checkbox, etc.
  required: boolean;       // Whether field is required
  options?: string[];      // Options for select, radio, checkbox fields
  validation?: string;     // Validation rules
  helpText?: string;       // Helper text for field
}

enum FormType {
  PRE_SESSION = 'pre_session',
  IN_SESSION = 'in_session',
  POST_SESSION = 'post_session',
  ASSESSMENT = 'assessment',
  CUSTOM = 'custom'
}

enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  TIME = 'time',
  EMAIL = 'email',
  NUMBER = 'number',
  SCALE = 'scale'
}

interface FormResponse {
  id: string;              // UUID
  formId: string;          // Reference to Form
  sessionId?: string;      // Optional reference to Session
  clientId: string;        // Reference to User (client)
  responses: {
    [fieldId: string]: any; // Field responses
  };
  submittedAt: Date;       // Submission timestamp
  meta: Record<string, any>; // Extensible metadata
}
```

### 3.4 Resources

```typescript
interface TherapyResource {
  id: string;              // UUID
  therapistId: string;     // Reference to Therapist
  title: string;           // Resource title
  description?: string;    // Optional description
  type: ResourceType;      // enum: pdf, video, link, etc.
  url: string;             // Resource URL or path
  isPublic: boolean;       // Whether resource is publicly available
  tags: string[];          // Categorization tags
  meta: Record<string, any>; // Extensible metadata
  createdAt: Date;
  updatedAt: Date;
}

enum ResourceType {
  PDF = 'pdf',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  IMAGE = 'image',
  TEXT = 'text',
  OTHER = 'other'
}

interface ResourceAssignment {
  id: string;              // UUID
  resourceId: string;      // Reference to Resource
  clientId: string;        // Reference to User (client)
  assignedAt: Date;        // Assignment timestamp
  dueDate?: Date;          // Optional due date
  status: AssignmentStatus; // enum: assigned, viewed, completed
  notes?: string;          // Optional notes
  meta: Record<string, any>; // Extensible metadata
}

enum AssignmentStatus {
  ASSIGNED = 'assigned',
  VIEWED = 'viewed',
  COMPLETED = 'completed'
}
```

## 4. API Endpoints

### 4.1 Therapist Endpoints

```
GET    /api/v1/therapists                - List therapists
GET    /api/v1/therapists/:id            - Get therapist details
POST   /api/v1/therapists                - Create therapist profile
PUT    /api/v1/therapists/:id            - Update therapist profile
DELETE /api/v1/therapists/:id            - Delete therapist profile
GET    /api/v1/therapists/:id/availability - Get therapist availability
POST   /api/v1/therapists/:id/availability - Update therapist availability
```

### 4.2 Session Endpoints

```
GET    /api/v1/sessions                  - List sessions (filtered by user role)
GET    /api/v1/sessions/:id              - Get session details
POST   /api/v1/sessions                  - Create session
PUT    /api/v1/sessions/:id              - Update session
DELETE /api/v1/sessions/:id              - Cancel session
POST   /api/v1/sessions/:id/notes        - Add/update session notes
GET    /api/v1/sessions/:id/notes        - Get session notes
```

### 4.3 Forms & Assessments Endpoints

```
GET    /api/v1/forms                     - List forms
GET    /api/v1/forms/:id                 - Get form details
POST   /api/v1/forms                     - Create form
PUT    /api/v1/forms/:id                 - Update form
DELETE /api/v1/forms/:id                 - Delete form
GET    /api/v1/forms/:id/responses       - List form responses
POST   /api/v1/forms/:id/responses       - Submit form response
GET    /api/v1/forms/responses/:id       - Get specific response
```

### 4.4 Resource Endpoints

```
GET    /api/v1/resources                 - List resources
GET    /api/v1/resources/:id             - Get resource details
POST   /api/v1/resources                 - Create resource
PUT    /api/v1/resources/:id             - Update resource
DELETE /api/v1/resources/:id             - Delete resource
POST   /api/v1/resources/:id/assign      - Assign resource to client
GET    /api/v1/resources/assignments     - List resource assignments
PUT    /api/v1/resources/assignments/:id - Update assignment status
```

## 5. Security & Compliance

### 5.1 Data Protection

- **End-to-end encryption** for all sensitive data
- **Access controls** based on user roles and permissions
- **Audit logging** for all data access and modifications
- **Secure data storage** with encryption at rest
- **Regular backups** with secure storage

### 5.2 Compliance Requirements

- **HIPAA compliance** for all data handling
- **Data privacy laws** adherence (GDPR, CCPA, etc.)
- **Professional standards** for therapy practice
- **Ethics guidelines** implementation
- **Record keeping** in compliance with regulatory requirements

### 5.3 Authentication & Authorization

- **JWT-based authentication** for all API endpoints
- **Role-based access control** (therapist, client, admin)
- **Fine-grained permissions** for specific actions
- **Session management** with secure timeout policies
- **Two-factor authentication** for sensitive operations

## 6. Integration Points

### 6.1 Core Platform Integration

- **Authentication**: Leverage core authentication system
- **User Management**: Integrate with existing user profiles
- **Notifications**: Use core notification system for reminders and alerts
- **Email**: Utilize core email service for communications
- **Payments**: Integrate with core payment processing (future)

### 6.2 External Integrations

- **Calendar**: Google Calendar, Outlook Calendar
- **Video Conferencing**: Zoom, Google Meet (future)
- **Assessment Tools**: Standardized assessment instruments (future)
- **Electronic Health Records**: Secure EHR integration (future)

## 7. Future Extensions

### 7.1 Tiered Service Model

**Client Tiers:**
- **Basic Tier**: Essential booking and communication
- **Premium Tier**: Enhanced features like priority booking
- **Professional Tier**: Advanced features like multiple therapist access

**Therapist Tiers:**
- **Standard Tier**: Basic client management
- **Professional Tier**: Advanced features like custom treatment plans
- **Enterprise Tier**: Practice management and team collaboration

### 7.2 Additional Features

- **Group Sessions**: Support for group therapy
- **Family/Couple Therapy**: Specialized session types
- **Advanced Analytics**: Insights for therapists and clients
- **Mobile App Integration**: Native mobile experience
- **AI-Assisted Tools**: Intelligent recommendations and insights
