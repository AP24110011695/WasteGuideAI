# Data Flow Diagrams and User Stories

**Project Name:** WasteGuideAI  
**Team ID:** WasteGuideAI  
**Student Name:** Ayush Kumar Saha  
**Roll Number:** AP24110011695  

## Data Flow Diagram - Level 0 (Context Diagram)

```
                    ┌─────────────────┐
                    │   External User │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   WasteGuideAI  │
                    │     System      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  AI Service    │  │  Firebase DB    │  │  Location API  │
│  (Groq API)    │  │  (Firestore)    │  │  (Maps)        │
└────────────────┘  └─────────────────┘  └────────────────┘
```

## Data Flow Diagram - Level 1

```
┌─────────────────────────────────────────────────────────────────┐
│                        WasteGuideAI System                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User Input │────▶│  Web/Mobile  │────▶│  API Gateway │
│  (Image/Text)│     │   Interface  │     │   (Flask)    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                   │
              ┌────────────────────────────────────┼────────────────────────────────────┐
              │                                    │                                    │
┌─────────────▼──────────┐           ┌────────────▼──────────┐           ┌────────────▼──────────┐
│  Authentication Module │           │  AI Processing Module │           │  Location Module     │
│  (Firebase Auth)       │           │  (Groq API)           │           │  (Maps API)          │
└───────────┬────────────┘           └───────────┬────────────┘           └───────────┬────────────┘
            │                                    │                                    │
            │                                    │                                    │
┌───────────▼────────────┐           ┌───────────▼────────────┐           ┌───────────▼────────────┐
│  User Data Store       │           │  AI Response Store     │           │  Facility Database    │
│  (Firestore)           │           │  (Firestore)          │           │  (Firestore)          │
└─────────────────────────┘           └─────────────────────────┘           └─────────────────────────┘
```

## User Stories

### Epic 1: AI-Powered Waste Identification

**US-1: Image-Based Waste Classification**
- **As a** user
- **I want to** upload or capture an image of a waste item
- **So that** I can quickly identify the type of waste and how to dispose of it
- **Acceptance Criteria:**
  - User can access camera or upload image
  - AI classifies waste with 95%+ accuracy
  - Response includes waste type and disposal instructions
  - Processing time < 3 seconds

**US-2: Text-Based Waste Queries**
- **As a** user
- **I want to** ask questions about waste disposal in natural language
- **So that** I can get instant answers without searching through complex guides
- **Acceptance Criteria:**
  - Chat interface supports natural language
  - AI provides accurate disposal instructions
  - Response includes relevant local regulations
  - Conversation context is maintained

**US-3: Disposal Recommendations**
- **As a** user
- **I want to** receive personalized disposal recommendations
- **So that** I can make the most environmentally friendly choice
- **Acceptance Criteria:**
  - Recommendations consider user's location
  - Multiple disposal options provided with environmental impact
  - Recycling options prioritized
  - Special handling instructions for hazardous waste

### Epic 2: Location-Based Services

**US-4: Recycling Center Finder**
- **As a** user
- **I want to** find nearby recycling and disposal facilities
- **So that** I can easily locate where to take my waste
- **Acceptance Criteria:**
  - Map shows facilities within 10km radius
  - Facility details include hours, accepted materials, contact info
  - Directions integration available
  - Filters for facility types

**US-5: Collection Schedule Integration**
- **As a** user
- **I want to** view my local waste collection schedule
- **So that** I never miss pickup days
- **Acceptance Criteria:**
  - Schedule displays based on user's address
  - Reminders can be set for collection days
  - Notifications for schedule changes
  - Calendar integration available

### Epic 3: Educational Resources

**US-6: Waste Sorting Guide**
- **As a** user
- **I want to** access comprehensive waste sorting guides
- **So that** I can learn proper waste management practices
- **Acceptance Criteria:**
  - Searchable guide with common waste items
  - Visual examples for each category
  - Local regulation information
  - Printable reference materials

**US-7: Environmental Impact Information**
- **As a** user
- **I want to** understand the environmental impact of my waste choices
- **So that** I can make more informed decisions
- **Acceptance Criteria:**
  - Impact data for different disposal methods
  - Visual representations of environmental benefits
  - Personal impact tracking
  - Comparative statistics

### Epic 4: User Engagement

**US-8: Progress Tracking**
- **As a** user
- **I want to** track my waste management progress
- **So that** I can see my improvement over time
- **Acceptance Criteria:**
  - Dashboard shows disposal statistics
  - Environmental impact metrics displayed
  - Historical data available
  - Export functionality

**US-9: Achievement System**
- **As a** user
- **I want to** earn badges for sustainable behaviors
- **So that** I stay motivated to improve
- **Acceptance Criteria:**
  - Multiple achievement categories
  - Badge display on profile
  - Progressive difficulty levels
  - Social sharing capability

**US-10: Community Challenges**
- **As a** user
- **I want to** participate in community waste challenges
- **So that** I can contribute to broader environmental goals
- **Acceptance Criteria:**
  - Challenge creation and joining
  - Leaderboard functionality
  - Team participation options
  - Progress visualization

### Epic 5: Administrative Features

**US-11: User Authentication**
- **As a** user
- **I want to** securely create and access my account
- **So that** my data and progress are protected
- **Acceptance Criteria:**
  - Email/password authentication
  - Social login options (Google, Facebook)
  - Password recovery functionality
  - Session management

**US-12: Profile Management**
- **As a** user
- **I want to** manage my profile and preferences
- **So that** the app provides personalized experience
- **Acceptance Criteria:**
  - Profile editing capability
  - Location and notification preferences
  - Privacy settings management
  - Data export and deletion

## Data Dictionary

| Entity | Attributes | Type | Description |
|--------|-----------|------|-------------|
| User | user_id | String | Unique user identifier |
| | email | String | User email address |
| | name | String | User display name |
| | location | Object | User's default location |
| | preferences | Object | User preferences and settings |
| WasteQuery | query_id | String | Unique query identifier |
| | user_id | String | Reference to user |
| | type | String | Query type (image/text) |
| | content | String/Binary | Query content |
| | response | Object | AI response data |
| | timestamp | DateTime | Query timestamp |
| Facility | facility_id | String | Unique facility identifier |
| | name | String | Facility name |
| | type | String | Facility type |
| | location | Object | Geographic coordinates |
| | hours | Object | Operating hours |
| | materials | Array | Accepted materials |
| Achievement | achievement_id | String | Unique achievement identifier |
| | name | String | Achievement name |
| | description | String | Achievement description |
| | criteria | Object | Completion criteria |
| UserAchievement | user_id | String | Reference to user |
| | achievement_id | String | Reference to achievement |
| | date_earned | DateTime | Completion date |
| Challenge | challenge_id | String | Unique challenge identifier |
| | name | String | Challenge name |
| | description | String | Challenge description |
| | start_date | DateTime | Challenge start |
| | end_date | DateTime | Challenge end |
| | participants | Array | Participant list |
