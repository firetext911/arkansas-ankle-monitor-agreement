-- Create agreement_submissions table with all required fields (SAFE VERSION)
-- Run this SQL in your Supabase SQL Editor

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_agreement_submissions_updated_at ON agreement_submissions;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS agreement_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic info
  status TEXT DEFAULT 'draft',
  recordId TEXT,
  
  -- Agent/Installer info
  installer_name TEXT,
  installer_phone TEXT,
  device_number TEXT,
  dispatch_confirmed BOOLEAN DEFAULT false,
  court_name TEXT,
  county TEXT,
  dispatch_representative TEXT,
  
  -- Financial info
  weekly_rate NUMERIC DEFAULT 0,
  install_removal_fee NUMERIC DEFAULT 0,
  amount_collected NUMERIC DEFAULT 0,
  payment_type TEXT DEFAULT 'self_pay',
  first_invoice_amount NUMERIC DEFAULT 0,
  coverage_through_date DATE,
  next_invoice_amount NUMERIC DEFAULT 0,
  next_invoice_date DATE,
  next_invoice_due_date DATE,
  
  -- Participant info
  full_name TEXT,
  dob DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'Arkansas',
  zip TEXT,
  ssn TEXT,
  
  -- Installation info
  install_date DATE,
  install_time TIME,
  
  -- Signatures
  signature_png TEXT,
  guardian_signature_png TEXT,
  guardian_printed_name TEXT,
  guardian_relationship TEXT,
  agent_signature_png TEXT,
  
  -- Files
  uploaded_files JSONB DEFAULT '[]',
  
  -- Dates
  signed_date DATE,
  
  -- Acknowledgments
  ack_abide_restrictions BOOLEAN DEFAULT false,
  init_abide_restrictions TEXT,
  ack_payments_advance BOOLEAN DEFAULT false,
  init_payments_advance TEXT,
  ack_charge_maintain BOOLEAN DEFAULT false,
  init_charge_maintain TEXT,
  ack_gps_tracking BOOLEAN DEFAULT false,
  init_gps_tracking TEXT,
  ack_no_tamper BOOLEAN DEFAULT false,
  init_no_tamper TEXT,
  ack_rules_explained BOOLEAN DEFAULT false,
  init_rules_explained TEXT,
  ack_equipment_liability BOOLEAN DEFAULT false,
  init_equipment_liability TEXT,
  ack_weekly_rate_terms BOOLEAN DEFAULT false,
  init_weekly_rate_terms TEXT,
  ack_revocation_conditions BOOLEAN DEFAULT false,
  init_revocation_conditions TEXT,
  
  -- Audit metadata
  audit_metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE agreement_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view agreement_submissions" ON agreement_submissions;
DROP POLICY IF EXISTS "Authenticated users can create agreement_submissions" ON agreement_submissions;
DROP POLICY IF EXISTS "Authenticated users can update agreement_submissions" ON agreement_submissions;

-- Create RLS Policies for agreement_submissions
CREATE POLICY "Authenticated users can view agreement_submissions" ON agreement_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create agreement_submissions" ON agreement_submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update agreement_submissions" ON agreement_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_agreement_submissions_updated_at 
  BEFORE UPDATE ON agreement_submissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_created_at ON agreement_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_status ON agreement_submissions(status);
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_full_name ON agreement_submissions(full_name);
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_device_number ON agreement_submissions(device_number);
CREATE INDEX IF NOT EXISTS idx_agreement_submissions_installer_name ON agreement_submissions(installer_name);
