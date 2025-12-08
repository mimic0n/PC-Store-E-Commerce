import React, {useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext';

import "/src/styles/Header.css"

import ClickSpark from "/src/styles/Animation/ClickSpark.jsx"
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'

import Search from './Search/Search'
import Navigation from './navigation/Navigation';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';


import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";

import { MyContext } from '../../App';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogoutClick = () => {
      handleClose();
      context.handleLogout();
      navigate('/');
    };

    const handleProfileClick = () => {
      handleClose();
      navigate('/MyAccount/profile');
    };

    const handleMyAccountClick = () => {
      handleClose();
      navigate('/MyAccount');
    };

    const { cartCount } = useCart();

    return (
       <div className='Header_Background'>
      <ClickSpark
            sparkColor='#fff'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}>
      <header className='HeaderContainer'>
          <div className='nav1'>
              <div className='container'>
                  <div className='flex-container'> 
                      <div className="col1 "> 
                          <p className='SaleFont'> Big Sale Season , Dont't dare to missed the event XD </p>
                      </div>
                      <div className='col2'>
                        <ul className='nav-bar'>
                                   
                        {context.isLogin && context.user
                            ?
                            <li className='Logout'>
                                <div className='UserPlace'>
                                    <React.Fragment>
                                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                            <Tooltip title="Account settings">
                                            <IconButton
                                                onClick={handleClick}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={open ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                            >
                                                <Avatar sx={{ width: 32, height: 32 }}>
                                                  {context.user?.fullName?.charAt(0).toUpperCase() || <FaRegUser />}
                                                </Avatar>
                                            </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={open}
                                            onClose={handleClose}
                                            onClick={handleClose}
                                            slotProps={{
                                            paper: {
                                                elevation: 0,
                                                sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                                },
                                            },
                                            }}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <MenuItem onClick={handleProfileClick}>
                                              <Avatar>{context.user?.fullName?.charAt(0).toUpperCase()}</Avatar> 
                                              Profile
                                            </MenuItem>
                                            <MenuItem onClick={handleMyAccountClick}>
                                              <Avatar>{context.user?.fullName?.charAt(0).toUpperCase()}</Avatar> 
                                              My account
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem onClick={handleClose}>
                                            <ListItemIcon>
                                                <Settings fontSize="small" />
                                            </ListItemIcon>
                                            Settings
                                            </MenuItem>
                                            <MenuItem onClick={handleLogoutClick}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                            </MenuItem>
                                        </Menu>
                                        </React.Fragment>
                                    <div className='User-info'>
                                        <div className='User-name'>{context.user?.fullName || 'User'}</div>
                                        <div className='User-email'>
                                            {context.user?.email || 'email@example.com'}
                                        </div>
                                    </div>
                                    </div>
                                <BiLogOut className='LogoutIcon' onClick={handleLogoutClick} style={{ cursor: 'pointer' }}/>
                                <span className='LoginButton' onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>Logout</span>
                            </li>
                            :
                            <li className='Login-Resigter'>
                                <Link to='/Login' className='LoginButton'>Login</Link>
                                <span>|</span>
                                <Link to='/Register' className='LoginButton'>Register</Link>
                            </li> }
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
                           <h3 className='Shop_Name_Title' >HKT STORE </h3>
                    </GradientText>
                 </a>
                  </div>
                <div className='col2'> 
                        <Search/>
                </div>
                        <div className='col3'>
                            <ul className="col3Tab"> 
                                <li className="item-cart" style={{'--i':'#3C096C', '--j':'#FF006E'}} onClick={() => context.setOpenCartPanel(true)}>
                                    <Tooltip title="Cart">
                                        <IconButton aria-label="cart">
                                            <StyledBadge badgeContent={cartCount}
                                                color="primary" 
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        backgroundColor: '#673ab7',
                                                        color: 'white',
                                                    },
                                                }}>
                                                <RiShoppingBasket2Fill className="shopIcon"  />
                                            </StyledBadge>
                                        </IconButton>
                                    </Tooltip>
                                    <span className="item-cart-title" onClick={() => context.setOpenCartPanel(true)}>Shop</span>
                                </li>
                                
                                <li className="item-cart" style={{'--i':'#3C096C', '--j':'#FF006E'}}>
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
                                    <span className="item-cart-title">Favourite</span>
                                </li>
                                
                                <li className="item-cart" style={{'--i':'#3C096C', '--j':'#FF006E'}}>
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
                                    <span className="item-cart-title">Compare</span>
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