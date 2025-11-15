# SubSentry Testing Guide

## 🧪 Manual Testing Flow

### Test 1: Complete User Journey
**Time**: ~3 minutes

1. **Login** → Click "Continue with Google"
2. **Dashboard** → Verify you see:
   - Total Monthly: $137.96
   - 5 sample subscriptions
   - 1 overdue item (Gym Membership)
3. **Add Subscription** → Click "+ Add Subscription"
   - Fill form with test data
   - Click "Add Subscription"
   - Verify return to dashboard with new item
4. **View Details** → Click any subscription
   - Verify annual cost calculation
   - Check all details display correctly
5. **Set Reminder** → Click "Set Reminder"
   - Select reminder preferences
   - Click "Set Reminder"
   - Verify confirmation screen
6. **Settings** → Navigate to Settings
   - Toggle notification switches
   - Change dropdown values
   - Verify all sections load

**Expected Result**: Smooth navigation, no errors, all data displays correctly

---

### Test 2: Form Validation
**Time**: ~2 minutes

1. Navigate to "Add Subscription"
2. Try submitting empty form
   - **Expected**: Browser validation prevents submission
3. Fill only name field, submit
   - **Expected**: Amount field shows validation error
4. Enter negative amount
   - **Expected**: Browser prevents negative numbers
5. Select past date for billing
   - **Expected**: Form accepts (would need backend validation)
6. Fill all required fields correctly
   - **Expected**: Subscription added successfully

---

### Test 3: Navigation & Back Buttons
**Time**: ~2 minutes

1. Dashboard → Create → Back button → Dashboard ✓
2. Dashboard → Detail → Back button → Dashboard ✓
3. Detail → Reminder → Back button → Detail ✓
4. Reminder → Cancel button → Detail ✓
5. Sidebar navigation works from any screen ✓

**Expected Result**: No broken navigation, always return to correct screen

---

### Test 4: Responsive Design
**Time**: ~2 minutes

1. Open browser DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Test at different widths:
   - **375px** (iPhone SE): Mobile layout
   - **768px** (iPad): Tablet layout
   - **1440px** (Desktop): Full layout

**Check**:
- [ ] Sidebar collapses on mobile
- [ ] Stats cards stack vertically
- [ ] Forms remain usable
- [ ] Buttons don't overflow
- [ ] Text remains readable (min 14px)

---

### Test 5: Accessibility
**Time**: ~3 minutes

1. **Keyboard Navigation**:
   - Tab through all interactive elements
   - Enter/Space activates buttons
   - Forms are keyboard accessible

2. **Screen Reader** (Optional):
   - Enable VoiceOver (Mac) or NVDA (Windows)
   - Navigate through dashboard
   - Verify labels are descriptive

3. **Color Contrast**:
   - Check text on backgrounds
   - Verify button states are visible
   - Ensure status badges are distinguishable

4. **Focus States**:
   - Tab through forms
   - Verify blue outline appears on focus

---

### Test 6: Interactive Elements
**Time**: ~2 minutes

1. **Buttons**:
   - [ ] Hover shows elevation effect
   - [ ] Click provides feedback
   - [ ] Disabled state (if applicable)

2. **Forms**:
   - [ ] Input focus shows blue border
   - [ ] Dropdowns open correctly
   - [ ] Date picker works
   - [ ] Textarea resizes

3. **Cards**:
   - [ ] Hover shows shadow increase
   - [ ] Click navigates correctly

4. **Toggles** (Settings):
   - [ ] Switch animates smoothly
   - [ ] State persists during session

---

### Test 7: Edge Cases
**Time**: ~3 minutes

1. **Empty States**:
   - Delete all subscriptions (in code)
   - Verify empty state message appears
   - "Add Your First Subscription" button works

2. **Long Text**:
   - Add subscription with very long name
   - Verify text doesn't break layout
   - Check truncation or wrapping

3. **Large Numbers**:
   - Add subscription with amount $9999.99
   - Verify formatting remains correct

4. **Special Characters**:
   - Add subscription with emoji in name
   - Verify displays correctly

---

## 🐛 Known Limitations (By Design)

### Data Persistence
- ❌ Data resets on page refresh
- ✅ This is expected (no backend yet)
- 💡 Future: Add localStorage or backend API

### Authentication
- ❌ Login buttons don't actually authenticate
- ✅ This is a front-end prototype
- 💡 Future: Integrate OAuth or JWT

