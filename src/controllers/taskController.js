//src/controllers/taskController.js

const Task = require('../models/Task');
const Joi = require('joi');

// Task validation schema
const taskSchema = Joi.object({
    description: Joi.string().min(3).required(),
    completed: Joi.boolean(),
});

// Create a new task
exports.createTask = async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const task = new Task({
            ...req.body,
            user: req.user._id,
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true } // Returns the updated task and runs validators
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all tasks for the user
exports.getTasks = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const tasks = await Task.find({ user: req.user._id })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const totalTasks = await Task.countDocuments({ user: req.user._id });

        res.json({ tasks, totalPages: Math.ceil(totalTasks / limit), currentPage: Number(page) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};