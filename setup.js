#!/usr/bin/env node

/**
 * Setup script for Arkansas Ankle Monitor Agreement
 * This script helps with initial project setup and deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Arkansas Ankle Monitor Agreement Setup');
console.log('==========================================\n');

// Check if .env.local exists
const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Base44 Configuration (if still needed)
VITE_BASE44_APP_ID=68af56ee3e6ef99fc977b500
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update the Supabase credentials in .env.local\n');
} else {
  console.log('✅ .env.local file already exists\n');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed\n');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed\n');
  } catch (error) {
    console.error('❌ Failed to install Vercel CLI:', error.message);
    console.log('Please install manually: npm install -g vercel\n');
  }
}

console.log('🎯 Next Steps:');
console.log('==============');
console.log('1. Set up your Supabase project:');
console.log('   - Create a new project at https://supabase.com');
console.log('   - Run the SQL from supabase-schema.sql in the SQL Editor');
console.log('   - Create a storage bucket called "agreement-files"');
console.log('   - Copy your project URL and anon key to .env.local\n');

console.log('2. Deploy to Vercel:');
console.log('   - Run: vercel login');
console.log('   - Run: vercel --prod');
console.log('   - Set environment variables in Vercel dashboard\n');

console.log('3. Test your deployment:');
console.log('   - Visit your Vercel URL');
console.log('   - Test the agreement form');
console.log('   - Verify data is saved to Supabase\n');

console.log('📚 For detailed instructions, see DEPLOYMENT_GUIDE.md');
console.log('🎉 Setup complete! Happy coding!');
