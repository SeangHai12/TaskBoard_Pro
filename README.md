# TaskBoard Pro

A beginner-friendly, Trello-style task management web app built with:

- Next.js (App Router)
- React (functional components) with JavaScript files (`.js` / `.jsx`)
- Tailwind CSS
- MySQL

## Features

- Homepage shows all boards
- Create boards
- Delete boards
- Dynamic board detail page: `/boards/[id]`
- Each board has 3 columns: **To Do**, **In Progress**, **Done**
- Full CRUD for tasks
- Move tasks between columns using buttons
- Real-time search (client-side)
- Filter by status
- Task counters per column

## 1) Install dependencies

```bash
npm install
```

## 2) Create the MySQL database + tables

Open MySQL Workbench / phpMyAdmin / CLI and run:

1. `sql/schema.sql`
2. `sql/seed.sql` (optional sample data)

### MySQL CLI example (boards + tasks)

```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
```

## 4) Configure environment variables

Copy the example file:

```bash
copy .env.local.example .env.local
```

Edit `.env.local` and set:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`

## 5) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project structure (important files)

- `app/page.js` Homepage (boards list)
- `app/boards/[id]/page.js` Board detail page (tasks)
- `app/login/page.js` Login page
- `app/signup/page.js` Signup page
- `app/api/boards/*` Boards API routes
- `app/api/tasks/*` Tasks API routes
- `app/api/auth/*` Auth API routes
- `components/*` Reusable UI components
- `lib/db.js` MySQL connection pool
- `sql/schema.sql` MySQL CREATE TABLE statements
- `sql/seed.sql` Sample data inserts

## API Routes (required)

### Boards

- `GET /api/boards`
- `POST /api/boards`
- `PUT /api/boards/[id]`
- `DELETE /api/boards/[id]`

### Tasks

- `GET /api/tasks?boardId=`
- `POST /api/tasks`
- `PUT /api/tasks/[id]`
- `DELETE /api/tasks/[id]`

## Notes

- This project uses simple fetch() calls from the client components.
- The UI refreshes by reloading data after every CRUD action.
- Tasks are deleted automatically when a board is deleted (foreign key `ON DELETE CASCADE`).
