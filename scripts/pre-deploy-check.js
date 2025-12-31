#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Pre-Deployment Validation...\n');

let errorCount = 0;
let warningCount = 0;

// Colors for terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function pass(message) {
  console.log(`${colors.green}✅ PASS:${colors.reset} ${message}`);
}

function fail(message) {
  console.log(`${colors.red}❌ FAIL:${colors.reset} ${message}`);
  errorCount++;
}

function warn(message) {
  console.log(`${colors.yellow}⚠️  WARN:${colors.reset} ${message}`);
  warningCount++;
}

function info(message) {
  console.log(`${colors.cyan}ℹ️  INFO:${colors.reset} ${message}`);
}

function section(title) {
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}${title}${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

// ============================================
// 1. CHECK REQUIRED FILES
// ============================================
section('1. Checking Required Files');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'netlify.toml',
  'public/_redirects',
  '.env.local',
  '.gitignore',
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    pass(`${file} exists`);
  } else {
    fail(`${file} is missing!`);
  }
});

// ============================================
// 2. CHECK .ENV.LOCAL VARIABLES
// ============================================
section('2. Checking Environment Variables');

let envContent = '';
if (fs.existsSync('.env.local')) {
  envContent = fs.readFileSync('.env.local', 'utf8');
  pass('.env.local file found (local env)');
} else {
  warn('.env.local file not found — ensure CI/env vars are set for deployments');
}

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    pass(`${varName} is set via environment`);
    return;
  }

  if (envContent && envContent.includes(varName)) {
    const match = envContent.match(new RegExp(`${varName}=(.+)`));
    if (match && match[1].trim() && match[1] !== 'your_value_here') {
      pass(`${varName} is set in .env.local`);
    } else {
      warn(`${varName} is empty or has placeholder value in .env.local`);
    }
  } else {
    warn(`${varName} is missing (set in CI or add to .env.local)`);
  }
});

// Check for NEXT_PUBLIC_ prefix in local file (if present)
if (envContent) {
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#') && line.includes('FIREBASE')) {
      if (!line.startsWith('NEXT_PUBLIC_')) {
        warn(`Variable should have NEXT_PUBLIC_ prefix: ${line.split('=')[0]}`);
      }
    }
  });
}

// ============================================
// 3. CHECK .GITIGNORE
// ============================================
section('3. Checking .gitignore');

if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  
  const requiredIgnores = [
    '.env.local',
    '.env*.local',
    'node_modules',
    '.next',
  ];

  requiredIgnores.forEach(item => {
    if (gitignoreContent.includes(item)) {
      pass(`${item} is in .gitignore`);
    } else {
      fail(`${item} should be in .gitignore`);
    }
  });
} else {
  fail('.gitignore not found!');
}

// ============================================
// 4. CHECK NETLIFY.TOML
// ============================================
section('4. Checking netlify.toml');

if (fs.existsSync('netlify.toml')) {
  const tomlContent = fs.readFileSync('netlify.toml', 'utf8');
  
  const checks = [
    { text: 'command = "npm run build"', message: 'Build command is set' },
    { text: 'publish = ".next"', message: 'Publish directory is set' },
    { text: '@netlify/plugin-nextjs', message: 'Next.js plugin is configured' },
    { text: 'Cross-Origin-Opener-Policy', message: 'COOP header is set' },
  ];

  checks.forEach(check => {
    if (tomlContent.includes(check.text)) {
      pass(check.message);
    } else {
      fail(`${check.message} - not found in netlify.toml`);
    }
  });
} else {
  fail('netlify.toml not found!');
}

// ============================================
// 5. CHECK NEXT.CONFIG.JS
// ============================================
section('5. Checking next.config.js');

if (fs.existsSync('next.config.js')) {
  const configContent = fs.readFileSync('next.config.js', 'utf8');
  
  if (configContent.includes('output:') || configContent.includes('output =')) {
    pass('Output mode is configured');
  } else {
    warn('Output mode not explicitly set (may be okay)');
  }

  if (configContent.includes('images:') || configContent.includes('unoptimized')) {
    pass('Images configuration found');
  } else {
    warn('Images optimization not configured (may cause issues on Netlify)');
  }
} else {
  fail('next.config.js not found!');
}

// ============================================
// 6. CHECK PUBLIC/_REDIRECTS
// ============================================
section('6. Checking public/_redirects');

if (fs.existsSync('public/_redirects')) {
  const redirectsContent = fs.readFileSync('public/_redirects', 'utf8');
  
  if (redirectsContent.includes('/*') && redirectsContent.includes('/index.html')) {
    pass('Redirects file has correct SPA fallback');
  } else {
    fail('Redirects file missing SPA fallback rule');
  }
} else {
  fail('public/_redirects file not found!');
}

// ============================================
// 7. CHECK FIREBASE CONFIGURATION
// ============================================
section('7. Checking Firebase Configuration');

const firebasePaths = [
  'src/lib/firebase.js',
  'src/lib/firebaseClient.js',
  'lib/firebase.js',
  'config/firebase.js',
];

let firebaseFound = false;
let firebasePath = '';

for (const path of firebasePaths) {
  if (fs.existsSync(path)) {
    firebaseFound = true;
    firebasePath = path;
    break;
  }
}

