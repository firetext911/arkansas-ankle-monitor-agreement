# 📧 PDF Export, Email & Slack Integration Setup

## ✅ **What's Been Implemented**

I've added comprehensive PDF export, email notifications, and Slack integration to your Arkansas Ankle Monitor Agreement system.

### **🔧 New Features Added:**

1. **PDF Generation** - Automatic PDF creation for agreements
2. **Email Notifications** - Sends to `contact@anklemonitor.us`
3. **Slack Notifications** - Sends formatted messages to your Slack channel
4. **Supabase Edge Functions** - Serverless functions for email and Slack

## 📁 **New Files Created:**

- `src/api/pdfGenerator.js` - PDF generation and notification functions
- `supabase/functions/send-email/index.ts` - Email sending Edge Function
- `supabase/functions/send-slack/index.ts` - Slack notification Edge Function

## 🚀 **Setup Instructions**

### **Step 1: Deploy Edge Functions**

```bash
# Deploy email function
npx supabase functions deploy send-email

# Deploy Slack function
npx supabase functions deploy send-slack
```

### **Step 2: Configure Email Service**

Choose one of these email services:

#### **Option A: Resend (Recommended)**
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Set environment variables in Supabase:
   ```bash
   npx supabase secrets set EMAIL_SERVICE=resend
   npx supabase secrets set EMAIL_API_KEY=your_resend_api_key
   ```

#### **Option B: SendGrid**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Set environment variables in Supabase:
   ```bash
   npx supabase secrets set EMAIL_SERVICE=sendgrid
   npx supabase secrets set EMAIL_API_KEY=your_sendgrid_api_key
   ```

### **Step 3: Configure Slack Integration**

1. Go to your Slack workspace
2. Create a new app or use an existing one
3. Enable Incoming Webhooks
4. Create a webhook URL
5. Set environment variable in Supabase:
   ```bash
   npx supabase secrets set SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

### **Step 4: Update PDF Generation (Optional)**

The current PDF generation creates a basic HTML template. For production, you might want to:

1. **Use Puppeteer** for better PDF generation:
   ```bash
   npm install puppeteer
   ```

2. **Use a PDF service** like PDFShift or HTML/CSS to PDF API

3. **Use jsPDF** for client-side PDF generation

## 📧 **Email Notifications**

When an agreement is submitted, an email is automatically sent to `contact@anklemonitor.us` with:

- ✅ Participant information
- ✅ Agent details
- ✅ Device number and court
- ✅ Direct link to download PDF
- ✅ Link to admin dashboard

## 💬 **Slack Notifications**

Slack messages include:

- ✅ Formatted header with emoji
- ✅ All key agreement details
- ✅ Download PDF button
- ✅ View Admin Dashboard button
- ✅ Clean, professional formatting

## 🔧 **Configuration Options**

### **Email Template Customization**
Edit `src/api/pdfGenerator.js` to customize:
- Email subject line
- Email content and formatting
- Recipient email address

### **Slack Message Customization**
Edit the `sendSlackNotification` function to customize:
- Message formatting
- Button text and URLs
- Channel or user targeting

### **PDF Template Customization**
Edit the `createPDFTemplate` function to customize:
- PDF layout and styling
- Information included
- Branding and colors

## 🎯 **How It Works**

1. **User submits agreement** → Form data saved to Supabase
2. **PDF generated** → HTML template converted to PDF
3. **PDF uploaded** → Stored in Supabase Storage
4. **Email sent** → Notification to contact@anklemonitor.us
5. **Slack notified** → Message sent to your Slack channel
6. **User sees success** → PDF opens in new tab

## 🧪 **Testing**

### **Test Email Function:**
```bash
curl -X POST 'https://mafpgmercmlzeusdjxuq.supabase.co/functions/v1/send-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test Email</h1>"
  }'
```

### **Test Slack Function:**
```bash
curl -X POST 'https://mafpgmercmlzeusdjxuq.supabase.co/functions/v1/send-slack' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Test Slack Message"
  }'
```

## 🚨 **Important Notes**

1. **Environment Variables** - Make sure to set all required secrets in Supabase
2. **Email Service** - Choose one email service and configure it properly
3. **Slack Webhook** - Ensure your Slack webhook URL is correct
4. **PDF Generation** - Current implementation is basic; consider upgrading for production
5. **Error Handling** - Email/Slack failures won't break the agreement submission

## 🎉 **Benefits**

- ✅ **Automatic notifications** - No manual work required
- ✅ **Professional PDFs** - Clean, formatted agreement documents
- ✅ **Team collaboration** - Slack keeps everyone informed
- ✅ **Email records** - All agreements sent to contact@anklemonitor.us
- ✅ **Scalable** - Uses Supabase Edge Functions for reliability

## 🔄 **Next Steps**

1. Deploy the Edge Functions
2. Configure your email service
3. Set up Slack webhook
4. Test the complete flow
5. Customize templates as needed

Your Arkansas Ankle Monitor Agreement system now has professional-grade PDF export, email notifications, and Slack integration! 🚀
