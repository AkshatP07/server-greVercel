const Task = require('../models/Task');
const User = require('../models/User');

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const taskId = req.params.id;

        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        await task.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findByPk(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, status, priority, description, userId } = req.body;
        const { createdBy: adminId } = req.body; // Get the admin who is creating the task

        if (!title || !adminId) {
            return res.status(400).json({ message: 'Title and admin ID are required.' });
        }

        const taskData = { title, description, status, priority, createdBy: adminId };

        if (userId) {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Assigned user not found.' });
            }
            taskData.userId = userId;
        }

        const task = await Task.create(taskData);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [
                { model: User, as: 'assignedUser', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] }
            ]
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasksByID = async (req, res) => {
    const { id } = req.params; // Get the taskId from the URL params
    console.log('Fetching task with id:', id);
    try {
        const task = await Task.findOne({
            where: { id }, // Fetch task by the specific ID
            include: [
                { model: User, as: 'assignedUser', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] }
            ]
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task); // Return the single task
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

