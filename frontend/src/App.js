import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import POS from './components/pos/POS';
import Inventory from './components/inventory/Inventory';
import Products from './components/products/Products';
import Reports from './components/reports/Reports';
import Stores from './components/stores/Stores';
import Users from './components/users/Users';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                {!user ? (
                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                ) : (
                    <Layout user={user} onLogout={handleLogout}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/dashboard" element={<Dashboard user={user} />} />
                            <Route path="/pos" element={<POS user={user} />} />
                            <Route path="/inventory" element={<Inventory user={user} />} />
                            <Route path="/products" element={<Products user={user} />} />
                            <Route path="/reports" element={<Reports user={user} />} />
                            {(user.role === 'admin' || user.role === 'manager') && (
                                <>
                                    <Route path="/stores" element={<Stores user={user} />} />
                                    <Route path="/users" element={<Users user={user} />} />
                                </>
                            )}
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </Layout>
                )}
                <ToastContainer position="top-right" />
            </div>
        </Router>
    );
}

export default App;