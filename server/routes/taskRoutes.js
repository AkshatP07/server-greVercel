const express = require('express');
const { updateTaskStatus, deleteTask,createTask, getTasks,getTasksByID } = require('../controllers/taskController');

const router = express.Router();


router.put('/:id', updateTaskStatus); // Update task status
router.delete('/:id', deleteTask);    // Delete task
router.post('/', createTask); // Create task
router.get('/', getTasks);    // Fetch all tasks
router.get('/:id', getTasksByID);    // Fetch all tasks

module.exports = router;
