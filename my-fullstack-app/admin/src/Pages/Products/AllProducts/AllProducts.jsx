import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './AllProducts.css'
import { 
  IoSearchOutline, 
  IoFilterOutline, 
  IoAddOutline,
  IoEllipsisVerticalOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoCloudDownloadOutline,
  IoGridOutline,
  IoListOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoPauseCircle,
  IoCubeOutline,
  IoTrendingUpOutline,
  IoWarningOutline,
  IoBanOutline,
  IoSparkles,
  IoCopyOutline,
  IoRefreshOutline
} from 'react-icons/io5'
import { BiPackage } from 'react-icons/bi'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Divider,
  IconButton
} from '@mui/material'
import { getAllProducts, deleteProduct, getProductsCount, getProductById } from '../../../api/productService'
import { getAllCategories } from '../../../api/categoryService'

const AllProducts = () => {
  const [viewMode, setViewMode] = useState('table')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewDialog, setViewDialog] = useState({ open: false, product: null, loading: false })
  const navigate = useNavigate()

  // Data states
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0
  })

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null })
  const [deleting, setDeleting] = useState(false)

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleAddProduct = () => {
    navigate('/products/AddProducts');
  };

  const handleViewProduct = async (productId) => {
    setViewDialog({ open: true, product: null, loading: true });
    setActiveDropdown(null);
    try {
      const response = await getProductById(productId);
      if (response.success) {
        setViewDialog({ open: true, product: response.data, loading: false });
      } else {
        showSnackbar('Error loading product details', 'error');
        setViewDialog({ open: false, product: null, loading: false });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showSnackbar('Error loading product details', 'error');
      setViewDialog({ open: false, product: null, loading: false });
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialog({ open: false, product: null, loading: false });
  };

  // Handle Duplicate Product
  const handleDuplicateProduct = async (product) => {
    setActiveDropdown(null);
    showSnackbar('Duplicate feature coming soon!', 'info');
  };

  const handleEditProduct = (productId) => {
    navigate(`/products/EditProduct/${productId}`);
  };

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        isActive: selectedStatus === 'active' ? true : 
                  selectedStatus === 'inactive' ? false : undefined
      };

      const response = await getAllProducts(params);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Error loading products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await getProductsCount();
      if (response.success) {
        setStats({
          total: response.data.total || 0,
          active: response.data.active || 0,
          lowStock: response.data.lowStock || 0,
          outOfStock: response.data.outOfStock || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStats();
  }, [currentPage, itemsPerPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchProducts();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDeleteClick = (product) => {
    setDeleteDialog({ open: true, product });
    setActiveDropdown(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.product) return;
    
    setDeleting(true);
    try {
      const response = await deleteProduct(deleteDialog.product.id);
      if (response.success) {
        showSnackbar('Product deleted successfully!', 'success');
        fetchProducts();
        fetchStats();
      } else {
        showSnackbar(response.message || 'Error deleting product', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar(error.response?.data?.message || 'Error deleting product', 'error');
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, product: null });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    setDeleting(true);
    try {
      for (const productId of selectedProducts) {
        await deleteProduct(productId);
      }
      showSnackbar(`${selectedProducts.length} products deleted successfully!`, 'success');
      setSelectedProducts([]);
      fetchProducts();
      fetchStats();
    } catch (error) {
      showSnackbar('Error deleting some products', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (product) => {
    if (!product.isActive) {
      return (
        <span className='product-status status-draft'>
          <IoPauseCircle />
          Draft
        </span>
      );
    }
    if (product.quantity === 0) {
      return (
        <span className='product-status status-danger'>
          <IoBanOutline />
          Out of Stock
        </span>
      );
    }
    if (product.quantity < 10) {
      return (
        <span className='product-status status-warning'>
          <IoAlertCircle />
          Low Stock
        </span>
      );
    }
    return (
      <span className='product-status status-active'>
        <IoCheckmarkCircle />
        Available
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountPercentage = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleDropdown = (productId) => {
    setActiveDropdown(activeDropdown === productId ? null : productId)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const categoryOptions = ['All Categories', ...categories.map(c => c.name)];
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  return (
    <div className='all-products-page'>
      {/* Animated Background */}
      <div className='cyber-bg'>
        <div className='cyber-grid'></div>
        <div className='floating-particles'>
          {[...Array(20)].map((_, i) => (
            <div key={i} className='particle' style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className='all-products'>
        {/* Page Header */}
        <div className='all-products__header'>
          <div className='all-products__header-left'>
            <div className='header-icon'>
              <BiPackage />
              <div className='icon-glow'></div>
            </div>
            <div className='header-text'>
              <h1 className='all-products__title'>
                <span className='title-text'>All Products</span>
                <span className='title-accent'></span>
              </h1>
              <p className='all-products__subtitle'>
                <HiOutlineLightningBolt />
                Manage your PC store inventory with precision
              </p>
            </div>
          </div>
          <div className='all-products__header-right'>
            <button 
              className='cyber-btn cyber-btn--outline'
              onClick={() => { fetchProducts(); fetchStats(); }}
              disabled={isLoading}
            >
              <IoRefreshOutline className={isLoading ? 'spinning' : ''} />
              <span>Refresh</span>
            </button>
            <button className='cyber-btn cyber-btn--outline'>
              <IoCloudDownloadOutline />
              <span>Export</span>
              <div className='btn-glitch'></div>
            </button>
            <button className='cyber-btn cyber-btn--primary'
                    onClick={handleAddProduct}>
              <IoAddOutline />
              <span>Add Product</span>
              <div className='btn-shine'></div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='all-products__stats'>
          <div className='cyber-stat-card'>
            <div className='stat-card__glow'></div>
            <div className='stat-card__content'>
              <div className='stat-card__icon total'>
                <IoCubeOutline />
              </div>
              <div className='stat-card__info'>
                <span className='stat-card__label'>Total Products</span>
                <span className='stat-card__value'>{stats.total}</span>
              </div>
            </div>
            <div className='stat-card__trend positive'>
              <IoTrendingUpOutline />
              Live
            </div>
            <div className='stat-card__corner'></div>
          </div>

          <div className='cyber-stat-card'>
            <div className='stat-card__glow'></div>
            <div className='stat-card__content'>
              <div className='stat-card__icon active'>
                <IoCheckmarkCircle />
              </div>
              <div className='stat-card__info'>
                <span className='stat-card__label'>Available</span>
                <span className='stat-card__value'>{stats.active}</span>
              </div>
            </div>
            <div className='stat-card__badge active'>ONLINE</div>
            <div className='stat-card__corner'></div>
          </div>

          <div className='cyber-stat-card'>
            <div className='stat-card__glow'></div>
            <div className='stat-card__content'>
              <div className='stat-card__icon warning'>
                <IoWarningOutline />
              </div>
              <div className='stat-card__info'>
                <span className='stat-card__label'>Low Stock</span>
                <span className='stat-card__value'>{stats.lowStock}</span>
              </div>
            </div>
            <div className='stat-card__badge warning'>ALERT</div>
            <div className='stat-card__corner'></div>
          </div>

          <div className='cyber-stat-card'>
            <div className='stat-card__glow'></div>
            <div className='stat-card__content'>
              <div className='stat-card__icon danger'>
                <IoBanOutline />
              </div>
              <div className='stat-card__info'>
                <span className='stat-card__label'>Out of Stock</span>
                <span className='stat-card__value'>{stats.outOfStock}</span>
              </div>
            </div>
            <div className='stat-card__badge danger'>CRITICAL</div>
            <div className='stat-card__corner'></div>
          </div>
        </div>

        {/* Toolbar */}
        <div className='all-products__toolbar'>
          <div className='cyber-search'>
            <IoSearchOutline className='search-icon' />
            <input 
              type='text' 
              placeholder='SEARCH PRODUCTS BY NAME, SKU...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className='search-clear' onClick={() => setSearchQuery('')}>
                <IoCloseOutline />
              </button>
            )}
            <div className='search-border'></div>
          </div>

          <div className='all-products__filters'>
            <div className='cyber-select'>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryOptions.map((cat, idx) => (
                  <option key={idx} value={cat === 'All Categories' ? '' : cat}>{cat}</option>
                ))}
              </select>
              <div className='select-arrow'></div>
            </div>
            <div className='cyber-select'>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((status, idx) => (
                  <option key={idx} value={status.value}>{status.label}</option>
                ))}
              </select>
              <div className='select-arrow'></div>
            </div>
            <button 
              className={`cyber-btn cyber-btn--filter ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <IoFilterOutline />
              <span>More Filters</span>
            </button>
          </div>

          <div className='cyber-view-toggle'>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <IoListOutline />
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <IoGridOutline />
            </button>
            <div className='toggle-indicator' style={{ transform: viewMode === 'grid' ? 'translateX(100%)' : 'translateX(0)' }}></div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className='cyber-bulk-actions'>
            <div className='bulk-indicator'></div>
            <span className='bulk-count'>
              <IoSparkles />
              {selectedProducts.length} items selected
            </span>
            <div className='bulk-buttons'>
              <button className='cyber-btn cyber-btn--sm cyber-btn--outline'>Edit Selected</button>
              <button className='cyber-btn cyber-btn--sm cyber-btn--outline'>Change Status</button>
              <button 
                className='cyber-btn cyber-btn--sm cyber-btn--danger'
                onClick={handleBulkDelete}
                disabled={deleting}
              >
                {deleting ? <CircularProgress size={16} /> : 'Delete Selected'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <CircularProgress />
          </div>
        )}

        {/* Table View */}
        {!isLoading && viewMode === 'table' && (
          <div className='cyber-table-container'>
            <div className='table-glow'></div>
            <div className='table-corner tl'></div>
            <div className='table-corner tr'></div>
            <div className='table-corner bl'></div>
            <div className='table-corner br'></div>
            <table className='cyber-table'>
              <thead>
                <tr>
                  <th className='checkbox-col'>
                    <label className='cyber-checkbox'>
                      <input 
                        type='checkbox'
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                      />
                      <span className='checkmark'></span>
                    </label>
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sale Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr 
                      key={product.id} 
                      className={selectedProducts.includes(product.id) ? 'selected' : ''}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className='checkbox-col'>
                        <label className='cyber-checkbox'>
                          <input 
                            type='checkbox'
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                          <span className='checkmark'></span>
                        </label>
                      </td>
                      <td>
                        <div className='product-cell'>
                          <div className='product-image-wrapper'>
                            <img 
                              src={product.thumbnail || (product.images?.[0]?.url) || '/placeholder.png'} 
                              alt={product.name} 
                              className='product-image' 
                            />
                            <div className='image-overlay'></div>
                          </div>
                          <div>
                            <span className='product-name'>{product.name}</span>
                            {product.brand && (
                              <span className='product-brand'>{product.brand}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className='category-tag'>{product.category?.name || 'N/A'}</span>
                      </td>
                      <td className='price-col'>
                        {formatPrice(product.price)}
                      </td>
                      <td className='price-col'>
                        {product.salePrice ? formatPrice(product.salePrice) : '-'}
                      </td>
                      <td>
                        {getDiscountPercentage(product.price, product.salePrice) > 0 ? (
                          <span className='stock-badge' style={{background: 'rgba(239, 68, 68, 0.15)', color: 'var(--c-neon-danger)'}}>
                            -{getDiscountPercentage(product.price, product.salePrice)}%
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        <span className={`stock-badge ${product.quantity === 0 ? 'out' : product.quantity < 10 ? 'low' : ''}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td>{getStatusBadge(product)}</td>
                      <td>
                        <div className='actions-cell'>
                          <button 
                            className='cyber-action-btn' 
                            title='View'
                            onClick={() => handleViewProduct(product.id)}
                          >
                            <IoEyeOutline />
                          </button>
                          <button 
                            className='cyber-action-btn' 
                            title='Edit'
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <IoCreateOutline />
                          </button>
                          <button 
                            className='cyber-action-btn danger' 
                            title='Delete'
                            onClick={() => handleDeleteClick(product)}
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {!isLoading && viewMode === 'grid' && (
          <div className='cyber-grid-container'>
            {products.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                No products found
              </div>
            ) : (
              products.map((product, index) => (
                <div 
                  key={product.id} 
                  className='cyber-product-card'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className='card-glow'></div>
                  <div className='card-corner tl'></div>
                  <div className='card-corner tr'></div>
                  <div className='card-corner bl'></div>
                  <div className='card-corner br'></div>
                  
                  <div className='card__image'>
                    <img 
                      src={product.thumbnail || (product.images?.[0]?.url) || '/placeholder.png'} 
                      alt={product.name} 
                    />
                    <div className='card__image-overlay'></div>
                    <div className='card__actions-overlay'>
                      <button className='overlay-btn' onClick={() => handleViewProduct(product.id)}>
                        <IoEyeOutline />
                      </button>
                      <button className='overlay-btn' onClick={() => handleEditProduct(product.id)}>
                        <IoCreateOutline />
                      </button>
                      <button className='overlay-btn danger' onClick={() => handleDeleteClick(product)}>
                        <IoTrashOutline />
                      </button>
                    </div>
                    <label className='cyber-checkbox card__checkbox'>
                      <input 
                        type='checkbox'
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                      <span className='checkmark'></span>
                    </label>
                    <div className='card__status'>
                      {getStatusBadge(product)}
                    </div>
                  </div>
                  
                  <div className='card__body'>
                    <span className='card__category'>{product.category?.name || 'N/A'}</span>
                    <h3 className='card__name'>{product.name}</h3>
                    {product.brand && <p className='card__sku'>{product.brand}</p>}
                    <div className='card__footer'>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        {product.salePrice && (
                          <span style={{fontSize: '14px', textDecoration: 'line-through', opacity: 0.6, color: 'var(--c-text-muted)'}}>
                            {formatPrice(product.price)}
                          </span>
                        )}
                        <span className='card__price'>
                          {formatPrice(product.salePrice || product.price)}
                        </span>
                      </div>
                      {getDiscountPercentage(product.price, product.salePrice) > 0 && (
                        <span style={{
                          padding: '4px 8px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: 'var(--c-neon-danger)',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          -{getDiscountPercentage(product.price, product.salePrice)}%
                        </span>
                      )}
                    </div>
                    <div className='card__meta'>
                      <span><IoCubeOutline /> {product.quantity}</span>
                      <span>{product.isFeatured ? '⭐ Featured' : ''}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && products.length > 0 && (
          <div className='cyber-pagination'>
            <div className='pagination-info'>
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, pagination.total)}</strong> of <strong>{pagination.total}</strong> products
            </div>
            <div className='pagination-controls'>
              <div className='cyber-select sm'>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value='10'>10 per page</option>
                  <option value='25'>25 per page</option>
                  <option value='50'>50 per page</option>
                  <option value='100'>100 per page</option>
                </select>
              </div>
              <div className='pagination-buttons'>
                <button 
                  className='page-btn' 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <IoChevronBackOutline />
                </button>
                {[...Array(pagination.totalPages)].map((_, idx) => (
                  <button 
                    key={idx}
                    className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                )).slice(
                  Math.max(0, currentPage - 3),
                  Math.min(pagination.totalPages, currentPage + 2)
                )}
                <button 
                  className='page-btn'
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <IoChevronForwardOutline />
                </button>
              </div>
            </div>
            <div className='pagination-glow'></div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Product Details</span>
          <IconButton onClick={handleCloseViewDialog} sx={{ color: '#94a3b8' }}>
            <IoCloseOutline />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
      {viewDialog.loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </div>
      ) : viewDialog.product && (
        <div className='view-product-content'>
          {/* Product Images */}
          <div className='view-product-images'>
            <img 
              src={viewDialog.product.thumbnail || viewDialog.product.images?.[0]?.url || '/placeholder.png'} 
              alt={viewDialog.product.name}
              className='view-product-main-image'
            />
            {viewDialog.product.images && viewDialog.product.images.length > 1 && (
              <div className='view-product-thumbnails'>
                {viewDialog.product.images.slice(0, 4).map((img, idx) => (
                  <img 
                    key={idx}
                    src={typeof img === 'string' ? img : img.url}
                    alt={`${viewDialog.product.name} ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Product Info */}
          <div className='view-product-info'>
            <h2>{viewDialog.product.name}</h2>
            
            <div className='view-product-badges'>
              {getStatusBadge(viewDialog.product)}
              {viewDialog.product.isFeatured && (
                <Chip label="Featured" color="primary" size="small" />
              )}
            </div>

            <Divider sx={{ my: 2, borderColor: 'rgba(99, 102, 241, 0.2)' }} />

            <div className='view-product-details'>
              <div className='detail-row'>
                <span className='detail-label'>Category:</span>
                <span className='detail-value'>{viewDialog.product.category?.name || 'N/A'}</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Brand:</span>
                <span className='detail-value'>{viewDialog.product.brand || 'N/A'}</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Price:</span>
                <span className='detail-value'>{formatPrice(viewDialog.product.price)}</span>
              </div>
              {viewDialog.product.salePrice && (
                <div className='detail-row'>
                  <span className='detail-label'>Sale Price:</span>
                  <span className='detail-value sale-price'>
                    {formatPrice(viewDialog.product.salePrice)}
                    <span className='discount-badge'>
                      -{getDiscountPercentage(viewDialog.product.price, viewDialog.product.salePrice)}%
                    </span>
                  </span>
                </div>
              )}
              <div className='detail-row'>
                <span className='detail-label'>Stock:</span>
                <span className='detail-value'>{viewDialog.product.quantity} units</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Created:</span>
                <span className='detail-value'>
                  {new Date(viewDialog.product.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
                  </div>
                  {viewDialog.product.description && (
              <>
                <Divider sx={{ my: 2, borderColor: 'rgba(99, 102, 241, 0.2)' }} />
                <div className='view-product-description'>
                  <h4>Description</h4>
                  <p>{viewDialog.product.description}</p>
                </div>
              </>
            )}

            {/* Specifications */}
            {viewDialog.product.specifications && viewDialog.product.specifications.length > 0 && (
              <>
                <Divider sx={{ my: 2, borderColor: 'rgba(99, 102, 241, 0.2)' }} />
                <div className='view-product-specs'>
                  <h4>Specifications</h4>
                  <div className='specs-grid'>
                    {viewDialog.product.specifications.map((spec, idx) => (
                      spec.description && (
                        <div key={idx} className='spec-item'>
                          <span className='spec-category'>{spec.category}:</span>
                          <span className='spec-description'>{spec.description}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(99, 102, 241, 0.2)', p: 2 }}>
          <Button 
            onClick={handleCloseViewDialog}
            sx={{ color: '#94a3b8' }}
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              handleCloseViewDialog();
              handleEditProduct(viewDialog.product?.id);
            }}
            variant="contained"
            startIcon={<IoCreateOutline />}
          >
            Edit Product
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, product: null })}
        PaperProps={{
          style: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deleteDialog.product?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, product: null })}
            style={{ color: '#94a3b8' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default AllProducts