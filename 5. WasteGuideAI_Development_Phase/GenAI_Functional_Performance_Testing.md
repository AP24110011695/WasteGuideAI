# GenAI Functional & Performance Testing

**Project Name:** WasteGuideAI  
**Team ID:** WasteGuideAI  
**Student Name:** Ayush Kumar Saha  
**Roll Number:** AP24110011695  

## Testing Overview

This document outlines the functional and performance testing strategy for the AI components of WasteGuideAI, specifically focusing on the Groq API integration with the Llama 3.3 model for waste classification and natural language processing.

## Functional Testing

### Test Environment
- **Development:** Local testing with Groq API development key
- **Staging:** Pre-production environment with production-like data
- **Production:** Live environment with monitoring

### Test Data Sets

#### Image Classification Test Set
- **Total Images:** 500 diverse waste items
- **Categories:** 
  - Recyclable (plastic, paper, glass, metal): 200 images
  - Compostable (organic waste): 100 images
  - Hazardous (batteries, chemicals, e-waste): 100 images
  - General waste (non-recyclable): 100 images

#### Text Query Test Set
- **Total Queries:** 300 natural language questions
- **Query Types:**
  - Direct classification: 100 queries
  - Disposal instructions: 100 queries
  - Location-based questions: 50 queries
  - Environmental impact: 50 queries

### Functional Test Cases

#### FC-1: Image Classification Accuracy
**Objective:** Verify AI correctly classifies waste images

**Test Steps:**
1. Upload image of plastic bottle
2. Verify classification as "recyclable - plastic"
3. Check confidence score > 0.90
4. Verify disposal instructions provided

**Expected Result:** Correct classification with high confidence

**Pass Criteria:** 95%+ accuracy across test set

#### FC-2: Text Query Understanding
**Objective:** Verify AI understands natural language queries

**Test Steps:**
1. Submit query: "How do I dispose of old batteries?"
2. Verify response addresses hazardous waste disposal
3. Check response includes location-specific information
4. Verify response is clear and actionable

**Expected Result:** Accurate, helpful response

**Pass Criteria:** 90%+ user satisfaction in testing

#### FC-3: Context Maintenance
**Objective:** Verify AI maintains conversation context

**Test Steps:**
1. Ask about plastic bottle disposal
2. Follow up with "What about glass?"
3. Verify AI understands context refers to disposal
4. Check response is relevant to glass disposal

**Expected Result:** Context-aware responses

**Pass Criteria:** 85%+ context retention accuracy

#### FC-4: Multi-Item Classification
**Objective:** Verify AI can handle multiple items in one image

**Test Steps:**
1. Upload image with mixed waste items
2. Verify all items are identified
3. Check classification for each item
4. Verify disposal instructions for each

**Expected Result:** All items correctly classified

**Pass Criteria:** 80%+ accuracy for multi-item images

#### FC-5: Edge Case Handling
**Objective:** Verify AI handles unusual or unclear inputs

**Test Steps:**
1. Upload blurry image
2. Submit ambiguous query
3. Test with non-waste items
4. Verify appropriate error handling

**Expected Result:** Graceful handling with helpful responses

**Pass Criteria:** 90%+ appropriate responses

## Performance Testing

### Performance Metrics

#### Response Time
- **Image Classification:** < 5 seconds
- **Text Queries:** < 3 seconds
- **Context Processing:** < 2 seconds
- **Multi-item Classification:** < 8 seconds

#### Throughput
- **Concurrent Users:** Support 100+ concurrent AI requests
- **Requests Per Second:** 50+ RPS sustained
- **Peak Load:** Handle 200+ concurrent requests

#### Resource Utilization
- **CPU Usage:** < 70% under normal load
- **Memory Usage:** < 2GB per instance
- **API Costs:** < $0.01 per request

### Performance Test Cases

#### PC-1: Response Time Under Load
**Objective:** Verify response times meet SLA under load

**Test Steps:**
1. Send 100 concurrent image classification requests
2. Measure response time for each
3. Calculate average and p95 response times
4. Verify all requests complete within SLA

**Expected Result:** All responses within time limits

**Pass Criteria:** 95% of requests within SLA

#### PC-2: Sustained Load Testing
**Objective:** Verify system stability under sustained load

**Test Steps:**
1. Maintain 50 RPS for 1 hour
2. Monitor system health and response times
3. Check for memory leaks or degradation
4. Verify error rate remains < 1%

**Expected Result:** Stable performance over time

**Pass Criteria:** No degradation, error rate < 1%

#### PC-3: Peak Load Testing
**Objective:** Verify system handles traffic spikes

**Test Steps:**
1. Gradually increase load to 200 concurrent users
2. Monitor system behavior
3. Verify graceful degradation if needed
4. Check recovery after load reduction

**Expected Result:** System handles or gracefully degrades

**Pass Criteria:** No crashes, recovery within 30 seconds

#### PC-4: API Cost Optimization
**Objective:** Verify efficient API usage

**Test Steps:**
1. Monitor API calls for typical user session
2. Calculate cost per user session
3. Identify optimization opportunities
4. Implement caching where beneficial

**Expected Result:** Cost-effective API usage

**Pass Criteria:** < $0.10 cost per 100 queries

## Integration Testing

### AI Service Integration

#### IC-1: Groq API Connectivity
**Objective:** Verify reliable connection to Groq API

**Test Steps:**
1. Test API connection with various network conditions
2. Verify authentication works correctly
3. Test error handling for API failures
4. Verify retry logic functions properly

**Expected Result:** Reliable API integration

**Pass Criteria:** 99.9% successful API calls

#### IC-2: Firebase Integration
**Objective:** Verify AI responses integrate with Firebase

**Test Steps:**
1. Store AI responses in Firestore
2. Retrieve historical AI queries
3. Verify data consistency
4. Test real-time synchronization

**Expected Result:** Seamless Firebase integration

**Pass Criteria:** All data operations correct

### End-to-End Testing

#### EC-1: Complete User Flow
**Objective:** Verify complete AI-powered user journey

**Test Steps:**
1. User uploads waste image
2. AI classifies and provides disposal guidance
3. User asks follow-up question
4. AI maintains context and responds
5. User saves query to history
6. Verify data persisted correctly

**Expected Result:** Smooth end-to-end experience

**Pass Criteria:** No errors, user satisfaction > 90%

## Accuracy Testing

### Ground Truth Validation

#### AC-1: Classification Accuracy
**Objective:** Measure AI classification accuracy against ground truth

**Test Steps:**
1. Create labeled test dataset
2. Run AI classification on test set
3. Compare AI results with ground truth
4. Calculate accuracy, precision, recall, F1 score

**Expected Result:** High classification accuracy

**Pass Criteria:**
- Overall accuracy: 95%+
- Precision: 94%+
- Recall: 94%+
- F1 Score: 94%+

#### AC-2: Disposal Instruction Accuracy
**Objective:** Verify disposal instructions are correct

**Test Steps:**
1. Review disposal instructions for test items
2. Verify against local regulations
3. Check for safety compliance
4. Validate practical applicability

**Expected Result:** Accurate, safe disposal instructions

**Pass Criteria:** 98%+ instruction accuracy

## User Acceptance Testing

### UAT-1: Beta User Testing
**Objective:** Validate AI features with real users

**Test Steps:**
1. Recruit 50 beta users
2. Users test AI features for 2 weeks
3. Collect feedback on accuracy and usefulness
4. Analyze feedback and identify improvements

**Expected Result:** Positive user feedback

**Pass Criteria:** 4.0+ average rating, 80%+ would recommend

### UAT-2: A/B Testing
**Objective:** Compare AI performance with alternatives

**Test Steps:**
1. Split users between AI and manual classification
2. Compare accuracy and user satisfaction
3. Measure time to correct disposal
4. Analyze preference for AI vs manual

**Expected Result:** AI outperforms manual methods

**Pass Criteria:** AI preferred by 70%+ users

## Monitoring and Alerting

### Performance Monitoring
- **Response Time Tracking:** Real-time monitoring of AI response times
- **Error Rate Monitoring:** Alert if error rate exceeds 1%
- **Cost Monitoring:** Daily API cost tracking and alerts
- **Accuracy Monitoring:** Continuous accuracy sampling

### Health Checks
- **API Health:** Check Groq API status every 5 minutes
- **Service Health:** Monitor AI service availability
- **Integration Health:** Verify Firebase connectivity
- **Performance Health:** Track resource utilization

## Test Automation

### Automated Test Suite
- **Unit Tests:** AI service functions and utilities
- **Integration Tests:** API and database integrations
- **Performance Tests:** Automated load testing
- **Accuracy Tests:** Automated classification validation

### CI/CD Integration
- **Automated Testing:** Run tests on every commit
- **Performance Gates:** Block deployments if performance degrades
- **Accuracy Gates:** Alert if accuracy drops below threshold
- **Rollback Automation:** Automatic rollback on critical failures

## Test Results and Reporting

### Test Report Structure
- **Executive Summary:** High-level results and recommendations
- **Detailed Results:** Test case by test case results
- **Performance Analysis:** Response times and resource usage
- **Accuracy Analysis:** Classification accuracy metrics
- **User Feedback:** UAT results and comments
- **Issues Found:** Bugs and improvement suggestions
- **Recommendations:** Action items for improvement

### Success Criteria
- **Functional:** All critical test cases pass
- **Performance:** All performance metrics met
- **Accuracy:** 95%+ classification accuracy achieved
- **User Satisfaction:** 4.0+ rating in UAT
- **Stability:** 99.5% uptime during testing

## Continuous Improvement

### Feedback Loop
- **User Feedback Integration:** Incorporate user suggestions
- **Model Retraining:** Regular model updates with new data
- **Performance Optimization:** Continuous performance tuning
- **Test Case Updates:** Regular test case maintenance

### Model Monitoring
- **Accuracy Drift Detection:** Monitor for accuracy degradation
- **Bias Detection:** Check for biased classifications
- **Performance Drift:** Monitor for performance changes
- **Usage Pattern Analysis:** Understand how users interact with AI

This comprehensive testing strategy ensures the AI components of WasteGuideAI meet functional requirements, performance standards, and user expectations while maintaining reliability and accuracy.
