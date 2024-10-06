const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create new feedback
router.post('/', feedbackController.createFeedback);
// Get feedback for a specific task
router.get('/task/:taskId', feedbackController.getFeedbackByTask);
// Update feedback
router.put('/:feedbackId', feedbackController.updateFeedback);
// Delete feedback
router.delete('/:feedbackId', feedbackController.deleteFeedback);

module.exports = router;
