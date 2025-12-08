import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductItemViewList.css'
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { MyContext } from '../../App';

export const ProductItems = ({ product }) => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [quantity, setQuantity] = useState(1);

  // Format price với định dạng VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  // Tính discount
  const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  // Default product nếu không có data
  const defaultProduct = {
    id: 1,
    name: 'PC KCC AMD R7-9800x3d / RTX 4070 super',
    price: 52700000,
    salePrice: 48800000,
    thumbnail: '/src/assets/AdsBannerSlide/AdsBannerSlide_1.jpg',
    images: [],
    rating: 5,
    quantity: 10
  };

  const productData = product || defaultProduct;
  const discount = calculateDiscount(productData.price, productData.salePrice);
  const displayPrice = productData.salePrice || productData.price;
  const originalPrice = productData.price;

  // Get images - hỗ trợ cả format JSON string và array
  const getImages = () => {
    let images = productData.images;
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [];
      }
    }
    return images || [];
  };
  
  const images = getImages();
  const image1 = productData.thumbnail || images[0]?.url || images[0] || '/src/assets/AdsBannerSlide/AdsBannerSlide_1.jpg';
  const image2 = images[1]?.url || images[1] || images[0]?.url || images[0] || image1;

  const handleMinusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlusQuantity = () => {
    if (quantity < productData.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= productData.quantity) {
      setQuantity(value);
    }
  };

  const handleProductClick = () => {
    navigate(`/ProductDetails/${productData.id}`);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (context.setSelectedProduct) {
      context.setSelectedProduct(productData);
    }
    context.setOpenProductDetailsModel(true);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Add to cart:', productData.id, 'Quantity:', quantity);
    // Add to cart logic here
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Buy now:', productData.id, 'Quantity:', quantity);
    // Buy now logic - navigate to checkout
    navigate('/CheckOut');
  };

  return (
    <div className='ProductItemViewList'>
      <div className='imgWrapper'>  
        <div className='Product_Image_Box' onClick={handleProductClick}>
          <img src={image1} className='image_1' alt={productData.name} />
          <img src={image2} className='image_2' alt={productData.name} />
          {discount > 0 && <div className='Discount'>-{discount}%</div>}
          <div className='Product_Box_Button'>
            <Button 
              className='Complex_Button'
              onClick={handleQuickView}
            >
              <FaHeart />
            </Button>
            <Button 
              className='Complex_Button'
              onClick={(e) => e.stopPropagation()}
            >
              <FaCodeCompare />
            </Button>
            <Button 
              className='Complex_Button'
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
              }}
            >
              <RiShoppingBasket2Fill />
            </Button>
          </div>
        </div>
      </div>
      
      <div className='Product_Interact'>
        <div className='Product_Info'>
          <h5 className='Product_Name'>
            <a href='#' onClick={(e) => { e.preventDefault(); handleProductClick(); }}>
              {productData.name}
            </a>
          </h5>
          
          <div className='Product_Price'>
            <div>
              <h5 className='Product_Price_Title'>Price:</h5>
            </div>
            <div className='Product_Price_Value'>
              {productData.salePrice && productData.salePrice < productData.price && (
                <h5 className='Old-Price'>{formatPrice(originalPrice)}</h5>
              )}
              <h4 className="Now-Price">{formatPrice(displayPrice)}</h4>
            </div>
            {discount > 0 && (
              <div className='Product_Price_Sale'>
                <p className='Product_Price_Sale_text'>-{discount}%</p>
              </div>
            )}
          </div>

          <div className='Product_Bottom_Section'>
            <div className='Product_Detail_Info'>
              <h4 className='Product_State'>Product State:</h4>
              <div className='Product_State_Specification'>
                <h5 className={productData.quantity > 0 ? 'in-stock' : 'out-of-stock'}>
                  {productData.quantity > 0 ? 'Available' : 'Out of Stock'}
                </h5>
              </div>
            </div>
          </div>

          <div className="quantity-area">
            <div className="quantity-title">Quantity:</div>
            <button 
              type="button" 
              onClick={handleMinusQuantity} 
              className="qty-btn"
              disabled={quantity <= 1}
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
              max={productData.quantity}
              className="quantity-input"
            />
            <button 
              type="button" 
              onClick={handlePlusQuantity} 
              className="qty-btn"
              disabled={quantity >= productData.quantity}
            >
              <svg focusable="false" className="icon icon--plus" viewBox="0 0 10 10" role="presentation">
                <path d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z"></path>
              </svg>
            </button>
          </div>

          <div className='Product-Rating'>
            <div className="Rating-title">Rating:</div>
            <Rating 
              name={`rating-${productData.id}`} 
              value={productData.rating || 5} 
              readOnly 
              precision={0.5}
            />
            {productData.numReviews > 0 && (
              <span className='Review-Count'>({productData.numReviews})</span>
            )}
          </div>
          
          <div className='addcart-area'>
            <button 
              type="button"
              id="add-to-cart"
              className="add-to-cartProduct button dark btn-addtocart addtocart-modal"
              name="add"
              onClick={handleAddToCart}
              disabled={productData.quantity <= 0}
            >
              Add to cart
            </button>

            <button 
              type="button"
              id="buy-now"
              className="button dark btn-buynow btnBUY addtocart-modal"
              name="add"
              onClick={handleBuyNow}
              disabled={productData.quantity <= 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductItems