import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductItems.css';

import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

import { FaHeart } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";
import { FaCodeCompare } from "react-icons/fa6";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { MyContext } from '../../App';
import { useCart } from '../../context/CartContext';

export const ProductItems = ({ product }) => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { addToCart, loading } = useCart();

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
    rating: 5
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
  const image1 = productData.thumbnail || images[0]?.url || '/src/assets/AdsBannerSlide/AdsBannerSlide_1.jpg';
  const image2 = images[1]?.url || images[0]?.url || image1;

  const handleProductClick = () => {
    navigate(`/ProductDetails/${productData.id}`);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    context.setSelectedProduct(productData);
    context.setOpenProductDetailsModel(true);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(productData, 1);
    context.setOpenCartPanel(true);
  };

  return (
    <div className='ProductItem' onClick={handleProductClick}>
      <div className='imgWrapper'>  
        <img src={image1} className='image_1' alt={productData.name} loading="lazy" />
        <img src={image2} className='image_2' alt={productData.name} loading="lazy" />
        {discount > 0 && <div className='Discount'>-{discount}%</div>}
        <div className='Product_Box_Button'>
          <Button 
            className='Complex_Button'
            onClick={handleQuickView}
          >
            <LuExpand />
          </Button>
          <Button className='Complex_Button' onClick={(e) => e.stopPropagation()}>
            <FaCodeCompare />
          </Button>
          <Button className='Complex_Button' onClick={(e) => e.stopPropagation()}>
            <FaHeart />
          </Button>
        </div>
      </div>
      
      <div className='Product_Info'>
        <h5 className='Product_Name'>
          <a href='#' onClick={(e) => e.preventDefault()}>
            {productData.name}
          </a>
        </h5>
        <h4 className="Now-Price">{formatPrice(displayPrice)}</h4>
        {productData.salePrice && productData.salePrice < productData.price && (
          <h6 className='Old-Price'>{formatPrice(originalPrice)}</h6>
        )}
        <div className='Product-Rating'></div>
        <Rating name="read-only" value={productData.rating || 5} readOnly />
        <div className='addcart-area'>
          <button 
            type="button"
            id="add-to-cart"
            className="btn-addtocart"
            name="add"
            disabled={loading}
            onClick={handleAddToCart}
          >
            <div className='btn-addtocart-icon'>
              <RiShoppingBasket2Fill /> 
            </div>
            <div className='btn-addtocart-text'>
              {loading ? 'Adding...' : 'Add to cart'}
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductItems