import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user, collapsed, onLogout }) => {
    const location = useLocation();

    const menuItems = [
        {
            path: '/dashboard',
            icon: 'fas fa-tachometer-alt',
            label: 'Dashboard',
            roles: ['admin', 'manager', 'cashier']
        },
        {
            path: '/pos',
            icon: 'fas fa-cash-register',
            label: 'Point of Sale',
            roles: ['admin', 'manager', 'cashier']
        },
        {
            path: '/inventory',
            icon: 'fas fa-boxes',
            label: 'Inventory',
            roles: ['admin', 'manager', 'cashier']
        },
        {
            path: '/products',
            icon: 'fas fa-tags',
            label: 'Products',
            roles: ['admin', 'manager']
        },
        {
            path: '/reports',
            icon: 'fas fa-chart-bar',
            label: 'Reports',
            roles: ['admin', 'manager']
        },
        {
            path: '/stores',
            icon: 'fas fa-store',
            label: 'Stores',
            roles: ['admin', 'manager']
        },
        {
            path: '/users',
            icon: 'fas fa-users',
            label: 'Users',
            roles: ['admin', 'manager']
        }
    ];

    const filteredMenuItems = menuItems.filter(item => 
        item.roles.includes(user.role)
    );

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header p-3 border-bottom">
                {!collapsed && (
                    <div className="text-center">
                        <i className="fas fa-cash-register fa-2x text-primary mb-2"></i>
                        <h6 className="mb-0">POS System</h6>
                        <small className="text-muted">Multi-Store Management</small>
                    </div>
                )}
            </div>
            
            <nav className="sidebar-nav">
                <ul className="nav flex-column">
                    {filteredMenuItems.map((item) => (
                        <li key={item.path} className="nav-item">
                            <Link 
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <i className={`${item.icon} ${collapsed ? 'me-0' : 'me-3'}`}></i>
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer border-top p-3 mt-auto">
                {!collapsed && (
                    <div className="user-info mb-3">
                        <div className="d-flex align-items-center">
                            <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="fw-bold small">{user.name}</div>
                                <div className="text-muted small">{user.role}</div>
                                {user.store_name && (
                                    <div className="text-muted small">{user.store_name}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <button 
                    className={`btn btn-outline-danger ${collapsed ? 'btn-sm' : 'w-100'}`}
                    onClick={onLogout}
                    title="Logout"
                >
                    <i className="fas fa-sign-out-alt"></i>
                    {!collapsed && <span className="ms-2">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;