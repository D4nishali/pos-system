import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, user, onLogout }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="layout">
            <Sidebar 
                user={user} 
                collapsed={sidebarCollapsed}
                onLogout={onLogout}
            />
            <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <Header 
                    user={user}
                    onToggleSidebar={toggleSidebar}
                />
                <div className="content-wrapper p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;