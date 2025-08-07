#!/usr/bin/env node

/**
 * Kerala Cultural Hub - Deployment Verification Script
 * This script verifies that the migration and deployment was successful
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Kerala Cultural Hub - Deployment Verification');
console.log('================================================\n');

// Verification tests
const tests = [
  {
    name: 'Environment Configuration',
    test: checkEnvironmentVariables
  },
  {
    name: 'Database Connection',
    test: checkDatabaseConnection
  },
  {
    name: 'Build Artifacts',
    test: checkBuildArtifacts
  },
  {
    name: 'Demo Code Removal',
    test: checkDemoCodeRemoval
  },
  {
    name: 'Package Scripts',
    test: checkPackageScripts
  }
];

let passedTests = 0;
let totalTests = tests.length;

async function runTests() {
  console.log(`Running ${totalTests} verification tests...\n`);
  
  for (const test of tests) {
    try {
      console.log(`🧪 Testing: ${test.name}`);
      const result = await test.test();
      if (result.success) {
        console.log(`✅ ${test.name}: PASSED`);
        if (result.details) {
          console.log(`   ${result.details}`);
        }
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   ${error.message}`);
    }
    console.log('');
  }

  // Summary
  console.log('📊 Verification Summary');
  console.log('=====================');
  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Deployment verification successful.');
    console.log('\n🚀 Your Kerala Cultural Hub is ready for production!');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Deploy to your hosting platform');
    console.log('2. Configure production environment variables');
    console.log('3. Test critical user flows');
    console.log('4. Set up monitoring and analytics');
    
    process.exit(0);
  } else {
    console.log(`⚠️ ${totalTests - passedTests} tests failed. Please review and fix issues before deploying.`);
    process.exit(1);
  }
}

// Test functions
function checkEnvironmentVariables() {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY'
  ];
  
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) {
    return { success: false, error: '.env file not found' };
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = requiredVars.filter(varName => 
    !envContent.includes(varName) || envContent.includes(`${varName}=`)
  );
  
  if (missingVars.length > 0) {
    return { 
      success: false, 
      error: `Missing required environment variables: ${missingVars.join(', ')}` 
    };
  }
  
  return { 
    success: true, 
    details: `All ${requiredVars.length} required environment variables are configured` 
  };
}

function checkDatabaseConnection() {
  try {
    // Check if Supabase CLI is available
    execSync('supabase --version', { stdio: 'pipe' });
    
    // Try to get project status
    const status = execSync('supabase status', { stdio: 'pipe', encoding: 'utf8' });
    
    return { 
      success: true, 
      details: 'Supabase CLI available and project accessible' 
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Could not verify database connection. Ensure Supabase CLI is installed and configured.' 
    };
  }
}

function checkBuildArtifacts() {
  const distPath = path.resolve('dist');
  if (!fs.existsSync(distPath)) {
    return { success: false, error: 'dist directory not found. Run npm run build first.' };
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return { success: false, error: 'dist/index.html not found. Build may have failed.' };
  }
  
  const assetsPath = path.join(distPath, 'assets');
  if (!fs.existsSync(assetsPath)) {
    return { success: false, error: 'dist/assets directory not found. Build may be incomplete.' };
  }
  
  return { 
    success: true, 
    details: 'Build artifacts found and appear complete' 
  };
}

function checkDemoCodeRemoval() {
  const filesToCheck = [
    'src/pages/event-submission-portal/index.jsx'
  ];
  
  const demoPatterns = [
    'kerala_demo_user',
    'demo mode',
    'fallback for demo',
    'simulate successful submission',
    'DEMO_EVT_'
  ];
  
  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const foundPatterns = demoPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (foundPatterns.length > 0) {
      return {
        success: false,
        error: `Demo code patterns still found in ${filePath}: ${foundPatterns.join(', ')}`
      };
    }
  }
  
  return {
    success: true,
    details: 'Demo code patterns successfully removed from key files'
  };
}

function checkPackageScripts() {
  const packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return { success: false, error: 'package.json not found' };
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const expectedScripts = ['build', 'dev', 'preview'];
  const missingScripts = expectedScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length > 0) {
    return {
      success: false,
      error: `Missing required package scripts: ${missingScripts.join(', ')}`
    };
  }
  
  return {
    success: true,
    details: 'All required package scripts are available'
  };
}

// Run the verification
runTests().catch(error => {
  console.error('Verification failed:', error.message);
  process.exit(1);
});