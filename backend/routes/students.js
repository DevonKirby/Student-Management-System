const express = require('express');
const router = express.Router();

const students = require('../models/studentModel')

// Get all students
router.get('/', async (req, res) => {
    try {
        const allStudents = await students.getAllStudents();
        res.json(allStudents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch all students' });
    }
});

// Get specified student
router.get('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const student = await students.getStudentById(id);

        // If student not found
        if (!student) {
            return res.status(404).json({ error: `Student with ID ${id} not found.`});
        }

        res.json(student);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch student'});
    }
});

// Add new student
router.post('/', async (req, res) => {
    try {
        const info = req.body;
        const student = await students.createStudent(info);
        res.status(201).json(student);
    } catch (err) {
        console.log(err);
        
        // Missing information
        if (err.code === '23502') {
            return res.status(400).json({ error: 'Missing required student fields.' });
        }

        // Field constraint violation (Emails must be unique)
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists.' });
        }

        res.status(500).json({ error: 'Failed to add student' });
    }
});

// Update existing student
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const info = req.body;
        const student = await students.updateStudent(id, info);

        // If student not found
        if (!student) {
            return res.status(404).json({ error: `Student with ID ${id} not found.`});
        }

        res.status(200).json(student);
    } catch (err) {
        console.log(err);

        // Missing information
        if (err.code === '23502') {
            return res.status(400).json({ error: 'Missing required student fields.' });
        }

        // Field constraint violation (Emails must be unique)
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists.' });
        }

        res.status(500).json({ error: 'Failed to update student' });
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await students.deleteStudent(id);

        // If student not found
        if (!student) {
            return res.status(404).json({ error: `Student with ID ${id} not found.`});
        }

        res.status(200).json(student);
    } catch (err) {
        console.log(err);

        // Field constraint violation (Foreign key in use)
        // This error should not trigger since records cascade on delete
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Conflict: Resource is still in use.' });
        }

        res.status(500).json({ error: 'Failed to delete student' });
    }
});

// Get all enrollments of a student
router.get('/:id/enrollments', async (req, res) => {
    try {
        const { id } = req.params;
        const studentEnrollment = await students.getStudentEnrollment(id);

        // If student not found or no enrollments found
        if (studentEnrollment.length === 0) {
            return res.status(404).json({ error: `Student with ID ${id} either DNE or hasn't enrolled.`});
        }

        res.status(200).json(studentEnrollment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch student enrollment' });
    }
});

module.exports = router;