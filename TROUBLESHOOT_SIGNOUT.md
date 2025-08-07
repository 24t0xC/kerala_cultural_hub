# 🔧 Sign Out Troubleshooting Guide

## Critical Fix Applied

**ISSUE FOUND**: The Header component was using stale `demoUser` state instead of real-time localStorage data.

**FIX APPLIED**:

- Changed `currentUser = user || demoUser` to `currentUser = user || getCurrentDemoUser()`
- `getCurrentDemoUser()` reads localStorage immediately on every render
- Added comprehensive logging to track sign out process

## Step-by-Step Testing Protocol

### 1. 🧪 **Browser Console Debug Test**

Open browser console and run:

```javascript
// Load debug script
const script = document.createElement("script");
script.src = "/debug-signout.js";
document.head.appendChild(script);

// Or copy-paste the debug functions directly
// Check /debug-signout.js file for complete debug utilities
```

### 2. 🎯 **Manual Sign Out Test Sequence**

1. **Setup**: Create demo user

   ```javascript
   debugSignOut.createTestUser();
   debugSignOut.checkAuthState();
   ```

2. **Verify Login**:

   - Refresh page (`F5`)
   - Check header shows user avatar (not "Sign In" button)
   - User name should be visible in dropdown

3. **Test Sign Out**:

   - Click user avatar → "Sign Out"
   - Watch console logs for "Header: Starting logout process..."
   - Page should redirect to `/login`
   - Header should show "Sign In" button

4. **Verify Sign Out**:
   ```javascript
   debugSignOut.checkAuthState(); // Should show no user
   ```

### 3. 🔍 **Common Issues & Solutions**

#### Issue A: Header Still Shows User After Sign Out

**Symptoms**:

- Console shows sign out process completed
- localStorage is empty
- But header still shows user avatar

**Cause**: React state not updating
**Solution**:

```javascript
// Force component re-render
window.location.reload();
// Or dispatch storage event
window.dispatchEvent(
  new StorageEvent("storage", {
    key: "kerala_demo_user",
    oldValue: "old_user_data",
    newValue: null,
    storageArea: localStorage,
  })
);
```

#### Issue B: Sign Out Button Not Working

**Symptoms**:

- Clicking "Sign Out" does nothing
- No console logs appear

**Causes**:

- Click handler not attached
- onAuthAction callback not passed correctly

**Debug**:

```javascript
// Check if onAuthAction is function
console.log(typeof onAuthAction); // Should be 'function'

// Test direct sign out
await signOut();
```

#### Issue C: Redirect Not Working

**Symptoms**:

- Sign out clears data
- But stays on same page

**Cause**: Navigation issue
**Solution**: Check `navigate('/login')` is called

### 4. 🧪 **Automated Test Scripts**

#### Quick Test Function

```javascript
async function quickSignOutTest() {
  console.log("🚀 Quick Sign Out Test");

  // 1. Create user
  localStorage.setItem(
    "kerala_demo_user",
    JSON.stringify({
      id: "test123",
      name: "Test User",
      email: "test@test.com",
      role: "user",
      isDemo: true,
    })
  );

  console.log("✅ User created");

  // 2. Simulate sign out
  localStorage.removeItem("kerala_demo_user");

  // 3. Check result
  const result = localStorage.getItem("kerala_demo_user");
  console.log(
    result ? "❌ FAILED: User still exists" : "✅ SUCCESS: User cleared"
  );

  return !result;
}
```

#### Component State Test

```javascript
function testComponentState() {
  // Check if Header component is receiving correct props
  const headers = document.querySelectorAll("header");
  console.log("Header elements found:", headers.length);

  // Check for user avatar elements
  const avatars = document.querySelectorAll(
    '[data-testid="user-avatar"], .user-menu-container'
  );
  console.log("User avatars found:", avatars.length);

  // Check for sign in button
  const signInButtons = document.querySelectorAll(
    'button:contains("Sign In"), a:contains("Sign In")'
  );
  console.log("Sign In buttons found:", signInButtons.length);
}
```

## 5. 🔧 **If Sign Out Still Doesn't Work**

### Nuclear Option - Force Refresh After Sign Out

Add to AuthContext signOut method:

```javascript
const signOut = async () => {
  // ... existing code ...

  // Force refresh as last resort
  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
};
```

### Alternative - Add Storage Event Listener

Add to Header component:

```javascript
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === "kerala_demo_user" && !e.newValue) {
      // User was signed out
      setDemoUser(null);
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
```

## 6. 📊 **Expected Console Output for Working Sign Out**

```
Header: Starting logout process...
Header: Demo user cleared
Header: Parent onAuthAction called
AuthContext: Starting sign out process...
AuthContext: Demo user data cleared from localStorage
AuthContext: Remembered credentials cleared (remember me was not checked)
AuthContext: Auth context state cleared
Navigating to: /login
```

## 7. 🎯 **Final Verification Checklist**

After implementing fixes, verify:

- [ ] ✅ User can log in (demo credentials work)
- [ ] ✅ Header shows user avatar when logged in
- [ ] ✅ Click avatar opens dropdown with "Sign Out"
- [ ] ✅ Click "Sign Out" triggers console logs
- [ ] ✅ localStorage is cleared after sign out
- [ ] ✅ Page redirects to `/login`
- [ ] ✅ Header shows "Sign In" button after sign out
- [ ] ✅ Protected routes redirect to login when signed out
- [ ] ✅ Remember Me preserves credentials when checked
- [ ] ✅ Remember Me clears credentials when not checked

---

**Status**: If all checklist items pass, sign out functionality is working correctly!
