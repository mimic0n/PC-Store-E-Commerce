import React, { useState, useEffect } from 'react'

import { HomeSlider } from '../../component/HomeSlider/HomeSlider'
import { HomeCatSlider } from '../../component/HomeCatSlider/HomeCatSlider'
import { Category_Slider } from '../../component/Category_Slider/Category_Slider';
import { Product_List_Slider } from '../../component/Product_List_Slider/Product_List_Slider';
import { BrandBar } from '../../component/BrandBar/BrandBar.jsx';
import '/src/styles/Home.css'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getAllProducts, getFeaturedProducts, getProductsByCategoryName } from '../../api/productService';
import { getAllCategories } from '../../api/categoryService';

export const Home = () => {
  // Tab state - giữ category name hoặc 'all'
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Products state
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  
  // Categories for tabs
  const [categoryTabs, setCategoryTabs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesRes, productsRes, featuredRes] = await Promise.all([
                getAllCategories({ parentId: 'null', isActive: true, limit: 5 }),
                getAllProducts({ limit: 10 }),
                getFeaturedProducts({ limit: 10 })
            ]);
            
            if (categoriesRes.success) setCategoryTabs(categoriesRes.data.slice(0, 5));
            if (productsRes.success) setProducts(productsRes.data);
            if (featuredRes.success) setFeaturedProducts(featuredRes.data);
        } catch (error) {
          console.error('Error fetching :', error);
          setCategoryTabs([
            { id: 1, name: 'PC Gaming', slug: 'pc-gaming' },
            { id: 2, name: 'PC Workstation', slug: 'pc-workstation' },
            { id: 3, name: 'Gaming Gear', slug: 'gaming-gear' },
            { id: 4, name: 'Hardware', slug: 'hardware' }
          ]);
        } finally {
            setLoading(false);
        }
    }; 
    fetchData();
  }, []);
  
  // Handle tab change - fetch products by category
  const handleTabChange = async (event, newValue) => {
    setSelectedTab(newValue);
    
    try {
      setTabLoading(true);
      
      if (newValue === 'all') {
        // Hiển thị tất cả products
        setFilteredProducts(products);
      } else {
        // Fetch products theo category name
        const response = await getProductsByCategoryName(newValue, { limit: 10 });
        if (response.success) {
          setFilteredProducts(response.data);
        } else {
          setFilteredProducts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setFilteredProducts([]);
    } finally {
      setTabLoading(false);
    }
  };
  
  return (
    <div className='Home_Container'>
      <HomeSlider />

      <HomeCatSlider />

      <section style={{ marginBottom: '30px' }}>
        <Category_Slider items={5} />
      </section>
      
      {/* Popular Products Section with Category Tabs */}
      <section className='ProductBox_1_section'>
        <div className='ProductBox_1'>
          <div className='ProductBox_1_container'>
            <div className='ProductBox_1_content'>
              <h2 className='ProductBox_1_Font'>Popular Products</h2>
            </div>
              
            <div className="Product_Nav">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="product category tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                {/* Tab "All" để hiển thị tất cả */}
                <Tab value="all" label="All Products" />
                
                {/* Dynamic tabs từ categories */}
                {categoryTabs.map((category) => (
                  <Tab 
                    key={category.id} 
                    value={category.name} 
                    label={category.name} 
                  />
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <section className='ProductBox_section' style={{ marginBottom: '30px' }}>
        <div className='ProductBox_container'>
          <div className='ProductBox_Content'>
            {/* Hiển thị thông tin filter */}
          </div>
          <Product_List_Slider 
            items={5} 
            products={filteredProducts} 
            loading={loading || tabLoading} 
          />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='ProductBox_2_section' style={{ marginBottom: '30px' }}>
        <div className='ProductBox_2'>
          <div className='ProductBox_2_container'>
            <div className='ProductBox_2_content'>
              <h2 className='ProductBox_2_Font'>Featured Products</h2>
            </div>
          </div>
        </div>
        <div className='ProductBox_container'>
          <Product_List_Slider 
            items={5} 
            products={featuredProducts} 
            loading={loading} 
          />
        </div>
      </section>
      
      <section style={{ marginBottom: '30px' }}>
        <BrandBar />
      </section>
    </div>
  )
}

export default Home