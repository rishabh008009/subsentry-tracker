-- SubSentry Sample Data
-- Seed database with test data for development

-- Note: This assumes you have a test user authenticated
-- Replace the user_id values with actual UUIDs from your auth.users table

-- Insert sample user (for testing only)
-- In production, users are created via Google OAuth
insert into public.users (id, auth_id, name, email, avatar_url) values
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Priya Kumar', 'priya.kumar@example.com', null)
on conflict (email) do nothing;

-- Insert sample subscriptions
insert into public.subscriptions (user_id, name, icon, amount, currency, frequency, next_billing_date, status, notes) values
  ('550e8400-e29b-41d4-a716-446655440000', 'Netflix', '🎬', 15.99, 'USD', 'Monthly', '2025-11-20', 'active', 'Premium plan'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Spotify', '🎵', 9.99, 'USD', 'Monthly', '2025-11-18', 'due-soon', 'Individual plan'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Adobe Creative Cloud', '🎨', 54.99, 'USD', 'Monthly', '2025-11-25', 'active', 'All apps'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Gym Membership', '💪', 45.00, 'USD', 'Monthly', '2025-11-12', 'overdue', 'Local gym'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Cloud Storage', '☁️', 11.99, 'USD', 'Monthly', '2025-11-22', 'active', 'Google Drive 2TB');

-- Insert sample reminders
insert into public.reminders (subscription_id, user_id, scheduled_date, days_before, notification_method, status) values
  ((select id from public.subscriptions where name = 'Netflix' limit 1), '550e8400-e29b-41d4-a716-446655440000', '2025-11-17', 3, 'email', 'pending'),
  ((select id from public.subscriptions where name = 'Spotify' limit 1), '550e8400-e29b-41d4-a716-446655440000', '2025-11-15', 3, 'both', 'pending');

-- Insert sample settings
insert into public.settings (user_id, email_notifications, push_notifications, default_reminder_days, currency, theme) values
  ('550e8400-e29b-41d4-a716-446655440000', true, true, 3, 'USD', 'light')
on conflict (user_id) do nothing;

-- Insert sample payment history
insert into public.payment_history (subscription_id, user_id, amount, payment_date, status) values
  ((select id from public.subscriptions where name = 'Netflix' limit 1), '550e8400-e29b-41d4-a716-446655440000', 15.99, '2025-10-20', 'completed'),
  ((select id from public.subscriptions where name = 'Spotify' limit 1), '550e8400-e29b-41d4-a716-446655440000', 9.99, '2025-10-18', 'completed');
