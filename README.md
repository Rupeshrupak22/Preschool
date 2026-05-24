# ADYAPAN Future Skills Platform

Project ab clean folder structure me organized hai:

```text
ADYAPAN/
├─ frontend/   Next.js website, dashboards, auth pages, and Next API routes
├─ backend/    Standalone backend API starter
├─ package.json
└─ .env.example
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Backend starter:

```bash
npm run dev:backend
```

Open `http://localhost:4000/api/health`.

## Environment

Copy `.env.example` to `.env.local` and configure:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
- `NEXT_PUBLIC_APP_URL`

Initialize the MySQL database and tables:

```bash
npm run db:init
```

## Main Frontend Routes

- `/` homepage
- `/signup`
- `/login`
- `/dashboard`
- `/admin`
- `/payment/success`
- `/certificate/verify/[id]`

## Verify

```bash
npm run build
```
