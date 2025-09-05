#!/usr/bin/env node

/**
 * Display the database schema for easy copying
 */

import fs from 'fs';

console.log('📋 Arkansas Ankle Monitor Agreement - Database Schema');
console.log('====================================================\n');

const migrationPath = 'supabase/migrations/20250905194706_create_agreement_tables.sql';

if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const schema = fs.readFileSync(migrationPath, 'utf8');

console.log('🔗 Your Supabase Dashboard:');
console.log('https://supabase.com/dashboard/project/mafpgmercmlzeusdjxuq\n');

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
console.log('6. Create storage bucket "agreement-files"');
console.log('7. Get your API keys from Settings > API');
console.log('8. Update your .env.local file');

console.log('\n✅ After this, your database will be ready for deployment!');
