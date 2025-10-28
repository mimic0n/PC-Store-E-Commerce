
import React,{useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";


import "/src/styles/Category.css"



const Category = (props) => {
  const [ submenuIndex , setSubmenuIndex] = useState(null)

  const toggleDrawer = (newOpen) => () => {
    props.setIsOpenCatPanel(newOpen)
  };
  const openSubmenu = (index) => { 
    if (submenuIndex === index) {
      setSubmenuIndex(null)
    }
    else { 
      setSubmenuIndex(index)
    }
  }
 

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className = "CategoryPanel">
    <GradientText
        colors={["#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8"]}
        animationSpeed={8}
        showBorder={false}
        className="custom-class"
        >
        <h3 className='Category_Panel_Title'>Shop By Category </h3>
        </GradientText>

        <div className='scroll'>
          <ul className='Category_List'>
          <li className='Category_List_Item'>
            <div >
              {submenuIndex === 0 ? (
              <Button className='Category_List_Item_Button'onClick={()=> openSubmenu(0)}>
                PC
                <HiMinusCircle className='Plus_icon' onClick={() => openSubmenu(0)} />
                </Button>
              ) : (
                <Button className='Category_List_Item_Button'onClick={()=> openSubmenu(0)}>
                PC
                <BsFillPlusCircleFill className='Plus_icon' onClick={() => openSubmenu(0)} />
                </Button>
              )}
              
                {submenuIndex === 0 && (
                  <ul className='subMenu'>
                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      PC Gaming
                       {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                    </li>

                    <li className='subMenu_Item'>
                    <Button target='/' className='subMenu_Item_Button'>
                    PC Workstation
                    {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                    </li>
                  </ul>
                )}
            </div>

            <div >
              {submenuIndex === 1 ? (
              <Button className='Category_List_Item_Button'onClick={()=> openSubmenu(1)}>
                Gaming Gear
                <HiMinusCircle className='Plus_icon' onClick={() => openSubmenu(1)} />
                </Button>
              ) : (
                <Button className='Category_List_Item_Button'onClick={()=> openSubmenu(1)}>
                Gaming Gear
                <BsFillPlusCircleFill className='Plus_icon' onClick={() => openSubmenu(1)} />
                </Button>
              )}
              
                {submenuIndex === 1 && (
                  <ul className='subMenu'>
                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      Console
                       {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                    </li>

                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      Keyboard
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>
                  
                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      Mouse
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>
                  
                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      Headset
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>
                  </ul>
                )}
            </div>

            <div >
              {submenuIndex === 2 ? (
              <Button className='Category_List_Item_Button'onClick={()=> openSubmenu(2)}>
                Hardware
                <HiMinusCircle className='Plus_icon' onClick={() => openSubmenu(2)} />
                </Button>
              ) : (
                <Button className='Category_List_Item_Button'onClick={()=> openSubmenu(2)}>
                Hardware
                <BsFillPlusCircleFill className='Plus_icon' onClick={() => openSubmenu(2)} />
                </Button>
              )}
              
                {submenuIndex === 2 && (
                  <ul className='subMenu'>
                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      CPU
                       {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                    </li>

                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      Mainboard
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>
                  
                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      RAM
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>
                  
                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      VGA
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>

                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      SSD/HHD
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>

                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      Tản Nhiệt
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>

                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      Case
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>

                    <li className='subMenu_Item'>
                      <Button target='/' className='subMenu_Item_Button'>
                      PSU
                      {/* <BsFillPlusCircleFill className='Plus_icon' />*/}</Button> 
                  </li>
                  </ul>
                )}
            </div>
            
            <div > 
                    <Button className='Category_List_Item_Button'onClick={()=> openSubmenu(3)}>
                      Monitor
                      </Button>
                  </div>
          </li>
          </ul>
        </div>
    </Box>
  );
  return (
      <>
      <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}> 
        {DrawerList}
        </Drawer>
      </>
  )
}
export default Category
