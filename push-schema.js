#!/usr/bin/env node

/**
 * Manual schema push script for Arkansas Ankle Monitor Agreement
 * This script helps push the database schema to your Supabase project
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Arkansas Ankle Monitor Agreement - Schema Push');
console.log('================================================\n');

// Read the migration file
const migrationPath = 'supabase/migrations/20250905194706_create_agreement_tables.sql';
const seedPath = 'supabase/seed.sql';

if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const migrationContent = fs.readFileSync(migrationPath, 'utf8');
const seedContent = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf8') : '';

console.log('📋 Your Supabase Project Details:');
console.log('================================');
console.log('Project Name: arkansas-ankle-monitor-agreement');
console.log('Project ID: mafpgmercmlzeusdjxuq');
console.log('Region: East US (North Virginia)');
console.log('Status: ACTIVE_HEALTHY\n');

console.log('🔧 Next Steps:');
console.log('==============');
console.log('1. Go to your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/mafpgmercmlzeusdjxuq\n');

console.log('2. Navigate to SQL Editor\n');

console.log('3. Copy and paste the following SQL schema:\n');
console.log('─'.repeat(80));
console.log(migrationContent);
console.log('─'.repeat(80));

if (seedContent) {
  console.log('\n4. (Optional) Copy and paste the seed data:\n');
  console.log('─'.repeat(80));
  console.log(seedContent);
  console.log('─'.repeat(80));
}

console.log('\n5. Click "Run" to execute the SQL\n');

console.log('6. Create Storage Bucket:');
console.log('   - Go to Storage in your dashboard');
console.log('   - Create bucket: "agreement-files"');
console.log('   - Set to public (for direct file access)\n');

console.log('7. Get your API keys:');
console.log('   - Go to Settings > API');
console.log('   - Copy Project URL and anon key');
console.log('   - Update your .env.local file\n');

console.log('🎯 Alternative: Use Supabase CLI (requires database password)');
console.log('============================================================');
console.log('If you have your database password, you can run:');
console.log('npx supabase link --project-ref mafpgmercmlzeusdjxuq');
console.log('npm run db:push\n');

console.log('✅ After completing these steps, your database will be ready!');
console.log('📚 See SUPABASE_CLI_GUIDE.md for more detailed instructions.');
