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
    const slackMessage = await req.json()

    // Get Slack webhook URL from environment variables
    const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL')
    
    if (!slackWebhookUrl) {
      throw new Error('Slack webhook URL not configured')
    }

    // Send message to Slack
    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    })

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text()
      throw new Error(`Slack API error: ${errorText}`)
    }

    const result = await slackResponse.text()

    return new Response(
      JSON.stringify({ success: true, response: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending Slack message:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
