# IssueFlow

A task management app with user login, a Kanban board and dashboard charts.

## Tech stack
- Frontend: React (Vite)
- Backend: Spring Boot, Spring Data JPA
- Database: PostgreSQL

## Features
- Register and login (BCrypt password hashing, token based)
- Each user sees only their own tasks
- Create, edit and delete tasks
- Status, priority, labels, assignee and due date (overdue highlighted)
- Drag and drop Kanban board
- Dashboard with status, priority and workload charts

## Run locally

### 1. Database
Create a PostgreSQL database:
```sql
CREATE DATABASE issueflow_db;
```

### 2. Backend (port 8080)
```powershell
cd IssueFlow
$env:DB_PASSWORD='your_postgres_password'
.\mvnw spring-boot:run
```
Tables are created automatically on first run.

### 3. Frontend (port 5173)
```powershell
cd IssueFlow\frontend
npm install
npm run dev
```

Open http://localhost:5173, register an account and start adding tasks.

## Notes
- The database password is read from the `DB_PASSWORD` environment variable, never stored in the repo.
- Authentication is a simple token scheme meant for learning. For production use Spring Security with JWT and HTTPS.