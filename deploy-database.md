# Database Deployment Guide

## Supabase Setup (Required)

1. **Access your Supabase Dashboard**:

   - Go to: https://ydxfbmhvapdowmawypsf.supabase.co
   - Login to your Supabase account

2. **Apply Database Migration**:

   - Go to SQL Editor in Supabase Dashboard
   - Copy and paste the content from: `supabase/migrations/20250803175425_kerala_cultural_events_mvp.sql`
   - Execute the SQL to create all tables and functions

3. **Verify Tables Created**:
   Check that these tables exist:
   - user_profiles
   - events
   - cultural_content
   - artist_profiles
   - orders
   - tickets
   - user_favorites
   - event_reviews

## Stripe Setup (For Payments)

1. **Test Environment** (Current):

   - Test key already configured
   - Use test card: 4242 4242 4242 4242

2. **Production Environment**:
   - Replace `VITE_STRIPE_PUBLISHABLE_KEY` with live key
   - Configure webhook endpoints in Stripe dashboard

## Environment Variables for Production

Set these in your hosting platform:

- VITE_SUPABASE_URL=https://ydxfbmhvapdowmawypsf.supabase.co
- VITE_SUPABASE_ANON_KEY=(your anon key)
- VITE_STRIPE_PUBLISHABLE_KEY=(your stripe key)
