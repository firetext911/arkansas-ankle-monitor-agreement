#!/usr/bin/env node

/**
 * Test Slack integration
 */

const testSlackIntegration = async () => {
  try {
    console.log('🧪 Testing Slack Integration...\n');
    
    // You'll need to get your actual anon key from Supabase Settings > API
    const anonKey = 'YOUR_SUPABASE_ANON_KEY_HERE';
    const functionUrl = 'https://mafpgmercmlzeusdjxuq.supabase.co/functions/v1/send-slack';
    
    const testMessage = {
      text: "🚀 Arkansas Ankle Monitor Agreement system is now connected to Slack!",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "✅ Slack Integration Test"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Your Arkansas Ankle Monitor Agreement system is now successfully connected to Slack! 🎉"
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
              text: "*Status:*\n✅ Connected"
            },
            {
              type: "mrkdwn",
              text: "*Test Time:*\n" + new Date().toLocaleString()
            },
            {
              type: "mrkdwn",
              text: "*Environment:*\nProduction"
            }
          ]
        }
      ]
    };
    
    console.log('📤 Sending test message to Slack...');
    console.log('🔗 Function URL:', functionUrl);
    console.log('📝 Message:', JSON.stringify(testMessage, null, 2));
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Slack test successful!');
      console.log('📋 Response:', result);
    } else {
      console.log('❌ Slack test failed!');
      console.log('📋 Error:', result);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

console.log('🔧 Slack Integration Test');
console.log('========================\n');
console.log('To test your Slack integration:');
console.log('1. Get your Supabase anon key from: https://mafpgmercmlzeusdjxuq.supabase.co');
console.log('2. Go to Settings > API');
console.log('3. Copy the "anon public" key');
console.log('4. Replace `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZnBnbWVyY21semV1c2RqeHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDEwNDAsImV4cCI6MjA3MjY3NzA0MH0.CLY9X-QuRcqZJ65207xxO7YjL-kZrrDlAo9_GfhAuY8` in this file');
console.log('5. Run: node test-slack.js\n');

// Uncomment the line below to run the test
// testSlackIntegration();
