# Selam Platform

> Premium multilingual mental wellness and health network platform for Ethiopia and East Africa.

![Selam Platform](./public/og-image.png)

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + CSS Variables |
| Database | Supabase (PostgreSQL, no Auth) |
| AI | Google Gemini (`gemini-1.5-flash`) |
| Animation | Framer Motion |
| Maps | Leaflet + react-leaflet |
| QR Code | qrcode.react (generate) + html5-qrcode (scan) |
| i18n | next-intl (en, am, ti, om) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Auth | Custom JWT (jose + bcryptjs) |

---

## Prerequisites

- Node.js 18+
- A Supabase project (PostgreSQL only)
- A Google AI Studio API key (Gemini)

---

## Environment Setup

Copy the values below into `.env.local` and fill in your real keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Auth
JWT_SECRET=a_random_32_plus_character_string_for_signing_jwts

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database Migration

1. Open your Supabase project → **SQL Editor**
2. Run the contents of `web/supabase/schema.sql`
3. No RLS is required — all queries use the service role key

```bash
# Or using supabase CLI (if installed)
supabase db push
```

---

## Local Development

```bash
cd web
npm install
npm run dev
```

Visit: http://localhost:3000

The app auto-redirects to `/en` (English). Switch languages using the navbar.

---

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── [locale]/           # All pages under locale prefix
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── about/          # About page
│   │   │   ├── pricing/        # Pricing page
│   │   │   ├── auth/           # Login + Signup
│   │   │   ├── dashboard/      # Client dashboards
│   │   │   ├── doctor/         # Doctor dashboards
│   │   │   └── agent/          # NGO agent dashboards
│   │   └── api/                # All API routes
│   ├── components/
│   │   ├── ui/                 # Design system (Button, Card, etc.)
│   │   ├── layout/             # Navbar, Sidebar, Footer
│   │   └── features/           # ChatInterface, QRDisplay, etc.
│   ├── lib/
│   │   ├── auth.ts             # JWT helpers
│   │   ├── gemini.ts           # Gemini AI integration
│   │   ├── supabase.ts         # Server-side Supabase client
│   │   └── utils.ts            # Shared utilities
│   ├── types/index.ts          # TypeScript types
│   └── middleware.ts           # JWT verification + route protection
├── messages/                   # i18n translations
│   ├── en.json
│   ├── am.json
│   ├── ti.json
│   └── om.json
└── supabase/
    └── schema.sql              # Database schema
```

---

## Vercel Deployment

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set **Root Directory** to `web/`
4. Add all environment variables from `.env.local`
5. Deploy

---

## User Roles

| Role | Access |
|------|--------|
| `client` | `/dashboard` — Wellness, Health ID, Awareness |
| `doctor` | `/doctor` — QR Scanner, Patient View, AI Diagnostics |
| `agent` | `/agent` — Awareness Posts, Analytics |

---

## API Routes

| Route | Method | Auth |
|-------|--------|------|
| `/api/auth/signup` | POST | Public |
| `/api/auth/login` | POST | Public |
| `/api/auth/logout` | POST | Any |
| `/api/auth/me` | GET | Any authenticated |
| `/api/chat` | POST | Optional (anonymous allowed) |
| `/api/mood` | GET/POST | Authenticated |
| `/api/hospitals` | GET | Public |
| `/api/awareness` | GET/POST | GET: Public, POST: Agent only |
| `/api/emergency-contacts` | GET/POST/DELETE | Authenticated |
| `/api/patient-record` | GET/PUT | Authenticated |
| `/api/scan` | GET | Doctor only |
| `/api/diagnoses` | GET/POST | Doctor only |

---

## Emergency Numbers (Ethiopia)

- **Police**: 911
- **Ambulance**: 907
- **Mental Health**: 8722
- **Fire**: 939
