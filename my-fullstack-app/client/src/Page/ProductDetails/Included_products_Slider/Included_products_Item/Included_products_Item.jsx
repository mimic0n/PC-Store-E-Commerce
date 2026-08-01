import React from 'react'

import './Included_products_Item.css';

import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { RiShoppingBasket2Fill } from "react-icons/ri";


export const Included_products_Item = () => {
  return (
      <div className='Included_products_Item'>
          <div className='imgWrapper'>  
        <img src="/src/assets/Product/Keyboard/AULA S98 Pro/250_12664_ban_phim_co_aula_s98_pro_3_mode_starry_cloud_paleo_dust_switch_4.png" className='image_1' loading="lazy"></img>
        <img src="/src/assets/Product/Keyboard/AULA S98 Pro/12664_ban_phim_co_aula_s98_pro_3_mode_starry_cloud_paleo_dust_switch_1.png" className='image_2' loading="lazy"></img>
        </div>
      
      <div className='Product_Info'>
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
