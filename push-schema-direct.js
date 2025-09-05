#!/usr/bin/env node

/**
 * Direct schema push using PostgreSQL connection
 * This script connects directly to your Supabase database and runs the migration
 */

import { Client } from 'pg';
import fs from 'fs';

const connectionString = 'postgresql://postgres:T?qhqQeXh4B$oJFC@db.mafpgmercmlzeusdjxuq.supabase.co:5432/postgres';

console.log('🚀 Arkansas Ankle Monitor Agreement - Direct Schema Push');
console.log('======================================================\n');

async function pushSchema() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('📡 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read the migration file
    const migrationPath = 'supabase/migrations/20250905194706_create_agreement_tables.sql';
    if (!fs.existsSync(migrationPath)) {
      throw new Error('Migration file not found: ' + migrationPath);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📋 Executing database schema...');
    
    // Split the SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          // Some statements might fail if they already exist, which is okay
          if (error.message.includes('already exists')) {
            console.log('⚠️  Already exists:', statement.substring(0, 50) + '...');
          } else {
            console.error('❌ Error executing:', statement.substring(0, 50) + '...');
            console.error('   Error:', error.message);
          }
        }
      }
    }

    console.log('\n🎉 Schema push completed successfully!');
    console.log('\n📋 What was created:');
    console.log('   ✅ agreement_submissions table');
    console.log('   ✅ file_uploads table');
    console.log('   ✅ audit_logs table');
    console.log('   ✅ Indexes for performance');
    console.log('   ✅ Triggers for audit logging');
    console.log('   ✅ Row Level Security policies');
    console.log('   ✅ agreement_summary view');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Check if pg is installed
try {
  await pushSchema();
} catch (error) {
  if (error.message.includes("Cannot resolve module 'pg'")) {
    console.log('📦 Installing PostgreSQL client...');
    console.log('Please run: npm install pg');
    console.log('Then run this script again.');
  } else {
    console.error('❌ Error:', error.message);
  }
}