if (firebaseFound) {
  pass(`Firebase config found at: ${firebasePath}`);
  
  const firebaseContent = fs.readFileSync(firebasePath, 'utf8');
  
  // Check for singleton pattern
  if (firebaseContent.includes('getApps()') || firebaseContent.includes('getApps().length')) {
    pass('Singleton pattern detected (prevents multiple Firebase initializations)');
  } else {
    warn('Consider using singleton pattern to prevent multiple Firebase initializations');
  }

  // Check for signInWithRedirect
  if (firebaseContent.includes('signInWithRedirect')) {
    pass('Using signInWithRedirect (good for production)');
  } else if (firebaseContent.includes('signInWithPopup')) {
    warn('Using signInWithPopup (may cause COOP errors in production)');
  }

  // Check for environment variables usage
  if (firebaseContent.includes('process.env.NEXT_PUBLIC_FIREBASE')) {
    pass('Using environment variables for Firebase config');
  } else {
    fail('Hardcoded Firebase config detected (security risk!)');
  }
} else {
  fail('Firebase configuration file not found!');
}

// ============================================
// 8. CHECK PACKAGE.JSON SCRIPTS
// ============================================
section('8. Checking package.json Scripts');

if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredScripts = ['dev', 'build', 'start'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      pass(`Script "${script}" is defined`);
    } else {
      fail(`Script "${script}" is missing`);
    }
  });

  // Check for Next.js dependency
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  if (deps.next) {
    pass(`Next.js version: ${deps.next}`);
  } else {
    fail('Next.js is not in dependencies!');
  }

  if (deps.firebase) {
    pass(`Firebase version: ${deps.firebase}`);
  } else {
    fail('Firebase is not in dependencies!');
  }
} else {
  fail('package.json not found!');
}

// ============================================
// 9. TRY PRODUCTION BUILD
// ============================================
section('9. Running Production Build Test');

info('Building project... (this may take 1-2 minutes)');

try {
  execSync('npm run build', { stdio: 'inherit' });
  pass('Production build successful!');
} catch (error) {
  fail('Production build failed! Check errors above.');
}

// ============================================
// 10. CHECK BUILD OUTPUT
// ============================================
section('10. Checking Build Output');

if (fs.existsSync('.next')) {
  pass('.next directory created');
  
  const buildId = fs.existsSync('.next/BUILD_ID');
  if (buildId) {
    pass('BUILD_ID file exists');
  } else {
    warn('BUILD_ID file not found (may be okay for newer Next.js versions)');
  }
} else {
  fail('.next directory not created!');
}

// ============================================
// 11. CHECK FOR COMMON ISSUES IN CODE
// ============================================
section('11. Checking for Common Code Issues');

function checkFilesForIssues(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      checkFilesForIssues(fullPath);
    } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.tsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for localStorage without proper checks
      if (content.includes('localStorage') && !content.includes('typeof window !== "undefined"')) {
        warn(`${fullPath}: Using localStorage without window check (may cause SSR issues)`);
      }

      // Check for window without proper checks
      if (content.match(/window\./g) && !content.includes('"use client"') && !content.includes('typeof window')) {
        warn(`${fullPath}: Using window object (may need "use client" or typeof check)`);
      }

      // Check for console.log (should be removed in production)
      const logMatches = content.match(/console\.log/g);
      if (logMatches && logMatches.length > 3) {
        warn(`${fullPath}: Found ${logMatches.length} console.log statements (consider removing)`);
      }
    }
  });
}

info('Scanning code for common issues...');
checkFilesForIssues('src');
checkFilesForIssues('app');

// ============================================
// 12. GIT STATUS CHECK
// ============================================
section('12. Checking Git Status');

try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (gitStatus.trim()) {
    warn('You have uncommitted changes:');
    console.log(gitStatus);
  } else {
    pass('No uncommitted changes');
  }

  // Check if .env.local is tracked
  const gitTracked = execSync('git ls-files .env.local', { encoding: 'utf8' });
  if (gitTracked.trim()) {
    fail('.env.local is tracked by Git! This is a SECURITY RISK!');
  } else {
    pass('.env.local is not tracked by Git');
  }
} catch (error) {
  warn('Not a git repository or git not installed');
}

// ============================================
// FINAL REPORT
// ============================================
section('📊 Final Report');

console.log(`\nTotal Checks:`);
console.log(`  ${colors.green}✅ Passed: Check logs above${colors.reset}`);
console.log(`  ${colors.red}❌ Failed: ${errorCount}${colors.reset}`);
console.log(`  ${colors.yellow}⚠️  Warnings: ${warningCount}${colors.reset}`);

if (errorCount === 0) {
  console.log(`\n${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}🎉 ALL CHECKS PASSED! Ready to deploy! 🚀${colors.reset}`);
  console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  if (warningCount > 0) {
    console.log(`${colors.yellow}Note: You have ${warningCount} warnings. Consider fixing them before deployment.${colors.reset}\n`);
  }
  
  process.exit(0);
} else {
  console.log(`\n${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.red}❌ ${errorCount} ERRORS FOUND! Fix them before deploying!${colors.reset}`);
  console.log(`${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  process.exit(1);
}