# Vercel Deployment Guide - HackLab

## 📋 Pre-Deployment Checklist

### ✅ Repository Status
- [x] Code committed to GitHub
- [x] .env.local is in .gitignore
- [x] Build configuration verified (next.config.ts)

---

## 🔧 Environment Variables Configuration

### Required Variables for Vercel Dashboard

Navigate to: **Vercel Dashboard → Project Settings → Environment Variables**

Add the following variables for **Production** environment:

#### Public Variables (Required)
```env
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url_from_.env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key_from_.env.local>
```

#### 🔐 Private Variables (SENSITIVE - Handle with Care)
```env
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key_from_.env.local>
SUPABASE_ACCESS_TOKEN=<your_access_token_from_.env.local>
```

⚠️ **CRITICAL SECURITY WARNING:**
- Copy actual values from your `.env.local` file
- NEVER commit these keys to Git
- These keys grant admin access to your Supabase database
- Only add them directly in Vercel Dashboard
- Never share them publicly

---

## 🚀 Deployment Steps

### Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### Step 2: Configure Build Settings

Vercel should auto-detect:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (automatic)
- **Install Command:** `npm install`
- **Node.js Version:** 20.x (recommended)

### Step 3: Add Environment Variables

1. In Project Settings, go to **Environment Variables**
2. Add all 4 variables listed above
3. Select **Production** environment for each
4. Click **Save**

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (~2-5 minutes)
3. Vercel will provide a production URL

---

## ✅ Post-Deployment Verification

### Critical Checks After Deploy

- [ ] **Homepage loads** - Navigate to production URL
- [ ] **Supabase connection works** - Test authentication
- [ ] **Images load correctly** - Verify Supabase Storage integration
- [ ] **API routes respond** - Test any API endpoints
- [ ] **Admin panel accessible** - Check protected routes

### Common Issues & Fixes

#### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set correctly
- Ensure Node.js version compatibility

#### Supabase Connection Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Confirm Supabase project is active

#### Images Not Loading
- Verify `next.config.ts` has correct Supabase hostname
- Check Supabase Storage RLS policies allow public access

---

## 🔄 Future Deployments

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

Vercel will:
1. Detect the push
2. Run build
3. Deploy to production (if build succeeds)

---

## 🌐 Custom Domain (Optional)

To add a custom domain:
1. Go to **Project Settings → Domains**
2. Add your domain
3. Configure DNS records as instructed by Vercel
4. SSL certificate will be auto-generated

---

## 📊 Monitoring

### Available Tools
- **Vercel Analytics** - Page views and performance
- **Vercel Logs** - Runtime logs and errors
- **Supabase Dashboard** - Database and API usage

---

## 🆘 Support & Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Deployment Guide](https://supabase.com/docs/guides/platform/going-to-production)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

---

**Last Updated:** 2026-01-03
**Project:** HackLab
**Framework:** Next.js 15 + React 19 + Supabase
