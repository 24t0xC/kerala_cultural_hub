---
description: Repository Information Overview
alwaysApply: true
---

# Kerala Cultural Hub Information

## Summary

A modern React-based web application for Kerala's cultural events and heritage. The platform enables event discovery, ticket purchasing, artist profiles, and cultural content repository. Built with React 18, Vite, and integrates with Supabase for backend services and Stripe for payments.

## Structure

- **src/**: Core application code (components, pages, services)
- **public/**: Static assets and resources
- **supabase/**: Supabase functions and database migrations
- **dist/**: Build output directory
- **.zencoder/**: Project configuration files

## Language & Runtime

**Language**: JavaScript/JSX (React)
**Version**: React 18.2.0
**Build System**: Vite 5.0.0
**Package Manager**: npm

## Dependencies

**Main Dependencies**:

- React 18.2.0 and React DOM 18.2.0
- React Router DOM 6.0.2
- Redux Toolkit 2.6.1
- Supabase JS 2.21.0
- Stripe JS 7.8.0
- TailwindCSS 3.4.6
- Framer Motion 10.16.4
- D3.js 7.9.0 and Recharts 2.15.2

**Development Dependencies**:

- Vite 5.0.0
- @vitejs/plugin-react 4.3.4
- TailwindCSS plugins (typography, forms, aspect-ratio)
- PostCSS 8.4.8 and Autoprefixer 10.4.2

## Build & Installation

```bash
# Install dependencies
npm install

# Development server
npm start

# Production build
npm run build

# Preview production build
npm run serve
```

## Database

**Type**: PostgreSQL (Supabase)
**Schema**: Comprehensive database with tables for users, events, tickets, orders, artists, and cultural content
**Migrations**: SQL migrations in supabase/migrations directory
**Key Tables**: user_profiles, events, orders, tickets, cultural_content, artist_profiles

## Serverless Functions

**Platform**: Supabase Edge Functions (Deno)
**Functions**:

- create-payment-intent: Handles Stripe payment processing for event tickets

## Authentication

**Provider**: Supabase Auth
**Features**: Email/password login, JWT tokens, role-based access

## Payment Processing

**Provider**: Stripe
**Features**: Payment intents, Indian Rupee (INR) currency support

## Deployment

**Platforms**: Supports both Netlify and Vercel
**Node Version**: 18
**Build Command**: npm run build
**Output Directory**: dist
**Configuration**:

- netlify.toml: Netlify deployment settings
- vercel.json: Vercel deployment settings
