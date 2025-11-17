// Supabase Client Configuration for SubSentry
// Connect your front-end to Supabase backend

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase Configuration
// TODO: Replace these with your actual Supabase project credentials
// Get these from: Supabase Dashboard → Settings → API
const SUPABASE_URL = 'https://gkgehpwtwboovbpjlrll.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY' // TODO: Replace with your actual anon key

// Check if credentials are configured
if (SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY' || SUPABASE_ANON_KEY.includes('...')) {
  console.warn('⚠️ Supabase credentials not configured. Get your anon key from: https://app.supabase.com/project/gkgehpwtwboovbpjlrll/settings/api');
  throw new Error('Supabase not configured');
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Authentication Functions
export const auth = {
  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database Functions
export const db = {
  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Get all subscriptions for current user
  async getSubscriptions() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        users!inner(id, name, email)
      `)
      .order('next_billing_date', { ascending: true })

    return { data, error }
  },

  // Get single subscription
  async getSubscription(id) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Add new subscription
  async addSubscription(subscription) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    // Get user's internal ID
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        ...subscription,
        user_id: userData.id
      }])
      .select()
      .single()

    return { data, error }
  },

  // Update subscription
  async updateSubscription(id, updates) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  },

  // Delete subscription
  async deleteSubscription(id) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)

    return { error }
  },

  // Get user statistics
  async getUserStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    const { data, error } = await supabase
      .rpc('get_user_stats', { p_user_id: userData.id })

    return { data, error }
  },

  // Get reminders for user
  async getReminders() {
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        subscriptions(name, amount, next_billing_date)
      `)
      .order('scheduled_date', { ascending: true })

    return { data, error }
  },

  // Add reminder
  async addReminder(reminder) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('reminders')
      .insert([{
        ...reminder,
        user_id: userData.id
      }])
      .select()
      .single()

    return { data, error }
  },

  // Get user settings
  async getSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userData.id)
      .single()

    return { data, error }
  },

  // Update settings
  async updateSettings(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('settings')
      .update(updates)
      .eq('user_id', userData.id)
      .select()
      .single()

    return { data, error }
  },

  // Update subscription statuses (call this periodically)
  async updateSubscriptionStatuses() {
    const { error } = await supabase.rpc('update_subscription_status')
    return { error }
  }
}

// Real-time subscriptions
export const realtime = {
  // Subscribe to subscription changes
  subscribeToSubscriptions(callback) {
    return supabase
      .channel('subscriptions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions'
      }, callback)
      .subscribe()
  },

  // Subscribe to reminder changes
  subscribeToReminders(callback) {
    return supabase
      .channel('reminders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reminders'
      }, callback)
      .subscribe()
  }
}
