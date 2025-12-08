import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideBar.css';
import { Collapse } from 'react-collapse';
import { FaAngleDown, FaAngleUp, FaChevronRight } from "react-icons/fa6";
import { Button, FormControlLabel, Checkbox, Slider } from '@mui/material';
import { getAllCategories } from '../../api/categoryService';

export const SideBar = ({ currentCategoryId, onFilterChange }) => {
  const navigate = useNavigate();
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenBrandFilter, setIsOpenBrandFilter] = useState(true);
  const [isOpenPriceFilter, setIsOpenPriceFilter] = useState(true);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200000000]);

  // Brands tĩnh (có thể fetch từ API nếu có)
  const brands = ['AMD', 'Intel', 'NVIDIA', 'MSI', 'Asus', 'Gigabyte', 'Acer', 'Dell', 'Logitech', 'Razer'];

  // Price ranges cho VND
  const priceRanges = [
    { label: 'Dưới 10 triệu', min: 0, max: 10000000 },
    { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
    { label: '20 - 50 triệu', min: 20000000, max: 50000000 },
    { label: '50 - 100 triệu', min: 50000000, max: 100000000 },
    { label: 'Trên 100 triệu', min: 100000000, max: 999999999 },
  ];

  // Fetch ALL categories với full tree structure
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories({
          parentId: 'null',
          includeChildren: 'true',
          isActive: true,
          limit: 100
        });
        
        if (response.success) {
          setCategories(response.data);
          
          // Auto expand category chứa currentCategoryId
          if (currentCategoryId) {
            const expanded = {};
            response.data.forEach(cat => {
              // Check if current category is this category or in its children
              if (cat.id === currentCategoryId) {
                expanded[cat.id] = true;
              }
              if (cat.children) {
                cat.children.forEach(child => {
                  if (child.id === currentCategoryId) {
                    expanded[cat.id] = true;
                    expanded[child.id] = true;
                  }
                  if (child.children) {
                    child.children.forEach(grandChild => {
                      if (grandChild.id === currentCategoryId) {
                        expanded[cat.id] = true;
                        expanded[child.id] = true;
                      }
                    });
                  }
                });
              }
            });
            setExpandedCategories(expanded);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentCategoryId]);

  // Toggle expand/collapse category
  const toggleCategory = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle category click - navigate to category page
  const handleCategoryClick = (category, parentSlugs = []) => {
    let path = '/category';
    parentSlugs.forEach(slug => {
      path += `/${slug}`;
    });
    path += `/${category.slug}`;
    navigate(path);
  };

  // Handle price range change
  const handlePriceRangeSelect = (range) => {
    setPriceRange([range.min, range.max]);
    if (onFilterChange) {
      onFilterChange({ minPrice: range.min, maxPrice: range.max });
    }
  };

  // Handle price slider change
  const handlePriceSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceSliderCommit = (event, newValue) => {
    if (onFilterChange) {
      onFilterChange({ minPrice: newValue[0], maxPrice: newValue[1] });
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 200000000]);
    setExpandedCategories({});
    if (onFilterChange) {
      onFilterChange({ categoryId: null, minPrice: null, maxPrice: null, brand: null });
    }
    navigate('/ProductListing');
  };

  // Format price để hiển thị
  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  // Recursive component để render categories
  const CategoryItem = ({ category, level = 0, parentSlugs = [] }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category.id];
    const isActive = currentCategoryId === category.id;
    
    return (
      <li className={`category-item level-${level}`}>
        <div 
          className={`category-link ${isActive ? 'active' : ''}`}
          style={{ paddingLeft: `${12 + level * 15}px` }}
        >
          {hasChildren && (
            <span 
              className={`category-toggle ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => toggleCategory(category.id, e)}
            >
              <FaChevronRight />
            </span>
          )}
          <span 
            className='category-name'
            onClick={() => handleCategoryClick(category, parentSlugs)}
          >
            {category.name}
          </span>
          {hasChildren && (
            <span className='category-count'>({category.children.length})</span>
          )}
        </div>
        
        {/* Nested children */}
        {hasChildren && isExpanded && (
          <ul className='subcategory-list'>
            {category.children.map((child) => (
              <CategoryItem 
                key={child.id} 
                category={child} 
                level={level + 1}
                parentSlugs={[...parentSlugs, category.slug]}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className='sidebar'>
      {/* Reset Filters Button */}
      <div className='Box ResetBox'>
        <Button 
          className='ResetFiltersBtn'
          onClick={handleResetFilters}
          variant="outlined"
          fullWidth
        >
          Reset All Filters
        </Button>
      </div>

      {/* Category Filter */}
      <div className='Box'>
        <h3 className='sidebar-title'>
          Shop by Categories
          <div className='Expand_Button'>
            <Button
              onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
              className='Expand_icon'>
              {isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </div>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter}>
          <div className='scroll category-scroll'>
            {loading ? (
              <div className='SideBar-Loading'>Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className='SideBar-Empty'>No categories found</div>
            ) : (
              <ul className='category-list'>
                {/* All Products option */}
                <li className='category-item level-0'>
                  <div 
                    className={`category-link ${!currentCategoryId ? 'active' : ''}`}
                    onClick={() => navigate('/ProductListing')}
                  >
                    <span className='category-name'>All Products</span>
                  </div>
                </li>
                
                {/* Dynamic categories */}
                {categories.map((category) => (
                  <CategoryItem 
                    key={category.id} 
                    category={category} 
                    level={0}
                    parentSlugs={[]}
                  />
                ))}
              </ul>
            )}
          </div>
        </Collapse>
      </div>

      {/* Brand Filter */}
      <div className='Box'>
        <h3 className='sidebar-title'>
          Brand
          <div className='Expand_Button'>
            <Button
              onClick={() => setIsOpenBrandFilter(!isOpenBrandFilter)}
              className='Expand_icon'>
              {isOpenBrandFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </div>
        </h3>
        <Collapse isOpened={isOpenBrandFilter}>
          <div className='scroll'>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(selectedBrands.filter(b => b !== brand));
                      }
                    }}
                    sx={{
                      color: '#888',
                      '&.Mui-checked': {
                        color: '#8a2be2',
                      },
                    }}
                  />
                }
                label={brand}
                className='SideBarFilter'
              />
            ))}
          </div>
        </Collapse>
      </div>

      {/* Price Filter */}
      <div className='Box'>
        <h3 className='sidebar-title'>
          Price Range
          <div className='Expand_Button'>
            <Button
              onClick={() => setIsOpenPriceFilter(!isOpenPriceFilter)}
              className='Expand_icon'>
              {isOpenPriceFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </div>
        </h3>
        <Collapse isOpened={isOpenPriceFilter}>
          <div className='scroll price-filter'>
            {/* Quick Price Ranges */}
            <div className='price-ranges'>
              {priceRanges.map((range, index) => (
                <Button
                  key={index}
                  className={`price-range-btn ${priceRange[0] === range.min && priceRange[1] === range.max ? 'active' : ''}`}
                  onClick={() => handlePriceRangeSelect(range)}
                  variant="outlined"
                  size="small"
                >
                  {range.label}
                </Button>
              ))}
            </div>

            {/* Price Slider */}
            <div className='price-slider'>
              <Slider
                value={priceRange}
                onChange={handlePriceSliderChange}
                onChangeCommitted={handlePriceSliderCommit}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${formatPrice(value)}`}
                min={0}
                max={200000000}
                step={1000000}
                sx={{
                  color: '#8a2be2',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#8a2be2',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#8a2be2',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#444',
                  },
                }}
              />
              <div className='price-inputs'>
                <span>{formatPrice(priceRange[0])} VND</span>
                <span>-</span>
                <span>{formatPrice(priceRange[1])} VND</span>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </aside>
  );
}

export default SideBar;