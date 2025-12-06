import React, { useState , useContext } from 'react'
import './ProductItems.css';

import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { MyContext } from '../../App';

const slideData = [
  { id: 1, img: "/src/assets/Home_Banner/HomeSlider_1-1920x560px.jpg", alt: "Slide Category Banner 1" ,},
  { id: 2, img: "/src/assets/Home_Banner/HomeSlider_2-1920x560px.jpg", alt: "Slide Category Banner 2" ,},
  { id: 3, img: "/src/assets/Home_Banner/HomeSlider_3-1920x560px.jpg", alt: "Slide Category Banner 3" ,},
  { id: 4, img: "/src/assets/Home_Banner/HomeSlider_4-1920x560px.jpg", alt: "Slide Category Banner 4" ,},
];

export const ProductItems = () => {

  const [value, setValue] = React.useState(5);
  const context = useContext(MyContext);

  return (
      <div className='ProductItem'>
          <div className='imgWrapper'>  
        <img src="/src/assets/AdsBannerSlide/AdsBannerSlide_1.jpg" className='image_1'></img>
        <img src="/src/assets/AdsBannerSlide/AdsBannerSlide_2.jpg" className='image_2'></img>
        <div className='Discount'> -18%</div>
        <div className='Product_Box_Button'>
          <Button className='Complex_Button'
                  onClick={() => context.setOpenProductDetailsModel(true)}><FaHeart /></Button>
          <Button className='Complex_Button'><FaCodeCompare /></Button>
          <Button className='Complex_Button'><RiShoppingBasket2Fill /></Button>
        </div>
        </div>
      
      <div className='Product_Info'>
        
        <h5 className='Product_Name'><a href='#'> PC KCC AMD R7-9800x3d / RTX 4070 super</a></h5>
        <h4 className="Now-Price"> 48.800.000 VND </h4>
        <h6 className='Old-Price'> 52.700.000 VND</h6>
        <div className='Product-Rating'></div>
        <Rating name="read-only" value={value} readOnly />
        <div className='addcart-area'>
          <button type="button"
              id="add-to-cart"
              className=" btn-addtocart "
            name="add">
            <div className='btn-addtocart-icon'>
              <RiShoppingBasket2Fill /> 
            </div>
            <div className='btn-addtocart-text'>
                Add to cart
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductItems
