// src/pages/loginPage.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext'; // Adjust the import path as necessary

const Login = () => {
    const { setUser } = useContext(UserContext); // Get setUser from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        try {
            const response = await axios.post('https://server-gre-vercel.vercel.app/api/users/login', { email, password } , );
            setUser({ ...response.data.user, token: response.data.token }); // Set user data in context
            navigate('/'); // Redirect to dashboard
        } catch (error) {
            console.error(error);
            setError('Login failed. Please check your credentials.'); // Display error message
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl mb-6 text-center text-gray-700 font-semibold">Login to Task Space</h2>
                
                {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>} {/* Error message */}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">Don't have an account? </span>
                    <a href="/register" className="text-blue-500 hover:underline">Register here</a> {/* Link to Registration */}
                </div>
            </div>
        </div>
    );
};

export default Login;
