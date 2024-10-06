import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext.jsx'; // Import UserContext
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const TaskCard = ({ task, fetchTasks }) => {
    const { user } = useContext(UserContext); // Get logged-in user details from context
    const [status, setStatus] = useState(task.status); // State to manage the selected status

    // Handle task status update
    const handleStatusChange = async (newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task.id}`, { status: newStatus });
            setStatus(newStatus); // Update the status in UI
            fetchTasks(); // Refresh tasks after updating
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    // Handle task deletion
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${task.id}`);
            fetchTasks(); // Refresh tasks after deletion
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow-md mb-4">
            {/* Make the title a clickable link to the task details page */}
            <Link to={`/tasks/${task.id}`}>
                <h3 className="font-bold text-lg hover:text-blue-500 cursor-pointer">{task.title}</h3>
            </Link>
            
            <p className="text-gray-600">Status: {status}</p>
            <p className="text-gray-600">Priority: {task.priority}</p>

            {/* Dropdown to update task status */}
            <div className="mt-2">
                <label htmlFor="status" className="mr-2 font-semibold">Update Status:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-gray-200 p-2 rounded"
                >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {/* Only show delete button if the user is an admin */}
            {user && user.role === 'Admin' && (
                <div className="mt-2">
                    <button 
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
