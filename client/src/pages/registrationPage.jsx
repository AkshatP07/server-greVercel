// src/pages/Registration.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const [role, setRole] = useState('Member');
    const navigate = useNavigate();

    // New state for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation states
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [dobError, setDobError] = useState(false);
    const [fieldError, setFieldError] = useState(false);

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        const isEmailValid = validateEmail(email);
        setEmailError(!isEmailValid);

        const isDobValid = new Date(dob) < new Date();
        setDobError(!isDobValid);

        if (!name || !email || !password || !confirmPassword || !dob) {
            setFieldError(true);
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError(true);
            alert('Passwords do not match');
            return;
        }

        // Prepare data for submission
        const registrationData = { name, email, password, dob, role };

        try {
            const response = await axios.post('https://server-gre-vercel.vercel.app/api/users', registrationData , { withCredentials: true }); // Updated endpoint
            console.log('Registration successful:', response.data);
            alert('Registration successful!'); // Success message
            // Reset form fields
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setDob('');
            setRole('Member');
            navigate('/login'); 
        } catch (error) {
            console.error('Error during registration:', error.response);
            alert(error.response?.data?.message || 'Registration failed'); // Improved error message handling
        }

        // Reset error states
        setEmailError(false);
        setPasswordError(false);
        setDobError(false);
        setFieldError(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-6 text-center">Register</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {emailError && <div className="text-red-500 text-sm">Invalid email format</div>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 text-gray-600"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2 text-gray-600"
                        >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {passwordError && <div className="text-red-500 text-sm">Passwords do not match</div>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border ${dobError ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {dobError && <div className="text-red-500 text-sm">Date of Birth cannot be in the future</div>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Registration;
