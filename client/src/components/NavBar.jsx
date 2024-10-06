// src/components/NavBar.jsx
import React, { useContext } from 'react'; 
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { FaUser } from "react-icons/fa";

const NavBar = () => {
    const { user } = useContext(UserContext); 
    console.log(user);

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            <Link to="/">
                <div className="text-white font-bold text-xl">Task Space</div>
            </Link>

            <div className="flex space-x-4">
                

                {user ? (
                    <Link to="/profile" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                    <FaUser />
                    </Link>
                ) : (
                    <Link to="/login" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
