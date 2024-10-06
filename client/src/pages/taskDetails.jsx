import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../UserContext.jsx'; // Import UserContext

const TaskDetails = () => {
    const { taskId } = useParams(); // Get the task ID from URL params
    
    const { user } = useContext(UserContext); // Get logged-in user details from context
    const [task, setTask] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [editingMessage, setEditingMessage] = useState('');

    // Fetch task details and feedback
    const fetchTaskDetails = async () => {
        try {
            const taskResponse = await axios.get(`http://localhost:5000/api/tasks/${taskId}`);
            setTask(taskResponse.data);

            const feedbackResponse = await axios.get(`http://localhost:5000/api/feedback/task/${taskId}`);
            setFeedbacks(feedbackResponse.data);
        } catch (error) {
            console.error('Error fetching task details:', error);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId]);

    // Handle sending new feedback
    const handleSendFeedback = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/feedback`, {
                message: newMessage,
                taskId: task.id,
                userId: user.id,
            });
            setFeedbacks([...feedbacks, response.data]); // Add new feedback to state
            setNewMessage(''); // Clear input field
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    // Handle editing feedback
    const handleEditFeedback = (feedback) => {
        setEditingFeedbackId(feedback.id);
        setEditingMessage(feedback.message);
    };

    const handleUpdateFeedback = async (feedbackId) => {
        try {
            await axios.put(`http://localhost:5000/api/feedback/${feedbackId}`, {
                message: editingMessage,
            });
            setEditingFeedbackId(null);
            setEditingMessage('');
            fetchTaskDetails(); // Refresh feedbacks
        } catch (error) {
            console.error('Error updating feedback:', error);
        }
    };

    // Handle deleting feedback
    const handleDeleteFeedback = async (feedbackId) => {
        try {
            await axios.delete(`http://localhost:5000/api/feedback/${feedbackId}`);
            fetchTaskDetails(); // Refresh feedbacks after deletion
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    return (
        <div className="p-4">
            {task && (
                <>
                    <h1 className="text-2xl font-bold mb-4">Task Details</h1>
                    <div className="mb-4">
                        <h2 className="font-semibold">Title:</h2>
                        <p>{task.title}</p>
                        <h2 className="font-semibold">Description:</h2>
                        <p>{task.description}</p>
                        <h2 className="font-semibold">Status:</h2>
                        <p>{task.status}</p>
                        <h2 className="font-semibold">Priority:</h2>
                        <p>{task.priority}</p>
                        <h2 className="font-semibold">Assigned User:</h2>
                        <p>{task.assignedUser ? task.assignedUser.name : 'Not Assigned'}</p>
                    </div>

                    {/* Feedback Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-2">Feedback</h2>
                        <div className="bg-gray-100 p-4 rounded mb-4">
                            {feedbacks.map(feedback => (
                                <div key={feedback.id} className="mb-2">
                                    <strong>{feedback.User.name}:</strong> 
                                    {editingFeedbackId === feedback.id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editingMessage}
                                                onChange={(e) => setEditingMessage(e.target.value)}
                                                className="border rounded p-1"
                                            />
                                            <button
                                                onClick={() => handleUpdateFeedback(feedback.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {feedback.message}
                                            <button
                                                onClick={() => handleEditFeedback(feedback)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFeedback(feedback.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Input for New Feedback */}
                        {(user.role === 'Admin' || (task.assignedUser && task.assignedUser.id === user.id)) && (
                            <div className="flex">
                                <input
                                    type="text"
                                    className="flex-grow p-2 border rounded"
                                    placeholder="Type your feedback..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                                    onClick={handleSendFeedback}
                                >
                                    Send
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskDetails;
