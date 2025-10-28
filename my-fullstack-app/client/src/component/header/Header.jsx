import React from 'react'

import "/src/styles/Header.css"


import ClickSpark from "/src/styles/Animation/ClickSpark.jsx"
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'

import Search from './Search/Search'
import Navigation from './navigation/Navigation';

import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { RiShoppingBasket2Fill } from "react-icons/ri";
import Tooltip from '@mui/material/Tooltip';
import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";





const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));



 const Header = () => {
   return (
       <div className='Header_Background'>
      <ClickSpark
            sparkColor='#fff'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}>
      <header>
          <div className='nav1'>
              <div className='container'>
                  <div className='flex-container'> 
                      <div className="col1 "> 
                          <p className='SaleFont'> Big Sale Season , Dont't dare to missed the event XD </p>
                      </div>
                      <div className='col2'>
                          <ul className='nav-bar'>
                              <li className='list-none'>
                                  <p><a  href='#' className='Help_Center'>Help Center </a></p>
                              </li>  
                              <li className='list-none'>
                                  <p><a  href='#' className='Order_Tracking'>Order Tracking </a></p>
                              </li>  
                          </ul>
                      </div>
                  </div>
              </div>
          </div>

          <div className='header'>
            <div className='nav2'>
                <div className='col1'>
                 <a href='#' className="logo-container" >
                   <img className="Console" src="/src/assets/Metal_Console.png"></img>
                   <GradientText
                           colors={["#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8"]}
                           animationSpeed={8}
                           showBorder={false}
                           className="custom-class"
                           >
                           <h3 className='Shop_Name_Title'>HKT STORE </h3>
                    </GradientText>
                 </a>
                  </div>
                <div className='col2'> 
                        <Search/>
                </div>
                  <div className='col3'>
                      <ul className="col3Tab"> 
                        <li className='Login-Resigter'>
                         <a href='#' target="_blank" className='LoginButton'>Login</a>
                             |
                         <a href='#' target="_blank" className='LoginButton'>Resigter</a>
                        </li>
                          <li className="list-none">
                              <Tooltip title="Shop">
                                <IconButton aria-label="cart">
                                      <StyledBadge badgeContent={4}
                                                    color="primary" 
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                        backgroundColor: '#673ab7',
                                                        color: 'white',
                                                        },
                                                    }}>
                                        <RiShoppingBasket2Fill className="shopIcon" />
                                    </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                          </li>
                          <li className="list-none">
                              <Tooltip title="Favourite">
                              <IconButton aria-label="cart">
                                  <StyledBadge badgeContent={4}
                                                color="primary" 
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                        backgroundColor: '#673ab7',
                                                        color: 'white',
                                                        },
                                                    }}>
                                    <FaHeart className="shopIcon"/>
                                </StyledBadge>
                                  </IconButton>
                            </Tooltip>
                          </li>
                          <li className="list-none">
                              <Tooltip title="Compare">
                              <IconButton aria-label="cart">
                                  <StyledBadge badgeContent={4}
                                                color="primary" 
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                        backgroundColor: '#673ab7',
                                                        color: 'white',
                                                        },
                                                    }}>
                                    <FaCodeCompare className="shopIcon"/>
                                  </StyledBadge>
                                  </IconButton>
                                  </Tooltip>
                              </li>
                      </ul>
                </div>
            </div>
                   </div>
                   <div className='nav3'>
                       <Navigation />
                     </div>
         </header>
       </ClickSpark>
       </div>
  )
}
 export default Header