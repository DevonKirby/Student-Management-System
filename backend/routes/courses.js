const express = require('express');
const router = express.Router();

const courses = require('../models/courseModel');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const allCourses = await courses.getAllCourses();
        res.json(allCourses); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch all courses' });
    }
});

// Get specified course
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courses.getCourseById(id);

        if (!course) {
            return res.status(404).json({ error: `Course with ID ${id} not found` });
        }

        res.status(200).json(course);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// Add a new course
router.post('/', async (req, res) => {
    try {
        const info = req.body;
        const course = await courses.createCourse(info);
        res.status(201).json(course);
    } catch (err) {
        console.log(err);
        
        // Missing information
        if (err.code === '23502') {
            return res.status(400).json({ error: 'Missing required course fields.' });
        }

        // Field constraint violation
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Invalid values given.' });
        }

        res.status(500).json({ error: 'Failed to add course' });
    }
});

// Update existing course
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const info = req.body;
        const course = await courses.updateCourse(id, info);

        if (!course) {
            return res.status(404).json({ error: `Course with ID ${id} not found` });
        }

        res.status(200).json(course);
    } catch (err) {
        console.log(err);

        // Missing information
        if (err.code === '23502') {
            return res.status(400).json({ error: 'Missing required course fields.' });
        }

        // Field constraint violation (Emails must be unique)
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Invalid values given.' });
        }

        res.status(500).json({ error: 'Failed to update course' });
    }
});

// Delete course
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courses.deleteCourse(id);

        if (!course) {
            return res.status(404).json({ error: `Course with ID ${id} not found` });
        }

        res.status(200).json(course);
    } catch (err) {
        console.log(err);

        // Field constraint violation (Foreign key in use)
        // This error should not trigger since records cascade on delete
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Conflict: Resource is still in use.' });
        }

        res.status(500).json({ error: 'Failed to delete course' });
    }
});

// Get course roster
router.get('/:id/roster', async (req, res) => {
    try {
        const { id } = req.params;
        const roster = await courses.getCourseRoster(id);

        if (roster.length === 0) {
            return res.status(404).json({ error: `Course with ID ${id} either DNE or has no roster` });
        }

        res.status(200).json(roster);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch course roster' });
    }
});

module.exports = router;