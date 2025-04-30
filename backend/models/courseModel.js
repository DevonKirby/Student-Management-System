const pool = require('../db/db')

async function getAllCourses() {
    const res = await pool.query('SELECT * FROM courses');
    return res.rows;
}

async function createCourse({ title, department, credits }) {
    const res = await pool.query(
        'INSERT INTO courses (title, department, credits) VALUES ($1, $2, $3) RETURNING *',
        [title, department, credits]
    );
    return res.rows[0];
}

async function updateCourse(id, { title, department, credits }) {
    const res = await pool.query(
        'UPDATE courses SET title = $1, department = $2, credits = $3 WHERE id = $4 RETURNING *',
        [title, department, credits, id]
    )
    return res.rows[0];
}

async function getCourseById(id) {
    const res = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    return res.rows[0];
}

async function deleteCourse(id) {
    const res = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
}

async function getCourseRoster(id) {
    const res = await pool.query(`
        SELECT s.id, s.name, s.email, e.grade
        FROM students s
        JOIN enrollments e
        ON s.id = e.student_id
        WHERE e.course_id = $1
        ORDER BY s.name
        `, [id]);
    return res.rows;
}

module.exports = {
    getAllCourses,
    createCourse,
    updateCourse,
    getCourseById,
    deleteCourse,
    getCourseRoster
}