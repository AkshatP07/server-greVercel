import React, { useEffect, useState, useContext } from 'react';
import TaskCard from '../components/TaskCard.jsx';
import AddTask from '../components/AddTask.jsx';
import axios from 'axios';
import { UserContext } from '../../UserContext.jsx'; // Import UserContext

const DashBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(UserContext); // Get the logged-in user from context

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            if (Array.isArray(response.data)) {
                setTasks(response.data);
            } else {
                console.error('Expected an array, but got:', response.data);
                setTasks([]); // Clear tasks if not an array
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]); // Optionally clear tasks on error
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Filter tasks based on user role and assignment
    const filterTasksForUser = () => {
        if (!user) {
            return []; // If no user is logged in, show no tasks
        }

        if (user.role === 'Admin') {
            // Admin sees all tasks they created
            return tasks.filter(task => task.createdBy === user.id); 
        } else {
            // Non-admin users see only tasks assigned to them
            return tasks.filter(task => task.assignedUser && task.assignedUser.id === user.id);
        }
    };

    const filterTasksByStatus = (status) => {
        return filterTasksForUser().filter((task) => task.status === status);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {/* Only show Add Task button if the user is an admin */}
            {user && user.role === 'Admin' && (
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 float-right" 
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Task
                </button>
            )}

            {/* Display tasks only if the user is logged in */}
            {user ? (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-200 p-4 rounded">
                        <h2 className="font-bold mb-2">To Do</h2>
                        {filterTasksByStatus('todo').map(task => (
                            <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />
                        ))}
                    </div>

                    <div className="bg-gray-200 p-4 rounded">
                        <h2 className="font-bold mb-2">In Progress</h2>
                        {filterTasksByStatus('in-progress').map(task => (
                            <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />
                        ))}
                    </div>

                    <div className="bg-gray-200 p-4 rounded">
                        <h2 className="font-bold mb-2">Done</h2>
                        {filterTasksByStatus('done').map(task => (
                            <TaskCard key={task.id} task={task} fetchTasks={fetchTasks} />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">Please log in to view tasks.</p>
            )}

            {/* Modal for adding a task */}
            {isModalOpen && (
                <AddTask 
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchTasks(); // Refresh tasks after adding a new one
                    }} 
                />
            )}
        </div>
    );
};

export default DashBoard;
