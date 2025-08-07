# Kerala Cultural Hub - Production Ready 🎭

A comprehensive platform for Kerala's cultural events and heritage, now fully functional with real Supabase database integration.

## 🚀 Quick Start

### One-Click Deployment

```bash
# Complete production setup in one command
npm run deploy:full
```

### Manual Step-by-Step Setup

```bash
# 1. Install dependencies
npm install

# 2. Run database migration with seed data
npm run db:migrate

# 3. Remove demo functionality
npm run remove:demo

# 4. Verify environment configuration
npm run check-env

# 5. Build for production
npm run build

# 6. Verify deployment
npm run verify:deployment

# 7. Start preview server
npm run preview
```

## 📋 Available Scripts

### Development

- `npm start` / `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Database Management

- `npm run db:migrate` - Apply database migrations
- `npm run db:reset` - Reset database (⚠️ destructive)
- `npm run db:seed` - Reset and populate with seed data

### Deployment

- `npm run deploy:full` - Complete deployment process
- `npm run deploy:check` - Check environment and build
- `npm run verify:deployment` - Verify deployment success
- `npm run remove:demo` - Remove demo functionality

### Utilities

- `npm run check-env` - Verify environment variables

## 🎨 What's Included

### 🎭 Cultural Content

- **Kathakali**: Classical dance drama articles and events
- **Mohiniyattam**: Graceful dance form content and workshops
- **Theyyam**: Mystical ritual art performances
- **Thrissur Pooram**: Grand temple festival coverage
- **Carnatic Music**: Classical music concerts and content

### 👥 User Roles & Permissions

- **Admin**: Full platform management
- **Artists**: Event submission, profile management
- **Organizers**: Event management, artist collaboration
- **Users**: Event browsing, ticket purchasing, reviews

### 🎪 Event Types

- Classical dance performances
- Music concerts and recitals
- Cultural festivals
- Educational workshops
- Traditional art demonstrations

### 🏛️ Heritage Repository

- Detailed cultural articles
- Historical timelines
- Multimedia galleries
- Artist spotlights
- Festival documentations

## 🔐 Test Accounts

### Admin Access

**Email**: `admin@keralaculturalhub.com`
**Role**: Administrator
**Permissions**: Complete platform management

### Artist Accounts

- **Kathakali Master**: `kalamandalam.rajesh@gmail.com`
- **Mohiniyattam Artist**: `mohiniyattam.priya@yahoo.com`
- **Percussion Master**: `tabla.master@gmail.com`
- **Theyyam Performer**: `theyyam.artist@gmail.com`
- **Veena Virtuoso**: `veena.vidushi@gmail.com`

### Organizer Accounts

- **Cultural Foundation**: `organizer@spiccoast.org`
- **State Academy**: `events@keralasangeethanataka.org`
- **Festival Committee**: `coordinator@thrissurpooram.org`
- **Folk Society**: `info@kochifolk.com`

> **Note**: These are database user profiles. Actual authentication requires creating accounts through the registration flow or Supabase auth.

## 💾 Database Features

### ✅ Complete Schema

- User profiles with roles and permissions
- Event management with categories and status tracking
- Artist profiles with portfolios and availability
- Order processing with Stripe integration
- Ticket generation with QR codes
- Review and rating system
- Favorites and user preferences

### ✅ Row Level Security (RLS)

- User-specific data access
- Role-based permissions
- Secure API endpoints
- Admin-only functions

### ✅ Real-Time Features

- Live event updates
- Instant booking confirmations
- Real-time availability tracking

## 🎯 Key Features

### 🎪 Event Management

- **Submission Portal**: Complete event creation workflow
- **Approval Process**: Admin review and publication system
- **Category System**: Dance, Music, Theater, Festival, Workshop
- **Location Mapping**: Integrated Google Maps with venues
- **Media Support**: Images, videos, and gallery uploads

### 🎫 Ticketing System

- **Stripe Integration**: Secure payment processing
- **QR Code Generation**: Digital ticket validation
- **Inventory Management**: Real-time availability tracking
- **Order History**: Complete transaction records

### 👨‍🎨 Artist Profiles

- **Portfolio Management**: Showcase work and achievements
- **Availability Calendar**: Booking and scheduling
- **Performance History**: Track events and reviews
- **Specialization Tags**: Easy discovery and filtering

### 🏛️ Cultural Repository

- **Rich Content**: Articles, timelines, galleries
- **Search Functionality**: Full-text search across content
- **Category Browsing**: Organized by cultural forms
- **View Tracking**: Popular content analytics

### 📱 User Experience

- **Responsive Design**: Mobile-first approach
- **Progressive Web App**: App-like experience
- **Accessibility**: WCAG compliant interface
- **Performance Optimized**: Fast loading and smooth interactions

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Optional: Analytics and Monitoring
VITE_GA_TRACKING_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### Production Environment Setup

1. Create Supabase project
2. Configure authentication providers
3. Set up storage buckets for media files
4. Configure Stripe webhooks
5. Set up email templates
6. Configure CORS policies

## 📊 Database Metrics

### Seeded Data Summary

- **User Profiles**: 15 (2 admins, 5 artists, 4 organizers, 4 users)
- **Artist Profiles**: 5 professional Kerala artists
- **Events**: 6 diverse cultural events
- **Cultural Content**: 4 detailed heritage articles
- **Orders & Tickets**: Sample transaction data
- **Reviews**: Authentic event feedback

### Performance Optimizations

- Indexed database queries
- Optimized image delivery
- Cached static content
- Efficient data loading
- Minimal bundle size

## 🛡️ Security Features

### Authentication & Authorization

- Supabase Auth integration
- JWT token management
- Role-based access control
- Secure password policies

### Data Protection

- Row Level Security (RLS)
- Input validation and sanitization
- XSS protection
- CSRF protection
- SQL injection prevention

### Payment Security

- PCI DSS compliant via Stripe
- Secure payment intent flow
- No card data storage
- Encrypted transactions

## 📈 Analytics & Monitoring

### Built-in Tracking

- Event view counts
- User engagement metrics
- Popular content tracking
- Conversion analytics

### Integration Ready

- Google Analytics support
- Sentry error tracking
- Performance monitoring
- Custom dashboard capabilities

## 🚢 Deployment Options

### Recommended Platforms

- **Vercel**: Automatic deployments with Git integration
- **Netlify**: Continuous deployment with form handling
- **AWS Amplify**: Full-stack hosting with CI/CD

### Docker Support

```dockerfile
# Production-ready Dockerfile available
# Multi-stage build for optimized images
# Environment variable configuration
# Health check endpoints
```

## 📖 Documentation

- **API Documentation**: Comprehensive endpoint documentation
- **Component Library**: Reusable UI components
- **Database Schema**: Complete ERD and table descriptions
- **Deployment Guide**: Step-by-step production setup
- **User Manual**: End-user feature documentation

## 🤝 Contributing

### Development Guidelines

- Component-based architecture
- TypeScript support ready
- ESLint and Prettier configured
- Test framework setup
- Git hooks for quality control

### Code Standards

- Consistent naming conventions
- Comprehensive commenting
- Modular file structure
- Performance best practices
- Security-first development

## 📞 Support & Maintenance

### Health Checks

- Database connection monitoring
- API endpoint validation
- Performance benchmarking
- Error rate tracking
- Uptime monitoring

### Backup & Recovery

- Automated database backups
- Point-in-time recovery
- Disaster recovery procedures
- Data export capabilities

---

## 🎉 Ready for Production!

Your Kerala Cultural Hub is now fully functional with:

- ✅ Real database integration
- ✅ Complete user management
- ✅ Payment processing
- ✅ Content management
- ✅ Event lifecycle management
- ✅ Performance optimization
- ✅ Security implementation
- ✅ Mobile responsiveness

**Launch your cultural platform and celebrate Kerala's rich heritage! 🎭🎨🎵**
