# Journal Feature Specification

## Core Requirements

### User Experience Requirements
- Entry Creation & Management
  - Rich text formatting capabilities 
  - Voice-to-text journaling with transcription
  - Multiple journal types (Reflection, Gratitude, Notes, Custom)
  - Tagging system
  - Mood association
  - Auto-save functionality
  - Offline support

- Privacy & Security
  - End-to-end encryption
  - Entry locking with time-based unlock
  - Selective sharing capabilities
  - Anonymous sharing option
  - Professional sharing (Premium feature)

- Organization & Search
  - Full-text search across entries
  - Filter by date, type, mood, tags
  - Sort by various parameters
  - Custom journal types creation

## Database Schema

### Tables

#### journal_entries
- Primary identifier
- User reference
- Title
- Encrypted content
- Journal type reference
- Mood reference
- Tags array
- Lock status and unlock date
- Sharing settings
- Voice note reference
- Timestamps (created, updated, synced)
- Soft delete flag

#### journal_types
- Primary identifier
- User reference (null for defaults)
- Name
- Description
- Icon reference
- Default flag
- Creation timestamp

#### journal_sharing
- Primary identifier
- Entry reference
- Shared by user reference
- Shared with user/professional reference
- Anonymous flag
- Share expiration
- Access level
- Sharing timestamp

#### journal_tags
- Primary identifier
- User reference
- Tag name
- Usage count
- Created timestamp

## Security Architecture

### Encryption System
- Client-Side Encryption
  - Hybrid encryption system
  - User-specific master keys
  - Per-entry encryption keys
  - Secure key storage strategy

### Server-Side Security
- Additional encryption at rest
- Secure key management for sharing
- Access control system

## Feature Implementations

### Rich Text Editor
- Implementation Options:
  - Recommended: ProseMirror or TipTap
  - Alternative: Draft.js
- Required Features:
  - Basic formatting
  - Image embedding
  - Voice note embedding
  - Tag insertion
  - Mood selector integration

### Voice-to-Text
- Audio recording capability
- Real-time transcription
- Audio file compression
- Temporary audio storage
- Transcription error handling

### Offline Support
- IndexedDB for local storage
- Service Worker configuration
- Sync queue management
- Conflict resolution strategy
- Storage limit handling

### AI Integration
- Entry Analysis
  - Emotional tone detection
  - Key themes identification
  - Writing pattern analysis
  - Behavioral pattern recognition
- Insights Generation
  - Mood correlation analysis
  - Writing style patterns
  - Topic frequency analysis
  - Behavioral trend identification
- Recommendations
  - Prompt suggestions
  - Writing style improvements
  - Mood-based recommendations
  - Professional consultation triggers


## Subscription Tiers

### Free Tier
- Core Journaling
  - Basic text formatting
  - Daily journal entries (limited to 10 per day)
  - Basic journal types
  - Basic tagging (up to 3 tags per entry)
  - Mood tracking integration
  - Auto-save functionality
  - Basic search functionality
  - Offline access to last 7 days of entries
  - Basic encryption

### Premium Tier
- Enhanced Journaling
  - Advanced text formatting
  - Unlimited journal entries
  - Custom journal types (up to 5)
  - Advanced tagging (unlimited)
  - Voice-to-text journaling (30 minutes per month)
  - Full offline access
  - Advanced search with filters
  - Extended entry history

### Pro Tier
- Professional Journaling
  - Unlimited custom journal types
  - Unlimited voice-to-text journaling
  - Priority offline sync
  - Professional journal templates
  - Bulk export capabilities
  - Advanced encryption options
  - Clinical integration
  - Professional annotation support
  - Clinical progress tracking
  - Advanced AI features
  - Custom AI analysis parameters
  - Crisis pattern detection
  - Professional alert system