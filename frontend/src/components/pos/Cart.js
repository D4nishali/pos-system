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

    return (
        <>
            <div className="cart-section">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">
                            <i className="fas fa-shopping-cart me-2"></i>