# 🐛 Event Submission Debug Guide

## ✅ **FIXED**: "Cannot access 'eventData' before initialization" Error

### 🔧 **Root Cause**

The error was caused by a premature `console.log('Full event data being submitted:', eventData);` statement on line 87, which tried to access `eventData` before it was declared on line 108.

### 🔧 **Solution Applied**

```javascript
// BEFORE (BROKEN - Line 87)
console.log('Full event data being submitted:', eventData); // ❌ eventData not yet declared

// Map form categories to database enum values
const categoryMapping = { ... };

// Transform form data to match database schema
const eventData = { ... }; // ✅ eventData declared here (Line 108)

// AFTER (FIXED)
// Removed the premature console.log and added proper logging after declaration
const eventData = { ... };
console.log('Full event data being submitted:', eventData); // ✅ Now properly placed
```

## 🧪 **Testing Event Submission**

### **1. Quick Test Steps**

1. **Login with any authorized role**:

   ```
   Artist: artist@keralahub.com / artist123
   Organizer: organizer@keralahub.com / organizer123
   Admin: admin@keralahub.com / admin123
   ```

2. **Navigate to Event Submission**: http://localhost:3000/event-submission-portal

3. **Fill Minimal Required Fields**:

   - **Step 1 - Basic Info**:

     - Title: `Test Event`
     - Description: `Test event description`
     - Category: `Classical Dance`
     - Start Date: Any future date
     - Start Time: `10:00`

   - **Step 2 - Venue**:

     - Venue Name: `Test Venue`
     - Address: `Test Address`
     - City: `Kochi`
     - Capacity: `100`

   - **Step 3 - Media**: (Optional - can skip)

     - Cultural Documentation: `Test cultural significance`

   - **Step 4 - Ticketing**:
     - Keep default "Free Event" setting

4. **Submit Event**: Click "Submit Event" button

### **2. Expected Flow**

1. **Loading State**: Button shows loading spinner
2. **Console Logs**: Check browser console for debug information:
   ```javascript
   // You should see these logs:
   Event submission debug info: { currentUser: {...}, userRole: "artist", userId: "..." }
   Full event data being submitted: { title: "Test Event", ... }
   Event data validation: { hasTitle: true, hasDescription: true, ... }
   ```
3. **Success State**: Success message with submission ID
4. **Auto Redirect**: Redirects to events page after 3 seconds

### **3. Debug Console Commands**

Open browser console (F12) and run:

```javascript
// Check current user
console.log(
  "Current User:",
  JSON.parse(localStorage.getItem("kerala_demo_user"))
);

// Check form data being submitted (run before submission)
window.addEventListener("beforeunload", () => {
  console.log("Form data at submission:", window.formData);
});
```

## 🔍 **Common Issues & Solutions**

### **Issue 1: "User not defined" Error**

**Cause**: User not properly authenticated
**Solution**:

```javascript
// Check if user is logged in
const demoUser = JSON.parse(localStorage.getItem("kerala_demo_user"));
console.log("Demo user:", demoUser);

// If no user, clear and re-login
localStorage.removeItem("kerala_demo_user");
// Then login again
```

### **Issue 2: "Permission denied" Error**

**Cause**: User role not authorized
**Solution**: Verify user role in console:

```javascript
const user = JSON.parse(localStorage.getItem("kerala_demo_user"));
console.log("User role:", user.role);
// Should be 'admin', 'artist', or 'organizer'
```

### **Issue 3: Form Validation Errors**

**Common missing fields**:

- ❌ Empty title
- ❌ Empty description
- ❌ Empty venue name
- ❌ Empty address
- ❌ Invalid date

**Check validation in console**:

```javascript
// The validation object shows what's missing:
Event data validation: {
  hasTitle: false,        // ❌ Title is empty
  hasDescription: true,   // ✅ Description is filled
  hasVenueName: false,    // ❌ Venue name is empty
  // ...
}
```

## 📝 **Test Verification Checklist**

### ✅ **Form Data Flow**

- [ ] SubmissionWizard captures form data correctly
- [ ] handleSubmit calls onSubmit(formData)
- [ ] Parent component receives formData
- [ ] eventData object is properly constructed
- [ ] All required fields are validated

### ✅ **User Authentication**

- [ ] Demo user is stored in localStorage
- [ ] currentUser object has id/email
- [ ] userRole is correctly detected
- [ ] userId is properly generated for demo users

### ✅ **Database Operation**

- [ ] eventService.createEvent is called
- [ ] If database fails, fallback demo mode works
- [ ] Success status is set correctly
- [ ] Event ID is generated

### ✅ **UI Feedback**

- [ ] Loading spinner shows during submission
- [ ] Success message displays with submission ID
- [ ] Auto-redirect to events page works
- [ ] Error messages are user-friendly

## 🎯 **Success Indicators**

When event submission works correctly, you should see:

1. **Console Logs** (in order):

   ```
   Event submission debug info: {...}
   Full event data being submitted: {...}
   Event data validation: {...}
   Submitting event data: {...}
   Using demo mode fallback: {...} (if database not connected)
   ```

2. **UI Changes**:

   - Submit button shows loading spinner
   - Page shows success message
   - Automatic redirect after 3 seconds

3. **No Errors**:
   - No "Cannot access before initialization" errors
   - No "user not defined" errors
   - No validation errors for properly filled forms

## 🚀 **Ready to Test!**

The event submission system is now fixed and ready for comprehensive testing with all user roles.

**Test URL**: http://localhost:3000/event-submission-portal
