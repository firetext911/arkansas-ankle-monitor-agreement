# Arkansas Ankle Monitor Agreement

A comprehensive web application for managing ankle monitor agreements in Arkansas. Built with React, Vite, and Supabase.

## Features

- **Digital Agreement Forms**: Complete ankle monitor agreement forms with validation
- **Signature Capture**: Digital signature capture for participants, guardians, and agents
- **File Uploads**: Support for document and photo uploads
- **Admin Dashboard**: Management interface for viewing and managing agreements
- **Audit Trail**: Complete tracking of all form changes and submissions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage, Auth)
- **Deployment**: Vercel
- **UI Components**: Radix UI, Lucide React icons

## Quick Start

### 1. Setup

```bash
# Clone the repository
git clone https://github.com/firetext911/arkansas-ankle-monitor-agreement.git
cd arkansas-ankle-monitor-agreement

# Run setup script
npm run setup
```

### 2. Configure Environment

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase-schema.sql` in your Supabase SQL Editor
3. Create a storage bucket called `agreement-files`
4. Update `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Deployment

```bash
# Deploy to Vercel
npm run deploy
```

## Project Structure

```
src/
├── api/                 # API layer (Supabase client)
├── components/          # Reusable UI components
│   ├── agreement/       # Agreement-specific components
│   └── ui/             # Base UI components
├── pages/              # Page components
├── lib/                # Utilities and configurations
└── hooks/              # Custom React hooks
```

## Database Schema

The application uses the following main tables:

- **agreement_submissions**: Main agreement data
- **file_uploads**: File metadata and storage links
- **audit_logs**: Change tracking and audit trail

## API Endpoints

- `AgreementSubmission`: CRUD operations for agreements
- `FileUpload`: File upload and management
- `AuditLog`: Audit trail management
- `Statistics`: Dashboard statistics

## Security Features

- Row Level Security (RLS) policies
- Input validation and sanitization
- File type and size validation
- Audit logging for all changes
- HTTPS enforcement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is proprietary software. All rights reserved.