const pool  = require('../db/db');

async function getAllStudents() {
    const res = await pool.query('SELECT * FROM students');
    return res.rows;
}

async function createStudent({ name, email, major }) {
    const res = await pool.query(
        'INSERT INTO students (name, email, major) VALUES ($1, $2, $3) RETURNING *',
        [name, email, major]
    );
    return res.rows[0];
}

async function updateStudent(id, { name, email, major }) {
    const res = await pool.query(
        'UPDATE students SET name = $1, email = $2, major = $3 WHERE id = $4 RETURNING *',
        [name, email, major, id]
    );
    return res.rows[0];
}

async function getStudentById(id) {
    const res = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    return res.rows[0];
}

async function getStudentByEmail(email) {
    const res = await pool.query('SELECT * FROM students WHERE email = $1', [email]);
    return res.rows[0];
}

async function deleteStudent(id) {
    const res = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
}

async function getStudentEnrollment(id) {
    const res = await pool.query(`
        SELECT c.*, e.semester, e.grade
        FROM courses c
        JOIN enrollments e
        ON c.id = e.course_id
        WHERE e.student_id = $1
        ORDER BY e.semester DESC
        `, [id]);
    return res.rows;
}

module.exports = {
    getAllStudents,
    createStudent,
    updateStudent,
    getStudentById,
    getStudentByEmail,
    deleteStudent,
    getStudentEnrollment
};