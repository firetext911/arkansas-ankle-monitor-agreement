# Arkansas Ankle Monitor Agreement - Deployment Guide

This guide will help you deploy the Arkansas Ankle Monitor Agreement application to Vercel and set up Supabase as the backend database.

## Prerequisites

- Node.js 18+ installed
- Vercel account
- Supabase account
- Git repository access

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Choose a name like "arkansas-ankle-monitor"
3. Set a strong database password
4. Choose a region close to your users
5. Wait for the project to be created

### 1.2 Set up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` and run it
3. This will create all necessary tables, indexes, and triggers

### 1.3 Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `agreement-files`
3. Set it to public if you want direct file access
4. Configure RLS policies as needed

### 1.4 Get API Keys

1. Go to Settings > API in your Supabase dashboard
2. Copy the following:
   - Project URL
   - Anon/Public key

## Step 2: Environment Variables

### 2.1 Local Development

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2.2 Vercel Deployment

1. In your Vercel dashboard, go to your project settings
2. Add the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Step 3: Vercel Deployment

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3.3 Alternative: GitHub Integration

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main
3. Set environment variables in Vercel dashboard

## Step 4: Database Configuration

### 4.1 Row Level Security (RLS)

The schema includes RLS policies. You may need to adjust them based on your authentication needs:

```sql
-- Example: Restrict access to authenticated users only
CREATE POLICY "Authenticated users only" ON agreement_submissions
    FOR ALL USING (auth.role() = 'authenticated');
```

### 4.2 Storage Policies

Set up storage policies for file uploads:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated uploads" ON storage.objects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public access to files (if needed)
CREATE POLICY "Public access" ON storage.objects
    FOR SELECT USING (true);
```

## Step 5: Testing

### 5.1 Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 5.2 Production Testing

1. Visit your deployed Vercel URL
2. Test the agreement form
3. Verify data is being saved to Supabase
4. Check file uploads work correctly

## Step 6: Monitoring and Maintenance

### 6.1 Database Monitoring

- Monitor database usage in Supabase dashboard
- Set up alerts for storage limits
- Review audit logs regularly

### 6.2 Application Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking (Sentry, etc.)
- Monitor API usage and costs

## Database Schema Overview

The application uses the following main tables:

### `agreement_submissions`
- Main table storing all agreement data
- Includes participant info, financial terms, signatures
- Tracks status and audit information

### `file_uploads`
- Stores metadata for uploaded files
- Links to Supabase Storage for actual files
- Categorized by file type

### `audit_logs`
- Tracks all changes to agreements
- Includes user agent, IP, and timestamp
- Automatic logging via database triggers

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **RLS Policies**: Review and test all row-level security policies
3. **File Uploads**: Validate file types and sizes
4. **Input Validation**: All form inputs are validated on both client and server
5. **HTTPS**: Vercel automatically provides HTTPS

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Supabase URL is correct
2. **RLS Policy Errors**: Check that policies allow your operations
3. **File Upload Failures**: Verify storage bucket exists and policies are correct
4. **Build Failures**: Check that all environment variables are set

### Getting Help

- Check Supabase documentation
- Review Vercel deployment logs
- Check browser console for client-side errors
- Review Supabase logs for database errors

## Next Steps

1. Set up authentication if needed
2. Implement PDF generation for agreements
3. Add email notifications
4. Set up backup procedures
5. Configure monitoring and alerts
