const express = require('express');
const pool = require('./db/db');

const app = express();
app.use(express.json());

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

module.exports = app;