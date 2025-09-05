-- Arkansas Ankle Monitor Agreement Database Schema
-- This file contains all the necessary tables and fields for the ankle monitor agreement system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agreement_submissions table (main table)
CREATE TABLE IF NOT EXISTS agreement_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'submitted', 'completed')),
    
    -- Agent/Installer Information
    installer_name VARCHAR(255) NOT NULL,
    device_number VARCHAR(8) NOT NULL CHECK (device_number ~ '^[0-9]{8}$'),
    dispatch_confirmed BOOLEAN DEFAULT FALSE,
    court_name VARCHAR(255) NOT NULL,
    
    -- Financial Information
    weekly_rate DECIMAL(10,2) DEFAULT 80.00,
    install_removal_fee DECIMAL(10,2) DEFAULT 100.00,
    amount_collected DECIMAL(10,2) DEFAULT 0.00,
    payment_type VARCHAR(20) DEFAULT 'self_pay' CHECK (payment_type IN ('self_pay', 'agency_pay')),
    
    -- Participant Information
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) DEFAULT 'Arkansas',
    zip VARCHAR(10) NOT NULL,
    ssn VARCHAR(11), -- Format: XXX-XX-XXXX
    
    -- Signature Data (Base64 encoded PNG)
    signature_png TEXT,
    guardian_signature_png TEXT,
    guardian_printed_name VARCHAR(255),
    guardian_relationship VARCHAR(100),
    agent_signature_png TEXT,
    
    -- File uploads (JSON array of file metadata)
    uploaded_files JSONB DEFAULT '[]'::jsonb,
    
    -- Dates
    signed_date DATE DEFAULT CURRENT_DATE,
    
    -- Audit metadata
    audit_metadata JSONB,
    
    -- Acknowledgment fields
    ack_abide_restrictions BOOLEAN DEFAULT FALSE,
    init_abide_restrictions VARCHAR(10),
    ack_payments_advance BOOLEAN DEFAULT FALSE,
    init_payments_advance VARCHAR(10),
    ack_charge_maintain BOOLEAN DEFAULT FALSE,
    init_charge_maintain VARCHAR(10),
    ack_gps_tracking BOOLEAN DEFAULT FALSE,
    init_gps_tracking VARCHAR(10),
    ack_no_tamper BOOLEAN DEFAULT FALSE,
    init_no_tamper VARCHAR(10),
    ack_rules_explained BOOLEAN DEFAULT FALSE,
    init_rules_explained VARCHAR(10),
    ack_equipment_liability BOOLEAN DEFAULT FALSE,
    init_equipment_liability VARCHAR(10),
    ack_weekly_rate_terms BOOLEAN DEFAULT FALSE,
    init_weekly_rate_terms VARCHAR(10),
    ack_revocation_conditions BOOLEAN DEFAULT FALSE,
    init_revocation_conditions VARCHAR(10)
);

-- Create file_uploads table for better file management
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agreement_id UUID REFERENCES agreement_submissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- File information
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    file_category VARCHAR(50), -- e.g., 'photo', 'document', 'id'
    
    -- Metadata
    uploaded_by VARCHAR(255),
    description TEXT
);

-- Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agreement_id UUID REFERENCES agreement_submissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Action details
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'signed', 'submitted'
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    
    -- User/System info
    user_agent TEXT,
    ip_address INET,
    user_id VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_status ON agreement_submissions(status);
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_device_number ON agreement_submissions(device_number);
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_installer_name ON agreement_submissions(installer_name);
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_created_at ON agreement_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_file_uploads_agreement_id ON file_uploads(agreement_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_agreement_id ON audit_logs(agreement_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_agreement_submissions_updated_at 
    BEFORE UPDATE ON agreement_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_agreement_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (agreement_id, action, new_value, user_agent, ip_address)
        VALUES (NEW.id, 'created', 'Record created', 
                current_setting('request.headers', true)::json->>'user-agent',
                inet_client_addr());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log significant field changes
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO audit_logs (agreement_id, action, field_name, old_value, new_value)
            VALUES (NEW.id, 'status_changed', 'status', OLD.status, NEW.status);
        END IF;
        
        IF OLD.signature_png IS DISTINCT FROM NEW.signature_png AND NEW.signature_png IS NOT NULL THEN
            INSERT INTO audit_logs (agreement_id, action, field_name)
            VALUES (NEW.id, 'signed', 'signature_png');
        END IF;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for audit logging
CREATE TRIGGER audit_agreement_submissions
    AFTER INSERT OR UPDATE ON agreement_submissions
    FOR EACH ROW EXECUTE FUNCTION log_agreement_changes();

-- Create RLS (Row Level Security) policies
ALTER TABLE agreement_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy for agreement_submissions (allow all operations for now - adjust based on your auth needs)
CREATE POLICY "Allow all operations on agreement_submissions" ON agreement_submissions
    FOR ALL USING (true);

-- Policy for file_uploads
CREATE POLICY "Allow all operations on file_uploads" ON file_uploads
    FOR ALL USING (true);

-- Policy for audit_logs (read-only for most users)
CREATE POLICY "Allow read access to audit_logs" ON audit_logs
    FOR SELECT USING (true);

-- Create a view for easy querying of agreement data with file counts
CREATE OR REPLACE VIEW agreement_summary AS
SELECT 
    a.*,
    COUNT(f.id) as file_count,
    MAX(f.created_at) as last_file_upload
FROM agreement_submissions a
LEFT JOIN file_uploads f ON a.id = f.agreement_id
GROUP BY a.id;
