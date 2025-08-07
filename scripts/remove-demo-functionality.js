#!/usr/bin/env node

/**
 * Script to Remove Demo/Mock Functionality from Kerala Cultural Hub
 * This script updates the application to work with real Supabase data only
 * 
 * Run this script after running the database migration:
 * node scripts/remove-demo-functionality.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting removal of demo functionality...\n');

// Files that need to be updated to remove demo functionality
const filesToUpdate = [
  {
    path: 'src/pages/event-submission-portal/index.jsx',
    description: 'Event submission portal - remove demo user and fallback functionality'
  },
  {
    path: 'src/contexts/AuthContext.jsx',
    description: 'Auth context - remove demo user support'
  },
  {
    path: 'src/services/eventService.js',
    description: 'Event service - remove demo fallbacks'
  }
];

// Function to read file content
function readFile(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

// Function to write file content
function writeFile(filePath, content) {
  const fullPath = path.resolve(filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Updated: ${filePath}`);
}

// Function to remove demo functionality from event submission portal
function updateEventSubmissionPortal() {
  const filePath = 'src/pages/event-submission-portal/index.jsx';
  let content = readFile(filePath);
  
  if (!content) return;

  // Remove demo user logic
  content = content.replace(
    /\/\/ Get current user from auth context or demo storage[\s\S]*?const currentUserProfile = authUserProfile \|\| demoUser;/,
    `// Get current user from auth context
  const currentUser = authUser;
  const currentUserProfile = authUserProfile;`
  );

  // Remove demo role detection
  content = content.replace(
    /\/\/ Fallback role detection for demo users based on email[\s\S]*?else userRole = 'user';[\s\S]*?}/,
    ''
  );

  // Remove demo fallback in event creation
  content = content.replace(
    /console\.warn\('Database save failed, using fallback:', dbError\);[\s\S]*?console\.log\('Using demo mode fallback:', savedEvent\);/,
    `console.error('Database save failed:', dbError);
        throw dbError;`
  );

  // Remove demo user ID generation
  content = content.replace(
    /const userId = currentUser\?\.\id \|\| currentUser\?\.\user_id \|\| \`demo_\$\{currentUser\?\.\email\?\.\replace\('@', '_'\)\.replace\('\.', '_'\)\}\`;/,
    'const userId = currentUser?.id;'
  );

  // Clean up authentication checks
  content = content.replace(
    /\/\/ Validate user authentication first[\s\S]*?if \(\!currentUser\?\.\id && \!currentUser\?\.\email\) \{/,
    `// Validate user authentication first
      if (!currentUser?.id) {`
  );

  // Remove demo user clearing in logout
  content = content.replace(
    /\/\/ Clear demo user data[\s\S]*?localStorage\.removeItem\('kerala_demo_user'\);/,
    '// Clear any local storage if needed'
  );

  content = content.replace(
    /\/\/ Fallback to clear demo user and navigate[\s\S]*?localStorage\.removeItem\('kerala_demo_user'\);/,
    '// Navigate to login on error'
  );

  writeFile(filePath, content);
}

// Function to update AuthContext to remove demo support
function updateAuthContext() {
  const filePath = 'src/contexts/AuthContext.jsx';
  let content = readFile(filePath);
  
  if (!content) return;

  // This is a placeholder - the actual implementation will depend on the current AuthContext structure
  console.log(`📝 Please manually review ${filePath} to remove any demo user functionality`);
}

// Function to update event service to remove demo fallbacks
function updateEventService() {
  const filePath = 'src/services/eventService.js';
  let content = readFile(filePath);
  
  if (!content) return;

  // Remove any console.log fallbacks or demo-related code
  // The current eventService.js looks clean, but we'll check for any demo patterns
  const hasDemo = content.includes('demo') || content.includes('mock') || content.includes('fallback');
  
  if (hasDemo) {
    console.log(`📝 Demo patterns found in ${filePath} - manual review required`);
  } else {
    console.log(`✅ ${filePath} appears clean of demo functionality`);
  }
}

// Function to create environment setup script
function createEnvironmentScript() {
  const envScript = `#!/usr/bin/env node

/**
 * Environment Setup Script for Kerala Cultural Hub
 * Ensures all required environment variables are properly configured
 */

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY'
];

