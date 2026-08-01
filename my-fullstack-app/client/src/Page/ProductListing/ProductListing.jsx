import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import './ProductListing.css'
import { ProductItems as ProductItemViewList } from '/src/component/ProductItemViewList/ProductItemViewList'
import { SideBar } from '../../component/SideBar/SideBar'
import { emphasize, styled } from '@mui/material/styles';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';

import { Home } from '@mui/icons-material';
import { ExpandMore } from '@mui/icons-material';
import { ProductItems } from '../../component/ProductItems/ProductItems';
import { IoGrid } from "react-icons/io5";
import { AiOutlineMenuUnfold } from "react-icons/ai";

import { getAllProducts, getProductsByCategoryId, getProductsByPrice, searchProducts } from '../../api/productService';
import { getCategoryBySlug } from '../../api/categoryService';

// Loading Skeleton
const ProductSkeleton = () => (
  <div className='ProductItem ProductItem-Skeleton'>
    <div className='imgWrapper'>
      <div className='skeleton skeleton-image'></div>
    </div>
    <div className='Product_Info'>
      <div className='skeleton skeleton-text' style={{width: '80%', height: '20px', marginBottom: '10px'}}></div>
      <div className='skeleton skeleton-text' style={{width: '60%', height: '24px', marginBottom: '8px'}}></div>
      <div className='skeleton skeleton-text' style={{width: '40%', height: '16px', marginBottom: '10px'}}></div>
      <div className='skeleton skeleton-text' style={{width: '100%', height: '40px'}}></div>
    </div>
  </div>
);

