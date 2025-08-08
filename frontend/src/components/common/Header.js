import React from 'react';

const Header = ({ user, onToggleSidebar }) => {
    return (
        <header className="header bg-white shadow-sm border-bottom">
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                        <button 
                            className="btn btn-outline-secondary me-3"
                            onClick={onToggleSidebar}
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                        <h5 className="mb-0">
                            <i className="fas fa-cash-register text-primary me-2"></i>
                            POS System
                        </h5>
                    </div>
                    
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            <small className="text-muted">Welcome back,</small>
                            <div className="fw-bold">{user.name}</div>
                            <small className="text-muted">
                                {user.role} {user.store_name && `• ${user.store_name}`}
                            </small>
                        </div>
                        <div className="dropdown">
                            <button 
                                className="btn btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <i className="fas fa-user-circle me-2"></i>
                                {user.name}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><h6 className="dropdown-header">Account</h6></li>
                                <li><span className="dropdown-item-text small text-muted">{user.email}</span></li>
                                <li><span className="dropdown-item-text small text-muted">Role: {user.role}</span></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger">
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;