import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const Cart = ({ 
    cart, 
    onUpdateQuantity, 
    onRemoveItem, 
    onClearCart, 
    onProcessPayment,
    subtotal,
    tax,
    total
}) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        method: 'cash',
        customerName: '',
        customerEmail: '',
        amountReceived: total
    });

    const handlePayment = () => {
        if (paymentData.method === 'cash' && paymentData.amountReceived < total) {
            alert('Insufficient amount received');
            return;
        }
        
        onProcessPayment(paymentData);
        setShowPaymentModal(false);
        setPaymentData({
            method: 'cash',
            customerName: '',
            customerEmail: '',
            amountReceived: total
        });
    };

    const calculateChange = () => {
        return Math.max(0, paymentData.amountReceived - total);
    };

    const handleShowPayment = () => {
        setPaymentData(prev => ({ ...prev, amountReceived: total }));
        setShowPaymentModal(true);
    };

    return (
        <>
            <div className="cart-section">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">
                            <i className="fas fa-shopping-cart me-2"></i>
                            Cart ({cart.length} items)
                        </h5>
                        {cart.length > 0 && (
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={onClearCart}
                            >
                                <i className="fas fa-trash me-1"></i>
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="card-body p-0">
                        {cart.length === 0 ? (
                            <div className="text-center p-4">
                                <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                <p className="text-muted">Your cart is empty</p>
                                <p className="text-muted small">Add products to start a sale</p>
                            </div>
                        ) : (
                            <div className="cart-items" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {cart.map(item => (
                                    <div key={item.id} className="cart-item border-bottom p-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{item.name}</h6>
                                                <small className="text-muted">{item.sku}</small>
                                                <div className="mt-2">
                                                    <span className="text-success fw-bold">
                                                        ${item.price.toFixed(2)} each
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <button 
                                                    className="btn btn-sm btn-outline-danger mb-2"
                                                    onClick={() => onRemoveItem(item.id)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                                <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                                    <button 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input 
                                                        type="number" 
                                                        className="form-control text-center"
                                                        value={item.quantity}
                                                        onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                        min="1"
                                                    />
                                                    <button 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                                <div className="mt-1 fw-bold text-primary">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {cart.length > 0 && (
                        <div className="card-footer">
                            <div className="cart-summary">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tax (10%):</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total:</strong>
                                    <strong className="text-primary fs-5">${total.toFixed(2)}</strong>
                                </div>
                                <div className="d-grid">
                                    <button 
                                        className="btn btn-success btn-lg"
                                        onClick={handleShowPayment}
                                    >
                                        <i className="fas fa-credit-card me-2"></i>
                                        Process Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fas fa-credit-card me-2"></i>
                        Process Payment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <h6>Order Summary</h6>
                            <div className="bg-light p-3 rounded mb-3">
                                <div className="d-flex justify-content-between">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Tax:</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6>Payment Details</h6>
                            <div className="mb-3">
                                <label className="form-label">Payment Method</label>
                                <select 
                                    className="form-select"
                                    value={paymentData.method}
                                    onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="digital">Digital Payment</option>
                                </select>
                            </div>

                            {paymentData.method === 'cash' && (
                                <div className="mb-3">
                                    <label className="form-label">Amount Received</label>
                                    <input 
                                        type="number"
                                        className="form-control"
                                        value={paymentData.amountReceived}
                                        onChange={(e) => setPaymentData({...paymentData, amountReceived: parseFloat(e.target.value) || 0})}
                                        step="0.01"
                                        min={total}
                                    />
                                    {paymentData.amountReceived >= total && (
                                        <div className="mt-2 p-2 bg-success text-white rounded">
                                            <strong>Change: ${calculateChange().toFixed(2)}</strong>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Customer Name (Optional)</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    value={paymentData.customerName}
                                    onChange={(e) => setPaymentData({...paymentData, customerName: e.target.value})}
                                    placeholder="Walk-in Customer"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Customer Email (Optional)</label>
                                <input 
                                    type="email"
                                    className="form-control"
                                    value={paymentData.customerEmail}
                                    onChange={(e) => setPaymentData({...paymentData, customerEmail: e.target.value})}
                                    placeholder="customer@email.com"
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="success" 
                        onClick={handlePayment}
                        disabled={paymentData.method === 'cash' && paymentData.amountReceived < total}
                    >
                        <i className="fas fa-check me-2"></i>
                        Complete Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Cart;