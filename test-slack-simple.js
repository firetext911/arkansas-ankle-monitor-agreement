#!/usr/bin/env node

/**
 * Simple Slack test - you just need to add your anon key
 */

const testSlack = async () => {
  // 🔑 REPLACE THIS WITH YOUR ACTUAL SUPABASE ANON KEY
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZnBnbWVyY21semV1c2RqeHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDEwNDAsImV4cCI6MjA3MjY3NzA0MH0.CLY9X-QuRcqZJ65207xxO7YjL-kZrrDlAo9_GfhAuY8';
  
  if (ANON_KEY === 'REPLACE_WITH_YOUR_ANON_KEY') {
    console.log('🔑 Please get your Supabase anon key first:');
    console.log('1. Go to: https://mafpgmercmlzeusdjxuq.supabase.co');
    console.log('2. Click "Settings" → "API"');
    console.log('3. Copy the "anon public" key');
    console.log('4. Replace REPLACE_WITH_YOUR_ANON_KEY in this file');
    console.log('5. Run: node test-slack-simple.js');
    return;
  }
  
  const functionUrl = 'https://mafpgmercmlzeusdjxuq.supabase.co/functions/v1/send-slack';
  
  const testMessage = {
    text: "🧪 Arkansas Ankle Monitor - Slack Test",
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
          text: "Your Arkansas Ankle Monitor Agreement system is now connected to Slack! 🎉"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*System:*\nArkansas Ankle Monitor"
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
          }
        ]
      }
    ]
  };
  
  try {
    console.log('📤 Sending test to Slack...');
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS! Check your Slack channel!');
      console.log('📋 Response:', result);
    } else {
      console.log('❌ Failed:', result);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testSlack();
