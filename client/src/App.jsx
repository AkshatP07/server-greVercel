// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Registration from './pages/registrationPage';
import axios from 'axios'
import UserContextProvider from '../UserContext';
import Login from './pages/loginPage'; // Ensure to create this page
import DashBoard from './pages/dashBoard';
import UserProfile from './pages/userProfile'; // Ensure to create this page
import TaskDetails from './pages/taskDetails'; // Ensure to create this page

import Layout from './components/Layout';

axios.defaults.withCredentials=true;

function App() {
    return (
        <>
        <UserContextProvider>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<DashBoard />} /> {/* Default route */}
                    <Route path='/register' element={<Registration />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/profile' element={<UserProfile />} />
                    <Route path='/tasks/:taskId' element={<TaskDetails />} />
                    
                    
                </Route>
            </Routes>
            </UserContextProvider>
        </>
    );
}

export default App;
