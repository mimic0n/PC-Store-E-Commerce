import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "/src/styles/Navigation.css"

import Button from '@mui/material/Button'
import { RiMenuFold2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { IoRocketSharp } from "react-icons/io5";
import Category from './Category';
import { getAllCategories } from '/src/api/categoryService';

export const Navigation = () => {
    const navigate = useNavigate();
    const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [navItems, setNavItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories cho navigation
    useEffect(() => {
        const fetchNavCategories = async () => {
            try {
                const response = await getAllCategories({
                    parentId: 'null',
                    includeChildren: 'true',
                    isActive: true,
                    limit: 10
                });

                if (response.success) {
                    const items = [
                        { label: "Home", href: "/", slug: null },
                        ...response.data.map(cat => ({
                            label: cat.name,
                            href: `/category/${cat.slug}`,
                            slug: cat.slug,
                            submenu: cat.children?.length > 0
                                ? cat.children.map(child => ({
                                    label: child.name,
                                    href: `/category/${cat.slug}/${child.slug}`,
                                    slug: child.slug,
                                    parentSlug: cat.slug
                                }))
                                : null
                        }))
                    ];
                    setNavItems(items);
                }
            } catch (err) {
                console.error('Error fetching nav categories:', err);
                setNavItems([{ label: "Home", href: "/" }]);
            } finally {
                setLoading(false);
            }
        };

        fetchNavCategories();
    }, []);

    const openCategory = () => { 
        setIsOpenCatPanel(true)
    }

    const handleNavItemClick = (item, e) => {
        e.preventDefault();
        navigate(item.href);
    };

    const handleSubmenuClick = (subItem, e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(subItem.href);
        setOpenMenuIndex(null);
    };

    return (
        <>
            <Category 
                isOpenCatPanel={isOpenCatPanel} 
                setIsOpenCatPanel={setIsOpenCatPanel} 
            />
            <div className='Navigation_Container'>
                <nav className='nav_3'>
                    <div className='container'>
                        <div className='col_1'>
                            <Button className='Shop_By_Categories_Button' onClick={openCategory}>
                                <RiMenuFold2Fill className='Shop_By_Categories_Icon_1' />
                                <span className='Shop_By_Categories_Text'>Shop By Categories</span>
                                <FaAngleDown className='Shop_By_Categories_Icon_2' />
                            </Button>
                        </div>
                        <div className='space'></div>

                        <div className='col_2'>
                            <ul className='col2_page'>
                                {loading ? (
                                    <li className='col2_page_item'>Loading...</li>
                                ) : (
                                    navItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className='col2_page_item'
                                            onMouseEnter={() => setOpenMenuIndex(index)}
                                            onMouseLeave={() => setOpenMenuIndex(null)}
                                        >
                                            <a 
                                                href={item.href} 
                                                className='Page_link'
                                                onClick={(e) => handleNavItemClick(item, e)}
                                            >
                                                <Button className='Item_Button'>
                                                    {item.label}
                                                </Button>
                                            </a>
                                            {item.submenu && openMenuIndex === index && (
                                                <ul className='submenu_dropdown'>
                                                    <div>
                                                        {item.submenu.map((subItem, subIndex) => (
                                                            <li key={subIndex} className='submenu_item'>
                                                                <a 
                                                                    href={subItem.href} 
                                                                    className='submenu_link'
                                                                    onClick={(e) => handleSubmenuClick(subItem, e)}
                                                                >
                                                                    {subItem.label}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </div>
                                                </ul>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        
                        <div className='space_1'></div>

                        <div className='col_4'>
                            <p className='col4_text'>
                                <IoRocketSharp className='col4_text-icon'/>
                                Free International Delivery
                            </p>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Navigation