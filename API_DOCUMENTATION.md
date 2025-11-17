# SubSentry API Documentation
Complete reference for all backend endpoints and functions

## 🔐 Authentication

All API calls require authentication via Supabase session token.

### Sign In with Google
```javascript
const { data, error } = await auth.signInWithGoogle()
```

**Response:**
```json
{
  "data": {
    "provider": "google",
    "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

### Sign Out
```javascript
const { error } = await auth.signOut()
```

### Get Current User
```javascript
const { user, error } = await auth.getCurrentUser()
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "user_metadata": {
      "name": "John Doe",
      "avatar_url": "https://..."
    }
  }
}
```

---

## 📊 Subscriptions API

### GET /subscriptions
Fetch all subscriptions for authenticated user

```javascript
const { data, error } = await db.getSubscriptions()
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Netflix",
      "icon": "🎬",
      "amount": 15.99,
      "currency": "USD",
      "frequency": "Monthly",
      "next_billing_date": "2025-11-20",
      "status": "active",
      "notes": "Premium plan",
      "created_at": "2025-11-01T00:00:00Z",
      "updated_at": "2025-11-01T00:00:00Z"
    }
  ]
}
```

**Status Values:**
- `active` - More than 3 days until billing
- `due-soon` - Within 3 days of billing
- `overdue` - Past billing date
- `cancelled` - User cancelled

### GET /subscriptions/:id
Fetch single subscription

```javascript
const { data, error } = await db.getSubscription(subscriptionId)
```

### POST /subscriptions
Create new subscription

```javascript
const { data, error } = await db.addSubscription({
  name: 'Netflix',
  icon: '🎬',
  amount: 15.99,
  currency: 'USD',
  frequency: 'Monthly',
  next_billing_date: '2025-12-01',
  notes: 'Premium plan'
})
```

**Required Fields:**
- `name` (string)
- `amount` (number)
- `frequency` (Weekly|Monthly|Quarterly|Yearly)
- `next_billing_date` (date)

**Optional Fields:**
- `icon` (emoji, default: '📦')
- `currency` (default: 'USD')
- `notes` (text)

### PUT /subscriptions/:id
Update subscription

```javascript
const { data, error } = await db.updateSubscription(id, {
  amount: 17.99,
  status: 'cancelled'
})
```

### DELETE /subscriptions/:id
Delete subscription

```javascript
const { error } = await db.deleteSubscription(id)
```

---

## 📈 Statistics API

### GET /stats
Get user spending statistics

```javascript
const { data, error } = await db.getUserStats()
```

**Response:**
```json
{
  "data": {
    "total_monthly": 137.96,
    "total_yearly": 1655.52,
    "active_count": 4,
    "due_soon_count": 1,
    "overdue_count": 0
  }
}
```

**Calculations:**
- `total_monthly` - Sum of all subscriptions normalized to monthly
- `total_yearly` - Sum of all subscriptions normalized to yearly
- `active_count` - Subscriptions with status 'active'
- `due_soon_count` - Subscriptions with status 'due-soon'
- `overdue_count` - Subscriptions with status 'overdue'

---

## ⏰ Reminders API

### GET /reminders
Fetch all reminders for user

```javascript
const { data, error } = await db.getReminders()
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "subscription_id": "uuid",
      "user_id": "uuid",
      "scheduled_date": "2025-11-17",
      "days_before": 3,
      "notification_method": "email",
      "custom_message": "Don't forget!",
      "status": "pending",
      "sent_at": null,
      "subscriptions": {
        "name": "Netflix",
        "amount": 15.99,
        "next_billing_date": "2025-11-20"
      }
    }
  ]
}
```

### POST /reminders
Create new reminder

```javascript
const { data, error } = await db.addReminder({
  subscription_id: 'uuid',
  scheduled_date: '2025-11-17',
  days_before: 3,
  notification_method: 'email',
  custom_message: 'Optional personal note'
})
```

**Required Fields:**
- `subscription_id` (uuid)
- `scheduled_date` (date)
- `days_before` (integer)

**Optional Fields:**
- `notification_method` (email|push|both, default: 'email')
- `custom_message` (text)

### POST /send-reminder (Edge Function)
Manually trigger reminder email

```javascript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/send-reminder',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subscription_id: 'uuid',
      reminder_id: 'uuid'
    })
  }
)
```

---

## ⚙️ Settings API

### GET /settings
Fetch user settings

```javascript
const { data, error } = await db.getSettings()
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "email_notifications": true,
    "push_notifications": true,
    "default_reminder_days": 3,
    "currency": "USD",
    "theme": "light",
    "created_at": "2025-11-01T00:00:00Z",
    "updated_at": "2025-11-01T00:00:00Z"
  }
}
```

### PUT /settings
Update user settings

```javascript
const { data, error } = await db.updateSettings({
  email_notifications: false,
  default_reminder_days: 7,
  theme: 'dark'
})
```

**Available Fields:**
- `email_notifications` (boolean)
- `push_notifications` (boolean)
- `default_reminder_days` (1|3|7|14)
- `currency` (USD|EUR|GBP|INR)
- `theme` (light|dark|auto)

---

## 💳 Payment History API

### GET /payment-history
Fetch payment history

```javascript
const { data, error } = await supabase
  .from('payment_history')
  .select('*')
  .order('payment_date', { ascending: false })
