const Feedback = require('../models/feedback'); // Adjust the import based on your project structure
const Task = require('../models/Task'); // Assuming you have a Task model
const User = require('../models/User'); // Assuming you have a User model

// Create new feedback
exports.createFeedback = async (req, res) => {
    const { message, taskId, userId } = req.body;

    try {
        const feedback = await Feedback.create({ message, taskId, userId });
        const populatedFeedback = await feedback.populate('User', 'name'); // Populate user details
        res.status(201).json(populatedFeedback);
    } catch (error) {
        console.error('Error creating feedback:', error); // Log the error
        res.status(500).json({ error: 'Failed to create feedback' });
    }
};

// Get feedback for a specific task
exports.getFeedbackByTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const feedbacks = await Feedback.find({ taskId }).populate('User', 'name'); // Populate user details
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const { message } = req.body;

    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { message }, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json(updatedFeedback);
    } catch (error) {
        console.error('Error updating feedback:', error); // Log the error
        res.status(500).json({ error: 'Failed to update feedback' });
    }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
    const { feedbackId } = req.params;

    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!deletedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting feedback:', error); // Log the error
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
};
