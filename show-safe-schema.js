#!/usr/bin/env node

/**
 * Display the safe database schema for easy copying
 */

import fs from 'fs';

console.log('📋 Arkansas Ankle Monitor Agreement - Safe Database Schema');
console.log('========================================================\n');

const safeMigrationPath = 'supabase/migrations/20250905194706_create_agreement_tables_safe.sql';

if (!fs.existsSync(safeMigrationPath)) {
  console.error('❌ Safe migration file not found:', safeMigrationPath);
  process.exit(1);
}

const schema = fs.readFileSync(safeMigrationPath, 'utf8');

console.log('🔗 Your Supabase Dashboard:');
console.log('https://supabase.com/dashboard/project/mafpgmercmlzeusdjxuq\n');

console.log('✅ This is the SAFE version that handles existing objects gracefully');
console.log('📝 Copy the following SQL and paste it into the SQL Editor:\n');
console.log('─'.repeat(80));
console.log(schema);
console.log('─'.repeat(80));

console.log('\n🎯 Instructions:');
console.log('1. Go to the Supabase dashboard link above');
console.log('2. Click "SQL Editor" in the left sidebar');
console.log('3. Click "New Query"');
console.log('4. Paste the SQL above');
console.log('5. Click "Run" to execute');
console.log('6. This version will NOT give errors for existing objects');
console.log('7. Create storage bucket "agreement-files"');
console.log('8. Get your API keys from Settings > API');
console.log('9. Update your .env.local file');

console.log('\n✅ After this, your database will be ready for deployment!');
