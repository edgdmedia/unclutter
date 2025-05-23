# Functional Requirements Document (FRD): Unclutter Therapy Module

## 1. Overview
The Therapy Module provides a flexible, scalable system for organizations or solo practitioners to deliver therapy services. It integrates with the core plugin for authentication, notifications, email, roles, subscriptions, and payments.

---

## 2. Data Model

### 2.1. Table: `unclutter_therapists`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Therapist ID                             |
| org_id        | BIGINT, FK     | Organization ID (nullable for solo)      |
| profile_id    | BIGINT, FK     | Linked profile                           |
| bio           | TEXT           | Therapist bio                            |
| specialties   | VARCHAR(255)   | Comma-separated specialties              |
| is_active     | TINYINT(1)     | Active/Inactive                          |
| calendar_link | VARCHAR(255)   | Google Calendar/ICS link (optional)      |
| meta          | JSON           | Extensible                               |

### 2.2. Table: `wp_unclutter_therapy_sessions`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Session ID                               |
| therapist_id  | BIGINT, FK     | Therapist                                |
| client_id     | BIGINT, FK     | Client profile                           |
| package_id    | BIGINT, FK     | Linked package (nullable)                |
| start_time    | DATETIME       | Session start                            |
| end_time      | DATETIME       | Session end                              |
| status        | VARCHAR(20)    | (booked, completed, canceled, etc.)      |
| type          | VARCHAR(30)    | (video, in-person, phone, etc.)          |
| notes         | TEXT           | Private notes                            |
| shared_notes  | TEXT           | Notes shared with client                 |
| coupon_id     | BIGINT, FK     | Applied coupon (nullable)                |
| meta          | JSON           | Extensible                               |

### 2.3. Table: `wp_unclutter_therapy_bookings`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Booking ID                               |
| session_id    | BIGINT, FK     | Linked session                           |
| created_at    | DATETIME       | Booking creation                         |
| status        | VARCHAR(20)    | (pending, confirmed, canceled)           |
| form_status   | VARCHAR(20)    | (pending, complete, etc.)                |
| meta          | JSON           | Extensible                               |

### 2.4. Table: `wp_unclutter_therapy_forms`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Form ID                                  |
| org_id        | BIGINT, FK     | Organization                             |
| type          | VARCHAR(20)    | (pre, in, post)                          |
| title         | VARCHAR(100)   | Form title                               |
| fields        | JSON           | Form fields/structure                    |
| meta          | JSON           | Extensible                               |

### 2.5. Table: `wp_unclutter_therapy_form_responses`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Response ID                              |
| form_id       | BIGINT, FK     | Linked form                              |
| booking_id    | BIGINT, FK     | Linked booking                           |
| client_id     | BIGINT, FK     | Client profile                           |
| responses     | JSON           | Answers                                  |
| submitted_at  | DATETIME       | Submission time                          |

### 2.6. Table: `wp_unclutter_therapy_packages`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Package ID                               |
| org_id        | BIGINT, FK     | Organization                             |
| title         | VARCHAR(100)   | Package name                             |
| description   | TEXT           | Description                              |
| sessions      | INT            | Number of sessions                       |
| price         | DECIMAL(10,2)  | Price                                    |
| duration      | VARCHAR(20)    | e.g., monthly, quarterly                  |
| meta          | JSON           | Extensible                               |

### 2.7. Table: `wp_unclutter_therapy_coupons`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Coupon ID                                |
| org_id        | BIGINT, FK     | Organization                             |
| code          | VARCHAR(30)    | Coupon code                              |
| discount_type | VARCHAR(10)    | (percent, fixed)                         |
| value         | DECIMAL(10,2)  | Discount value                           |
| valid_from    | DATETIME       | Start date                               |
| valid_to      | DATETIME       | End date                                 |
| usage_limit   | INT            | Max uses                                 |
| meta          | JSON           | Extensible                               |

### 2.8. Table: `wp_unclutter_therapy_resources`
| Field         | Type           | Description                              |
|-------------- |--------------- |------------------------------------------|
| id            | BIGINT, PK     | Resource ID                              |
| org_id        | BIGINT, FK     | Organization                             |
| therapist_id  | BIGINT, FK     | Therapist (nullable)                     |
| title         | VARCHAR(100)   | Resource title                           |
| type          | VARCHAR(30)    | (pdf, video, link, etc.)                 |
| url           | VARCHAR(255)   | Resource URL                             |
| assigned_to   | BIGINT, FK     | Client profile (nullable)                |
| meta          | JSON           | Extensible                               |

---

## 4. Business Logic
- Support both multi-therapist and single-therapist organizations
- Therapists/admins manage profiles, availability, forms, resources
- Flexible calendar: recurring and specific date slots, Google Calendar integration
- Dynamic forms: assignable as pre, in, or post-session (or custom stages)
- Automated onboarding and reminders via core plugin notifications/email
- Packages and coupons: support for multi-session, monthly, discounts
- Session notes: private to therapist, shareable summary with client
- Reporting: exportable by admin/therapist
- Role-based access for all endpoints
- All payments, notifications, emails, and audit logs handled via core plugin

---

## 5. Security & Extensibility
- All endpoints require JWT and role validation
- Input validation and sanitization
- All actions logged via audit system
- Extensible data model for new fields, types, and integrations

---

## 6. Non-Functional Requirements
- Documentation for all endpoints and data models
