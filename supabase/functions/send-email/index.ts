import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html } = await req.json()

    // Email configuration - you'll need to set these as environment variables
    const emailService = Deno.env.get('EMAIL_SERVICE') || 'resend' // or 'sendgrid', 'mailgun', etc.
    const apiKey = Deno.env.get('EMAIL_API_KEY')
    
    if (!apiKey) {
      throw new Error('Email API key not configured')
    }

    let emailResponse

    switch (emailService) {
      case 'resend':
        emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Arkansas Ankle Monitor <noreply@anklemonitor.us>',
            to: [to],
            subject: subject,
            html: html,
          }),
        })
        break

      case 'sendgrid':
        emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: 'noreply@anklemonitor.us', name: 'Arkansas Ankle Monitor' },
            subject: subject,
            content: [{ type: 'text/html', value: html }],
          }),
        })
        break

      default:
        throw new Error(`Unsupported email service: ${emailService}`)
    }

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email service error: ${errorText}`)
    }

    const result = await emailResponse.json()

    return new Response(
      JSON.stringify({ success: true, messageId: result.id || result.message_id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
