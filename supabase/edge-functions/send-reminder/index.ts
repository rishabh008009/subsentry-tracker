// Supabase Edge Function: Send Reminder Email
// Triggers automated reminder emails for upcoming subscriptions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get request body
    const { subscription_id, reminder_id } = await req.json()

    // Fetch subscription and user details
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select(`
        *,
        users!inner(name, email)
      `)
      .eq('id', subscription_id)
      .single()

    if (subError) throw subError

    // Fetch reminder details
    const { data: reminder, error: remError } = await supabaseClient
      .from('reminders')
      .select('*')
      .eq('id', reminder_id)
      .single()

    if (remError) throw remError

    // Generate email content using AI (optional - using Gemini API)
    const emailContent = await generateReminderEmail(
      subscription.users.name,
      subscription.name,
      subscription.amount,
      subscription.currency,
      subscription.next_billing_date,
      reminder.custom_message
    )

    // Send email via Gmail API or SMTP
    const emailSent = await sendEmail(
      subscription.users.email,
      `Reminder: ${subscription.name} subscription renewing soon`,
      emailContent
    )

    if (emailSent) {
      // Update reminder status
      await supabaseClient
        .from('reminders')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', reminder_id)

      return new Response(
        JSON.stringify({ success: true, message: 'Reminder sent successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      throw new Error('Failed to send email')
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Generate reminder email using AI
async function generateReminderEmail(
  userName: string,
  subscriptionName: string,
  amount: number,
  currency: string,
  billingDate: string,
  customMessage?: string
): Promise<string> {
  // Option 1: Use Gemini API for AI-generated content
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
  
  if (GEMINI_API_KEY) {
    const prompt = `Write a friendly, professional reminder email for ${userName} about their ${subscriptionName} subscription. 
    The subscription costs ${currency} ${amount} and will renew on ${billingDate}. 
    ${customMessage ? `Include this personal note: ${customMessage}` : ''}
    Keep it concise, supportive, and empowering. Use a calm tone.`

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      )

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Gemini API error:', error)
      // Fall back to template
    }
  }

  // Option 2: Use template (fallback)
  return `
    <html>
      <body style="font-family: Inter, sans-serif; color: #1A1A1A; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4A90E2;">Hi ${userName},</h2>
          
          <p>Just a friendly reminder that your <strong>${subscriptionName}</strong> subscription is coming up for renewal.</p>
          
          <div style="background: #E8F4FD; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Amount:</strong> ${currency} ${amount}</p>
            <p style="margin: 10px 0 0 0;"><strong>Renewal Date:</strong> ${new Date(billingDate).toLocaleDateString()}</p>
          </div>
          
          ${customMessage ? `<p style="background: #F8F9FA; padding: 15px; border-left: 3px solid #4A90E2; margin: 20px 0;">${customMessage}</p>` : ''}
          
          <p>You're all set! This is just a heads-up so you can stay in control of your spending.</p>
          
          <p style="color: #6B6B6B; font-size: 14px; margin-top: 30px;">
            Sent with care from SubSentry 🔔<br>
            <a href="#" style="color: #4A90E2;">Manage your subscriptions</a>
          </p>
        </div>
      </body>
    </html>
  `
}

// Send email via Gmail API or SMTP
async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  // Option 1: Use Gmail API (requires OAuth setup)
  // Option 2: Use SendGrid, Resend, or other email service
  // Option 3: Use SMTP
  
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'SubSentry <reminders@subsentry.app>',
          to: [to],
          subject: subject,
          html: htmlContent
        })
      })

      return response.ok
    } catch (error) {
      console.error('Email send error:', error)
      return false
    }
  }

  // For development: Log email instead of sending
  console.log('Email would be sent to:', to)
  console.log('Subject:', subject)
  console.log('Content:', htmlContent)
  
  return true // Return true for development
}
