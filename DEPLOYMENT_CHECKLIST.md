# SubSentry Deployment Checklist
Complete guide to deploy your full-stack app

## ✅ Pre-Deployment Checklist

### 1. Supabase Setup
- [ ] Supabase project created
- [ ] Database schema deployed (`schema.sql`)
- [ ] Row Level Security enabled on all tables
- [ ] Google OAuth configured
- [ ] API keys copied to `.env`
- [ ] Edge functions deployed (optional)

### 2. Google OAuth Setup
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] Redirect URIs added for production
- [ ] Credentials added to Supabase

### 3. Front-End Configuration
- [ ] `lib/supabase-client.js` updated with real credentials
- [ ] `.env.example` copied to `.env`
- [ ] All environment variables filled in
- [ ] Production URLs updated

### 4. Testing
- [ ] Authentication works (Google sign-in)
- [ ] Can create subscriptions
- [ ] Can view subscriptions
- [ ] Can update subscriptions
- [ ] Can delete subscriptions
- [ ] Statistics calculate correctly
- [ ] Reminders can be set
- [ ] Settings can be updated

---

## 🚀 Deployment Steps

### Option 1: GitHub Pages (Current Setup)

#### Step 1: Update OAuth Redirect
1. Go to Google Cloud Console
2. Add redirect URI:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
3. Add to authorized origins:
   ```
   https://rishabh008009.github.io
   ```

#### Step 2: Update Supabase Auth
1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `https://rishabh008009.github.io/subsentry-tracker`
3. **Redirect URLs**: Add:
   ```
   https://rishabh008009.github.io/subsentry-tracker
   https://rishabh008009.github.io/subsentry-tracker/**
   ```

#### Step 3: Push to GitHub
```bash
git add .
git commit -m "Add Supabase backend integration"
git push origin main
```

#### Step 4: Enable GitHub Pages
1. Repository → Settings → Pages
2. Source: Deploy from branch `main`
3. Folder: `/ (root)`
4. Save

#### Step 5: Test Production
1. Visit: `https://rishabh008009.github.io/subsentry-tracker/`
2. Click "Continue with Google"
3. Sign in and test all features

---

### Option 2: Vercel (Recommended for Production)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
vercel
```

Follow prompts:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: subsentry-tracker
- Directory: ./
- Override settings: No

#### Step 3: Add Environment Variables
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

#### Step 4: Update OAuth
Add Vercel URL to:
- Google Cloud Console redirect URIs
- Supabase Auth redirect URLs

#### Step 5: Deploy Production
```bash
vercel --prod
```

---

### Option 3: Netlify

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Deploy
```bash
netlify deploy
```

#### Step 3: Configure
- Build command: (leave empty)
- Publish directory: ./
- Add environment variables in Netlify dashboard

#### Step 4: Deploy to Production
```bash
netlify deploy --prod
```

---

## 🔐 Security Checklist

### Before Going Live
- [ ] All API keys in environment variables (not in code)
- [ ] `.env` file in `.gitignore`
- [ ] Row Level Security tested
- [ ] OAuth redirect URIs match production domain
- [ ] HTTPS enabled (automatic on GitHub Pages/Vercel/Netlify)
- [ ] Email verification enabled in Supabase
- [ ] Rate limiting configured (if needed)

### Supabase Security Settings
1. Dashboard → Settings → API
2. **Enable email confirmations**: Yes
3. **Disable public user registration**: No (we want sign-ups)
4. **JWT expiry**: 3600 seconds (1 hour)

---

## 📧 Email Service Setup (Optional)

### Option A: Resend (Easiest)
1. Sign up: [resend.com](https://resend.com)
2. Verify domain (or use resend.dev for testing)
3. Get API key
4. Add to Supabase Edge Function secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your_key
   ```

### Option B: Gmail API
1. Enable Gmail API in Google Cloud
2. Create service account
3. Download credentials JSON
4. Add to Supabase secrets

