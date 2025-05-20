# Check-in Feature Specification

## System Overview

### Purpose
The Check-in system serves as an optional but integrated core experience providing structured moments for mental health self-care while maintaining flexibility for different user preferences and needs.

## Core Components

### Check-in Types

#### Daily Wellness Check-ins
- Morning Check-in
  - Mood assessment
  - Daily intention setting
  - Gratitude practice
  - Preview of day's activities
- Evening Check-in
  - Day reflection
  - Mood review
  - Achievement acknowledgment
  - Next day preparation

#### Custom Check-ins
- User-defined frequency
  - Daily
  - Weekly
  - Monthly
  - Custom schedule
- Specialized focus areas
- Professional integration
- Progress tracking

### Database Schema

```sql
-- Check-in Templates
CREATE TABLE checkin_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  components JSON NOT NULL,
  duration_minutes INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- User Check-in Settings
CREATE TABLE user_checkin_settings (
  user_id UUID PRIMARY KEY,
  morning_time TIME,
  evening_time TIME,
  preferred_duration INTEGER,
  sound_enabled BOOLEAN DEFAULT TRUE,
  notification_preferences JSON,
  custom_components JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Check-in Sessions
CREATE TABLE checkin_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  template_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  completion_status VARCHAR(20),
  responses JSON,
  metrics JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (template_id) REFERENCES checkin_templates(id)
);

-- Check-in Components
CREATE TABLE checkin_components (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  configuration JSON NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  subscription_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

#### Check-in Management
- POST /api/v1/checkins/start
- GET /api/v1/checkins/current
- POST /api/v1/checkins/complete
- GET /api/v1/checkins/history
- GET /api/v1/checkins/templates
- POST /api/v1/checkins/templates
- PUT /api/v1/checkins/templates/{id}

#### Settings & Preferences
- GET /api/v1/checkins/settings
- PUT /api/v1/checkins/settings
- GET /api/v1/checkins/components
- PUT /api/v1/checkins/components/order

#### Analytics & Insights
- GET /api/v1/checkins/analytics/overview
- GET /api/v1/checkins/analytics/trends
- GET /api/v1/checkins/analytics/completion-rates

## Feature Tiers

### Free Tier
- Daily morning and evening check-ins
- Basic customization options
- Standard question templates
- Simple progress tracking
- Basic activity recommendations
- Limited sound/music options

### Premium Tier
- Unlimited custom check-ins
- Advanced customization
- Custom questions and flows
- Detailed progress analytics
- AI-powered recommendations
- Full ambient sound library
- Professional check-in templates
- Export capabilities

### Professional Tier
- Clinical integration features
- Custom therapeutic workflows
- Treatment progress tracking
- Professional collaboration tools
- Advanced analytics and reporting
- API access for integration

## Security & Privacy

### Data Protection
- End-to-end encryption for sensitive data
- Secure storage of personal information
- Professional sharing controls
- Data retention policies

### Access Control
- Role-based permissions
- Session management
- API authentication
- Audit logging

## Performance Requirements

### Response Times
- Initial load: < 2 seconds
- Component transitions: < 100ms
- API responses: < 200ms
- Animation frame rate: 60fps

### Offline Capabilities
- Template caching
- Session data storage
- Background sync
- Conflict resolution