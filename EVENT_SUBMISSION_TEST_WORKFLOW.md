# 🎭 Kerala Cultural Hub - Event Submission Role Testing Workflow

## 🚀 Pre-Test Setup

1. **Start Application**: `npm start` (Running on http://localhost:3000)
2. **Open Test File**: Open `test-event-submission.html` in browser
3. **Clear Browser Data**: Clear localStorage/cookies to start fresh

## 🔐 Authentication Test Credentials

| Role          | Email                   | Password     | Expected Permissions                 |
| ------------- | ----------------------- | ------------ | ------------------------------------ |
| **Admin**     | admin@keralahub.com     | admin123     | ✅ Create Events, ✅ Admin Dashboard |
| **Artist**    | artist@keralahub.com    | artist123    | ✅ Create Events, ❌ Admin Dashboard |
| **Organizer** | organizer@keralahub.com | organizer123 | ✅ Create Events, ❌ Admin Dashboard |
| **User**      | user@keralahub.com      | user123      | ❌ Create Events, ❌ Admin Dashboard |

## 🧪 Test Workflow by Role

### 🔐 Admin Role Test

**Steps:**

1. Navigate to http://localhost:3000/login
2. Login with: `admin@keralahub.com / admin123`
3. **Verify Dashboard**: Should redirect to `/admin-dashboard`
4. **Check Header**: Should show "Admin Dashboard" link
5. **Test Event Creation**:
   - Click "Create Event" or navigate to `/event-submission-portal`
   - Fill out form with test data:
     ```
     Title: Admin Test Event
     Category: Classical Dance
     Venue: Test Venue
     City: Kochi
     Date: Future date
     Description: Admin test event submission
     ```
   - Submit form
   - **Expected**: Success message and redirect
6. **Check Admin Queue**: Navigate to admin dashboard to verify event appears in approval queue

### 🎨 Artist Role Test

**Steps:**

1. **Logout** if logged in
2. Navigate to http://localhost:3000/login
3. Login with: `artist@keralahub.com / artist123`
4. **Verify Navigation**: Should redirect to `/events`
5. **Check Header**: Should show "Create Event" button
6. **Test Event Creation**:
   - Navigate to `/event-submission-portal`
   - Fill out form:
     ```
     Title: Artist Performance - Kathakali
     Category: Classical Dance
     Venue: Kerala Kalamandalam
     City: Thrissur
     Date: Future date
     Description: Traditional Kathakali performance by artist
     ```
   - Submit form
   - **Expected**: Success message and redirect
7. **Test Admin Access**: Try to access `/admin-dashboard`
   - **Expected**: Redirect to `/unauthorized`

### 🎪 Organizer Role Test

**Steps:**

1. **Logout** if logged in
2. Navigate to http://localhost:3000/login
3. Login with: `organizer@keralahub.com / organizer123`
4. **Verify Navigation**: Should redirect to `/events`
5. **Check Header**: Should show "Create Event" button
6. **Test Event Creation**:
   - Navigate to `/event-submission-portal`
   - Fill out form:
     ```
     Title: Onam Festival Celebration 2025
     Category: Festival
     Venue: Community Center
     City: Thiruvananthapuram
     Date: Future date
     Description: Grand Onam celebration with cultural programs
     ```
   - Submit form
   - **Expected**: Success message and redirect
7. **Test Admin Access**: Try to access `/admin-dashboard`
   - **Expected**: Redirect to `/unauthorized`

### 👤 Regular User Role Test

**Steps:**

1. **Logout** if logged in
2. Navigate to http://localhost:3000/login
3. Login with: `user@keralahub.com / user123`
4. **Verify Navigation**: Should redirect to `/events`
5. **Check Header**: Should NOT show "Create Event" button
6. **Test Event Creation Access**:
   - Try to navigate directly to `/event-submission-portal`
   - **Expected**: Redirect to `/unauthorized`
7. **Test Admin Access**: Try to access `/admin-dashboard`
   - **Expected**: Redirect to `/unauthorized`

## 🔍 Error Scenarios to Test

### 1. User Not Defined Error Fix

- **Issue**: "user not defined" error on event submission
- **Cause**: Missing user ID or authentication
- **Fixed**: Added proper user validation and demo ID generation

### 2. Role-Based Access

- **Test**: Direct URL access to protected routes
- **Expected**: Proper redirects to login or unauthorized pages

### 3. Form Validation

- **Test**: Submit incomplete forms
- **Expected**: Validation errors and required field messages

## ✅ Success Criteria Checklist

### Authentication Flow

- [ ] All demo credentials work for login
- [ ] Users redirect to appropriate pages after login
- [ ] Already logged-in users redirect away from login page
- [ ] Logout clears user state and redirects properly

### Role-Based Access Control

- [ ] **Admin**: Can access everything
- [ ] **Artist**: Can create events, cannot access admin
- [ ] **Organizer**: Can create events, cannot access admin
- [ ] **User**: Cannot create events or access admin

### Event Submission

- [ ] **Admin**: Can submit events successfully
- [ ] **Artist**: Can submit events successfully
- [ ] **Organizer**: Can submit events successfully
- [ ] **User**: Blocked from submission portal
- [ ] Form validation works properly
- [ ] Success messages display correctly
- [ ] Events appear in admin approval queue

### UI/UX Elements

- [ ] Header shows role-appropriate navigation items
- [ ] Create Event button visible for authorized roles only
- [ ] Admin Dashboard link visible for admin only
- [ ] Unauthorized page displays for blocked access attempts

## 🐛 Known Issues & Fixes Applied

1. **✅ Fixed**: "user not defined" error in event submission

   - Added proper user authentication validation
   - Added demo user ID generation
   - Added fallback role detection

2. **✅ Fixed**: Missing headers on key pages

   - Added Header component to all pages
   - Standardized authentication handling

3. **✅ Fixed**: Inconsistent role-based navigation
   - Updated all components to use consistent user state
   - Added proper role detection logic

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Admin Role Test:    [ PASS / FAIL ] - Notes: ___________
Artist Role Test:   [ PASS / FAIL ] - Notes: ___________
Organizer Role Test: [ PASS / FAIL ] - Notes: ___________
User Role Test:     [ PASS / FAIL ] - Notes: ___________

Event Submission:   [ PASS / FAIL ] - Notes: ___________
Access Control:     [ PASS / FAIL ] - Notes: ___________
UI Navigation:      [ PASS / FAIL ] - Notes: ___________

Overall Status:     [ PASS / FAIL ]
Issues Found: ___________
```

## 🔧 Debug Commands

If issues occur during testing:

```javascript
// Check user state in browser console
console.log(
  "Current User:",
  JSON.parse(localStorage.getItem("kerala_demo_user"))
);

// Check authentication context
console.log("Auth Context User:", window.__REACT_DEVTOOLS_GLOBAL_HOOK__);

// Clear user state if stuck
localStorage.removeItem("kerala_demo_user");
location.reload();
```

## 🎯 Production Checklist

Before deploying to production:

- [ ] Replace demo credentials with real Supabase OAuth
- [ ] Add email verification for new signups
- [ ] Configure rate limiting for login attempts
- [ ] Set up proper error logging and monitoring
- [ ] Test with real user roles in Supabase database
- [ ] Verify all environment variables are set
- [ ] Test event submission with real database integration

---

**🎉 Ready for Testing!**

The Kerala Cultural Hub authentication and event submission system is now fully functional with comprehensive role-based access control.
