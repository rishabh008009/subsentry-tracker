# SubSentry Deployment Guide

## 🚀 Quick Start (Local)

1. **Open the app**:
   - Simply double-click `index.html` in your file browser
   - Or right-click → Open With → Your preferred browser

2. **Test the flow**:
   - Start at Login screen
   - Click "Continue with Google" or "Sign In with Email"
   - Explore the dashboard with sample data
   - Try adding a new subscription
   - Set a reminder
   - Check out settings

## 📦 File Structure

```
subsentry/
├── index.html          # Main HTML entry point
├── styles.css          # Complete styling system
├── app.js              # Application logic & navigation
├── README.md           # Product overview & PRD summary
├── SCREENS.md          # Detailed screen documentation
├── MICROCOPY.md        # Voice, tone & copy guidelines
└── DEPLOYMENT.md       # This file
```

## 🌐 Deploy to Web

### Option 1: Netlify (Recommended)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your app is live! (e.g., `subsentry.netlify.app`)

### Option 2: Vercel
1. Create account at [vercel.com](https://vercel.com)
2. Import your project
3. Deploy with one click

### Option 3: GitHub Pages
1. Create a GitHub repository
2. Push your files:
   ```bash
   git init
   git add .
   git commit -m "Initial SubSentry build"
   git branch -M main
   git remote add origin [your-repo-url]
   git push -u origin main
   ```
3. Enable GitHub Pages in repository settings
4. Select `main` branch as source

### Option 4: Any Static Host
Upload these files to any web server:
- index.html
- styles.css
- app.js

No build process or server-side code required!

## 🔧 Customization

### Change Colors
Edit `styles.css` root variables (lines 9-18):
```css
:root {
    --primary-blue: #4A90E2;    /* Your brand color */
    --light-blue: #E8F4FD;      /* Accent color */
    /* ... */
}
```

### Add Real Data
Replace sample data in `app.js` (lines 6-12):
```javascript
subscriptions: [
    // Add your actual subscription data
]
```

### Connect Backend
The app is ready for API integration:
1. Replace `app.subscriptions` with API calls
2. Add authentication logic in login screen
3. Connect form submissions to your backend
4. Implement real reminder scheduling

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance

- **Load Time**: < 1 second (no dependencies)
- **File Size**: ~48KB total (uncompressed)
- **No Build Required**: Pure HTML/CSS/JS
- **Offline Ready**: Can be enhanced with Service Worker

## 🔐 Security Notes

Current implementation:
- ⚠️ Client-side only (no real authentication)
- ⚠️ Data stored in memory (resets on refresh)

For production:
- ✅ Add real authentication (OAuth, JWT)
- ✅ Connect to secure backend API
- ✅ Implement HTTPS
- ✅ Add CSRF protection
- ✅ Sanitize user inputs

## 🧪 Testing Checklist

- [ ] Login screen displays correctly
- [ ] Dashboard shows sample subscriptions
- [ ] Can add new subscription
- [ ] Can view subscription details
- [ ] Can set reminders
- [ ] Confirmation screen appears
- [ ] Settings page loads
- [ ] Navigation works between all screens
- [ ] Responsive on mobile (< 768px)
- [ ] Buttons have hover states
- [ ] Forms validate required fields
- [ ] Back buttons work correctly

## 📊 Analytics Integration

Add tracking to key actions:
```javascript
// Example: Google Analytics
function trackEvent(action, label) {
    gtag('event', action, {
        'event_category': 'Subscriptions',
        'event_label': label
    });
}

// Call on actions:
trackEvent('add_subscription', subscriptionName);
trackEvent('set_reminder', subscriptionName);
```

## 🐛 Troubleshooting

### Styles not loading
- Check that `styles.css` is in the same folder as `index.html`
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)

### JavaScript not working
- Check browser console for errors (F12)
- Ensure `app.js` is in the same folder
- Verify file names match exactly (case-sensitive)

### Mobile layout issues
- Test in responsive mode (F12 → Device toolbar)
- Check viewport meta tag is present in HTML

## 🎨 Design Assets

All icons are emoji-based (no external dependencies):
- 🔔 SubSentry logo
- 📊 Dashboard
- ➕ Add
- ⚙️ Settings
- 🎬 Netflix
- 🎵 Spotify
- 🎨 Adobe
- 💪 Gym
- ☁️ Cloud

To use custom icons:
1. Replace emojis with SVG or icon font
2. Update CSS for icon sizing
3. Maintain accessibility labels

## 📈 Next Steps

### Phase 2 Features
- [ ] Backend API integration
- [ ] Real authentication
- [ ] Database persistence
- [ ] Email/SMS reminders
- [ ] Export to CSV
- [ ] Spending analytics charts
- [ ] Multi-currency support
- [ ] Dark mode toggle
- [ ] Recurring payment detection

### Enhancement Ideas
- Calendar view of upcoming payments
- Budget alerts when spending exceeds threshold
- Subscription recommendations
- Price change notifications
- Sharing with family members
- Receipt storage

## 💡 Support

For questions or issues:
1. Check `SCREENS.md` for screen details
2. Review `MICROCOPY.md` for copy guidelines
3. Refer to `README.md` for product overview

---

**Built with ❤️ for financial peace of mind**
