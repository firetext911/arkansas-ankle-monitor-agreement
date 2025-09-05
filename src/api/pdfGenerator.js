import { supabase } from '../lib/supabase'

/**
 * PDF Generation Service
 * Generates PDF agreements and handles email/Slack notifications
 */

// Generate PDF for an agreement
export async function generateAgreementPDF(agreementId) {
  try {
    // Get agreement data
    const { data: agreement, error } = await supabase
      .from('agreement_submissions')
      .select('*')
      .eq('id', agreementId)
      .single()

    if (error) throw error

    // Create PDF content (you can customize this template)
    const pdfContent = createPDFTemplate(agreement)
    
    // For now, we'll create a simple PDF using a service
    // In production, you might want to use Puppeteer, jsPDF, or a service like PDFShift
    const pdfBlob = await generatePDFBlob(pdfContent)
    
    // Upload to Supabase Storage
    const fileName = `agreement-${agreementId}-${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('agreement-files')
      .upload(`pdfs/${fileName}`, pdfBlob, {
        contentType: 'application/pdf'
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('agreement-files')
      .getPublicUrl(`pdfs/${fileName}`)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

// Create PDF template content
function createPDFTemplate(agreement) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Arkansas Ankle Monitor Agreement</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .signature-section { margin-top: 40px; }
        .signature-box { border: 1px solid #ccc; height: 100px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Arkansas Ankle Monitor Agreement</h1>
        <p>Agreement ID: ${agreement.id}</p>
        <p>Date: ${new Date(agreement.created_at).toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Agent Information</h2>
        <div class="field"><span class="label">Agent Name:</span> ${agreement.installer_name}</div>
        <div class="field"><span class="label">Device Number:</span> ${agreement.device_number}</div>
        <div class="field"><span class="label">Court Name:</span> ${agreement.court_name}</div>
      </div>

      <div class="section">
        <h2>Participant Information</h2>
        <div class="field"><span class="label">Full Name:</span> ${agreement.full_name}</div>
        <div class="field"><span class="label">Date of Birth:</span> ${agreement.dob}</div>
        <div class="field"><span class="label">Phone:</span> ${agreement.phone}</div>
        <div class="field"><span class="label">Address:</span> ${agreement.address}</div>
        <div class="field"><span class="label">City:</span> ${agreement.city}</div>
        <div class="field"><span class="label">State:</span> ${agreement.state}</div>
        <div class="field"><span class="label">ZIP:</span> ${agreement.zip}</div>
      </div>

      <div class="section">
        <h2>Financial Information</h2>
        <div class="field"><span class="label">Weekly Rate:</span> $${agreement.weekly_rate}</div>
        <div class="field"><span class="label">Install/Removal Fee:</span> $${agreement.install_removal_fee}</div>
        <div class="field"><span class="label">Payment Type:</span> ${agreement.payment_type}</div>
      </div>

      <div class="signature-section">
        <h2>Signatures</h2>
        <div class="field">
          <span class="label">Participant Signature:</span>
          <div class="signature-box"></div>
        </div>
        ${agreement.guardian_signature_png ? `
        <div class="field">
          <span class="label">Guardian Signature:</span>
          <div class="signature-box"></div>
        </div>
        ` : ''}
        <div class="field">
          <span class="label">Agent Signature:</span>
          <div class="signature-box"></div>
        </div>
      </div>

      <div class="section">
        <p><strong>Status:</strong> ${agreement.status}</p>
        <p><strong>Signed Date:</strong> ${agreement.signed_date}</p>
      </div>
    </body>
    </html>
  `
}

// Generate PDF blob (placeholder - you'll need to implement actual PDF generation)
async function generatePDFBlob(htmlContent) {
  // This is a placeholder. In production, you would:
  // 1. Use Puppeteer to convert HTML to PDF
  // 2. Use jsPDF to create PDF programmatically
  // 3. Use a service like PDFShift, HTML/CSS to PDF API, etc.
  
  // For now, return a simple text blob
  const textContent = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return new Blob([textContent], { type: 'text/plain' })
}

// Send email notification
export async function sendAgreementEmail(agreementId, pdfUrl) {
  try {
    const { data: agreement } = await supabase
      .from('agreement_submissions')
      .select('*')
      .eq('id', agreementId)
      .single()

    const emailData = {
      to: 'contact@anklemonitor.us',
      subject: `New Ankle Monitor Agreement - ${agreement.full_name}`,
      html: `
        <h2>New Ankle Monitor Agreement Submitted</h2>
        <p><strong>Participant:</strong> ${agreement.full_name}</p>
        <p><strong>Agent:</strong> ${agreement.installer_name}</p>
        <p><strong>Device Number:</strong> ${agreement.device_number}</p>
        <p><strong>Court:</strong> ${agreement.court_name}</p>
        <p><strong>Date:</strong> ${new Date(agreement.created_at).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${agreement.status}</p>
        
        <h3>Download Agreement PDF</h3>
        <p><a href="${pdfUrl}" target="_blank">Download PDF Agreement</a></p>
        
        <h3>View in Admin Dashboard</h3>
        <p><a href="${window.location.origin}/Admin" target="_blank">View Admin Dashboard</a></p>
      `
    }

    // Call Supabase Edge Function for email sending
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Send Slack notification
export async function sendSlackNotification(agreementId, pdfUrl) {
  try {
    const { data: agreement } = await supabase
      .from('agreement_submissions')
      .select('*')
      .eq('id', agreementId)
      .single()

    const slackMessage = {
      text: `New Ankle Monitor Agreement Submitted`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🔔 New Ankle Monitor Agreement"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Participant:*\n${agreement.full_name}`
            },
            {
              type: "mrkdwn",
              text: `*Agent:*\n${agreement.installer_name}`
            },
            {
              type: "mrkdwn",
              text: `*Device Number:*\n${agreement.device_number}`
            },
            {
              type: "mrkdwn",
              text: `*Court:*\n${agreement.court_name}`
            },
            {
              type: "mrkdwn",
              text: `*Date:*\n${new Date(agreement.created_at).toLocaleDateString()}`
            },
            {
              type: "mrkdwn",
              text: `*Status:*\n${agreement.status}`
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
                text: "Download PDF"
              },
              url: pdfUrl,
              style: "primary"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Admin Dashboard"
              },
              url: `${window.location.origin}/Admin`
            }
          ]
        }
      ]
    }

    // Call Supabase Edge Function for Slack notification
    const { data, error } = await supabase.functions.invoke('send-slack', {
      body: slackMessage
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending Slack notification:', error)
    throw error
  }
}