```

### POST /payment-history
Record payment

```javascript
const { data, error } = await supabase
  .from('payment_history')
  .insert([{
    subscription_id: 'uuid',
    amount: 15.99,
    payment_date: '2025-11-01',
    status: 'completed',
    notes: 'Paid via credit card'
  }])
```

---

## 🔄 Real-time Subscriptions

### Subscribe to Subscription Changes
```javascript
const subscription = realtime.subscribeToSubscriptions((payload) => {
  console.log('Change received!', payload)
  // payload.eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  // payload.new: new row data
  // payload.old: old row data
})

// Unsubscribe when done
subscription.unsubscribe()
```

### Subscribe to Reminder Changes
```javascript
const subscription = realtime.subscribeToReminders((payload) => {
  console.log('Reminder updated!', payload)
})
```

---

## 🛠️ Utility Functions

### Update Subscription Statuses
Automatically updates all subscription statuses based on billing dates

```javascript
const { error } = await db.updateSubscriptionStatuses()
```

**Logic:**
- Sets `overdue` if `next_billing_date < today`
- Sets `due-soon` if `next_billing_date` within 3 days
- Sets `active` if `next_billing_date > 3 days away`

**Recommended:** Call this on app load and every 24 hours

---

## 🚨 Error Handling

All API calls return an error object if something goes wrong:

```javascript
const { data, error } = await db.getSubscriptions()

if (error) {
  console.error('Error:', error.message)
  // Handle error
} else {
  // Use data
}
```

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| `PGRST116` | Not authenticated | User needs to sign in |
| `PGRST301` | Row level security | Check RLS policies |
| `23505` | Unique constraint | Duplicate entry |
| `23503` | Foreign key violation | Referenced record doesn't exist |
| `42501` | Insufficient privilege | Check permissions |

---

## 📊 Rate Limits

### Free Tier
- **API Requests**: Unlimited
- **Database Queries**: Unlimited
- **Edge Functions**: 500K invocations/month
- **Bandwidth**: 2 GB/month

### Best Practices
- Cache frequently accessed data
- Use real-time subscriptions instead of polling
- Batch operations when possible
- Implement client-side pagination

---

## 🔐 Security Headers

All requests should include:

```javascript
headers: {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY
}
```

---

## 📝 Example: Complete Flow

```javascript
// 1. Sign in
const { data: authData } = await auth.signInWithGoogle()

// 2. Get user session
const { session } = await auth.getSession()

// 3. Fetch subscriptions
const { data: subscriptions } = await db.getSubscriptions()

// 4. Get statistics
const { data: stats } = await db.getUserStats()

// 5. Add new subscription
const { data: newSub } = await db.addSubscription({
  name: 'Spotify',
  amount: 9.99,
  frequency: 'Monthly',
  next_billing_date: '2025-12-01'
})

// 6. Set reminder
const { data: reminder } = await db.addReminder({
  subscription_id: newSub.id,
  scheduled_date: '2025-11-28',
  days_before: 3,
  notification_method: 'email'
})

// 7. Update settings
await db.updateSettings({
  default_reminder_days: 7
})
```

---

## 🧪 Testing

### Test in Browser Console
```javascript
// Import client
import { auth, db } from './lib/supabase-client.js'

// Test authentication
const user = await auth.getCurrentUser()
console.log('Current user:', user)

// Test database
const subs = await db.getSubscriptions()
console.log('Subscriptions:', subs)

// Test stats
const stats = await db.getUserStats()
console.log('Stats:', stats)
```

### Test with Postman
1. Get session token from browser DevTools
2. Use in Authorization header
3. Make requests to Supabase REST API

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Edge Functions**: https://supabase.com/docs/guides/functions
- **Real-time**: https://supabase.com/docs/guides/realtime

---

**Last Updated**: November 2025
**API Version**: 1.0.0
