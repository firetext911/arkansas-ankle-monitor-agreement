import { AgreementSubmission, FileUpload, AuditLog } from './supabaseClient'

// Replace the Base44 saveInstallerStep function
export const saveInstallerStep = async (data) => {
  try {
    let result
    
    if (data.recordId) {
      // Update existing record
      result = await AgreementSubmission.update(data.recordId, data)
    } else {
      // Create new record
      result = await AgreementSubmission.create(data)
    }
    
    return { data: result }
  } catch (error) {
    console.error('Error saving installer step:', error)
    throw error
  }
}

// Replace the Base44 submitAgreementToComply function
export const submitAgreementToComply = async (data) => {
  try {
    // Update the agreement status to 'signed'
    const updatedData = {
      ...data,
      status: 'signed',
      signed_date: new Date().toISOString().split('T')[0]
    }
    
    const result = await AgreementSubmission.update(data.id, updatedData)
    
    // Log the submission
    await AuditLog.create({
      agreement_id: data.id,
      action: 'submitted',
      new_value: 'Agreement submitted to comply system'
    })
    
    // Generate PDF URL
    const pdfUrl = await generateAgreementPDF(data.id)
    
    // Send email notification
    try {
      await sendAgreementEmail(data.id, pdfUrl)
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
      // Don't fail the whole process if email fails
    }
    
    // Send Slack notification via email
    try {
      await sendSlackEmailNotification(data.id, pdfUrl)
    } catch (slackError) {
      console.error('Slack email notification failed:', slackError)
      // Don't fail the whole process if Slack email fails
    }
    
    return {
      data: {
        success: true,
        id: result.id,
        pdfUrl: pdfUrl
      }
    }
  } catch (error) {
    console.error('Error submitting agreement:', error)
    throw error
  }
}

// Replace the Base44 renderAgreementPdf function
export const renderAgreementPdf = async (agreementId) => {
  try {
    // Get agreement data
    const agreement = await AgreementSubmission.getById(agreementId)
    
    if (!agreement) {
      throw new Error('Agreement not found')
    }
    
    // Generate PDF URL
    const pdfUrl = await generateAgreementPDF(agreementId)
    
    return {
      data: {
        success: true,
        pdfUrl: pdfUrl
      }
    }
  } catch (error) {
    console.error('Error rendering PDF:', error)
    throw error
  }
}

// Import PDF generator
import { generateAgreementPDF, sendAgreementEmail, sendSlackEmailNotification } from './pdfGenerator'

// Additional utility functions for the ankle monitor system

// Get agreement with all related data
export const getAgreementWithFiles = async (agreementId) => {
  try {
    const agreement = await AgreementSubmission.getById(agreementId)
    const files = await FileUpload.getByAgreementId(agreementId)
    const auditLogs = await AuditLog.getByAgreementId(agreementId)
    
    return {
      agreement,
      files,
      auditLogs
    }
  } catch (error) {
    console.error('Error getting agreement with files:', error)
    throw error
  }
}

// Update agreement status
export const updateAgreementStatus = async (agreementId, status) => {
  try {
    const result = await AgreementSubmission.update(agreementId, { status })
    
    await AuditLog.create({
      agreement_id: agreementId,
      action: 'status_changed',
      field_name: 'status',
      new_value: status
    })
    
    return { data: result }
  } catch (error) {
    console.error('Error updating agreement status:', error)
    throw error
  }
}

// Search agreements
export const searchAgreements = async (searchParams) => {
  try {
    const { data, error } = await supabase
      .from('agreement_submissions')
      .select('*')
      .or(`full_name.ilike.%${searchParams.query}%,device_number.ilike.%${searchParams.query}%,installer_name.ilike.%${searchParams.query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data }
  } catch (error) {
    console.error('Error searching agreements:', error)
    throw error
  }
}

// Get agreements by installer
export const getAgreementsByInstaller = async (installerName) => {
  try {
    const { data, error } = await supabase
      .from('agreement_submissions')
      .select('*')
      .eq('installer_name', installerName)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data }
  } catch (error) {
    console.error('Error getting agreements by installer:', error)
    throw error
  }
}

// Get agreements by date range
export const getAgreementsByDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('agreement_submissions')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data }
  } catch (error) {
    console.error('Error getting agreements by date range:', error)
    throw error
  }
}
