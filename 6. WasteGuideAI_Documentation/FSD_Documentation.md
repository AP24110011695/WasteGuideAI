# FSD Documentation Format

**Project Name:** WasteGuideAI  
**Team ID:** WasteGuideAI  
**Student Name:** Ayush Kumar Saha  
**Roll Number:** AP24110011695  

## Functional Specification Document (FSD)

### Document Information
- **Document Version:** 1.0
- **Last Updated:** July 19, 2026
- **Author:** Ayush Kumar Saha
- **Project:** WasteGuideAI

## 1. Introduction

### 1.1 Purpose
This Functional Specification Document (FSD) describes the functional requirements and behavior of the WasteGuideAI system. It serves as a guide for developers, testers, and stakeholders to understand what the system should do.

### 1.2 Scope
The WasteGuideAI system is an AI-powered waste management assistant that provides waste classification, disposal guidance, location-based services, and educational resources. This document covers all functional aspects of the system.

### 1.3 Definitions
- **AI Classification:** Automated identification of waste types using artificial intelligence
- **Disposal Guidance:** Instructions on how to properly dispose of waste items
- **Location Services:** Features that use geographic data to provide facility information
- **User Achievement:** Gamification elements to encourage sustainable behavior

## 2. System Overview

### 2.1 System Description
WasteGuideAI is a web-based application that uses artificial intelligence to help users identify waste items and determine proper disposal methods. The system integrates with mapping services to provide location-based facility information and includes educational resources to promote sustainable waste management.

### 2.2 System Goals
- Provide accurate waste classification with 95%+ accuracy
- Offer instant disposal guidance through AI-powered chat
- Help users find nearby recycling and disposal facilities
- Educate users about waste management best practices
- Encourage sustainable behavior through gamification

### 2.3 Target Users
- Individual households seeking waste disposal guidance
- Small businesses managing commercial waste
- Municipal workers educating the public
- Environmental enthusiasts promoting sustainability

## 3. Functional Requirements

### 3.1 User Authentication

#### FR-1.1 User Registration
**Description:** Users must be able to create an account using email and password or social login.

**Input:**
- Email address (valid format)
- Password (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number)
- Optional: Social login provider (Google, Facebook)

**Processing:**
- Validate email format and password strength
- Check for existing email in database
- Create user account in Firebase Authentication
- Initialize user profile in Firestore
- Send verification email

**Output:**
- Success message with user ID
- Verification email sent confirmation
- Redirect to onboarding flow

**Business Rules:**
- Email must be unique across the system
- Password must meet security requirements
- Social login users skip password setup

#### FR-1.2 User Login
**Description:** Registered users must be able to log in to the system.

**Input:**
- Email address and password OR
- Social login provider selection

**Processing:**
- Validate credentials with Firebase Auth
- Generate authentication token
- Create user session
- Load user profile and preferences

**Output:**
- Authentication token
- User profile data
- Redirect to dashboard

**Business Rules:**
- Maximum 5 failed login attempts before lockout
- Session expires after 7 days of inactivity
- Remember me option extends session to 30 days

#### FR-1.3 Password Recovery
**Description:** Users must be able to recover forgotten passwords.

**Input:**
- Registered email address

**Processing:**
- Verify email exists in system
- Generate password reset link
- Send reset email via Firebase
- Link expires after 1 hour

**Output:**
- Password reset email sent confirmation
- Redirect to login after successful reset

**Business Rules:**
- Reset link valid for 1 hour only
- New password must meet security requirements
- Old password cannot be reused immediately

### 3.2 AI-Powered Waste Classification

#### FR-2.1 Image Upload and Classification
**Description:** Users must be able to upload images of waste items for AI classification.

**Input:**
- Image file (JPG, PNG, WEBP, max 10MB)
- Optional: User location context

**Processing:**
- Validate image format and size
- Compress image if needed
- Send to Groq API for classification
- Process classification results
- Generate disposal recommendations
- Store query in user history

**Output:**
- Waste category (recyclable, compostable, hazardous, general)
- Confidence score (0-1)
- Specific material type (plastic, paper, glass, etc.)
- Disposal instructions
- Environmental impact information

**Business Rules:**
- Maximum 5 image classifications per minute per user
- Images must contain visible waste items
- Confidence score below 0.70 triggers manual review suggestion
- Classification history retained for 90 days

#### FR-2.2 Text-Based Waste Queries
**Description:** Users must be able to ask natural language questions about waste disposal.

**Input:**
- Natural language text query
- Conversation context (if follow-up question)

**Processing:**
- Analyze query intent and context
- Query Groq API with conversation history
- Generate relevant response
- Include location-specific information if available
- Maintain conversation context for follow-ups

