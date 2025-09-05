# 🔧 Environment Variables Setup Guide

## ❌ **Current Issue**
Your application is showing: `Uncaught Error: Missing Supabase environment variables`

This means the environment variables aren't set in your Vercel deployment.

## ✅ **Solution: Set Environment Variables in Vercel**

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/fire-text-dispatch/arkansas-ankle-monitor-agreement
2. Click on **"Settings"** tab
3. Click on **"Environment Variables"** in the left sidebar

### **Step 2: Add Environment Variables**

Click **"Add New"** and add these two variables:

#### **Variable 1:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://mafpgmercmlzeusdjxuq.supabase.co`
- **Environment**: ✅ Production ✅ Preview ✅ Development

#### **Variable 2:**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `[Get this from Supabase - see Step 3]`
- **Environment**: ✅ Production ✅ Preview ✅ Development

### **Step 3: Get Your Supabase Anon Key**

1. Go to: https://mafpgmercmlzeusdjxuq.supabase.co
2. Click **"Settings"** in the left sidebar
3. Click **"API"**
4. Copy the **"anon public"** key (long string starting with `eyJ...`)

### **Step 4: Redeploy**

After setting the environment variables, your application will automatically redeploy, or you can manually redeploy:

```bash
vercel --prod
```

## 🎯 **Your Updated URLs**

After setting the environment variables:
- **Main App**: https://arkansas-ankle-monitor-agreement-jsxa6l065-fire-text-dispatch.vercel.app
- **Admin Dashboard**: https://arkansas-ankle-monitor-agreement-jsxa6l065-fire-text-dispatch.vercel.app/Admin

## ✅ **Verification**

Once you've set the environment variables and redeployed:

1. Visit your application URL
2. The error should be gone
3. You should see the agreement form
4. Test creating a new agreement
5. Check that data is saved in your Supabase dashboard

## 🆘 **If You Still Have Issues**

1. **Check Environment Variables**: Make sure they're set for all environments
2. **Wait for Redeploy**: It may take a few minutes for changes to take effect
3. **Clear Browser Cache**: Hard refresh (Ctrl+F5) your browser
4. **Check Vercel Logs**: Look at the deployment logs for any errors

## 🎉 **After Setup**

Your Arkansas Ankle Monitor Agreement system will be fully functional with:
- ✅ Working agreement forms
- ✅ Database connectivity
- ✅ File uploads
- ✅ Admin dashboard
- ✅ Complete audit trail
