import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import './index.css'
import ClickSpark from "/src/styles/Animation/ClickSpark.jsx"
import FloatingLines from '/src/Background/Background.jsx';

import { IoClose } from "react-icons/io5";

import Header from './component/header/Header';
import Footer from './component/footer/Footer.jsx';
import CartSummary from './component/CartSummary/CartSummary.jsx';


import { ProductZoom_ForProductDetailsModel } from '/src/component/ProductZoom_ForProductDetailsModel/ProductZoom_ForProductDetailsModel.jsx'
import { ProductDetails_For_ProductDetailsModel } from '/src/component/ProductDetails_For_ProductDetailsModel/ProductDetails_For_ProductDetailsModel.jsx'
import { Home } from '/src/Page/Home/Home';
import { ProductListing } from './Page/ProductListing/ProductListing.jsx';
import { ProductDetails } from './Page/ProductDetails/ProductDetails.jsx';
import { Login } from './Page/Login/Login.jsx';
import { Register } from './Page/Register/Register.jsx';
import { CartPage } from './Page/CartPage/CartPage.jsx';
import { Verify } from './Page/Verify/Verify.jsx';
import { ForgotPassword } from './Page/ForgotPassword/ForgotPassword.jsx';
import { CheckOut } from './Page/CheckOut/CheckOut.jsx';
import { MyAccount } from './Page/MyAccount/MyAccount.jsx';
import { Orders} from './Page/MyAccount/Orders/Orders.jsx';
import { Wishlist } from './Page/MyAccount/Wishlist/Wishlist.jsx';
import { Addresses } from './Page/MyAccount/Addresses/Addresses.jsx';
import { Profile } from './Page/MyAccount/Profile/Profile.jsx';

import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { RiCloseLargeFill } from "react-icons/ri";

import toast, { Toaster } from 'react-hot-toast';

export const MyContext = createContext()

function App() {
  const [message, setMessage] = useState('');
  const [openProductDetailsModel, setOpenProductDetailsModel] = useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [isLogin , setisLogin] = useState(false);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openCartPanel, setOpenCartPanel] = React.useState(false);
  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const handleClickOpenProductDetailsModel = () => {
    setOpenProductDetailsModel(true);
  };

  const handleCloseProductDetailsModel = () => {
    setOpenProductDetailsModel(false);
  };

  const openAlertPanel = (status, msg) => { 
    if (status === "success") {
      toast.success(msg);
    }
    else if (status === "error") {
      toast.error(msg);
    }
  }
  
  useEffect(() => {
    const checkAuth = () => { 
      const savedUser = localStorage.getItem('user')
      const accessToken = localStorage.getItem("accessToken")

      if (savedUser && accessToken) { 
        setUser(JSON.parse(savedUser));
        setisLogin(true)
      }
      setIsLoading(false)
    }
    checkAuth();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  const handleLogout = () => { 
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setisLogin(false);
    openAlertPanel("success", "Đăng xuất thành công!");
  }

  const values = {
    setOpenProductDetailsModel,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
    openAlertPanel,
    isLogin,
    setisLogin,
    user,
    setUser,
    isLoading,
    handleLogout,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
            <div style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
              }}>
              <FloatingLines 
                enabledWaves={['top', 'middle', 'bottom']}
                // Array - specify line count per wave; Number - same count for all waves
                lineCount={[10, 15, 20]}
                // Array - specify line distance per wave; Number - same distance for all waves
                lineDistance={[8, 6, 4]}
                bendRadius={5.0}
                bendStrength={-0.5}
                interactive={true}
                parallax={true}
              />
            </div>
            <ClickSpark
                        sparkColor='#fff'
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}>
              <div className='rootContainer'>
                <Header className="Header" />
                </div>
                
                <Routes>
                  <Route path='/' element={ 
                    <div className='Swiper_Banner'>
                      <Home className="Home"/>
                    </div>
                  } />
                  
                  <Route path='Home' element={ 
                    <div className='Swiper_Banner'>
                      <Home className="Home"/>
                    </div>
                  } />

                  <Route path={"/ProductDetails/:id"} exact = "true" element={ 
                    <ProductDetails/>
                  } />
                  
                  <Route path={"/ProductListing/"} exact = "true" element={ 
                    <ProductListing/>
                  } />
                    
                  <Route path={"/Login/"} exact = "true" element={ 
                    <Login/>
                  } />
                    
                  <Route path={"/Register/"} exact = "true" element={ 
                    <Register/>
                  } />
                    
                  <Route path={"/CartPage/"} exact = "true" element={ 
                    <CartPage/>
                  } />
              
                  <Route path={"/Verify/"} exact = "true" element={ 
                    <Verify/>
                  } />  
              
                  <Route path={"/ForgotPassword/"} exact = "true" element={ 
                    <ForgotPassword/>
                  } />
              
                  <Route path={"/CheckOut/"} exact = "true" element={ 
                    <CheckOut/>
                  } />
              
                  <Route path="/MyAccount/*" element={<MyAccount />}>
                    <Route index element={<Profile />} /> {/* Default route - /MyAccount */}
                    <Route path="profile" element={<Profile />} /> {/* /MyAccount/profile */}
                    <Route path="orders" element={<Orders />} /> {/* /MyAccount/orders */}
                    <Route path="addresses" element={<Addresses />} /> {/* /MyAccount/addresses */}
                    <Route path="wishlist" element={<Wishlist />} /> {/* /MyAccount/wishlist */}
                  </Route>
              
              </Routes>

              

              <Footer />
                  <div className="card">
                {/* Hiển thị tin nhắn từ backend */}
                <p>{message || "Đang tải dữ liệu từ backend..."}</p>
                </div>
                  

              <Dialog
              fullWidth={fullWidth}
              maxWidth={maxWidth}
              open={openProductDetailsModel}
              onClose={handleCloseProductDetailsModel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              className='ProductDetailsModel_Root'
            >
              <DialogContent>
              <div className='Product_Details_Model_Container'>
                  <Button
                    className='Product_Details_Model_Container_CloseButton'
                    onClick={handleCloseProductDetailsModel}
                  >
                    <RiCloseLargeFill />
                  </Button>
                <div className='Product_Details_Model_Col1'>
                  <ProductZoom_ForProductDetailsModel/>
                </div>
                <div className='Product_Details_Model_Col2'>
                    <ProductDetails_For_ProductDetailsModel/> 
                </div>
              </div>
              </DialogContent>
            </Dialog>

            <Drawer 
              open={openCartPanel}
              onClose={toggleCartPanel(false)}
              anchor='right'
              PaperProps={{
                sx: {
                  width: { xs: '100%', sm: '450px', md: '500px' },
                  background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderLeft: '2px solid rgba(138, 43, 226, 0.3)',
                }
              }}
            >
              <div className='CartSummary' style={{ 
                padding: '1.5rem 1rem',
                height: '100%',
                overflow: 'auto'
                    }}>
                <div className='cart-summary-close-icon'><IoClose onClick={toggleCartPanel(false)} /></div>
                <CartSummary />
              </div>
            </Drawer>
          </ClickSpark>
        </MyContext.Provider>  
      </BrowserRouter>

      <Toaster />
    </>   
  );
}

export default App;
