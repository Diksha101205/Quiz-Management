# Deployment Guide

## Frontend

Recommended option: Vercel or Netlify.

Build settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend-domain.com/api`

## Backend

Recommended option: Render, Railway, Fly.io, or any Node.js host.

Build settings:

- Root directory: `backend`
- Build command: `npm install && npm run prisma:generate`
- Start command: `npm start`
- Runtime: Node.js 20+

Required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `CLIENT_URL`

Use the existing `.env`, `backend/.env`, and `frontend/.env` files as the source for local values, then set production values directly in your hosting dashboard.

## Production Database

Use a hosted PostgreSQL database. Common options are Render PostgreSQL, Railway PostgreSQL, Supabase, Neon, or AWS RDS.

After setting `DATABASE_URL`, run:

```bash
npm run prisma:migrate --prefix backend
npm run seed --prefix backend
```

For production, replace the demo seed passwords immediately or create the admin account manually.

## Production Testing Checklist

- Register a student account.
- Login as admin and student.
- Confirm student cannot access admin endpoints.
- Create a category.
- Create a quiz with a passing percentage.
- Add questions, options, correct answers, and explanations.
- Publish the quiz.
- Start the quiz as a student.
- Confirm the timer counts down.
- Submit manually and verify score/pass/fail.
- Start another quiz attempt and let time expire to verify auto-submit.
- Review result answers and explanations.
- Confirm overall and category leaderboards update.
- Confirm admin analytics show pass/fail, student, quiz, and attempt statistics.
