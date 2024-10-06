import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = Cookies.get('token'); 
            console.log(Cookies.get('token')); // Directly check from the browser's console.
            // Get token from cookies
            console.log("Token retrieved from cookies:", token);
    
            if (token) {
                console.log('Hello user');
                try {
                    console.log("Fetching user profile...");
                    const response = await axios.get('https://server-gre-vercel.vercel.app/api/users/me', { 
                        withCredentials: true, 
                        headers: { Authorization: `Bearer ${token}` } 
                    }); 
                    setUser(response.data); 
                    
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    console.log("No token found. User will be set to null.");
                    setUser(null); 
                }
            } else {
                setUser(null); 
            }
            setReady(true); 
        };
    
        fetchUserProfile();
    }, [Cookies.get('token')]); 
    

    return (
        <UserContext.Provider value={{ user, setUser, ready, setReady }}>
            {children}
        </UserContext.Provider>
    );
}
