# Quick Deployment Guide

## 🚀 Deploy Arkansas Ankle Monitor Agreement to Vercel + Supabase

### Step 1: Supabase Setup (5 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: `arkansas-ankle-monitor`
   - Set strong password
   - Choose region (US East recommended)
   - Wait for creation

2. **Setup Database**
   - Go to SQL Editor in Supabase dashboard
   - Copy entire contents of `supabase-schema.sql`
   - Paste and run the SQL
   - Verify tables are created

3. **Create Storage Bucket**
   - Go to Storage in Supabase dashboard
   - Create bucket: `agreement-files`
   - Set to public (for direct file access)

4. **Get API Keys**
   - Go to Settings > API
   - Copy Project URL and anon key

### Step 2: Environment Setup (2 minutes)

1. **Create .env.local**
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Step 3: Vercel Deployment (3 minutes)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables in Vercel**
   - Go to your project in Vercel dashboard
   - Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Step 4: Test Deployment (2 minutes)

1. **Visit your Vercel URL**
2. **Test the agreement form**
3. **Check Supabase dashboard** - verify data is being saved
4. **Test admin dashboard** - visit `/Admin`

## 🎯 What You Get

### Main Features
- ✅ Digital agreement forms with validation
- ✅ Signature capture (participant, guardian, agent)
- ✅ File uploads (documents, photos)
- ✅ Admin dashboard for management
- ✅ Complete audit trail
- ✅ Responsive design (mobile-friendly)

### Database Tables
- `agreement_submissions` - Main agreement data
- `file_uploads` - File metadata and storage
- `audit_logs` - Change tracking

### Security Features
- Row Level Security (RLS)
- Input validation
- File type validation
- HTTPS enforcement
- Audit logging

## 🔧 URLs

- **Main App**: `https://your-vercel-url.vercel.app/`
- **Admin Dashboard**: `https://your-vercel-url.vercel.app/Admin`
- **Supabase Dashboard**: Your Supabase project dashboard

## 📱 Testing Checklist

- [ ] Agreement form loads correctly
- [ ] All form fields work and validate
- [ ] Signature capture works
- [ ] File uploads work
- [ ] Data saves to Supabase
- [ ] Admin dashboard shows data
- [ ] Mobile responsive design
- [ ] PDF generation (when implemented)

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check Supabase URL is correct
   - Verify environment variables are set

2. **Build Failures**
   - Check all environment variables are set in Vercel
   - Verify Node.js version compatibility

3. **Database Errors**
   - Ensure SQL schema was run completely
   - Check RLS policies are correct

4. **File Upload Issues**
   - Verify storage bucket exists
   - Check storage policies

### Getting Help

- Check browser console for errors
- Review Vercel deployment logs
- Check Supabase logs
- See `DEPLOYMENT_GUIDE.md` for detailed instructions

## 🎉 Success!

Your Arkansas Ankle Monitor Agreement system is now live and ready to use!

**Next Steps:**
- Set up authentication (if needed)
- Implement PDF generation
- Add email notifications
- Configure monitoring and alerts
