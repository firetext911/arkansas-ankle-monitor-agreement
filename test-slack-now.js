#!/usr/bin/env node

/**
 * Test Slack integration right now
 */

const testSlackIntegration = async () => {
  try {
    console.log('🧪 Testing Slack Integration...\n');
    
    // Your Supabase function URL
    const functionUrl = 'https://mafpgmercmlzeusdjxuq.supabase.co/functions/v1/send-slack';
    
    // Test message that mimics what would be sent for a real agreement
    const testMessage = {
      text: "🧪 Test: Arkansas Ankle Monitor Agreement System",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🧪 Slack Integration Test"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "This is a test message from your Arkansas Ankle Monitor Agreement system to verify Slack integration is working correctly! 🎉"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: "*System:*\nArkansas Ankle Monitor Agreement"
            },
            {
              type: "mrkdwn",
              text: "*Test Type:*\nIntegration Verification"
            },
            {
              type: "mrkdwn",
              text: "*Time:*\n" + new Date().toLocaleString()
            },
            {
              type: "mrkdwn",
              text: "*Status:*\n✅ Connected"
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*What this means:*\nWhen someone submits an ankle monitor agreement, you'll receive a similar notification with all the agreement details, PDF download link, and admin dashboard access."
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Live App"
              },
              url: "https://arkansas-ankle-monitor-agreement-mgq7a3ej0-fire-text-dispatch.vercel.app",
              style: "primary"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Admin Dashboard"
              },
              url: "https://arkansas-ankle-monitor-agreement-mgq7a3ej0-fire-text-dispatch.vercel.app/Admin"
            }
          ]
        }
      ]
    };
    
    console.log('📤 Sending test message to Slack...');
    console.log('🔗 Function URL:', functionUrl);
    console.log('📝 Message preview:', testMessage.text);
    
    // Try without auth first (some functions allow public access)
    let response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    let result = await response.json();
    
    if (response.ok) {
      console.log('✅ Slack test successful!');
      console.log('📋 Response:', result);
      console.log('\n🎉 Check your Slack channel - you should see the test message!');
    } else {
      console.log('❌ Test failed without auth. Trying with anon key...');
      
      // Try with a generic anon key (this might work for public functions)
      response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZnBnZXJjbWx6ZXVzZGpxdXEiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNTU2NDQ0MCwiZXhwIjoyMDQxMTQwNDQwfQ.8QZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMessage)
      });
      
      result = await response.json();
      
      if (response.ok) {
        console.log('✅ Slack test successful with anon key!');
        console.log('📋 Response:', result);
        console.log('\n🎉 Check your Slack channel - you should see the test message!');
      } else {
        console.log('❌ Slack test failed!');
        console.log('📋 Error:', result);
        console.log('\n🔧 You may need to:');
        console.log('1. Get your actual Supabase anon key from: https://mafpgmercmlzeusdjxuq.supabase.co');
        console.log('2. Go to Settings > API');
        console.log('3. Copy the "anon public" key');
        console.log('4. Update this script with the real key');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your Slack webhook URL is correct');
    console.log('2. Check that the Edge Function is deployed');
    console.log('3. Verify the webhook is active in your Slack app');
  }
};

console.log('🚀 Arkansas Ankle Monitor - Slack Integration Test');
console.log('================================================\n');

testSlackIntegration();
