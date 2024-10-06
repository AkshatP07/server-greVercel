const express = require('express');
const { createUser, getAllUsers, loginUser, getCurrentUser } = require('../controllers/userController');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
// Create a new user
router.post('/', createUser);

// User login
router.post('/login', loginUser);

// Get all users
router.get('/', getAllUsers);

// Get current user profile
router.get('/me',authenticate, getCurrentUser); // New route for fetching current user

module.exports = router;
