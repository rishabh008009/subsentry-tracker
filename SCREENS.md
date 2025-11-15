# SubSentry Screen Guide

## 🔐 Screen 1: Login/Signup
**Purpose**: Welcome users and authenticate
**Key Elements**:
- SubSentry logo (🔔)
- "Welcome to SubSentry" headline
- Google authentication button with icon
- Email sign-in alternative
- Calm gradient background (light blue to white)

**CTA**: "Continue with Google" or "Sign In with Email"

---

## 📊 Screen 2: Dashboard (Home)
**Purpose**: Overview of all subscriptions and spending
**Key Elements**:
- Sidebar navigation (Dashboard, Add Subscription, Settings)
- Welcome message: "You're all caught up — great job!"
- Three stat cards:
  - Total Monthly: $137.96
  - Active Subscriptions: 4
  - Due Soon: 1
- Overdue alert section (if applicable)
- Subscription list with icons, amounts, and status badges
- Each item shows: Icon, Name, Frequency, Next billing date, Amount, Status badge, "Set Reminder" button

**CTA**: "+ Add Subscription" (top right)

---

## ➕ Screen 3: Create Subscription
**Purpose**: Add new recurring payment
**Key Elements**:
- Back button to Dashboard
- Form fields:
  - Subscription Name (required)
  - Amount (required)
  - Billing Frequency dropdown (Weekly/Monthly/Quarterly/Yearly)
  - Next Billing Date (date picker)
  - Icon (emoji input)
  - Notes (optional textarea)
- Form validation with focus states

**CTAs**: "Cancel" (secondary) | "Add Subscription" (primary, right-aligned)

---

## 🔍 Screen 4: Subscription Detail View
**Purpose**: Deep dive into single subscription
**Key Elements**:
- Back button to Dashboard
- Subscription header with icon and name
- Three stat cards:
  - Monthly/Weekly Cost
  - Annual Cost (calculated)
  - Next Billing Date
- Information section showing:
  - Status badge
  - Billing frequency
  - Amount per cycle
- Action buttons: "Edit Subscription" | "Delete Subscription" (red)

**CTA**: "Set Reminder" (top right)

---

## ⏰ Screen 5: Reminder Setup
**Purpose**: Schedule billing notifications
**Key Elements**:
- Back button to Detail view
- Form fields:
  - Remind me before billing (dropdown: 1/3/7/14 days)
  - Notification method (Email/Push/Both)
  - Custom message (optional)
- Preview box showing:
  - "📧 Preview"
  - Calculated reminder date
  - Subscription details

**CTAs**: "Cancel" (secondary) | "Set Reminder" (primary)

---

## ✅ Screen 6: Confirmation
**Purpose**: Success feedback
**Key Elements**:
- Large green checkmark icon in circle
- "All Set!" headline
- Confirmation message: "Your reminder has been scheduled successfully..."
- Auto-navigation hint

**CTA**: "Back to Dashboard" (full width)

---

## ⚙️ Screen 7: Settings/Profile
**Purpose**: Manage account and preferences
**Key Elements**:
- Sidebar navigation (Settings active)
- Four sections with icons:
  
  **👤 Profile**
  - Name: Priya Kumar (Edit button)
  - Email: priya.kumar@email.com (Edit button)
  
  **🔔 Notifications**
  - Email Notifications (toggle switch - ON)
  - Push Notifications (toggle switch - ON)
  - Default Reminder Time (dropdown: 3 days)
  
  **💰 Preferences**
  - Currency (dropdown: USD)
  - Theme (dropdown: Light/Dark/Auto)
  
  **🔒 Security**
  - Change Password (button)
  - Two-Factor Authentication (Enable button)
  
  **ℹ️ About**
  - Version: v1.0.0
  - Help & Support (Contact button)

**Navigation**: Accessible from sidebar

---

## 🎨 Consistent Elements Across All Screens

### Header Navigation
- Logo: 🔔 SubSentry (top left in sidebar)
- Active state: Light blue background with blue border

### Buttons
- Primary: Blue background, white text, rounded 12px
- Secondary: White background, blue border, blue text
- Hover: Slight lift (translateY -2px) with shadow

### Cards
- White background
- 16px border radius
- Soft shadow (0 2px 8px rgba(0,0,0,0.08))
- Hover: Enhanced shadow and lift

### Typography
- H1: 32px, weight 600
- H2: 24px, weight 600
- Body: 14-16px, weight 400
- All text: Inter font family

### Colors
- Primary White: #FFFFFF
- Primary Blue: #4A90E2
- Light Blue: #E8F4FD
- Text Primary: #1A1A1A
- Text Secondary: #6B6B6B
- Success Green: #4CAF50
- Warning Orange: #FF9800
- Error Red: #F44336

### Spacing
- Card padding: 24-32px
- Section gaps: 24-32px
- Form field gaps: 24px
- Button padding: 12px 24px

### Accessibility
- All interactive elements keyboard accessible
- Minimum contrast ratio: 4.5:1
- Focus states visible with blue outline
- Descriptive labels for screen readers
