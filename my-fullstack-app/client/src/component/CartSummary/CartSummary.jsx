import React, { useState } from 'react';
import './CartSummary.css';
import { FiTag, FiChevronDown, FiChevronUp, FiShoppingCart } from 'react-icons/fi';
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoNewspaperOutline } from "react-icons/io5";
import { BsShieldLockFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 

const CartSummary = () => {
    const navigate = useNavigate();
    const [promoExpanded, setPromoExpanded] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
        
    const { 
        cartItems, 
        cartTotal, 
        loading, 
        removeItem,
        // Import các functions mới cho selective checkout
        selectedItems,
        toggleSelectItem,
        selectAllItems,
        deselectAllItems,
        isItemSelected,
        calculateSelectedTotal,
        setItemsForCheckout
    } = useCart();

    // Tính toán dựa trên items được chọn
    const hasSelectedItems = selectedItems.length > 0;
    const selectedTotal = calculateSelectedTotal();
    const subtotal = hasSelectedItems ? selectedTotal : cartTotal;
    const shipping = null;
    const tax = 0;
    const discount = appliedPromo ? subtotal * 0.1 : 0;
    const total = subtotal + (shipping || 0) + tax - discount;

    // Kiểm tra tất cả đã được chọn chưa
    const isAllSelected = cartItems.length > 0 && 
        cartItems.every(item => selectedItems.includes(item.id || item.productId));

    const handleToggleAll = () => {
        if (isAllSelected) {
            deselectAllItems();
        } else {
            selectAllItems();
        }
    };

    const handleApplyPromo = () => {
        if (promoCode.trim()) {
            setAppliedPromo({
                code: promoCode,
                discount: subtotal * 0.1
            });
            setPromoExpanded(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
    };

    const handleRemoveItem = async (itemId) => {
        await removeItem(itemId);
    };

    // Handle checkout với selected items
    const handleCheckout = () => {
        setItemsForCheckout();
        navigate('/CheckOut');
    };

    // Handle Buy Now cho 1 item
    const handleBuyNow = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        const itemsToCheckout = [item];
        setItemsForCheckout(itemsToCheckout);
        navigate('/CheckOut');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            currencyDisplay: 'code'
        }).format(amount);
    };
    
    if (cartItems.length === 0) {
        return (
            <div className="cart-summary-container">
                <div className="cart-summary">
                    <div className="cart-summary-header">
                        <h2 className="cart-summary-title">
                            <span className="title-icon"><IoNewspaperOutline /></span>
                            Shopping Cart
                        </h2>
                    </div>
                    <div className="cart-summary-empty">
                        <FiShoppingCart size={60} />
                        <p>Your cart is empty</p>
                        <Link to="/ProductListing" className="continue-shopping-btn">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-summary-container">
            <div className="cart-summary">
                <div className="glitch-overlay"></div>
                
                <div className="cart-summary-header">
                    <h2 className="cart-summary-title">
                        <span className="title-icon"><IoNewspaperOutline /></span>
                        Total Orders ({cartItems.length})
                        {hasSelectedItems && (
                            <span className="cart-summary-selected-badge">
                                {selectedItems.length} selected
                            </span>
                        )}
                    </h2>
                </div>

                {/* Select All Option */}
                <div className="cart-summary-select-all" onClick={handleToggleAll}>
                    <span className="cart-summary-checkbox">
                        {isAllSelected ? (
                            <MdCheckBox className="checkbox-icon checked" />
                        ) : (
                            <MdCheckBoxOutlineBlank className="checkbox-icon" />
                        )}
                    </span>
                    <span className="cart-summary-select-all-text">
                        Select All
                    </span>
                </div>
                    
                <div className='cart-summary-product'>
                    {cartItems.map((item) => {
                        const product = item.product || item;
                        const itemPrice = product.salePrice || product.price || item.price;
                        const itemId = item.id || item.productId;
                        const isSelected = isItemSelected(itemId);
                        
                        return (
                            <div 
                                key={itemId} 
                                className={`cart-summary-product-item ${isSelected ? 'selected' : ''}`}
                            >
                                {/* Checkbox */}
                                <div 
                                    className='cart-summary-item-checkbox'
                                    onClick={() => toggleSelectItem(itemId)}
                                >
                                    {isSelected ? (
                                        <MdCheckBox className="checkbox-icon checked" />
                                    ) : (
                                        <MdCheckBoxOutlineBlank className="checkbox-icon" />
                                    )}
                                </div>

                                <div className='cart-summary-product-item-img'>
                                    <Link to={`/ProductDetails/${product.id || item.productId}`}>
                                        <img
                                            className='cart-summary-product-item-img-tag'
                                            alt={product.name}
                                            src={product.thumbnail || '/src/assets/placeholder.jpg'}
                                        />        
                                    </Link>
                                </div> 
                                <div className='cart-summary-product-item-info'>
                                    <span className='cart-summary-product-item-info-name'>
                                        <Link 
                                            to={`/ProductDetails/${product.id || item.productId}`}
                                            className='cart-summary-product-item-info-name-link'
                                        >
                                            {product.name}
                                        </Link>
                                    </span>
                                    <div className='cart-summary-product-item-info-details'>
                                        <span className='cart-summary-product-item-info-quantity'>
                                            Qty: <span className='cart-summary-product-item-info-quantity-value'>{item.quantity}</span>
                                        </span>
                                        <span>×</span>
                                        <span className='cart-summary-product-item-price'>
                                            {formatCurrency(itemPrice)}
                                        </span>
                                    </div>
                                    
                                    {/* Item Actions */}
                                    <div className='cart-summary-item-actions'>
                                        <button 
                                            className='cart-summary-buy-now-btn'
                                            onClick={(e) => handleBuyNow(e, item)}
                                        >
                                            Buy Now
                                        </button>
                                        <RiDeleteBin6Line 
                                            className="cart-summary-Delete-icon" 
                                            onClick={() => handleRemoveItem(itemId)}
                                        />
                                    </div>
                                </div>   
                            </div>
                        );
                    })}
                </div>
                    
                <div className="cart-summary-body">
                    {/* Circuit pattern decoration */}
                    <div className="circuit-pattern"></div>
                    
                    <div className="summary-row">
                        <span className="summary-label">
                            Subtotal 
                            {hasSelectedItems && (
                                <span className="summary-selected-info">
                                    ({selectedItems.length} items)
                                </span>
                            )}
                        </span>
                        <span className="summary-value">{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="summary-row">
                        <span className="summary-label">Shipping fee</span>
                        <span className="summary-value shipping-value">
                            {shipping === null ? (
                                <span className="shipping-pending">
                                    Calculated at checkout
                                </span>
                            ) : (
                                formatCurrency(shipping)
                            )}
                        </span>
                    </div>

                    {appliedPromo && (
                        <div className="summary-row discount-row">
                            <span className="summary-label discount-label">
                                <FiTag className="tag-icon" />
                                Discount ({appliedPromo.code})
                            </span>
                            <span className="summary-value discount-value">
                                -{formatCurrency(discount)}
                            </span>
                        </div>
                    )}

                    <div className="summary-divider">
                        <div className="divider-glow"></div>
                    </div>

                    <div className="summary-row total-row">
                        <span className="summary-label total-label">Total : </span>
                        <span className="summary-value total-value">
                            {formatCurrency(total)}
                        </span>
                    </div>

                    <div className="promo-section">
                        {!appliedPromo ? (
                            <>
                                <button
                                    className="promo-toggle"
                                    onClick={() => setPromoExpanded(!promoExpanded)}
                                >
                                    <FiTag className="promo-icon" />
                                    <span>Do you have a discount Voucher?</span>
                                    {promoExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                </button>

                                {promoExpanded && (
                                    <div className="promo-input-wrapper">
                                        <input
                                            type="text"
                                            className="promo-input"
                                            placeholder="Discount Voucher"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                                        />
                                        <button className="promo-apply-btn" onClick={handleApplyPromo}>
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="promo-applied">
                                <IoCheckmarkCircle className="check-icon" />
                                <span>Applied: <strong>{appliedPromo.code}</strong></span>
                                <button className="promo-remove" onClick={handleRemovePromo}>
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons Container */}
                    <div className="action-buttons-container">
                        <Button className="view-cart-btn" fullWidth>
                            <FiShoppingCart className="btn-icon" />
                            <span className="btn-text">
                                <Link to="/CartPage/">
                                    View Cart
                                </Link>
                            </span>
                        </Button>

                        <Button 
                            className="checkout-btn" 
                            fullWidth
                            onClick={handleCheckout}
                        >
                            <span className="btn-text">
                                {hasSelectedItems 
                                    ? `Checkout (${selectedItems.length})`
                                    : 'Checkout All'
                                }
                            </span>
                            <span className="btn-arrow">→</span>
                        </Button>
                    </div>

                    <div className="security-note">
                        <span className="security-icon"><BsShieldLockFill /></span>
                        <span className="security-text">Safe & Secure Payment</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;