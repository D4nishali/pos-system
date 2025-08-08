import React, { useState, useEffect } from 'react';
import { productsAPI, salesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import ProductGrid from './ProductGrid';
import Cart from './Cart';

const POS = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            setCart(cart.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        
        toast.success(`${product.name} added to cart`);
    };

    const updateCartItem = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        setCart(cart.map(item => 
            item.id === productId 
                ? { ...item, quantity }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const processPayment = async (paymentData) => {
        try {
            const saleData = {
                store_id: user.store_id,
                customer_name: paymentData.customerName || 'Walk-in Customer',
                customer_email: paymentData.customerEmail || '',
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity
                })),
                subtotal: calculateSubtotal(),
                tax_amount: calculateTax(),
                discount_amount: 0,
                total_amount: calculateTotal(),
                payment_method: paymentData.method
            };

            await salesAPI.create(saleData);
            toast.success('Payment processed successfully!');
            clearCart();
            
            // Print receipt (placeholder)
            console.log('Printing receipt...', saleData);
            
        } catch (error) {
            toast.error('Payment processing failed');
        }
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1; // 10% tax
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="pos-container">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    Point of Sale
                                </h5>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ width: '250px' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <ProductGrid 
                                products={filteredProducts} 
                                onAddToCart={addToCart}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <Cart
                        cart={cart}
                        onUpdateQuantity={updateCartItem}
                        onRemoveItem={removeFromCart}
                        onClearCart={clearCart}
                        onProcessPayment={processPayment}
                        subtotal={calculateSubtotal()}
                        tax={calculateTax()}
                        total={calculateTotal()}
                    />
                </div>
            </div>
        </div>
    );
};

export default POS;