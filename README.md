# HealthConnect - Healthcare Awareness Platform

A healthcare awareness platform for rural and village communities. Provides simple, accessible information on hygiene, nutrition, disease prevention, vaccination schedules, emergency contacts, and women & child healthcare with multi-language support.

## Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, React Router, i18next
- **Backend:** Node.js, Express.js (REST API)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcrypt password hashing
- **Internationalization:** i18next (English, Hindi, Tamil)

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or pnpm

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Key environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_EMAIL` - Admin login email (default: admin@healthconnect.org)
- `ADMIN_PASSWORD` - Admin login password (default: Admin@123456)
- `SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS` - Email configuration for vaccination reminders (optional)
- `TWILIO_*` - SMS configuration (optional)

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Database

```bash
# From the backend directory
cd ../backend

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed the database with demo data
npm run db:seed
```

### 3. Start the Application

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

The backend API runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## Demo Credentials

- **Admin:** admin@healthconnect.org / Admin@123456
- **User:** demo@healthconnect.org / User@123456

## Project Structure

```
healthconnect/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Seed data script
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── routes/           # Express route definitions
│   │   ├── utils/            # Prisma client, upload helpers
│   │   └── app.js            # Express app entry point
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth, Language, Theme contexts
│       ├── i18n/             # Translation files (en, hi, ta)
│       ├── pages/            # Page components
│       ├── services/         # API service layer
│       └── main.jsx          # Frontend entry point
├── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Content (Public)
- `GET /api/health-tips` - List health tips (filter by category, language)
- `GET /api/health-tips/:id` - Get health tip by ID
- `GET /api/diseases` - List diseases (filter by language)
- `GET /api/diseases/:id` - Get disease by ID
- `GET /api/emergency-contacts` - List emergency contacts (filter by type, location)
- `GET /api/emergency-contacts/:id` - Get emergency contact by ID
- `GET /api/women-child` - List women & child content (filter by category, language)
- `GET /api/women-child/:id` - Get women & child content by ID
- `GET /api/languages` - List supported languages
- `GET /api/search` - Global search across all content

### Vaccinations (Authenticated)
- `GET /api/vaccinations/templates` - Get vaccination schedule templates
- `GET /api/vaccinations/family` - Get family members with records
- `POST /api/vaccinations/family` - Add family member
- `PUT /api/vaccinations/family/:id` - Update family member
- `DELETE /api/vaccinations/family/:id` - Delete family member
- `PUT /api/vaccinations/records/:id/complete` - Mark vaccination complete
- `GET /api/vaccinations/reminders` - Get upcoming reminders (7 days)

### Admin (Admin only)
- Full CRUD for all content types under `/api/admin/`
- `GET /api/analytics/dashboard` - View usage analytics

### Analytics
- `POST /api/analytics/track` - Track page view

All endpoints return consistent JSON: `{ success: boolean, data: any, error?: string }`

## Features

- **Multi-language support** - English, Hindi, Tamil with easy extensibility
- **Responsive design** - Mobile-first, works on low-end phones
- **Accessibility** - High contrast mode, large text toggle
- **Vaccination reminders** - Track family members and get automated reminders
- **Search** - Global search across all health content
- **Admin dashboard** - Manage all content, view analytics
- **Offline detection** - Graceful handling of offline state

## Deployment

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# The built files are in frontend/dist
```

### Deploy to VPS/Render/Railway

1. Set up a PostgreSQL instance
2. Configure environment variables
3. Run Prisma migrations: `npx prisma migrate deploy`
4. Seed the database: `npm run db:seed`
5. Start the backend: `npm start`
6. Serve frontend build from Express static or deploy separately

## Adding a New Language

1. Add language to `backend/prisma/seed.js` and re-seed
2. Create a new translation file `frontend/src/i18n/{code}.json`
3. Add the language to `frontend/src/i18n/i18n.js` resources
4. Add to `frontend/src/context/LanguageContext.jsx` supportedLanguages
5. Add translations for all content in seed data

## Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```
