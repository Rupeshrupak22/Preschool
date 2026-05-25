# Backend

Standalone backend starter for ADYAPAN.

The current website still uses `frontend/src/app/api/*` Next API routes, but this folder is ready for separating backend services such as:

- Auth
- Students
- Courses
- Certificates
- Payments
- Schools
- Notifications

Run from project root:

```bash
npm run dev:backend
```

It loads MySQL settings from `.env` or `frontend/.env.local`.

- `GET /api/health` checks the MySQL connection.
- `GET /api/modules` lists backend modules.
- `POST /api/leads` stores lead form submissions in the MySQL `leads` table.
