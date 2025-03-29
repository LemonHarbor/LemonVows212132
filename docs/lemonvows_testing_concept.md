# LemonVows Testing Concept

## Overview

This document outlines the comprehensive testing strategy for the LemonVows wedding planning application. The testing approach is designed to validate all functionality across different user roles and ensure the application meets the requirements specified in the project documentation.

## Test Environment

### Deployment Options

1. **Temporary Public Link**
   - Deploy the application to a temporary public URL for online testing
   - Enable access without requiring downloads or local setup
   - Provide a production-like environment for realistic testing

2. **Local Development Environment**
   - For developer testing and debugging
   - Faster iteration cycles for fixing issues
   - Ability to test database migrations and schema changes

### Test Data

A comprehensive set of sample data will be created to simulate a realistic wedding planning scenario:

- Multiple weddings with different settings and styles
- Various guest lists with different RSVP statuses
- Menu options with different dietary restrictions
- Table layouts with assigned and unassigned guests
- Multilingual content for testing language switching

## User Roles and Test Accounts

### 1. Admin Role

**Test Account:**
- Username: `admin@lemonvows.com`
- Password: `TestAdmin2025!`

**Access Rights:**
- Full system access
- User management
- Wedding instance creation
- System configuration
- Statistics across all weddings

**Test Scenarios:**
- Create new wedding instances
- Manage user accounts
- View system-wide statistics
- Configure system settings
- Manage subscription tiers

### 2. Couple Role (Wedding Organizers)

**Test Accounts:**
- Username: `couple1@lemonvows.com` / Password: `TestCouple2025!`
- Username: `couple2@lemonvows.com` / Password: `TestCouple2025!`

**Access Rights:**
- Manage their wedding details
- Guest list management
- Table planning
- Menu management
- View RSVP statistics
- Send invitations

**Test Scenarios:**
- Add and edit guest information
- Create and modify table layouts
- Define menu options and dietary restrictions
- View and export RSVP statistics
- Send and track invitations
- Manage wedding details and settings

### 3. Guest Role

**Test Accounts:**
- Username: `guest1@example.com` / RSVP Code: `jodo-abc-123`
- Username: `guest2@example.com` / RSVP Code: `masm-def-456`
- Username: `guest3@example.com` / RSVP Code: `anwi-ghi-789`

**Access Rights:**
- View wedding details
- Submit RSVP response
- Select menu options
- Indicate dietary restrictions
- Request accommodation

**Test Scenarios:**
- Access RSVP page using unique code
- Accept or decline invitation
- Select meal preferences
- Indicate allergies and dietary restrictions
- Request accommodation
- Add accompanying persons

## Test Scenarios by Feature

### 1. Guest Management & RSVP

#### Couple Role Tests:
- Add new guests individually and in bulk
- Edit guest information
- Delete guests
- Group guests by category
- Send invitations
- Track RSVP status
- Export guest list

#### Guest Role Tests:
- Access RSVP page with unique code
- Submit RSVP response
- Update RSVP response
- Add special requests
- Indicate accompanying persons

### 2. Food Selection & Allergy Tracking

#### Couple Role Tests:
- Create menu options for different courses
- Define dietary properties (vegetarian, vegan, etc.)
- View dietary statistics
- Export catering requirements

#### Guest Role Tests:
- Select meal preferences for each course
- Indicate allergies
- Add special dietary requests

### 3. Statistics Dashboard

#### Couple Role Tests:
- View RSVP summary statistics
- Analyze response timeline
- View statistics by guest group
- Check table utilization
- Export statistics in different formats

#### Admin Role Tests:
- View statistics across all weddings
- Generate system-wide reports
- Analyze platform usage metrics

### 4. Multilingual Support

#### All Roles:
- Switch between languages (German, English, French, Spanish)
- Verify all content is correctly translated
- Test language persistence across sessions

### 5. Table Planning

#### Couple Role Tests:
- Create tables with different shapes and capacities
- Assign guests to tables
- Optimize seating based on relationships and preferences
- View table statistics

## Test Execution Plan

### 1. Preparation Phase

- Set up test environment with sample data
- Create test accounts for all roles
- Prepare test scripts and scenarios
- Define acceptance criteria for each feature

### 2. Functional Testing

