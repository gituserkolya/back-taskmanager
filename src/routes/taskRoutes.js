// src/routes/taskRoutes.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Get all tasks
router.get('/', authMiddleware, taskController.getTasks);
// Create a new task
router.post('/', authMiddleware, taskController.createTask);
// Update a task with ID
router.put('/:id', authMiddleware, taskController.updateTask);
// Delete a task with ID
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
