# Manual Schema Push Guide

## 🚀 Quick Setup Instructions

Since the Supabase CLI is having connectivity issues, here's the manual approach to push your schema:

### Step 1: Go to Supabase Dashboard
1. Open your browser and go to: https://supabase.com/dashboard/project/mafpgmercmlzeusdjxuq
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### Step 2: Copy and Paste the Schema
Copy the entire contents of `supabase/migrations/20250905194706_create_agreement_tables.sql` and paste it into the SQL Editor.

### Step 3: Execute the Schema
1. Click the **"Run"** button (or press Ctrl+Enter)
2. Wait for the execution to complete
3. You should see success messages

### Step 4: Create Storage Bucket
1. Go to **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Name it: `agreement-files`
4. Set it to **"Public"** for direct file access
5. Click **"Create bucket"**

### Step 5: Get API Keys
1. Go to **"Settings"** > **"API"**
2. Copy your:
   - **Project URL** (looks like: `https://mafpgmercmlzeusdjxuq.supabase.co`)
   - **Anon/Public key** (long string starting with `eyJ...`)

### Step 6: Update Environment Variables
Create or update your `.env.local` file:

```env
VITE_SUPABASE_URL=https://mafpgmercmlzeusdjxuq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🎯 What This Creates

Your database will have:

### Tables
- **agreement_submissions** - Main agreement data with all form fields
- **file_uploads** - File metadata and storage links
- **audit_logs** - Complete change tracking

### Features
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ UUID primary keys
- ✅ Data validation constraints
- ✅ Performance indexes
- ✅ Audit logging triggers
- ✅ Row Level Security policies
- ✅ Summary view for easy querying

### Sample Data (Optional)
You can also run the seed data from `supabase/seed.sql` to add test records.

## 🔧 Verification

After running the schema, verify it worked by:

1. Go to **"Table Editor"** in Supabase
2. You should see these tables:
   - `agreement_submissions`
   - `file_uploads` 
   - `audit_logs`
3. Check that the `agreement_summary` view exists

## 🚀 Next Steps

Once the schema is pushed:

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables in Vercel**:
   - Go to your Vercel project settings
   - Add the same environment variables

3. **Test Your Application**:
   - Visit your Vercel URL
   - Test the agreement form
   - Verify data is being saved

## 🆘 Troubleshooting

### If SQL Execution Fails
- Check for syntax errors
- Some statements might fail if they already exist (this is normal)
- Run statements one by one if needed

### If Tables Don't Appear
- Refresh the Table Editor
- Check the SQL Editor for error messages
- Verify you're in the correct project

### If Storage Bucket Creation Fails
- Make sure you have the correct permissions
- Try a different bucket name if needed

## ✅ Success Checklist

- [ ] Schema executed without major errors
- [ ] Three tables visible in Table Editor
- [ ] Storage bucket created
- [ ] API keys copied
- [ ] Environment variables updated
- [ ] Application deployed to Vercel
- [ ] Form submission works
- [ ] Data appears in Supabase

## 🎉 You're Done!

Your Arkansas Ankle Monitor Agreement system is now fully set up with:
- Professional database schema
- File storage capabilities
- Complete audit trail
- Production-ready deployment

The manual approach is actually quite common and works perfectly well. Your application is now ready for production use!
