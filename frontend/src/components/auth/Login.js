import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            const { token, user } = response.data;
            onLogin(user, token);
            toast.success('Login successful!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (role) => {
        const demoCredentials = {
            admin: { email: 'admin@pos.com', password: 'password123' },
            cashier: { email: 'john@pos.com', password: 'password123' }
        };

        setFormData(demoCredentials[role]);
        
        try {
            const response = await authAPI.login(demoCredentials[role]);
            const { token, user } = response.data;
            onLogin(user, token);
            toast.success('Demo login successful!');
        } catch (error) {
            toast.error('Demo login failed');
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-lg" style={{ width: '400px' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-cash-register fa-3x text-primary mb-3"></i>
                        <h3 className="fw-bold">POS System</h3>
                        <p className="text-muted">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="d-grid mb-3">
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <hr />
                    
                    <div className="text-center">
                        <p className="text-muted mb-2">Demo Accounts:</p>
                        <div className="d-grid gap-2">
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleDemoLogin('admin')}
                            >
                                <i className="fas fa-user-shield me-2"></i>
                                Admin Demo
                            </button>
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleDemoLogin('cashier')}
                            >
                                <i className="fas fa-user me-2"></i>
                                Cashier Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;