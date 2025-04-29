CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  major VARCHAR(50),
  enrollment_date DATE DEFAULT CURRENT_DATE
);
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  department VARCHAR(50),
  credits INT CHECK (credits > 0)
);
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id) ON DELETE CASCADE,
  course_id INT REFERENCES courses(id) ON DELETE CASCADE,
  grade VARCHAR(2) DEFAULT 'IP' CHECK (grade IN ('A', 'B', 'C', 'D', 'F', 'W', 'IP')),
  semester VARCHAR(20),
  UNIQUE(student_id, course_id, semester) -- prevent double enrollment
);
