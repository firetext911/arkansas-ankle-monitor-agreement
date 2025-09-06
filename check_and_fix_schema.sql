-- Check and fix the agreement_submissions table schema
-- Run this SQL in your Supabase SQL Editor

-- First, let's see what tables exist
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agreement_submissions' 
ORDER BY ordinal_position;

-- Check if the table exists at all
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'agreement_submissions'
);

-- If the table doesn't exist or is missing columns, let's recreate it properly
DROP TABLE IF EXISTS agreement_submissions CASCADE;

-- Create the complete agreement_submissions table
CREATE TABLE agreement_submissions (
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

-- Create RLS Policies
CREATE POLICY "Public can insert agreement_submissions" ON agreement_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can select agreement_submissions" ON agreement_submissions
  FOR SELECT USING (true);

CREATE POLICY "Public can update agreement_submissions" ON agreement_submissions
  FOR UPDATE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_agreement_submissions_updated_at 
  BEFORE UPDATE ON agreement_submissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_agreement_submissions_created_at ON agreement_submissions(created_at DESC);
CREATE INDEX idx_agreement_submissions_status ON agreement_submissions(status);
CREATE INDEX idx_agreement_submissions_full_name ON agreement_submissions(full_name);
CREATE INDEX idx_agreement_submissions_device_number ON agreement_submissions(device_number);
CREATE INDEX idx_agreement_submissions_installer_name ON agreement_submissions(installer_name);

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'agreement_submissions' 
ORDER BY ordinal_position;
