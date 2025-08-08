import React, { useState, useEffect } from 'react';
import { salesAPI, inventoryAPI, productsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = ({ user }) => {
    const [dashboardData, setDashboardData] = useState({
        todaySales: 0,
        totalProducts: 0,
        lowStockItems: 0,
        recentSales: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch today's sales
            const today = new Date().toISOString().split('T')[0];
            const salesResponse = await salesAPI.getAll({ 
                start_date: today,
                store_id: user.store_id || undefined,
                limit: 5
            });
            
            // Fetch products count
            const productsResponse = await productsAPI.getAll();
            
            // Fetch low stock items
            const lowStockResponse = await inventoryAPI.getLowStock({
                store_id: user.store_id || undefined
            });

            // Calculate today's sales total
            const todaySalesTotal = salesResponse.data.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);

            setDashboardData({
                todaySales: todaySalesTotal,
                totalProducts: productsResponse.data.length,
                lowStockItems: lowStockResponse.data.length,
                recentSales: salesResponse.data
            });
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fas fa-tachometer-alt me-2 text-primary"></i>
                    Dashboard
                </h2>
                <button 
                    className="btn btn-outline-primary"
                    onClick={fetchDashboardData}
                >
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Today's Sales</h6>
                                    <h3 className="mb-0">${dashboardData.todaySales.toFixed(2)}</h3>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-dollar-sign fa-2x opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Total Products</h6>
                                    <h3 className="mb-0">{dashboardData.totalProducts}</h3>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-tags fa-2x opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Low Stock Items</h6>
                                    <h3 className="mb-0">{dashboardData.lowStockItems}</h3>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-exclamation-triangle fa-2x opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Recent Sales</h6>
                                    <h3 className="mb-0">{dashboardData.recentSales.length}</h3>
                                </div>
                                <div className="align-self-center">
                                    <i className="fas fa-shopping-cart fa-2x opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Sales */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-clock me-2"></i>
                                Recent Sales
                            </h5>
                        </div>
                        <div className="card-body">
                            {dashboardData.recentSales.length === 0 ? (
                                <div className="text-center py-4">
                                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No sales today</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Customer</th>
                                                <th>Payment</th>
                                                <th>Total</th>
                                                <th>Cashier</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.recentSales.map(sale => (
                                                <tr key={sale.id}>
                                                    <td>
                                                        {new Date(sale.created_at).toLocaleTimeString()}
                                                    </td>
                                                    <td>{sale.customer_name || 'Walk-in'}</td>
                                                    <td>
                                                        <span className={`badge bg-${sale.payment_method === 'cash' ? 'success' : 'primary'}`}>
                                                            {sale.payment_method}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">${parseFloat(sale.total_amount).toFixed(2)}</td>
                                                    <td>{sale.cashier_name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                Quick Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link to="/pos" className="btn btn-primary">
                                    <i className="fas fa-cash-register me-2"></i>
                                    New Sale
                                </Link>
                                <Link to="/inventory" className="btn btn-outline-warning">
                                    <i className="fas fa-boxes me-2"></i>
                                    Check Inventory
                                </Link>
                                {(user.role === 'admin' || user.role === 'manager') && (
                                    <>
                                        <Link to="/products" className="btn btn-outline-info">
                                            <i className="fas fa-plus me-2"></i>
                                            Add Product
                                        </Link>
                                        <Link to="/reports" className="btn btn-outline-secondary">
                                            <i className="fas fa-chart-line me-2"></i>
                                            View Reports
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {dashboardData.lowStockItems > 0 && (
                        <div className="card mt-3">
                            <div className="card-header bg-warning text-dark">
                                <h6 className="mb-0">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    Stock Alert
                                </h6>
                            </div>
                            <div className="card-body">
                                <p className="mb-2">
                                    <strong>{dashboardData.lowStockItems}</strong> items are running low on stock.
                                </p>
                                <Link to="/inventory" className="btn btn-warning btn-sm">
                                    <i className="fas fa-eye me-2"></i>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;