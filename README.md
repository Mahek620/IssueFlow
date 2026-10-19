# IssueFlow

Task management app with a Kanban board and dashboard charts.

## Tech stack
- Frontend: React (Vite)
- Backend: Spring Boot, Spring Data JPA
- Database: PostgreSQL

## Features
- Create, edit, delete tasks
- Status, priority, labels, assignee, due date
- Drag and drop Kanban board
- Dashboard with charts

## Run locally
1. Create a PostgreSQL database named `issueflow_db`.
2. Set the environment variable `DB_PASSWORD`.
3. Backend: `.\mvnw spring-boot:run` (port 8080)
4. Frontend: `cd frontend`, `npm install`, `npm run dev` (port 5173)