**Output:**
- Direct answer to the question
- Relevant disposal instructions
- Additional helpful information
- Suggested follow-up questions

**Business Rules:**
- Maximum 10 text queries per minute per user
- Conversation context maintained for 10 minutes
- Responses must be actionable and clear
- Fallback to general advice if location unavailable

#### FR-2.3 Multi-Item Classification
**Description:** System must be able to identify multiple waste items in a single image.

**Input:**
- Image containing multiple waste items

**Processing:**
- Detect individual items in image
- Classify each detected item separately
- Generate disposal instructions for each item
- Prioritize hazardous items in response

**Output:**
- List of detected items with classifications
- Disposal instructions for each item
- Sorting recommendations
- Safety warnings for hazardous items

**Business Rules:**
- Maximum 10 items per image
- Items must be clearly visible and separated
- Hazardous items always highlighted first

### 3.3 Location-Based Services

#### FR-3.1 Facility Finder
**Description:** Users must be able to find nearby recycling and disposal facilities.

**Input:**
- User location (automatic or manual)
- Optional: Facility type filter
- Optional: Material type filter

**Processing:**
- Get user coordinates
- Query facility database within 10km radius
- Apply user filters
- Calculate distances and sort by proximity
- Include facility details and operating hours

**Output:**
- Map with facility markers
- List of facilities with details
- Distance from user location
- Operating hours and contact information
- Accepted materials list

**Business Rules:**
- Default search radius: 10km
- Maximum search radius: 50km
- Facilities must be verified and active
- Operating hours checked for current time

#### FR-3.2 Directions Integration
**Description:** Users must be able to get directions to selected facilities.

**Input:**
- Selected facility
- User's current location

**Processing:**
- Generate route using mapping service
- Provide multiple route options if available
- Calculate estimated travel time
- Check for real-time traffic conditions

**Output:**
- Turn-by-turn directions
- Map with route highlighted
- Estimated travel time
- Distance to facility

**Business Rules:**
- Default to fastest route
- Provide walking, driving, and transit options
- Update route based on real-time traffic

#### FR-3.3 Collection Schedule Display
**Description:** Users must be able to view their local waste collection schedule.

**Input:**
- User's address or location

**Processing:**
- Identify local municipality
- Retrieve collection schedule
- Match schedule to user's address
- Display upcoming collection dates

**Output:**
- Calendar view of collection dates
- List of upcoming collections
- Types of waste collected each date
- Reminder option

**Business Rules:**
- Schedule data updated weekly
- Show next 4 weeks of collections
- Highlight collections within 3 days
- Support reminder notifications

### 3.4 Educational Resources

#### FR-4.1 Waste Sorting Guides
**Description:** Users must have access to comprehensive waste sorting guides.

**Input:**
- Search query or category selection

**Processing:**
- Search waste item database
- Filter by category if selected
- Display relevant guides
- Include visual examples
- Provide local regulation information

**Output:**
- Detailed sorting instructions
- Visual examples and diagrams
- Local regulation information
- Printable format option

**Business Rules:**
- Database covers 500+ common waste items
- Content reviewed and updated monthly
- Local regulations clearly marked by jurisdiction
- Printable PDF generation available

#### FR-4.2 Environmental Impact Information
**Description:** Users must be able to understand the environmental impact of their waste choices.

**Input:**
- Waste item or disposal method

**Processing:**
- Retrieve environmental impact data
- Calculate CO2 savings for proper disposal
- Compare disposal methods
- Display visual impact representation

**Output:**
- CO2 equivalent saved or emitted
- Water usage impact
- Landfill space saved
- Comparative analysis with alternatives

**Business Rules:**
- Impact data from verified environmental sources
- Calculations based on regional averages
- Display both positive and negative impacts
- Provide sources for impact data

### 3.5 User Engagement Features

#### FR-5.1 User Dashboard
**Description:** Users must have a personalized dashboard showing their waste management statistics.

**Input:**
- User authentication

**Processing:**
- Aggregate user's waste query history
- Calculate environmental impact
- Track achievement progress
- Display recent activity
- Compare with community averages

**Output:**
- Total waste queries made
- Classification accuracy rate
- Environmental impact metrics
- Achievement progress
- Recent activity timeline
- Community comparison

**Business Rules:**
- Data updated in real-time
- Historical data available for 90 days
- Community comparison anonymized
- Privacy controls for data sharing

#### FR-5.2 Achievement System
**Description:** Users must be able to earn achievements for sustainable behaviors.

**Input:**
- User actions (queries, correct disposals, etc.)

**Processing:**
- Monitor user actions against achievement criteria
- Check achievement completion conditions
- Award achievements when criteria met
- Update user profile and leaderboard
- Send notification of new achievement

