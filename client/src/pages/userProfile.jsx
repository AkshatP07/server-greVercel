import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router

const UserProfile = () => {
    const { user, ready, setUser } = useContext(UserContext);
    const navigate = useNavigate(); 

    const handleLogout = () => {
        // Clear the token by removing the cookie manually
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; sameSite=None; secure";

        // Clear the user context
        setUser(null);

        // Redirect to the login page
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96 relative">
                <h2 className="text-2xl mb-6 text-center">User Profile</h2>

                {!ready ? (
                    <p className="text-red-500">Loading user information...</p>
                ) : user ? (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Name:</label>
                            <p className="text-gray-700">{user.name}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Email:</label>
                            <p className="text-gray-700">{user.email}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Date of Birth:</label>
                            <p className="text-gray-700">
                                {user.dob ? new Date(user.dob).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }) : 'Not provided'}
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Role:</label>
                            <p className="text-gray-700">{user.role || 'Not provided'}</p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <p className="text-red-500">User information could not be fetched.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
