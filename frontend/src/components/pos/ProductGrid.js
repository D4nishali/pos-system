import React from 'react';

const ProductGrid = ({ products, onAddToCart }) => {
    return (
        <div className="product-grid">
            {products.map(product => (
                <div 
                    key={product.id} 
                    className="card product-card h-100"
                    onClick={() => onAddToCart(product)}
                >
                    <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '120px' }}>
                        {product.image_url ? (
                            <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="img-fluid"
                                style={{ maxHeight: '100px', maxWidth: '100px' }}
                            />
                        ) : (
                            <i className="fas fa-box fa-2x text-muted"></i>
                        )}
                    </div>
                    <div className="card-body d-flex flex-column">
                        <h6 className="card-title text-truncate" title={product.name}>
                            {product.name}
                        </h6>
                        <p className="card-text text-muted small mb-1">{product.sku}</p>
                        <p className="card-text text-success fw-bold mt-auto">
                            ${product.price.toFixed(2)}
                        </p>
                        <small className="text-muted">
                            Stock: {product.stock || 0}
                        </small>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;