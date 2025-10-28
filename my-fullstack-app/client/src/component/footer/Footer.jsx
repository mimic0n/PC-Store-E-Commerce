import React from 'react'
import { FaShippingFast } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { GiWallet } from "react-icons/gi";
import { FaGifts } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { IoChatboxEllipses } from "react-icons/io5";
import { Link } from 'react-router-dom'; 
import { BsDiscord , BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import './Footer.css'

export const Footer = () => {
  return (
      <footer className='Box'>
          <div className='contanier'>
            <div className='Value_Property'>
                  <div className='Value_Column'>
                      <FaShippingFast className='ICON' />
                      <h3>Free Shipping</h3>
                      <p>On all orders over $1000</p>
              </div>
          
              <div className='Value_Column'>
                      <GiReturnArrow className='ICON' />
                      <h3>30 Days Returns</h3>
                      <p>For an Exchange Product</p>
            </div>
          
            <div className='Value_Column'>
                      <GiWallet className='ICON' />
                      <h3>Secured Payment</h3>
                      <p>Payment Cards Accepted</p>
            </div>
          
            <div className='Value_Column'>
                      <FaGifts className='ICON' />
                      <h3>Special Gifts</h3>
                      <p>Our First Product Order</p>
            </div>
          
            <div className='Value_Column'>
                      <BiSupport className='ICON' />
                      <h3>Support 24/7</h3>
                      <p>Contact us Anytime</p>
            </div>
          </div>
        
          <div className='footer'>
          <div className='col1'>
             <h2 className='Footer_Font_1'>Contact US</h2>
            <p className='Footer_Font_2'>HKT STORE - Super PC Store 369 <br/> Union Trade Center Vietnam</p>
            <Link className='link' to='/contact'>HKT_Store@gmail.com</Link>
              <span className='Phone'>+84 123 456 789</span>
              <div className='Description'><IoChatboxEllipses className='footer_ICON' />
                <span className='Footer_Font_3'> Online Chat <br/> Get Expert Help </span>
              </div>
          </div>
          
          <div className='col2'>
            <div className='col2_part1'>
              <h2 className='Footer_Font_1'>Products</h2>
              <ul>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Price Drop</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>New Product</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Best Sale</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Contact Us</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Site Map</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Stores</Link></li>
              </ul>

            </div>

            <div className='col2_part2'>
              <h2 className='Footer_Font_1'>Our Store</h2>
              <ul>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Delivery</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Legal Notice</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Terms And Conditions of use</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>About Us</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Secure Payment</Link></li>
                <li className='col2_link'><Link to='/products/laptops' className='link'>Login</Link></li>
              </ul>

            </div>

          </div>
          
          <div className='col3'>
            <h2 className='Col3_Font_1'>Subscribe to Newsletter</h2>
            <p className='Footer_Font_2'>Get all the latest information on Events, Sales and Offers. </p>
            <form className='Subscribe_Box'>
              <input type="text" className='Subscribe_Input' placeholder='Enter your email address' />
              <button className='Subscribe_Button'>Subscribe</button>
               <FormControlLabel control={<Checkbox defaultChecked />} label="I agree to the terms and conditions and the privacy policy" />
          </form>
          </div>
        </div>

         <div className="footer-bottom">
           {/* <p className='footer_bottom_Font'>Get all the latest information on Events, Sales and Offers. </p> */}
          <div className="footer-social">
            <ul className='footer-social-list'>
              <li className='footer-social_link' >
                <Link to='/' className='footer-social_icon'>
                  <BsFacebook className='footer-social_icon_Link' />
                </Link>
              </li>
              <li className='footer-social_link' >
                <Link to='/' className='footer-social_icon'>
                  <BsInstagram className='footer-social_icon_Link' />
                </Link>
              </li>
              <li className='footer-social_link' >
                <Link to='/' className='footer-social_icon'>
                  <BsTwitter className='footer-social_icon_Link' />
                </Link>
              </li>
                <li className='footer-social_link' >
                  <Link to='/' className='footer-social_icon'>
                    <BsGithub className='footer-social_icon_Link' />
                  </Link>
              </li>
              <li className='footer-social_link' >
                  <Link to='/' className='footer-social_icon'>
                    <BsDiscord className='footer-social_icon_Link' />
                  </Link>
              </li>
              
            </ul>

            <p className='footerBottom_Font'> HKTshop © 2025 - Eccomerce PC Store!</p>

            <div className='footer-payment'>
              <img src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_blockpaymentlogo/views/img/carte_bleue.png" alt="Payment Methods" className='footer-payment_img' />
              <img src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_blockpaymentlogo/views/img/visa.png" alt="Payment Methods" className='footer-payment_img' />
              <img src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_blockpaymentlogo/views/img/master_card.png" alt="Payment Methods" className='footer-payment_img' />
              <img src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_blockpaymentlogo/views/img/american_express.png" alt="Payment Methods" className='footer-payment_img' />
              <img src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_blockpaymentlogo/views/img/paypal.png" alt="Payment Methods" className='footer-payment_img' />
            </div>
          </div>
        </div>
        </div>
    </footer>
  )
}

export default Footer