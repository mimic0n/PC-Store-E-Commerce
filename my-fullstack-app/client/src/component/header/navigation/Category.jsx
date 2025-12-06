import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";
import { getCategoryTree, getAllCategories } from '/src/api/categoryService';
import "/src/styles/Category.css"

const Category = (props) => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Lấy root categories với children
        const response = await getAllCategories({
          parentId: 'null',
          includeChildren: 'true',
          isActive: true,
          limit: 50
        });
        
        if (response.success) {
          // Transform data để match với UI structure
          const transformedData = response.data.map(cat => ({
            id: cat.id,
            title: cat.name,
            slug: cat.slug,
            submenu: cat.children?.length > 0 
              ? cat.children.map(child => ({
                  id: child.id,
                  label: child.name,
                  href: `/${child.slug}`,
                  // Level 3 nếu có
                  children: child.children?.map(subChild => ({
                    id: subChild.id,
                    label: subChild.name,
                    href: `/${subChild.slug}`
                  }))
                }))
              : null
          }));
          setCategories(transformedData);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    // Chỉ fetch khi drawer mở
    if (props.isOpenCatPanel) {
      fetchCategories();
    }
  }, [props.isOpenCatPanel]);

  const toggleDrawer = (newOpen) => () => {
    props.setIsOpenCatPanel(newOpen);
  };

  const openSubmenu = (index) => {
    setSubmenuIndex(submenuIndex === index ? null : index);
  };

  const handleSubmenuClick = () => {
    if (window.innerWidth <= 768) {
      props.setIsOpenCatPanel(false);
    }
  };

  const DrawerList = (
    <div className='Category_Container'>
      <Box sx={{ width: 250 }} role="presentation" className="CategoryPanel">
        <GradientText
          colors={["#757F9A", "#D7DDE8", "#757F9A", "#D7DDE8", "#757F9A", "#D7DDE8"]}
          animationSpeed={8}
          showBorder={false}
          className="custom-class"
        >
          <h3 className='Category_Panel_Title'>Shop By Category</h3>
        </GradientText>

        <div className='Category_Panel_List'>
          <div className='scroll'>
            {/* Loading State */}
            {loading && (
              <div className='Category_Loading'>
                <p>Đang tải danh mục...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className='Category_Error'>
                <p>{error}</p>
              </div>
            )}

            {/* Categories List */}
            {!loading && !error && (
              <ul className='Category_List'>
                {categories.length === 0 ? (
                  <li className='Category_Empty'>Chưa có danh mục nào</li>
                ) : (
                  categories.map((category) => (
                    <li 
                      key={category.id} 
                      className={`Category_List_Item ${submenuIndex === category.id ? 'open' : ''}`}
                    >
                      <Button
                        className='Category_List_Item_Button'
                        onClick={() => category.submenu ? openSubmenu(category.id) : null}
                        href={!category.submenu ? `/${category.slug}` : undefined}
                        aria-expanded={submenuIndex === category.id}
                        aria-controls={category.submenu ? `submenu-${category.id}` : undefined}
                      >
                        {category.title}
                        {category.submenu && (
                          submenuIndex === category.id ? (
                            <HiMinusCircle className='Plus_icon' aria-label="Collapse menu" />
                          ) : (
                            <BsFillPlusCircleFill className='Plus_icon' aria-label="Expand menu" />
                          )
                        )}
                      </Button>

                      {/* Level 2 Submenu */}
                      {category.submenu && submenuIndex === category.id && (
                        <ul className='subMenu' id={`submenu-${category.id}`}>
                          {category.submenu.map((subItem) => (
                            <li key={subItem.id} className='subMenu_Item'>
                              <Button
                                href={subItem.href}
                                className='subMenu_Item_Button'
                                onClick={handleSubmenuClick}
                              >
                                {subItem.label}
                              </Button>
                              
                              {/* Level 3 nếu có */}
                              {subItem.children?.length > 0 && (
                                <ul className='subMenu_Level3'>
                                  {subItem.children.map((level3) => (
                                    <li key={level3.id}>
                                      <Button
                                        href={level3.href}
                                        className='subMenu_Level3_Button'
                                        onClick={handleSubmenuClick}
                                      >
                                        {level3.label}
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </Box>
    </div>
  );

  return (
    <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}> 
      {DrawerList}
    </Drawer>
  );
};

export default Category;