**Output:**
- Achievement badge
- Points awarded
- Leaderboard position update
- Notification message

**Business Rules:**
- Achievements categorized by difficulty
- Points vary by achievement difficulty
- Leaderboard updated weekly
- Achievement cannot be earned twice

#### FR-5.3 Community Challenges
**Description:** Users must be able to participate in community waste management challenges.

**Input:**
- Challenge selection and participation

**Processing:**
- Register user for challenge
- Track challenge-specific metrics
- Update progress in real-time
- Calculate challenge completion
- Update challenge leaderboard

**Output:**
- Challenge registration confirmation
- Progress tracking dashboard
- Leaderboard position
- Completion notification
- Reward distribution

**Business Rules:**
- Challenges run for defined periods
- Users can join multiple challenges
- Progress tracked separately per challenge
- Rewards distributed upon completion

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- System response time for AI queries: < 3 seconds
- Page load time: < 2 seconds
- Support 1000 concurrent users
- 99.5% system uptime
- Image processing time: < 5 seconds

### 4.2 Security Requirements
- All data encrypted in transit (TLS 1.3)
- User data encrypted at rest
- Compliance with GDPR and CCPA
- Regular security audits
- Secure authentication mechanisms

### 4.3 Usability Requirements
- WCAG 2.1 AA accessibility compliance
- Support for English, Hindi, and Spanish
- Mobile-responsive design
- Intuitive user interface
- Clear error messages

### 4.4 Reliability Requirements
- Automated daily backups
- Disaster recovery procedures
- Error rate < 1%
- Graceful degradation during outages
- Comprehensive error logging

## 5. Data Requirements

### 5.1 Data Storage
- User profiles and authentication data
- Waste query history and results
- Facility database with geographic data
- Achievement and challenge data
- Educational content library

### 5.2 Data Retention
- User query history: 90 days
- User profile data: Until account deletion
- Achievement data: Indefinite
- Facility data: Updated regularly
- Educational content: Current version only

### 5.3 Data Privacy
- User location data stored with consent
- Query data anonymized for analytics
- Data export available on request
- Account deletion removes all user data
- Privacy policy clearly communicated

## 6. Integration Requirements

### 6.1 External Integrations
- Groq API for AI services
- Firebase for authentication and database
- Google Maps/OpenStreetMap for location services
- Email service for notifications

### 6.2 API Specifications
- RESTful API design
- JSON data format
- Standard HTTP status codes
- API versioning
- Rate limiting implementation

## 7. User Interface Requirements

### 7.1 Interface Components
- Responsive navigation menu
- AI chat interface
- Image upload component
- Interactive map display
- User dashboard
- Achievement display
- Educational content viewer

### 7.2 Design Principles
- Mobile-first responsive design
- Consistent color scheme and branding
- Clear visual hierarchy
- Intuitive navigation
- Accessible color contrasts

## 8. Testing Requirements

### 8.1 Test Coverage
- Unit test coverage: > 75%
- Integration test coverage: > 80%
- User acceptance testing: All critical scenarios
- Performance testing: Load and stress testing
- Security testing: Vulnerability scanning

### 8.2 Quality Metrics
- Bug density: < 5 bugs per 1000 lines of code
- User satisfaction: > 4.5/5
- Task completion rate: > 90%
- Error rate: < 1%

## 9. Deployment Requirements

### 9.1 Deployment Environment
- Frontend: Vercel or similar hosting platform
- Production database: Firebase Production
- Backend: Render or Railway
- CDN: Cloudflare or similar

### 9.2 Deployment Process
- Automated CI/CD pipeline
- Staging environment for testing
- Blue-green deployment for zero downtime
- Rollback capability
- Health monitoring post-deployment

## 10. Maintenance and Support

### 10.1 Maintenance Requirements
- Regular security updates
- Dependency updates
- Performance optimization
- Content updates
- Bug fixes and improvements

### 10.2 Support Requirements
- User documentation and help center
- FAQ section
- Contact support mechanism
- Issue tracking system
- Response time SLA: 24 hours

## Appendix

### A. Glossary
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **CO2:** Carbon Dioxide
- **GDPR:** General Data Protection Regulation
- **CCPA:** California Consumer Privacy Act
- **UI:** User Interface
- **UX:** User Experience

### B. References
- Groq API Documentation
- Firebase Documentation
- React Documentation
- WCAG 2.1 Guidelines
- GDPR Compliance Guide

### C. Change History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-19 | Ayush Kumar Saha | Initial FSD creation |

This Functional Specification Document provides a comprehensive overview of the WasteGuideAI system requirements and serves as the foundation for development, testing, and deployment activities.
