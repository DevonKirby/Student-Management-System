const express = require('express');
const router = express.Router();

const enrollments = require('../models/enrollmentModel');

// Get all enrollments
router.get('/', async (req, res) => {
    try {
        allEnrollments = await enrollments.getAllEnrollments();
        res.json(allEnrollments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch all enrollments' });
    }
});

// Get specified enrollment
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await enrollments.getEnrollmentById(id);
        
        if (!enrollment) {
            return res.status(404).json({ error: `Enrollment with ID ${id} not found` });
        }

        res.status(200).json(enrollment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch enrollment' });
    }
});

// Add a new enrollment
router.post('/', async (req, res) => {
    try {
        const info = req.body;
        const enrollment = await enrollments.enrollStudent(info);
        res.status(201).json(enrollment);
    } catch (err) {
        console.error(err);

        // Catch custom thrown error from model
        if (err.message && err.message.includes('already enrolled')) {
          return res.status(409).json({ error: err.message });
        }
    
        // Catch PostgreSQL unique constraint violation
        if (err.code === '23505') {
          return res.status(409).json({ error: 'Student is already enrolled in that course for this semester.' });
        }
    
        res.status(500).json({ error: 'Failed to enroll student' });
    }
});

// Delete an enrollment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await enrollments.deleteEnrollment(id);

        if (!enrollment) {
            return res.status(404).json({ error: `Enrollment with ID ${id} not found` });
        }

        res.status(200).json(enrollment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete enrollment' });
    }
});

module.exports = router;