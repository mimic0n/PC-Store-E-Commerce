import React, { useState } from 'react'
import "/src/styles/Navigation.css"

import Button from '@mui/material/Button'
import { RiMenuFold2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { IoRocketSharp } from "react-icons/io5";
import Category from './Category';
import StaggeredDropDown from './Category_Dropdown'; // Changed from Category to Category_Dropdown


const items = [
    {
        label: "Home",
        href: "#"
    },
    { 
        label: "PC", 
        href: "#",
        submenu: [
            { label: "PC Gaming", href: "/pc-gaming" },
            { label: "PC Workstation", href: "/pc-workstation" }
        ]
    },
    { 
        label: "Gaming", 
        href: "#",
        submenu: [
            { label: "Console", href: "/console" },
            { label: "Keyboard", href: "/keyboard" },
            { label: "Mouse", href: "/mouse" },
            { label: "Headset", href: "/headset" }
        ]
    },
    {
        label: "Hardware", 
        href: "#",
        submenu: [
            { label: "CPU", href: "/CPU" },
            { label: "Mainboard", href: "/Mainboard" },
            { label: "RAM", href: "/RAM" },
            { label: "VGA", href: "/VGA" },
            { label: "SSD/HHD", href: "/SSD/HHD" },
            { label: "Heat Sink ", href: "/Heat Sink" },
            { label: "Case", href: "/Case" },
            { label: "PSU", href: "/PSU" }
        ]
    },
    {
        label: "Monitor", href: "#",
    }
];
export const Navigation = () => {
    const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const openCategory=() => { 
        setIsOpenCatPanel(true)
    }
    return (
        <>
        <Category isOpenCatPanel={isOpenCatPanel} setIsOpenCatPanel={setIsOpenCatPanel} sx={{
            zIndex: 500, // zIndex cho backdrop của Drawer (phần tối mờ)
            '& .MuiDrawer-paper': { // zIndex cho phần giấy (panel nội dung) của Drawer
              zIndex: 1201,
            },
        }} />

        <nav className='nav_3'>
            <div className='container'>
                <div className='col_1'>
                        <Button className='Shop_By_Categories_Button' onClick={openCategory}>
                        <RiMenuFold2Fill className='Shop_By_Categories_Icon_1' />
                        Shop By Categories
                        <FaAngleDown className='Shop_By_Categories_Icon_2' />
                    </Button>
                    </div>
                <div className='space'></div>

                <div className='col_2'>
                    <ul className='col2_page'>
                            {items.map((item, index) => (
                                <li
                                    key={index}
                                    className='col2_page_item'
                                    // Sự kiện khi di chuột vào và ra để đóng/mở submenu
                                    onMouseEnter={() => setOpenMenuIndex(index)}
                                    onMouseLeave={() => setOpenMenuIndex(null)}
                                >
                                    <a href={item.href} className='Page_link'>
                                        <Button className='Item_Button'>
                                            {item.label}
                                        </Button>
                                    </a>
                                    {/* Hiển thị submenu nếu có và đang được hover */}
                                    {item.submenu && openMenuIndex === index && (
                                        
                                        <ul className='submenu_dropdown'>
                                                <div>
                                                    {item.submenu.map((subItem, subIndex) => (
                                                <li key={subIndex} className='submenu_item'>
                                                    <a href={subItem.href} className='submenu_link'>{subItem.label}</a>
                                                </li>
                                            ))}
                                                </div>
                                        </ul>
                                    )}
                                </li>
                            ))}
                    </ul>
                    </div>
                    
                    <div className='space_1'></div>
                {/* <div className='col_3'></div> */}

                    <div className='col_4'>
                        <p className='col4_text'>
                        <IoRocketSharp  className='col4_text-icon'/>
                        Free International Delivery
                    </p>
                </div>
            </div>
            </nav>
           
    </>
  )
}

export default Navigation