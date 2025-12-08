import React, { useState, useContext } from 'react';
import './ProductDetails_For_ProductDetailsModel.css';
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx';
import Rating from '@mui/material/Rating';
import { FaHeart, FaCodeCompare, FaCartShopping } from "react-icons/fa6";
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const ProductDetails_For_ProductDetailsModel = () => {
    const [quantity, setQuantity] = useState(1);
    const context = useContext(MyContext);
    const { addToCart, loading } = useCart();
    const navigate = useNavigate();
    
    // Lấy selectedProduct từ context
    const product = context.selectedProduct;

    // Format price với định dạng VND
    const formatPrice = (price) => {
        if (!price) return '0 VND';
        return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
    };

    // Tính discount
    const calculateDiscount = (price, salePrice) => {
        if (!salePrice || salePrice >= price) return 0;
        return Math.round(((price - salePrice) / price) * 100);
    };

    // Kiểm tra trạng thái sản phẩm
    const getProductState = (quantity) => {
        if (quantity > 10) return 'Available';
        if (quantity > 0) return `Only ${quantity} left`;
        return 'Out of Stock';
    };

    const handleMinusQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handlePlusQuantity = () => {
        const maxQty = product?.quantity || 99;
        if (quantity < maxQty) setQuantity(quantity + 1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        const maxQty = product?.quantity || 99;
        if (!isNaN(value) && value >= 1 && value <= maxQty) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };

    const handleAddToCart = async () => {
        if (product) {
            await addToCart(product, quantity);
            context.setOpenCartPanel(true);
        }
    };

    const handleBuyNow = async () => {
        if (product) {
            await addToCart(product, quantity);
            context.setOpenProductDetailsModel(false);
            navigate('/CheckOut');
        }
    };

    const handleAddToWishlist = () => {
        // TODO: Implement wishlist functionality
        context.openAlertPanel("success", "Đã thêm vào danh sách yêu thích!");
    };

    const handleCompare = () => {
        // TODO: Implement compare functionality
        context.openAlertPanel("success", "Đã thêm vào danh sách so sánh!");
    };

    // Nếu không có product, hiển thị loading hoặc placeholder
    if (!product) {
        return (
            <div className='ProductDetails_For_ProductDetailsModel_Info'>
                <p>Loading...</p>
            </div>
        );
    }

    const discount = calculateDiscount(product.price, product.salePrice);
    const displayPrice = product.salePrice || product.price;
    const productState = getProductState(product.quantity);
    const isOutOfStock = product.quantity <= 0;

    return (
        <div className='ProductDetails_For_ProductDetailsModel_Info'>
            <h2 className='ProductDetails_Name'>
                <GradientText
                    colors={["#757F9A", "#5b5d60ff", "#757F9A", "#D7DDE8", "#757F9A", "#D7DDE8"]}
                    animationSpeed={8}
                    showBorder={false}
                    className="Gradient-Name"
                >
                    {product.name}
                </GradientText>
                {product.warranty && (
                    <span className='ProductDetails_Guarantee'> [ {product.warranty} months warranty ]</span>
                )}
            </h2>

            <div className='ProductDetails_Price'>
                <div className='ProductDetails_Price_Label'>
                    <h5 className='ProductDetails_Price_Title'>Price:</h5>
                </div>
                <div className='ProductDetails_Price_Value'>
                    {product.salePrice && product.salePrice < product.price && (
                        <h5 className='ProductDetails_Old_Price'>{formatPrice(product.price)}</h5>
                    )}
                    <h4 className='ProductDetails_Now_Price'>{formatPrice(displayPrice)}</h4>
                </div>
                {discount > 0 && (
                    <div className='ProductDetails_Price_Sale'>
                        <p className='ProductDetails_Price_Sale_Text'>-{discount}%</p>
                    </div>
                )}
            </div>

            <div className='ProductDetails_State_Section'>
                <div className='ProductDetails_State'>
                    <h4 className='ProductDetails_State_Title'>Product State:</h4>
                    <span className={`ProductDetails_State_Specification ${isOutOfStock ? 'out-of-stock' : ''}`}>
                        {productState}
                    </span>
                </div>
            </div>

            <div className='ProductDetails_Rating_Section'>
                <div className='ProductDetails_Rating'>
                    <h4 className='ProductDetails_Rating_Title'>Rating:</h4>
                    <Rating 
                        name="product-rating" 
                        value={parseFloat(product.rating) || 0} 
                        readOnly 
                        size="large"
                        precision={0.5}
                    />
                    <span className='ProductDetails_Rating_Count'>({product.numReviews || 0} reviews)</span>
                </div>
            </div>

            <div className='ProductDetails_Quantity_Section'>
                <div className='ProductDetails_Quantity_Area'>
                    <h4 className='ProductDetails_Quantity_Title'>Quantity:</h4>
                    <div className='ProductDetails_Quantity_Controls'>
                        <button
                            type="button"
                            onClick={handleMinusQuantity}
                            className='ProductDetails_Qty_Btn_Minus'
                            disabled={isOutOfStock}
                        >
                            <svg focusable="false" className="icon icon--minus" viewBox="0 0 10 2" role="presentation">
                                <path d="M10 0v2H0V0z"></path>
                            </svg>
                        </button>
                        <input
                            type="text"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            max={product.quantity}
                            className='ProductDetails_Quantity_Input'
                            disabled={isOutOfStock}
                        />
                        <button
                            type="button"
                            onClick={handlePlusQuantity}
                            className='ProductDetails_Qty_Btn_Plus'
                            disabled={isOutOfStock}
                        >
                            <svg focusable="false" className="icon icon--plus" viewBox="0 0 10 10" role="presentation">
                                <path d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className='ProductDetails_Actions'>
                <div className='ProductDetails_Wishlist_Actions'>
                    <Button 
                        className='ProductDetails_Action_Btn ProductDetails_Wishlist_Btn'
                        onClick={handleAddToWishlist}
                    >
                        <FaHeart />
                        <span>Add to Wishlist</span>
                    </Button>
                    <Button 
                        className='ProductDetails_Action_Btn ProductDetails_Compare_Btn'
                        onClick={handleCompare}
                    >
                        <FaCodeCompare />
                        <span>Compare</span>
                    </Button>
                </div>

                <div className='ProductDetails_Cart_Actions'>
                    <button
                        type="button"
                        className='ProductDetails_AddToCart_Btn'
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || loading}
                    >
                        <FaCartShopping />
                        <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
                    </button>

                    <button
                        type="button"
                        className='ProductDetails_BuyNow_Btn'
                        onClick={handleBuyNow}
                        disabled={isOutOfStock || loading}
                    >
                        <span>Buy Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
}