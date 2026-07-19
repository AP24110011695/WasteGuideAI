# Solution Architecture

**Project Name:** WasteGuideAI  
**Team ID:** WasteGuideAI  
**Student Name:** Ayush Kumar Saha  
**Roll Number:** AP24110011695  

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │  Mobile Web  │  │   Admin UI   │              │
│  │  (React 19)  │  │  (React 19)  │  │  (React 19)  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Flask Application Server                        │  │
│  │  - Request Routing                                           │  │
│  │  - Authentication Middleware                                 │  │
│  │  - Rate Limiting                                             │  │
│  │  - Request Validation                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼─────────┐  ┌────────▼────────┐
│  AI Service    │  │  Business Logic   │  │  Data Service   │
│  Layer         │  │  Layer           │  │  Layer          │
├────────────────┤  ├──────────────────┤  ├─────────────────┤
│ - Groq API     │  │ - User Service   │  │ - Firebase      │
│ - Image Proc   │  │ - Waste Service  │  │   Firestore     │
│ - NLP Engine   │  │ - Location Svc   │  │ - Firebase Auth │
│ - Model Mgmt   │  │ - Achievement Svc │  │ - Cache Layer   │
└────────────────┘  └──────────────────┘  └─────────────────┘
```

## Component Architecture

### Frontend Components

#### Component Hierarchy
```
App
├── AuthProvider
├── Router
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── FeatureCards
│   │   └── CTASection
│   ├── AIChatPage
│   │   ├── ChatInterface
│   │   ├── MessageList
│   │   ├── InputArea
│   │   └── ImageUpload
│   ├── FacilityMapPage
│   │   ├── MapContainer
│   │   ├── FacilityList
│   │   ├── FilterPanel
│   │   └── DetailModal
│   ├── EducationPage
│   │   ├── SearchBar
│   │   ├── GuideCards
│   │   ├── CategoryFilter
│   │   └── DetailView
│   ├── DashboardPage
│   │   ├── StatsOverview
│   │   ├── ImpactChart
│   │   ├── AchievementBadges
│   │   └── ActivityHistory
│   └── ProfilePage
│       ├── UserProfile
│       ├── SettingsForm
│       └── PrivacyControls
├── NotificationProvider
└── ThemeProvider
```

#### Component Communication
- **Props:** Parent to child data flow
- **Context:** Global state (auth, theme, notifications)
- **Custom Hooks:** Reusable logic (useAuth, useLocation, useAI)
- **Event Handlers:** User interaction handling
- **API Services:** Backend communication via Axios

### Backend Components

#### Service Layer Architecture
```
app.py (Flask Application)
├── config/
│   ├── __init__.py
│   ├── config.py (Configuration settings)
│   └── firebase_config.py (Firebase setup)
├── routes/
│   ├── __init__.py
│   ├── auth_routes.py (Authentication endpoints)
│   ├── waste_routes.py (Waste classification)
│   ├── facility_routes.py (Location services)
│   ├── user_routes.py (User management)
│   └── achievement_routes.py (Gamification)
├── services/
│   ├── __init__.py
│   ├── ai_service.py (Groq API integration)
│   ├── location_service.py (Maps integration)
│   ├── user_service.py (User business logic)
│   ├── achievement_service.py (Achievement logic)
│   └── notification_service.py (Notification logic)
├── models/
│   ├── __init__.py
│   ├── user_model.py (User data models)
│   ├── waste_model.py (Waste classification models)
│   └── facility_model.py (Facility data models)
└── utils/
    ├── __init__.py
    ├── validators.py (Input validation)
    ├── decorators.py (Auth decorators, rate limiting)
    └── helpers.py (Utility functions)
```

## Data Architecture

### Database Schema (Firebase Firestore)

#### Collections Structure

**users**
```
{
  "user_id": "string",
  "email": "string",
  "name": "string",
  "location": {
    "lat": number,
    "lng": number,
    "address": "string"
  },
  "preferences": {
    "notifications": boolean,
    "language": "string",
    "theme": "string"
  },
  "stats": {
    "total_queries": number,
    "correct_disposals": number,
    "environmental_impact": number
  },
  "created_at": timestamp,
  "updated_at": timestamp
}
```

**waste_queries**
```
{
  "query_id": "string",
  "user_id": "string",
  "type": "image|text",
  "content": "string",
  "classification": {
    "category": "string",
    "confidence": number,
    "disposal_method": "string"
  },
  "response": "string",
  "timestamp": timestamp
}
```

**facilities**
```
{
  "facility_id": "string",
  "name": "string",
  "type": "recycling|disposal|hazardous",
  "location": {
    "lat": number,
    "lng": number,
    "address": "string"
  },
  "hours": {
    "monday": "string",
    "tuesday": "string",
    // ... other days
  },
  "accepted_materials": ["string"],
  "contact": {
    "phone": "string",
    "email": "string",
    "website": "string"
  },
  "verified": boolean,
  "updated_at": timestamp
}
```

**achievements**
```
{
  "achievement_id": "string",
  "name": "string",
  "description": "string",
  "icon": "string",
  "criteria": {
    "type": "queries|disposals|streak",
    "target": number,
    "timeframe": "daily|weekly|monthly"
  },
  "points": number,
  "created_at": timestamp
}
```

**user_achievements**
```
{
  "user_id": "string",
  "achievement_id": "string",
  "earned_at": timestamp,
  "progress": number
}
```

**challenges**
```
{
  "challenge_id": "string",
  "name": "string",
  "description": "string",
  "type": "individual|community",
  "start_date": timestamp,
  "end_date": timestamp,
  "target": number,
  "participants": ["string"],
  "created_by": "string"
}
```

## API Architecture

### RESTful API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/verify
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### Waste Classification Endpoints
```
POST   /api/waste/classify-image
POST   /api/waste/classify-text
GET    /api/waste/history
GET    /api/waste/categories
GET    /api/waste/disposal-methods
```

#### Facility Endpoints
```
GET    /api/facilities/nearby
GET    /api/facilities/:facility_id
GET    /api/facilities/types
POST   /api/facilities/suggest
```

#### User Endpoints
```
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/stats
GET    /api/user/preferences
PUT    /api/user/preferences
DELETE /api/user/account
```

#### Achievement Endpoints
```
GET    /api/achievements
GET    /api/achievements/user
POST   /api/achievements/claim
GET    /api/achievements/leaderboard
```

#### Challenge Endpoints
```
GET    /api/challenges
POST   /api/challenges/join
GET    /api/challenges/:challenge_id
POST   /api/challenges/create
```

### API Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-07-19T12:00:00Z"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2024-07-19T12:00:00Z"
}
```

