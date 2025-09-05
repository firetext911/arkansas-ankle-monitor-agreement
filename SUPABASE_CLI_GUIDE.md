# Supabase CLI Setup Guide

## ✅ What's Been Set Up

I've successfully set up the Supabase CLI for your Arkansas Ankle Monitor Agreement project:

### 1. **Supabase CLI Installed**
- Installed locally as a dev dependency
- Available via `npx supabase` commands

### 2. **Project Initialized**
- Created `supabase/` directory structure
- Generated `supabase/config.toml` configuration
- Set up VS Code settings for Deno

### 3. **Migration Created**
- Created migration: `supabase/migrations/20250905194706_create_agreement_tables.sql`
- Contains your complete database schema
- Includes tables, indexes, triggers, and RLS policies

### 4. **Seed Data**
- Created `supabase/seed.sql` with sample data
- Includes test agreements, file uploads, and audit logs

### 5. **Package Scripts Added**
- `npm run db:push` - Push migrations to remote database
- `npm run db:reset` - Reset local database
- `npm run db:diff` - Generate diff between local and remote
- `npm run db:seed` - Seed local database with sample data
- `npm run db:start` - Start local Supabase instance
- `npm run db:stop` - Stop local Supabase instance
- `npm run db:status` - Check Supabase status

## 🚀 Next Steps

### Step 1: Link to Your Remote Project

```bash
# Get your project reference ID from Supabase dashboard URL
# It looks like: https://supabase.com/dashboard/project/abcdefghijklmnop

npx supabase link --project-ref your-project-ref-here
```

### Step 2: Push Your Schema to Remote Database

```bash
# Push the migration to your remote Supabase database
npm run db:push
```

This will:
- Apply your database schema to the remote database
- Create all tables, indexes, triggers, and policies
- Set up the complete ankle monitor agreement system

### Step 3: Create Storage Bucket (Manual)

In your Supabase dashboard:
1. Go to Storage
2. Create bucket: `agreement-files`
3. Set to public (for direct file access)

## 🔧 Development Workflow

### Local Development

```bash
# Start local Supabase (includes database, auth, storage, etc.)
npm run db:start

# Your local Supabase will be available at:
# - API: http://localhost:54321
# - Studio: http://localhost:54323
# - Database: postgresql://postgres:postgres@localhost:54322/postgres

# Start your app (update .env.local to use local URLs)
npm run dev
```

### Making Database Changes

```bash
# Create a new migration
npx supabase migration new your_change_name

# Edit the migration file in supabase/migrations/

# Apply to local database
npx supabase db reset

# Push to remote database
npm run db:push
```

### Checking Status

```bash
# Check local Supabase status
npm run db:status

# See what's different between local and remote
npm run db:diff
```

## 📁 Project Structure

```
supabase/
├── config.toml                    # Supabase configuration
├── migrations/                    # Database migrations
│   └── 20250905194706_create_agreement_tables.sql
├── seed.sql                      # Sample data
└── .gitignore                    # Git ignore rules
```

## 🔐 Environment Variables

Update your `.env.local` for local development:

```env
# Local Supabase (when running npm run db:start)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# Remote Supabase (for production)
# VITE_SUPABASE_URL=https://your-project-ref.supabase.co
# VITE_SUPABASE_ANON_KEY=your-remote-anon-key
```

## 🎯 Benefits of This Setup

1. **Version Control**: Database changes are tracked in git
2. **Team Collaboration**: Everyone gets the same database state
3. **Local Development**: Full Supabase stack locally
4. **Easy Deployments**: One command to push changes
5. **Rollbacks**: Easy to revert database changes
6. **CI/CD Ready**: Can be integrated into automated deployments

## 🆘 Troubleshooting

### Common Issues

1. **Link Command Fails**
   - Make sure you have the correct project reference ID
   - Ensure you're logged in: `npx supabase login`

2. **Push Command Fails**
   - Check your internet connection
   - Verify project permissions
   - Try: `npx supabase db push --debug`

3. **Local Start Fails**
   - Make sure Docker is running
   - Try: `npx supabase stop` then `npx supabase start`

### Getting Help

```bash
# Get help for any command
npx supabase --help
npx supabase db --help
npx supabase migration --help
```

## 🎉 You're All Set!

Your project now has professional database management with:
- ✅ Version-controlled migrations
- ✅ Local development environment
- ✅ Easy remote deployments
- ✅ Sample data for testing
- ✅ Complete ankle monitor agreement schema

Next: Link to your remote project and push the schema!