- Test each feature individually according to test scenarios
- Verify all functionality works as expected
- Document any issues or bugs found

### 3. Role-Based Testing

- Test the application from the perspective of each user role
- Verify access controls and permissions
- Ensure each role can only access appropriate features

### 4. Integration Testing

- Test interactions between different features
- Verify data consistency across the application
- Test workflows that span multiple features

### 5. User Experience Testing

- Evaluate the application's usability
- Test responsive design on different devices
- Verify accessibility features

### 6. Performance Testing

- Test application performance with large data sets
- Verify response times for critical operations
- Test concurrent user access

### 7. Security Testing

- Verify authentication and authorization
- Test data privacy and protection
- Check for common security vulnerabilities

## Test Reporting

For each test execution, the following information will be recorded:

- Test scenario description
- User role used for testing
- Steps performed
- Expected results
- Actual results
- Pass/Fail status
- Screenshots or recordings (if applicable)
- Any issues or bugs found

## Issue Tracking

Issues found during testing will be documented with:

- Issue description
- Steps to reproduce
- Severity level (Critical, High, Medium, Low)
- Affected features
- User role(s) affected
- Environment details
- Screenshots or recordings

## Test Environment Setup Instructions

### Setting Up the Test Environment

1. **Database Initialization**
   ```sql
   -- Initialize database with test data
   -- This will be executed automatically during deployment
   ```

2. **Test Account Creation**
   ```sql
   -- Create test accounts for different roles
   -- This will be executed automatically during deployment
   ```

3. **Sample Data Generation**
   ```sql
   -- Insert sample weddings, guests, menu options, etc.
   -- This will be executed automatically during deployment
   ```

### Accessing the Test Environment

1. **Admin Access**
   - URL: `https://test.lemonvows.com/admin`
   - Credentials: As specified in the User Roles section

2. **Couple Access**
   - URL: `https://test.lemonvows.com/dashboard`
   - Credentials: As specified in the User Roles section

3. **Guest Access**
   - URL: `https://test.lemonvows.com/rsvp`
   - RSVP Codes: As specified in the User Roles section

## Test Completion Criteria

The testing phase will be considered complete when:

1. All test scenarios have been executed
2. All critical and high-severity issues have been resolved
3. 90% of medium-severity issues have been resolved
4. All features meet the acceptance criteria
5. The application performs well with the expected user load
6. All user roles can successfully complete their primary tasks

## Appendix: Sample Test Cases

### Guest Management Test Cases

1. **Add New Guest**
   - **Role:** Couple
   - **Steps:**
     1. Log in as couple
     2. Navigate to Guest Management
     3. Click "Add Guest"
     4. Fill in guest details
     5. Save guest
   - **Expected Result:** Guest is added to the list with "Pending" RSVP status

2. **Submit RSVP Response**
   - **Role:** Guest
   - **Steps:**
     1. Access RSVP page with code
     2. View wedding details
     3. Select "Accept" option
     4. Choose menu preferences
     5. Indicate allergies
     6. Submit response
   - **Expected Result:** RSVP response is recorded, confirmation is displayed

### Food Selection Test Cases

1. **Add Menu Option**
   - **Role:** Couple
   - **Steps:**
     1. Log in as couple
     2. Navigate to Menu Management
     3. Click "Add Menu Option"
     4. Fill in menu details
     5. Mark dietary properties
     6. Save menu option
   - **Expected Result:** Menu option is added to the appropriate course

2. **Select Meal Preferences**
   - **Role:** Guest
   - **Steps:**
     1. Access RSVP page with code
     2. Navigate to meal selection
     3. Choose options for each course
     4. Submit selections
   - **Expected Result:** Meal preferences are saved and confirmation is displayed

### Statistics Dashboard Test Cases

1. **View RSVP Statistics**
   - **Role:** Couple
   - **Steps:**
     1. Log in as couple
     2. Navigate to Statistics Dashboard
     3. View RSVP summary cards
     4. Check timeline chart
   - **Expected Result:** Accurate statistics are displayed with correct calculations

2. **Export Statistics**
   - **Role:** Couple
   - **Steps:**
     1. Log in as couple
     2. Navigate to Statistics Dashboard
     3. Click "Export" button
     4. Select format (CSV, Excel, PDF)
   - **Expected Result:** Statistics are exported in the selected format with all relevant data
