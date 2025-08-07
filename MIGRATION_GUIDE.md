# Kerala Cultural Hub - Production Migration Guide

This guide will help you migrate your Kerala Cultural Hub from demo/mock data to a fully functional production application with real Supabase data.

## 🗂️ What This Migration Includes

### Database Population

- **User Profiles**: Admin, artists, organizers, and regular users
- **Artist Profiles**: Detailed profiles for Kerala cultural artists
- **Events**: Real Kerala cultural events (festivals, concerts, workshops)
- **Cultural Content**: Articles about Kerala's rich cultural heritage
- **Sample Orders & Tickets**: Test transaction data
- **Reviews**: Sample event reviews

### Code Updates

- Removes all demo/mock functionality
- Ensures proper authentication flow
- Real database integration only
- Production-ready error handling

## 🚀 Step-by-Step Migration Process

### Prerequisites

1. **Supabase Project Setup**

   ```bash
   # Make sure Supabase is properly configured
   npm install @supabase/cli -g
   supabase login
   ```

2. **Environment Variables**
   - Ensure your `.env` file has the correct Supabase credentials
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
   ```

### Step 1: Run Database Migration

```bash
# Navigate to your project directory
cd c:\LazyIdeas\kerala_cultural_hub

# Apply the database migration with seed data
supabase db push

# The migration file will automatically run:
# supabase/migrations/20250103120000_populate_kerala_cultural_data.sql
```

### Step 2: Remove Demo Functionality

```bash
# Run the cleanup script
node scripts/remove-demo-functionality.js
```

### Step 3: Verify Environment Configuration

```bash
# Check that all required environment variables are set
npm run check-env
```

### Step 4: Test the Application

```bash
# Start the development server
npm run dev

# Test these key flows:
# 1. User registration and login
# 2. Event submission (as artist/organizer)
# 3. Event browsing and filtering
# 4. Payment flow (use Stripe test mode)
```

## 🔧 Post-Migration Configuration

### 1. Storage Bucket Setup

In your Supabase dashboard, ensure these storage buckets are created:

- `event-images` (public)
- `cultural-content-media` (public)
- `artist-portfolios` (public)
- `user-profiles` (public)

### 2. Authentication Settings

Configure these in Supabase Auth settings:

- Email templates
- Social OAuth providers (if needed)
- Password policies
- Email confirmation requirements

### 3. Row Level Security Verification

Verify that RLS policies are working correctly:

```sql
-- Test queries to verify RLS
SELECT * FROM public.events WHERE status = 'published';
SELECT * FROM public.user_profiles WHERE is_active = true;
```

## 📊 Seed Data Overview

### Users Created

- **Admin**: `admin@keralaculturalhub.com`
- **Artists**: 5 professional Kerala artists
- **Organizers**: 4 cultural organizations
- **Regular Users**: 3 sample users

### Events Created

- Kathakali Festival 2024
- Carnatic Music Concert
- Theyyam Festival
- Mohiniyattam Workshop
- Thrissur Pooram 2024
- Past events with reviews

### Cultural Content

- Articles about Kathakali, Mohiniyattam, Theyyam
- Thrissur Pooram cultural significance
- Rich multimedia content with images and videos

## 🔐 Default Login Credentials

### Admin Access

- **Email**: `admin@keralaculturalhub.com`
- **Role**: Admin
- **Permissions**: Full access to all features

### Test Artist Account

- **Email**: `kalamandalam.rajesh@gmail.com`
- **Role**: Artist
- **Permissions**: Can submit events, manage profile

### Test Organizer Account

- **Email**: `organizer@spiccoast.org`
- **Role**: Organizer
- **Permissions**: Can submit and manage events

> **Note**: These are seeded user profiles. You'll need to create actual auth users through the Supabase auth system or your registration flow.

## 🧪 Testing Scenarios

### 1. Event Submission Flow

```bash
# Test as artist/organizer
1. Login with artist/organizer credentials
2. Navigate to event submission portal
3. Fill out complete event form
4. Submit event
5. Verify event appears in listings (with pending status)
```

### 2. Payment Flow Testing

```bash
# Use Stripe test card numbers
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3-digit number
```

### 3. Content Management

```bash
# Test cultural content
1. Browse cultural heritage repository
2. View articles and media
3. Test search functionality
4. Verify content categorization
```

## 🚨 Troubleshooting

### Common Issues

1. **"User profile not found" error**

   - Ensure user profiles are created when users register
   - Check the `handle_new_user()` trigger is working

2. **RLS policy errors**

   - Verify you're logged in with correct user role
   - Check policy definitions in migration file

3. **Storage upload failures**

   - Ensure storage buckets are created and public
   - Check CORS settings in Supabase

4. **Event submission failures**
   - Verify user has correct role (artist/organizer/admin)
   - Check required fields are populated

### Debug Commands

```bash
# Check database connection
supabase db remote status

# View database logs
supabase logs --db

# Reset database (if needed)
supabase db reset
```

## 🎯 Production Deployment Checklist

- [ ] Database migration completed
- [ ] Demo functionality removed
- [ ] Environment variables configured
- [ ] Storage buckets created
- [ ] RLS policies working
- [ ] Authentication flow tested
- [ ] Event submission tested
- [ ] Payment flow tested (test mode)
- [ ] Performance optimized
- [ ] Error monitoring setup

## 📈 Next Steps

1. **Content Management**: Add more cultural content and events
2. **User Management**: Implement admin panel for user role management
3. **Analytics**: Add event analytics and user engagement tracking
4. **Mobile App**: Consider React Native mobile application
5. **SEO**: Optimize for search engines
6. **Performance**: Add caching and CDN integration

## 🆘 Support

If you encounter any issues during migration:

1. Check the application logs for specific error messages
2. Verify database connections and permissions
3. Review the deployment checklist
4. Check Supabase dashboard for any service issues

Remember to keep backups of your data before running migrations in production environments.

---

_This migration transforms your Kerala Cultural Hub into a production-ready application with authentic Kerala cultural data and full database integration._
