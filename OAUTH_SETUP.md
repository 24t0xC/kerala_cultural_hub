# 🔐 Setting Up Google OAuth for Kerala Cultural Hub

## 📋 **Prerequisites**

- Supabase project dashboard access
- Google Cloud Console account

---

## 🚀 **Step-by-Step Setup**

### **1. Configure Google OAuth in Google Cloud Console**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**: Create a new project or select existing one
3. **Enable Google+ API**:
   - Go to APIs & Services > Library
   - Search for "Google+ API" and enable it
4. **Create OAuth Credentials**:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add your authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     https://kerala-cultural-5sz4i9hgm-24t0xcs-projects.vercel.app/auth/callback
     ```
   - Save your **Client ID** and **Client Secret**

### **2. Configure Supabase OAuth**

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Go to Authentication**:
   - Click on your project
   - Navigate to Authentication > Providers
3. **Enable Google Provider**:
   - Toggle "Google" to enabled
   - Enter your Google **Client ID**
   - Enter your Google **Client Secret**
   - Set redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
4. **Save Configuration**

### **3. Update Site URL (Important!)**

1. **In Supabase Dashboard**:
   - Go to Authentication > URL Configuration
   - Set **Site URL** to: `https://kerala-cultural-5sz4i9hgm-24t0xcs-projects.vercel.app`
   - Add redirect URLs:
     ```
     https://kerala-cultural-5sz4i9hgm-24t0xcs-projects.vercel.app/**
     http://localhost:3000/**
     ```

---

## 🧪 **Testing OAuth**

1. **Visit Login Page**: https://kerala-cultural-5sz4i9hgm-24t0xcs-projects.vercel.app/login
2. **Click Google Login Button**
3. **Should redirect to Google OAuth consent screen**
4. **After consent, redirects back to your app at `/events`**

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"redirect_uri_mismatch"**:

   - Check your Google Cloud Console redirect URIs match exactly
   - Ensure Supabase project URL is correct

2. **"Invalid client"**:

   - Verify Client ID and Secret are correct in Supabase
   - Make sure Google+ API is enabled

3. **"OAuth provider not configured"**:

   - Ensure Google provider is enabled in Supabase
   - Check that credentials are saved properly

4. **Redirect doesn't work**:
   - Verify Site URL is set correctly in Supabase
   - Check that redirect URLs include your domain

---

## 📱 **Current OAuth Configuration**

```javascript
// Your app is configured to redirect to:
redirectTo: `${window.location.origin}/events`

// Supported providers:
- Google
- Facebook (needs similar setup)
```

---

## 🎯 **Quick Test**

If OAuth is not configured yet, you can still test the app with email/password:

```
Email: admin@keralahub.com
Password: admin123
```

---

## 📞 **Need Help?**

1. Check Supabase logs in Dashboard > Logs
2. Check browser network tab for OAuth redirect errors
3. Verify all URLs match exactly (no trailing slashes, correct protocols)

**Your Kerala Cultural Hub OAuth is ready once configured!** 🎉