### Reminders
- ❌ No actual email/push notifications sent
- ✅ UI flow is complete
- 💡 Future: Connect to notification service

### Delete Confirmation
- ⚠️ Uses browser confirm() dialog
- 💡 Future: Custom modal component

---

## ✅ Success Criteria

### Visual Design
- [x] Matches brand guidelines (white, blue, Inter font)
- [x] Consistent spacing and alignment
- [x] Rounded corners (12-16px)
- [x] Soft shadows on cards
- [x] Smooth transitions (0.2-0.3s)

### Functionality
- [x] All 7 screens render correctly
- [x] Navigation works between screens
- [x] Forms accept and validate input
- [x] Sample data displays properly
- [x] Interactive elements respond to clicks

### User Experience
- [x] Supportive, calm tone in copy
- [x] Clear CTAs on every screen
- [x] Maximum 3 clicks to any action
- [x] Loading states (where applicable)
- [x] Success confirmations

### Accessibility
- [x] Keyboard navigable
- [x] Sufficient color contrast (4.5:1)
- [x] Descriptive labels
- [x] Focus indicators visible
- [x] Responsive on mobile

### Performance
- [x] Loads in < 1 second
- [x] No external dependencies
- [x] Smooth animations
- [x] No console errors

---

## 🎯 Browser Testing Matrix

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Primary |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Supported |
| Mobile Safari | iOS 14+ | ✅ Supported |
| Chrome Mobile | Latest | ✅ Supported |

---

## 📊 Performance Benchmarks

### Load Time
- **Target**: < 1 second
- **Actual**: ~200-300ms (local)
- **Status**: ✅ Excellent

### File Sizes
- HTML: 0.6 KB
- CSS: 11.9 KB
- JS: 31.3 KB
- **Total**: ~44 KB (uncompressed)
- **Status**: ✅ Lightweight

### Interactions
- **Button hover**: < 200ms
- **Screen transition**: 300ms
- **Form submission**: Instant
- **Status**: ✅ Smooth

---

## 🔍 Visual Regression Checklist

Compare against design specs:

### Colors
- [ ] Primary blue: #4A90E2
- [ ] Light blue: #E8F4FD
- [ ] White: #FFFFFF
- [ ] Text primary: #1A1A1A
- [ ] Text secondary: #6B6B6B

### Typography
- [ ] Font family: Inter
- [ ] H1: 32px, weight 600
- [ ] H2: 24px, weight 600
- [ ] Body: 14-16px, weight 400

### Spacing
- [ ] Card padding: 24-32px
- [ ] Section gaps: 24-32px
- [ ] Button padding: 12px 24px

### Borders
- [ ] Border radius: 12-16px
- [ ] Border color: #E0E0E0
- [ ] Border width: 1-2px

---

## 🚨 Critical Bugs to Watch For

### High Priority
- [ ] Navigation breaks between screens
- [ ] Forms don't submit
- [ ] Styles don't load
- [ ] JavaScript errors in console
- [ ] Mobile layout completely broken

### Medium Priority
- [ ] Hover states don't work
- [ ] Focus states invisible
- [ ] Text overflow issues
- [ ] Alignment problems
- [ ] Color contrast too low

### Low Priority
- [ ] Animation timing off
- [ ] Minor spacing inconsistencies
- [ ] Icon alignment slightly off
- [ ] Tooltip positioning

---

## 📝 Test Report Template

```
Date: [Date]
Tester: [Name]
Browser: [Browser + Version]
Device: [Desktop/Mobile]

✅ Passed Tests:
- [List passed tests]

❌ Failed Tests:
- [List failed tests with details]

🐛 Bugs Found:
- [Bug description, severity, steps to reproduce]

💡 Suggestions:
- [Improvement ideas]

Overall Status: [Pass/Fail/Needs Work]
```

---

## 🎓 Testing Tips

1. **Clear Cache**: Always test with cleared cache (Cmd+Shift+R)
2. **Console Open**: Keep DevTools console open to catch errors
3. **Multiple Browsers**: Test in at least 2 different browsers
4. **Real Devices**: Test on actual mobile device if possible
5. **Slow Connection**: Throttle network to test loading states
6. **Zoom Levels**: Test at 100%, 125%, 150% zoom
7. **Dark Mode**: Check if OS dark mode affects appearance

---

**Happy Testing! 🎉**
