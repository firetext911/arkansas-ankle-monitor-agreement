import { supabase } from '../lib/supabase'

// Agreement Submissions API
export const AgreementSubmission = {
  // Create a new agreement submission
  async create(data) {
    const { data: result, error } = await supabase
      .from('agreement_submissions')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  },

  // Get agreement by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('agreement_submissions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Update agreement
  async update(id, updates) {
    const { data, error } = await supabase
      .from('agreement_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Filter agreements (replaces the Base44 filter method)
  async filter(filters = {}) {
    let query = supabase.from('agreement_submissions').select('*')
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Get all agreements with pagination
  async getAll(page = 0, limit = 50) {
    const from = page * limit
    const to = from + limit - 1
    
    const { data, error, count } = await supabase
      .from('agreement_submissions')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, count }
  },

  // Delete agreement
  async delete(id) {
    const { error } = await supabase
      .from('agreement_submissions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// File Uploads API
export const FileUpload = {
  // Upload file to Supabase Storage
  async uploadFile(file, agreementId, category = 'document') {
    // Validate file object
    if (!file || !file.name) {
      throw new Error('Invalid file object: file or file.name is missing')
    }
    
    const fileExt = file.name.split('.').pop() || 'bin'
    const fileName = `${agreementId}/${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('agreement-files')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('agreement-files')
      .getPublicUrl(fileName)
    
    // Save file metadata to database
    const fileRecord = {
      agreement_id: agreementId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_url: urlData.publicUrl,
      file_category: category
    }
    
    const { data, error } = await supabase
      .from('file_uploads')
      .insert([fileRecord])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get files for an agreement
  async getByAgreementId(agreementId) {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('agreement_id', agreementId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Delete file
  async delete(id) {
    // Get file info first
    const { data: fileData, error: fetchError } = await supabase
      .from('file_uploads')
      .select('file_url')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    // Extract file path from URL
    const url = new URL(fileData.file_url)
    const filePath = url.pathname.split('/').slice(-2).join('/')
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('agreement-files')
      .remove([filePath])
    
    if (storageError) throw storageError
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('file_uploads')
      .delete()
      .eq('id', id)
    
    if (dbError) throw dbError
    return true
  }
}

// Audit Logs API
export const AuditLog = {
  // Get audit logs for an agreement
  async getByAgreementId(agreementId) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('agreement_id', agreementId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create audit log entry
  async create(logData) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([logData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Statistics API
export const Statistics = {
  // Get dashboard statistics
  async getDashboardStats() {
    const { data: agreements, error: agreementsError } = await supabase
      .from('agreement_submissions')
      .select('status, created_at')
    
    if (agreementsError) throw agreementsError
    
    const stats = {
      total: agreements.length,
      draft: agreements.filter(a => a.status === 'draft').length,
      signed: agreements.filter(a => a.status === 'signed').length,
      submitted: agreements.filter(a => a.status === 'submitted').length,
      completed: agreements.filter(a => a.status === 'completed').length,
      thisMonth: agreements.filter(a => {
        const created = new Date(a.created_at)
        const now = new Date()
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      }).length
    }
    
    return stats
  }
}
