// App.js or your main component file

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from '../Main/index'; // Your main component
import AdminDashboard from '../../../Components/searchsuper'; // Your new admin dashboard component

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default Admin;