### Option C: SendGrid
1. Sign up: [sendgrid.com](https://sendgrid.com)
2. Verify sender email
3. Get API key
4. Add to Supabase secrets

---

## 🧪 Post-Deployment Testing

### Test Checklist
```javascript
// 1. Authentication
✓ Google sign-in works
✓ User profile created in database
✓ Session persists on refresh
✓ Sign out works

// 2. Subscriptions
✓ Can create subscription
✓ Subscription appears in list
✓ Can view subscription details
✓ Can update subscription
✓ Can delete subscription
✓ Statistics update correctly

// 3. Reminders
✓ Can set reminder
✓ Reminder appears in list
✓ Email sends (if configured)

// 4. Settings
✓ Can view settings
✓ Can update settings
✓ Changes persist

// 5. Security
✓ Can't see other users' data
✓ Can't modify other users' data
✓ Unauthenticated users redirected to login
```

---

## 📊 Monitoring & Maintenance

### Set Up Monitoring
1. **Supabase Dashboard**
   - Monitor API usage
   - Check database size
   - Review logs for errors

2. **Google Analytics** (Optional)
   - Add tracking code to `index.html`
   - Monitor user behavior

3. **Error Tracking** (Optional)
   - Sentry: [sentry.io](https://sentry.io)
   - LogRocket: [logrocket.com](https://logrocket.com)

### Regular Maintenance
- [ ] Check Supabase usage weekly
- [ ] Review error logs
- [ ] Update dependencies monthly
- [ ] Backup database (automatic in Supabase)
- [ ] Test critical flows monthly

---

## 🔄 Update Workflow

### Making Changes
```bash
# 1. Make changes locally
# 2. Test thoroughly
# 3. Commit changes
git add .
git commit -m "Description of changes"

# 4. Push to GitHub
git push origin main

# 5. Verify deployment
# GitHub Pages auto-deploys in 1-2 minutes
```

### Database Changes
```bash
# 1. Write migration SQL
# 2. Test in Supabase SQL Editor
# 3. Save to migrations folder
# 4. Apply to production
supabase db push
```

---

## 🚨 Rollback Plan

### If Something Breaks

#### Front-End Issue
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

#### Database Issue
1. Supabase Dashboard → Database → Backups
2. Restore from previous backup
3. Or run rollback SQL

#### Auth Issue
1. Check OAuth credentials
2. Verify redirect URIs
3. Check Supabase auth logs

---

## 📈 Scaling Considerations

### When to Upgrade Supabase

**Free Tier Limits:**
- 500 MB database
- 1 GB storage
- 2 GB bandwidth/month
- 500K edge function calls/month

**Upgrade to Pro ($25/mo) when:**
- Database > 400 MB
- Bandwidth > 1.5 GB/month
- Need daily backups
- Want custom domain

### Performance Optimization
- [ ] Enable caching for static data
- [ ] Optimize database queries
- [ ] Add indexes for slow queries
- [ ] Use CDN for assets
- [ ] Implement pagination for large lists

---

## 🎯 Launch Checklist

### Final Steps Before Launch
- [ ] All features tested in production
- [ ] Error handling works
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] SEO meta tags added
- [ ] Favicon added
- [ ] Privacy policy page (if collecting data)
- [ ] Terms of service page
- [ ] Contact/support email set up

### Marketing Prep
- [ ] Screenshots taken
- [ ] Demo video recorded
- [ ] README updated with live link
- [ ] Social media posts prepared
- [ ] Product Hunt submission ready

---

## 🎉 You're Ready to Launch!

### Your Live URLs
- **App**: https://rishabh008009.github.io/subsentry-tracker/
- **GitHub**: https://github.com/rishabh008009/subsentry-tracker
- **Supabase**: https://app.supabase.com/project/YOUR_PROJECT_REF

### Share Your App
```markdown
🎉 Introducing SubSentry!

A simple, beautiful subscription tracker that helps you stay in control of your recurring payments.

✨ Features:
- Track all subscriptions in one place
- Get reminders before renewals
- See total monthly/yearly spending
- Clean, intuitive interface

🔗 Try it: https://rishabh008009.github.io/subsentry-tracker/

Built with Supabase + Vanilla JS
```

---

**Congratulations! Your full-stack app is live! 🚀**
