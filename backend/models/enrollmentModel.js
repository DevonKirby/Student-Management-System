const pool = require('../db/db');

async function getAllEnrollments() {
    const res = await pool.query('SELECT * FROM enrollments');
    return res.rows;
}

async function enrollStudent(studentId, courseId, semester) {
    const enrolled = await checkIfAlreadyEnrolled(studentId, courseId, semester);
    if(enrolled) {
        throw new Error(`${studentId} is already enrolled in ${courseId} during ${semester}`);
    }

    const res = await pool.query(
        'INSERT INTO enrollments (student_id, course_id, semester) VALUES ($1, $2, $3) RETURNING *',
        [studentId, courseId, semester]
    );
    return res.rows[0];
}

async function getEnrollmentById(id) {
    const res = await pool.query('SELECT * FROM enrollment WHERE id = $1', [id]);
    return res.rows[0];
}

async function getEnrollmentsForStudent(studentId) {
    const res = await pool.query('SELECT * FROM enrollment WHERE student_id = $1', [studentId]);
    return res.rows;
}

async function getEnrollmentsForCourse(courseId) {
    const res = await pool.query('SELECT * FROM enrollment WHERE course_id = $1', [courseId]);
    return res.rows;
}

async function updateEnrollmentGrade(id, grade) {
    const res = await pool.query('UPDATE enrollment SET grade = $1 WHERE id = $2 RETURNING *',
        [grade, id]
    );
    return res.rows[0];
}

async function deleteEnrollment(id) {
    const res = await pool.query('DELETE FROM enrollment WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
}

async function checkIfAlreadyEnrolled(studentId, courseId, semester) {
    const res = await pool.query(`
        SELECT 1 FROM enrollments
        WHERE student_id = $1
        AND course_id = $2
        AND semester = $3
        LIMIT 1`, [studentId, courseId, semester]);
    return res.rowCount > 0;
}

module.exports = {
    getAllEnrollments,
    enrollStudent,
    getEnrollmentById,
    getEnrollmentsForStudent,
    getEnrollmentsForCourse,
    updateEnrollmentGrade,
    deleteEnrollment
}