console.log('🔧 Checking environment configuration...');

let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(\`   - \${varName}\`);
  });
  console.log('\\nPlease check your .env file and ensure all variables are set.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are configured');
}

console.log('🎉 Environment setup is complete!');
`;

  writeFile('scripts/check-environment.js', envScript);
}

// Function to create production deployment checklist
function createDeploymentChecklist() {
  const checklist = `# Production Deployment Checklist

## Pre-deployment Steps

### Database Setup
- [ ] Run database migrations: \`supabase db push\`
- [ ] Populate with seed data: Run the migration file \`20250103120000_populate_kerala_cultural_data.sql\`
- [ ] Verify RLS policies are enabled
- [ ] Test database connections

### Environment Configuration  
- [ ] Set production Supabase URL and keys
- [ ] Configure Stripe production keys
- [ ] Set up proper CORS policies
- [ ] Configure email templates in Supabase Auth

### Code Quality
- [ ] Remove all demo/mock functionality
- [ ] Test event submission flow
- [ ] Test payment flow with Stripe test mode
- [ ] Verify authentication flow
- [ ] Test responsive design

### Security
- [ ] Review RLS policies
- [ ] Audit API endpoints
- [ ] Check for exposed sensitive data
- [ ] Verify input validation

### Performance
- [ ] Optimize images and media
- [ ] Test loading times
- [ ] Verify caching strategies
- [ ] Monitor bundle size

## Deployment Steps
- [ ] Build production bundle: \`npm run build\`
- [ ] Test production build locally: \`npm run preview\`
- [ ] Deploy to hosting platform (Vercel/Netlify)
- [ ] Verify live site functionality
- [ ] Test critical user flows

## Post-deployment
- [ ] Monitor error logs
- [ ] Check analytics integration
- [ ] Verify email notifications
- [ ] Test from different devices
- [ ] Update documentation

## Rollback Plan
- [ ] Keep previous version backup
- [ ] Document rollback procedure
- [ ] Test rollback process
`;

  writeFile('DEPLOYMENT_CHECKLIST.md', checklist);
}

// Function to update package.json scripts
function updatePackageScripts() {
  const packageJsonPath = 'package.json';
  let content = readFile(packageJsonPath);
  
  if (!content) return;

  const packageJson = JSON.parse(content);
  
  // Add useful scripts for production
  packageJson.scripts = {
    ...packageJson.scripts,
    'check-env': 'node scripts/check-environment.js',
    'deploy:check': 'npm run check-env && npm run build',
    'db:migrate': 'supabase db push',
    'db:reset': 'supabase db reset',
    'db:seed': 'supabase db reset && supabase db push'
  };

  writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// Main execution
async function main() {
  try {
    console.log('1. Updating event submission portal...');
    updateEventSubmissionPortal();

    console.log('\\n2. Updating authentication context...');
    updateAuthContext();

    console.log('\\n3. Updating event service...');
    updateEventService();

    console.log('\\n4. Creating environment check script...');
    createEnvironmentScript();

    console.log('\\n5. Creating deployment checklist...');
    createDeploymentChecklist();

    console.log('\\n6. Updating package.json scripts...');
    updatePackageScripts();

    console.log('\\n🎉 Demo functionality removal completed successfully!');
    console.log('\\n📋 Next steps:');
    console.log('1. Run the database migration: supabase db push');
    console.log('2. Check environment variables: npm run check-env');
    console.log('3. Test the application: npm run dev');
    console.log('4. Review the deployment checklist: DEPLOYMENT_CHECKLIST.md');
    console.log('\\n⚠️  Manual review required for:');
    console.log('- src/contexts/AuthContext.jsx (remove any demo user support)');
    console.log('- Any other components that might use localStorage for demo data');

  } catch (error) {
    console.error('❌ Error during demo removal:', error.message);
    process.exit(1);
  }
}

// Run the script
main();