import React from 'react'
import './ProductItems.css';

import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import Button from '@mui/material/Button';

import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { RiShoppingBasket2Fill } from "react-icons/ri";

const slideData = [
  { id: 1, img: "/src/assets/Home_Banner/HomeSlider_1-1920x560px.jpg", alt: "Slide Category Banner 1" ,},
  { id: 2, img: "/src/assets/Home_Banner/HomeSlider_2-1920x560px.jpg", alt: "Slide Category Banner 2" ,},
  { id: 3, img: "/src/assets/Home_Banner/HomeSlider_3-1920x560px.jpg", alt: "Slide Category Banner 3" ,},
  { id: 4, img: "/src/assets/Home_Banner/HomeSlider_4-1920x560px.jpg", alt: "Slide Category Banner 4" ,},
];

export const ProductItems = () => {
  return (
      <div className='ProductItem'>
          <div className='imgWrapper'>  
        <img src="/src/assets/AdsBannerSlide/AdsBannerSlide_1.jpg" className='image_1'></img>
        <img src="/src/assets/AdsBannerSlide/AdsBannerSlide_2.jpg" className='image_2'></img>
        <div className='Discount'> -18%</div>
        <div className='Product_Box_Button'>
          <Button className='Complex_Button'><FaHeart /></Button>
          <Button className='Complex_Button'><FaCodeCompare /></Button>
          <Button className='Complex_Button'><RiShoppingBasket2Fill /></Button>
        </div>
        </div>
      
      <div className='Product_Info'>
        
        <h5 className='Product_Name'><a href='#'> PC KCC AMD R7-9800x3d / RTX 4070 super</a></h5>
        <h4 className="Now-Price"> 48.800.000 VND </h4>
        <h6 className='Old-Price'> 52.700.000 VND</h6>
      </div>
          
    </div>
    
    
  )
}