## Security Architecture

### Authentication Flow
```
1. User enters credentials
2. Frontend sends POST /api/auth/login
3. Backend validates with Firebase Auth
4. Firebase returns ID token
5. Backend creates session token
6. Frontend stores tokens securely
7. Subsequent requests include Authorization header
8. Backend validates token on each request
```

### Authorization Model
- **Role-Based Access Control (RBAC)**
- **User Roles:** user, admin, moderator
- **Permission Scopes:** read, write, delete, admin
- **Resource Ownership:** Users can only access their own data

### Data Protection
- **Encryption:** TLS 1.3 for all communications
- **Data at Rest:** Firebase encryption
- **PII Protection:** Minimal data collection, consent-based
- **Audit Logging:** All sensitive actions logged

## Integration Architecture

### External Service Integrations

#### Groq AI Integration
```
┌─────────────┐
│   Flask App │
└──────┬──────┘
       │ HTTP Request
       │
┌──────▼──────────┐
│   Groq API       │
│   - Llama 3.3    │
│   - Image Proc   │
│   - NLP          │
└──────────────────┘
```

#### Firebase Integration
```
┌─────────────┐
│   Flask App │
└──────┬──────┘
       │ Firebase SDK
       │
┌──────▼──────────┐
│   Firebase       │
│   - Auth         │
│   - Firestore    │
│   - Storage     │
└──────────────────┘
```

#### Maps Integration
```
┌─────────────┐
│ React App   │
└──────┬──────┘
       │ React Leaflet
       │
┌──────▼──────────┐
│   OpenStreetMap │
│   / Google Maps │
└──────────────────┘
```

## Deployment Architecture

### Development Environment
```
Local Development
├── Frontend: Vite dev server (localhost:5173)
├── Backend: Flask dev server (localhost:5000)
├── Database: Firebase emulator
└── AI Service: Groq API (development key)
```

### Production Environment
```
Production Deployment
├── Frontend: Vercel (CDN, edge caching)
├── Backend: Render/Railway (containerized)
├── Database: Firebase Production
├── AI Service: Groq Production API
└── Monitoring: Sentry, Google Analytics
```

### Infrastructure Components
- **Load Balancer:** Automatic scaling and distribution
- **CDN:** Global static asset delivery
- **Caching Layer:** Redis for session and data caching
- **Monitoring:** Error tracking and performance monitoring
- **Logging:** Centralized log management

## Performance Architecture

### Caching Strategy
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────────┐
│  Browser Cache  │
└──────┬───────────┘
       │
┌──────▼──────────┐
│  CDN Cache      │
└──────┬───────────┘
       │
┌──────▼──────────┐
│  Redis Cache    │
└──────┬───────────┘
       │
┌──────▼──────────┐
│  Database       │
└─────────────────┘
```

### Optimization Techniques
- **Code Splitting:** Lazy load components and routes
- **Tree Shaking:** Remove unused code
- **Image Optimization:** Compress and serve modern formats
- **API Optimization:** Batch requests, pagination
- **Database Optimization:** Indexing, query optimization

## Scalability Architecture

### Horizontal Scaling
- **Stateless Application:** Easy horizontal scaling
- **Load Balancing:** Distribute traffic across instances
- **Auto-scaling:** Scale based on CPU/memory metrics
- **Container Orchestration:** Kubernetes for large scale

### Database Scaling
- **Read Replicas:** Distribute read operations
- **Sharding:** Distribute data across shards
- **Connection Pooling:** Efficient database connections
- **Caching Layer:** Reduce database load

## Monitoring & Observability

### Monitoring Stack
- **Application Monitoring:** Sentry for error tracking
- **Performance Monitoring:** Web Vitals, API response times
- **User Analytics:** Google Analytics, Mixpanel
- **Infrastructure Monitoring:** Render/Railway metrics

### Logging Strategy
- **Structured Logging:** JSON-formatted logs
- **Log Levels:** DEBUG, INFO, WARNING, ERROR
- **Centralized Logging:** Log aggregation service
- **Log Retention:** 30-day retention policy

## Disaster Recovery

### Backup Strategy
- **Database Backups:** Daily automated backups
- **Multi-Region:** Geographic distribution
- **Point-in-Time Recovery:** Restore capability
- **Backup Testing:** Regular restoration tests

### Recovery Procedures
- **RTO (Recovery Time Objective):** < 4 hours
- **RPO (Recovery Point Objective):** < 1 hour
- **Failover Systems:** Redundant systems
- **Documentation:** Detailed recovery procedures

This architecture provides a solid foundation for WasteGuideAI, ensuring scalability, security, performance, and maintainability while supporting the project's growth from MVP to full-featured product.
