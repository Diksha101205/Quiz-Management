# Quiz Management & Online Assessment Platform

A full-stack quiz platform with two roles:

- Admin: manages users, categories, quizzes, questions, publishing, attempts, analytics, and leaderboard data.
- Student: registers, logs in, browses quizzes, starts timed attempts, submits answers, views history, and checks leaderboard ranking.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, lucide-react
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL
- Security foundation: password hashing, JWT authentication, role-based authorization, request validation, rate limiting, Helmet headers, backend-owned scoring

## Project Structure

```text
backend/
  prisma/schema.prisma
  prisma/seed.js
  src/app.js
  src/controllers/
  src/middleware/
  src/routes/
frontend/
  src/App.jsx
  src/api.js
  src/styles.css
docker-compose.yml
```

## Day 1 Setup

1. Copy environment files.

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```

If you created the database manually in pgAdmin as `QuizManagementdb`, update `backend/.env` like this:

```bash
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/QuizManagementdb?schema=public"
```

Replace `YOUR_POSTGRES_PASSWORD` with the password you use to login to PostgreSQL/pgAdmin. If this password is wrong, registration will fail because the backend cannot save the new user.

2. Install dependencies.

```bash
npm install
npm run install:all
```

3. Start PostgreSQL.

```bash
npm run db:up
```

4. Create database tables and seed demo data.

```bash
npm run db:migrate
npm run db:seed
```

5. Start the app.

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend health check: http://localhost:5000/api/health

## Demo Accounts

- Admin: `admin@quiz.local` / `Admin@12345`
- Student: `student@quiz.local` / `Student@12345`

## Implemented API Endpoints

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

Users:

- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `PATCH /api/users/:id/status`

Categories:

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Quizzes:

- `GET /api/quizzes`
- `GET /api/quizzes/:id`
- `POST /api/quizzes`
- `PUT /api/quizzes/:id`
- `DELETE /api/quizzes/:id`
- `PATCH /api/quizzes/:id/publish`

Questions:

- `GET /api/quizzes/:quizId/questions`
- `POST /api/quizzes/:quizId/questions`
- `PUT /api/questions/:id`
- `DELETE /api/questions/:id`

Attempts:

- `POST /api/quizzes/:quizId/start`
- `POST /api/quizzes/:quizId/submit`
- `GET /api/attempts`
- `GET /api/attempts/:id`

Admin Results:

- `GET /api/admin/attempts`
- `GET /api/admin/attempts/:id`
- `GET /api/admin/analytics`

Leaderboard:

- `GET /api/leaderboard`
- `GET /api/leaderboard?categoryId=:categoryId`

## Security Notes

Correct answers, scores, quiz availability, user roles, and attempt eligibility are checked by the backend. The frontend only displays quiz content and sends selected answers.

## Completed Milestones

Day 2 Authentication:

- Student registration
- Login and logout
- Password hashing
- JWT session authentication

Day 3 Role-Based Authorization:

- Admin role
- Student role
- Protected API routes
- Admin and student middleware

Day 4 Admin Dashboard:

- Admin dashboard layout
- Statistics cards
- Sidebar navigation
- User management with role and activation controls

Day 5 Quiz Management:

- Create quiz
- Edit quiz
- Delete quiz
- Publish and unpublish quiz

Day 6 Category & Question Management:

- Category create, edit, and delete
- Add quiz questions
- Add and remove answer options
- Select the correct answer
- Edit and delete questions

Day 7 Student Quiz Interface:

- Quiz listing
- Quiz details
- Start quiz
- Question navigation
- Answer selection
- Countdown timer with auto-submit

Day 8 Quiz Submission:

- Manual quiz submission
- Automatic submission when time reaches zero
- Backend score calculation
- Pass/fail calculation from quiz passing percentage

Day 9 Results:

- Result page
- Answer review
- Correct and incorrect answer highlighting
- Explanations after submission
- Attempt history with review access

Day 10 Student Dashboard:

- Student statistics
- Quiz history summary
- Average score calculation
- Performance chart bars

Day 11 Admin Analytics:

- Student statistics
- Quiz statistics
- Attempt statistics
- Pass/fail analytics

Day 12 Leaderboard:

- Ranking system
- Overall leaderboard
- Category leaderboard

Day 13 Testing & Security:

- Authentication tests
- Authorization tests
- Quiz validation tests
- Timer tests
- Score calculation tests
- Unauthorized access checks
- Input validation checks

Day 14 Deployment & Documentation:

- Frontend deployment settings
- Backend deployment settings
- Production database configuration
- Environment variable templates
- Production testing checklist

## Testing

Run backend tests:

```bash
npm test --prefix backend
```

Run frontend build verification:

```bash
npm run build --prefix frontend
```

## Deployment

Production environment templates are included in:

- `backend/.env.production.example`
- `frontend/.env.production.example`

Deployment steps are documented in `docs/deployment.md`. A Render service blueprint is included in `render.yaml` for the backend.
