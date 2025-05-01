# Student Management System (Backend)

This is a backend-only Node.js and PostgreSQL-based Student Management System. It provides a RESTful API for managing students, courses, and enrollments.

---

## Tech Stack

- **Node.js** + **Express.js** — for the server and routing
- **PostgreSQL** — for relational data storage
- **pg** — PostgreSQL client for Node.js
- **dotenv** — for environment variable management

---

## Project Structure

```
backend/
├── db/
│   └── index.js           # PostgreSQL pool setup
├── models/
│   ├── studentModel.js
│   ├── courseModel.js
│   └── enrollmentModel.js
├── routes/
│   ├── students.js
│   ├── courses.js
│   └── enrollments.js
├── schema.sql             # Database schema definition
├── app.js                 # Express app config
└── index.js               # Server bootstrap
```

---

## API Endpoints

### Students
- `GET /students` — List all students
- `GET /students/:id` — Get a student by ID
- `POST /students` — Add a new student
- `PUT /students/:id` — Update student details
- `DELETE /students/:id` — Remove a student
- `GET /students/:id/enrollments` — View a student's course history

### Courses
- `GET /courses` — List all courses
- `GET /courses/:id` — Get a course by ID
- `POST /courses` — Add a new course
- `PUT /courses/:id` — Update course details
- `DELETE /courses/:id` — Remove a course
- `GET /courses/:id/roster` — View students enrolled in a course

### Enrollments
- `POST /enrollments` — Enroll a student in a course
- `GET /enrollments/:id` — Get a specific enrollment
- `DELETE /enrollments/:id` — Drop a student from a course

---

## Setup Instructions

1. Clone the repository and `cd` into the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root with your database URL:
   ```env
   DATABASE_URL=postgresql://devuser:yourpassword@localhost:5432/student_management
   ```
4. Create the database and load the schema:
   ```bash
   createdb student_management
   psql -U devuser -d student_management -f schema.sql
   ```
5. Start the server:
   ```bash
   node index.js
   ```

---

## Sample Data

Sample CSV files for students, courses, and enrollments are included and can be imported via:

```sql
\COPY students FROM 'path/to/students.csv' DELIMITER ',' CSV HEADER;
\COPY courses FROM 'path/to/courses.csv' DELIMITER ',' CSV HEADER;
\COPY enrollments FROM 'path/to/enrollments.csv' DELIMITER ',' CSV HEADER;
```

---

## Author Notes

- All SQL queries use parameterized inputs to prevent SQL injection.
- Schema includes constraints for data integrity (e.g., unique emails, allowed grade values).
- Error handling returns appropriate HTTP status codes (`400`, `404`, `409`, `500`).

---

## Last Updated: May 01, 2025