export const ProductListing = () => {
  const { categorySlug, subCategorySlug, thirdCategorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get search query from URL
  const searchQuery = searchParams.get('q') || '';

  const [itemView, setItemView] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('DESC');
  const [sortLabel, setSortLabel] = useState('The Newest');

  // Filter states
  const [filters, setFilters] = useState({
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    brand: null
  });

  const open = Boolean(anchorEl);
  
  const handleClickSortBy = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseSortBy = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sortByValue, orderValue, label) => {
    setSortBy(sortByValue);
    setOrder(orderValue);
    setSortLabel(label);
    setPagination(prev => ({ ...prev, page: 1 }));
    handleCloseSortBy();
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change from SideBar
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle search query breadcrumbs
  useEffect(() => {
    if (searchQuery) {
      setBreadcrumbs([
        { label: 'Home', href: '/' },
        { label: `Kết quả tìm kiếm: "${searchQuery}"`, href: `/search?q=${encodeURIComponent(searchQuery)}` }
      ]);
      setCurrentCategory(null);
      setFilters(prev => ({ ...prev, categoryId: null }));
    }
  }, [searchQuery]);

  // Fetch category by slug
  useEffect(() => {
    const fetchCategory = async () => {
      // Skip if there's a search query
      if (searchQuery) return;
      
      // Xác định slug cần fetch (ưu tiên từ level 3 xuống)
      const slug = thirdCategorySlug || subCategorySlug || categorySlug;
      
      if (slug) {
        try {
          const response = await getCategoryBySlug(slug);
          if (response.success) {
            setCurrentCategory(response.data);
            setFilters(prev => ({ ...prev, categoryId: response.data.id }));
            
            // Build breadcrumbs
            const crumbs = [{ label: 'Home', href: '/' }];
            if (categorySlug) {
              crumbs.push({ label: response.data.name, href: `/category/${categorySlug}` });
            }
            if (subCategorySlug && response.data.parent) {
              // Insert parent before current
              crumbs.splice(1, 0, { label: response.data.parent.name, href: `/category/${categorySlug}` });
              crumbs[2] = { label: response.data.name, href: `/category/${categorySlug}/${subCategorySlug}` };
            }
            setBreadcrumbs(crumbs);
          }
        } catch (error) {
          console.error('Error fetching category:', error);
          setCurrentCategory(null);
        }
      } else {
        setCurrentCategory(null);
        setFilters(prev => ({ ...prev, categoryId: null }));
        setBreadcrumbs([{ label: 'Home', href: '/' }, { label: 'All Products', href: '/ProductListing' }]);
      }
    };

    fetchCategory();
  }, [categorySlug, subCategorySlug, thirdCategorySlug, searchQuery]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        const params = {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: sortBy,
          order: order
        };

        // Nếu có search query
        if (searchQuery) {
          response = await searchProducts(searchQuery, params);
        }
        // Nếu có categoryId thì fetch theo category
        else if (filters.categoryId) {
          response = await getProductsByCategoryId(filters.categoryId, params);
        } 
        // Nếu có filter giá
        else if (filters.minPrice !== null || filters.maxPrice !== null) {
          response = await getProductsByPrice(
            filters.minPrice || 0, 
            filters.maxPrice || 999999999,
            params
          );
        }
        // Mặc định fetch tất cả
        else {
          response = await getAllProducts(params);
        }
        
        if (response.success) {
          setProducts(response.data);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || response.data.length,
            totalPages: response.pagination?.totalPages || 1
          }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.page, sortBy, order, filters.categoryId, filters.minPrice, filters.maxPrice, searchQuery]);

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
      backgroundColor: theme.palette.grey[100],
      height: theme.spacing(3),
      color: (theme.vars || theme).palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
        cursor: 'pointer',
        ...theme.applyStyles('dark', {
          backgroundColor: emphasize(theme.palette.grey[800], 0.06),
        }),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
        ...theme.applyStyles('dark', {
          backgroundColor: emphasize(theme.palette.grey[800], 0.12),
        }),
      },
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    };
  });

  const handleBreadcrumbClick = (href) => {
    navigate(href);
  };

  return (
    <section className='ProductListingSection'>
      <div className='BreadcrumbsWrapper'>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            {breadcrumbs.map((crumb, index) => (
              <StyledBreadcrumb
                key={index}
                component="a"
                label={crumb.label}
                icon={index === 0 ? <Home fontSize="small" /> : undefined}
                onClick={() => handleBreadcrumbClick(crumb.href)}
                deleteIcon={index === breadcrumbs.length - 1 ? <ExpandMore /> : undefined}
                onDelete={index === breadcrumbs.length - 1 ? () => {} : undefined}
              />
            ))}
          </Breadcrumbs>
        </div>
      </div>

      <div className='ProductListingContainer'>
        <div className='container'>
          <div className='SideBarWrapper-col1'>
            <SideBar 
              currentCategoryId={filters.categoryId}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className='SideBarWrapper-col2'>
            <div className='ProductListingSection-Header'>
              <div className='ProductListingSection-Header-Col1'>
                <Button className='Grid-Button' onClick={() => setItemView('list')}>
                  <AiOutlineMenuUnfold />
                </Button>
                
                <Button className='Grid-Button' onClick={() => setItemView('grid')}>
                  <IoGrid />
                </Button>

                <span className='Product-Count'>
                  {currentCategory ? (
                    <>Showing {pagination.total} products in "{currentCategory.name}"</>
                  ) : (
                    <>There are {pagination.total} products</>
                  )}
                </span>
              </div>

              <div className='ProductListingSection-Header-Col2'> 
                <span className='Sort-By'>Sort by:</span>
                <div>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickSortBy}
                    className='SortByButton'
                  >
                    {sortLabel}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseSortBy}
                    slotProps={{
                      list: { 'aria-labelledby': 'basic-button' },
                    }}
                  >
                    <MenuItem onClick={() => handleSortChange('createdAt', 'DESC', 'The Newest')}>The Newest</MenuItem>
                    <MenuItem onClick={() => handleSortChange('createdAt', 'ASC', 'The Oldest')}>The Oldest</MenuItem>
                    <MenuItem onClick={() => handleSortChange('price', 'ASC', 'Price: Increase')}>Price: Increase</MenuItem>
                    <MenuItem onClick={() => handleSortChange('price', 'DESC', 'Price: Decrease')}>Price: Decrease</MenuItem>
                    <MenuItem onClick={() => handleSortChange('name', 'ASC', 'Name: A-Z')}>Name: A-Z</MenuItem>
                    <MenuItem onClick={() => handleSortChange('name', 'DESC', 'Name: Z-A')}>Name: Z-A</MenuItem>
                  </Menu>
                </div>
              </div>
            </div>

            <div className={itemView === 'grid' ? 'ProductListingSection-Content-Grid' : 'ProductListingSection-Content-List'}>
              {loading ? (
                [...Array(12)].map((_, index) => (
                  <ProductSkeleton key={`skeleton-${index}`} />
                ))
              ) : products.length === 0 ? (
                <div className='No-Products-Found'>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or browse other categories</p>
                </div>
              ) : itemView === 'grid' ? (
                products.map((product) => (
                  <ProductItems key={product.id} product={product} />
                ))
              ) : (
                products.map((product) => (
                  <ProductItemViewList key={product.id} product={product} />
                ))
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className='ProductListing-Pagination'>
                <Pagination 
                  count={pagination.totalPages} 
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary" 
                  showFirstButton 
                  showLastButton 
                />
              </div>
            )}
          </div>
        </div>   
      </div>
    </section>
  )
}

export default ProductListing