import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext'; // Import UserContext

const AddTask = ({ onClose }) => {
    const { user } = useContext(UserContext); // Get the user from context
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [priority, setPriority] = useState('medium');
    const [assignedUserId, setAssignedUserId] = useState(null); // For selected user
    const [alertMessage, setAlertMessage] = useState(''); // State for the alert message
    const [users, setUsers] = useState([]); // List of users

    // Fetch all team members (to be displayed in the dropdown)
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data); // Store the users in state
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users when the component mounts
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.id) {
            console.error('No user logged in or userId not available');
            setAlertMessage('Error: User not logged in');
            return;
        }
        try {
            // Send task data to the backend
            await axios.post('http://localhost:5000/api/tasks', { 
                title, 
                description, 
                status, 
                priority, 
                userId: assignedUserId, // Use the selected user ID
                createdBy: user.id // Logged-in admin's ID
            });

            // Show success alert
            setAlertMessage('Task added successfully!');

            // Reset form fields
            setTitle('');
            setDescription('');
            setStatus('todo');
            setPriority('medium');
            setAssignedUserId(null);

            // Automatically close modal after 2 seconds
            setTimeout(() => {
                setAlertMessage(''); // Clear alert message
                onClose(); // Close the modal
            }, 2000);
        } catch (error) {
            console.error('Error adding task:', error);
            setAlertMessage('Error adding task.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="font-bold mb-4">Add New Task</h2>

                {alertMessage && (
                    <div className={`p-2 mb-4 text-white ${alertMessage.includes('success') ? 'bg-green-500' : 'bg-red-500'}`}>
                        {alertMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Task Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="border mb-4 w-full p-2"
                    />
                    <textarea 
                        placeholder="Task Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="border mb-4 w-full p-2"
                    />
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        className="border mb-4 w-full p-2"
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)} 
                        className="border mb-4 w-full p-2"
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    {/* Dropdown for selecting a user to assign the task to */}
                    <select 
                        value={assignedUserId || ''} 
                        onChange={(e) => setAssignedUserId(e.target.value)} 
                        className="border mb-4 w-full p-2"
                    >
                        <option value="">Assign to None</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
