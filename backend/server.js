
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const app = express();


// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());
const PORT = 6754;

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Replace with your MySQL root password
    database: 'todo_list_db'
});
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});
app.post('/tasks', (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).send('Name and description are required');
    }

    const query = 'INSERT INTO tasks (name, description) VALUES (?, ?)';
    db.query(query, [name, description], (err, result) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.send('Task added successfully');
    });
});
// Assuming you have already set up Express and MySQL connection
app.get('/tasks', (req, res) => {
    const selectQuery = 'SELECT * FROM tasks';

    db.query(selectQuery, (error, results) => {
        if (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).send('Error fetching tasks');
        } else {
            res.json(results);
        }
    });
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const deleteQuery = 'DELETE FROM tasks WHERE id = ?';

    db.query(deleteQuery, [taskId], (error, results) => {
        if (error) {
            console.error('Error deleting task:', error);
            res.status(500).send('Error deleting task');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Task not found');
        } else {
            res.send('Task deleted successfully');
        }
    });
});
app.put('/tasks/:id/status', (req, res) => {
    const taskId = req.params.id;
    const newStatus = req.body.status;

    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.query(query, [newStatus, taskId], (err, result) => {
        if (err) {
            console.error('Error updating task status:', err);
            res.status(500).send('Server error');
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send('Task not found');
        } else {
            res.send('Task status updated successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

