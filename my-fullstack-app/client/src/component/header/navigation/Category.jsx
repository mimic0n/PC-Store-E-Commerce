import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";
import { getAllCategories } from '/src/api/categoryService';
import "/src/styles/Category.css"

const Category = (props) => {
  const navigate = useNavigate();
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories({
          parentId: 'null',
          includeChildren: 'true',
          isActive: true,
          limit: 50
        });
        
        if (response.success) {
          const transformedData = response.data.map(cat => ({
            id: cat.id,
            title: cat.name,
            slug: cat.slug,
            submenu: cat.children?.length > 0 
              ? cat.children.map(child => ({
                  id: child.id,
                  label: child.name,
                  slug: child.slug,
                  parentSlug: cat.slug,
                  children: child.children?.map(subChild => ({
                    id: subChild.id,
                    label: subChild.name,
                    slug: subChild.slug,
                    parentSlug: child.slug,
                    grandParentSlug: cat.slug
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

  // Navigate to category page
  const handleCategoryClick = (category) => {
    props.setIsOpenCatPanel(false);
    navigate(`/category/${category.slug}`);
  };

  // Navigate to subcategory page
  const handleSubCategoryClick = (subItem) => {
    props.setIsOpenCatPanel(false);
    navigate(`/category/${subItem.parentSlug}/${subItem.slug}`);
  };

  // Navigate to third level category page
  const handleThirdLevelClick = (level3Item) => {
    props.setIsOpenCatPanel(false);
    navigate(`/category/${level3Item.grandParentSlug}/${level3Item.parentSlug}/${level3Item.slug}`);
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
            {loading && (
              <div className='Category_Loading'>
                <p>Đang tải danh mục...</p>
              </div>
            )}

            {error && !loading && (
              <div className='Category_Error'>
                <p>{error}</p>
              </div>
            )}

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
                        onClick={() => {
                          if (category.submenu) {
                            openSubmenu(category.id);
                          } else {
                            handleCategoryClick(category);
                          }
                        }}
                        aria-expanded={submenuIndex === category.id}
                        aria-controls={category.submenu ? `submenu-${category.id}` : undefined}
                      >
                        <span 
                          className='Category_Title_Text'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category);
                          }}
                        >
                          {category.title}
                        </span>
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
                                className='subMenu_Item_Button'
                                onClick={() => handleSubCategoryClick(subItem)}
                              >
                                {subItem.label}
                              </Button>
                              
                              {/* Level 3 nếu có */}
                              {subItem.children?.length > 0 && (
                                <ul className='subMenu_Level3'>
                                  {subItem.children.map((level3) => (
                                    <li key={level3.id}>
                                      <Button
                                        className='subMenu_Level3_Button'
                                        onClick={() => handleThirdLevelClick(level3)}
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