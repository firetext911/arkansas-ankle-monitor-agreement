-- Seed data for Arkansas Ankle Monitor Agreement
-- This file contains sample data for development and testing

-- Insert sample agreement submissions
INSERT INTO agreement_submissions (
    installer_name,
    device_number,
    court_name,
    full_name,
    dob,
    phone,
    address,
    city,
    zip,
    status,
    weekly_rate,
    install_removal_fee,
    payment_type
) VALUES 
(
    'John Smith',
    '12345678',
    'Pulaski County Court',
    'Jane Doe',
    '1990-01-01',
    '555-1234',
    '123 Main St',
    'Little Rock',
    '72201',
    'draft',
    80.00,
    100.00,
    'self_pay'
),
(
    'Sarah Johnson',
    '87654321',
    'Washington County Court',
    'Bob Wilson',
    '1985-05-15',
    '555-5678',
    '456 Oak Ave',
    'Fayetteville',
    '72701',
    'signed',
    80.00,
    100.00,
    'agency_pay'
),
(
    'Mike Davis',
    '11223344',
    'Benton County Court',
    'Alice Brown',
    '1992-12-03',
    '555-9012',
    '789 Pine St',
    'Bentonville',
    '72712',
    'submitted',
    80.00,
    100.00,
    'self_pay'
);

-- Insert sample file uploads
INSERT INTO file_uploads (
    agreement_id,
    file_name,
    file_type,
    file_size,
    file_url,
    file_category,
    uploaded_by
) VALUES 
(
    (SELECT id FROM agreement_submissions WHERE device_number = '12345678'),
    'participant_photo.jpg',
    'image/jpeg',
    1024000,
    'https://example.com/files/participant_photo.jpg',
    'photo',
    'John Smith'
),
(
    (SELECT id FROM agreement_submissions WHERE device_number = '87654321'),
    'court_order.pdf',
    'application/pdf',
    512000,
    'https://example.com/files/court_order.pdf',
    'document',
    'Sarah Johnson'
);

-- Insert sample audit logs
INSERT INTO audit_logs (
    agreement_id,
    action,
    field_name,
    new_value,
    user_agent
) VALUES 
(
    (SELECT id FROM agreement_submissions WHERE device_number = '12345678'),
    'created',
    'status',
    'draft',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    (SELECT id FROM agreement_submissions WHERE device_number = '87654321'),
    'status_changed',
    'status',
    'signed',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
);
