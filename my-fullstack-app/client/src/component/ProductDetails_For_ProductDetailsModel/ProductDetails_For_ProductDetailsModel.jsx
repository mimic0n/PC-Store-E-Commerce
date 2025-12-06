import React, { useState } from 'react';
import './ProductDetails_For_ProductDetailsModel.css';
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx';
import Rating from '@mui/material/Rating';
import { FaHeart, FaCodeCompare, FaCartShopping } from "react-icons/fa6";
import Button from '@mui/material/Button';

export const ProductDetails_For_ProductDetailsModel = () => {
    const [quantity, setQuantity] = useState(1);
    const [value, setValue] = useState(5);

    const handleMinusQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handlePlusQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };

    return (
        <div className='ProductDetails_For_ProductDetailsModel_Info'>
                        <h2 className='ProductDetails_Name'>
                            <GradientText
                                colors={["#757F9A" , "#5b5d60ff", "#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8"]}
                                animationSpeed={8}
                                showBorder={false}
                                className="Gradient-Name"
                            >
                            PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC
                            </GradientText>
                           
                            <span className='ProductDetails_Guarantee'> [ 36 months warranty ]</span>
                        </h2>

                        <div className='ProductDetails_Price'>
                            <div className='ProductDetails_Price_Label'>
                                <h5 className='ProductDetails_Price_Title'>Price:</h5>
                            </div>
                            <div className='ProductDetails_Price_Value'>
                                <h5 className='ProductDetails_Old_Price'>52.700.000 VND</h5>
                                <h4 className='ProductDetails_Now_Price'>48.800.000 VND</h4>
                            </div>
                            <div className='ProductDetails_Price_Sale'>
                                <p className='ProductDetails_Price_Sale_Text'>-18%</p>
                            </div>
                        </div>

                        <div className='ProductDetails_State_Section'>
                            <div className='ProductDetails_State'>
                                <h4 className='ProductDetails_State_Title'>Product State:</h4>
                                <span className='ProductDetails_State_Specification'>Available</span>
                            </div>
                        </div>

                        <div className='ProductDetails_Rating_Section'>
                            <div className='ProductDetails_Rating'>
                                <h4 className='ProductDetails_Rating_Title'>Rating:</h4>
                                <Rating name="product-rating" value={value} readOnly size="large" />
                                <span className='ProductDetails_Rating_Count'>(128 reviews)</span>
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
                                        className='ProductDetails_Quantity_Input'
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePlusQuantity}
                                        className='ProductDetails_Qty_Btn_Plus'
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
                                <Button className='ProductDetails_Action_Btn ProductDetails_Wishlist_Btn'>
                                    <FaHeart />
                                    <span>Add to Wishlist</span>
                                </Button>
                                <Button className='ProductDetails_Action_Btn ProductDetails_Compare_Btn'>
                                    <FaCodeCompare />
                                    <span>Compare</span>
                                </Button>
                            </div>

                            <div className='ProductDetails_Cart_Actions'>
                                <button
                                    type="button"
                                    className='ProductDetails_AddToCart_Btn'
                                >
                                    <FaCartShopping />
                                    <span>Add to Cart</span>
                                </button>

                                <button
                                    type="button"
                                    className='ProductDetails_BuyNow_Btn'
                                >
                                    <span>Buy Now</span>
                                </button>
                            </div>
                            </div>
                        </div>
    );
}