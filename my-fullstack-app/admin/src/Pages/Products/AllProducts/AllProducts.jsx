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
  IoCopyOutline
} from 'react-icons/io5'
import { BiPackage } from 'react-icons/bi'
import { HiOutlineLightningBolt } from 'react-icons/hi'

const AllProducts = () => {
  const [viewMode, setViewMode] = useState('table')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const handleAddProduct = () => {
    navigate('/products/AddProducts');
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // Updated PC Store product data
  const products = [
    {
      id: 1,
      name: 'PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=100',
      sku: 'PC-AMD-LUX-001',
      category: 'PC AMD Gaming',
      oldPrice: 52700000,
      price: 48800000,
      discount: 18,
      stock: 5,
      status: 'active',
      sales: 12,
      guarantee: '36M',
      specs: {
        cpu: 'AMD Ryzen 9 9950X3D',
        vga: 'RTX 5090 32GB OC',
        ram: '64GB DDR5',
        ssd: '2TB NVMe'
      }
    },
    {
      id: 2,
      name: 'PC Intel Gaming Ultra i9-14900K - RTX 4090 24GB',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100',
      sku: 'PC-INT-ULT-002',
      category: 'PC Intel Gaming',
      oldPrice: 45000000,
      price: 39900000,
      discount: 11,
      stock: 8,
      status: 'active',
      sales: 23,
      guarantee: '36M',
      specs: {
        cpu: 'Intel i9-14900K',
        vga: 'RTX 4090 24GB',
        ram: '64GB DDR5',
        ssd: '2TB NVMe'
      }
    },
    {
      id: 3,
      name: 'PC AMD Ryzen 7 7800X3D - RTX 4080 16GB Gaming',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=100',
      sku: 'PC-AMD-MID-003',
      category: 'PC AMD Gaming',
      oldPrice: 35000000,
      price: 32500000,
      discount: 7,
      stock: 15,
      status: 'active',
      sales: 45,
      guarantee: '36M',
      specs: {
        cpu: 'AMD Ryzen 7 7800X3D',
        vga: 'RTX 4080 16GB',
        ram: '32GB DDR5',
        ssd: '1TB NVMe'
      }
    },
    {
      id: 4,
      name: 'Laptop Gaming ASUS ROG Strix G16 - RTX 4070',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100',
      sku: 'LAP-ASUS-ROG-004',
      category: 'Laptop Gaming',
      oldPrice: 42000000,
      price: 38900000,
      discount: 7,
      stock: 12,
      status: 'active',
      sales: 34,
      guarantee: '24M',
      specs: {
        cpu: 'Intel i9-13980HX',
        vga: 'RTX 4070 8GB',
        ram: '32GB DDR5',
        ssd: '1TB NVMe'
      }
    },
    {
      id: 5,
      name: 'ASUS ROG STRIX X870E-E Gaming Wifi DDR5',
      image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=100',
      sku: 'MB-ASUS-X870-005',
      category: 'Components',
      oldPrice: 15000000,
      price: 14200000,
      discount: 5,
      stock: 25,
      status: 'active',
      sales: 67,
      guarantee: '36M',
      specs: {
        chipset: 'AMD X870E',
        socket: 'AM5',
        formFactor: 'ATX',
        memory: 'DDR5'
      }
    },
    {
      id: 6,
      name: 'G.SKILL Trident Z5 RGB 64GB (32GBx2) 6000MHz DDR5',
      image: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=100',
      sku: 'RAM-GSKILL-Z5-006',
      category: 'Components',
      oldPrice: 8500000,
      price: 7900000,
      discount: 7,
      stock: 45,
      status: 'active',
      sales: 89,
      guarantee: '36M',
      specs: {
        capacity: '64GB (32GBx2)',
        speed: '6000MHz',
        type: 'DDR5',
        rgb: 'Yes'
      }
    },
    {
      id: 7,
      name: 'Samsung 990 PRO 2TB M.2 NVMe PCIe Gen4.0 x4',
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100',
      sku: 'SSD-SAMS-990-007',
      category: 'Components',
      oldPrice: 6500000,
      price: 5900000,
      discount: 9,
      stock: 3,
      status: 'low-stock',
      sales: 123,
      guarantee: '60M',
      specs: {
        capacity: '2TB',
        interface: 'PCIe 4.0 x4',
        formFactor: 'M.2 2280',
        speed: '7450MB/s'
      }
    },
    {
      id: 8,
      name: 'HYTE Y70 - BLACK (ATX/MID TOWER/BLACK)',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=100',
      sku: 'CASE-HYTE-Y70-008',
      category: 'Components',
      oldPrice: 4500000,
      price: 4200000,
      discount: 7,
      stock: 18,
      status: 'active',
      sales: 56,
      guarantee: '24M',
      specs: {
        type: 'Mid Tower',
        formFactor: 'ATX',
        color: 'Black',
        glass: 'Tempered Glass'
      }
    },
    {
      id: 9,
      name: 'Logitech G Pro X Superlight 2 Wireless Gaming Mouse',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=100',
      sku: 'PER-LOGI-GPRO-009',
      category: 'Peripherals',
      oldPrice: 3500000,
      price: 3200000,
      discount: 9,
      stock: 32,
      status: 'active',
      sales: 145,
      guarantee: '24M',
      specs: {
        sensor: 'HERO 2',
        dpi: '32000',
        weight: '60g',
        wireless: 'Yes'
      }
    },
    {
      id: 10,
      name: 'TRYX PANORAMA ARGB 360 (6.5" AMOLED Screen)',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100',
      sku: 'COOL-TRYX-PAN-010',
      category: 'Components',
      oldPrice: 12000000,
      price: 11200000,
      discount: 7,
      stock: 0,
      status: 'out-of-stock',
      sales: 34,
      guarantee: '24M',
      specs: {
        type: 'AIO Water Cooling',
        radiator: '360mm',
        screen: '6.5" AMOLED',
        pump: 'ASETEK 8'
      }
    },
    {
      id: 11,
      name: 'PC Budget AMD Ryzen 5 5600 - RX 6600 8GB',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=100',
      sku: 'PC-AMD-BUD-011',
      category: 'PC AMD Gaming',
      oldPrice: 15000000,
      price: 13900000,
      discount: 7,
      stock: 0,
      status: 'draft',
      sales: 0,
      guarantee: '24M',
      specs: {
        cpu: 'AMD Ryzen 5 5600',
        vga: 'RX 6600 8GB',
        ram: '16GB DDR4',
        ssd: '500GB NVMe'
      }
    },
    {
      id: 12,
      name: 'Keychron Q1 Pro QMK Mechanical Keyboard',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100',
      sku: 'PER-KEY-Q1P-012',
      category: 'Peripherals',
      oldPrice: 4500000,
      price: 4200000,
      discount: 7,
      stock: 28,
      status: 'active',
      sales: 78,
      guarantee: '12M',
      specs: {
        layout: '75%',
        switches: 'Hot-swappable',
        backlight: 'RGB',
        wireless: 'Yes'
      }
    }
  ]

  const categories = [
    'All Categories', 
    'PC AMD Gaming', 
    'PC Intel Gaming', 
    'Laptop Gaming', 
    'Components', 
    'Peripherals', 
    'Accessories'
  ]
  
  const statuses = ['All Status', 'Active', 'Low Stock', 'Out of Stock', 'Draft']

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { label: 'Available', class: 'status-active', icon: <IoCheckmarkCircle /> },
      'low-stock': { label: 'Low Stock', class: 'status-warning', icon: <IoAlertCircle /> },
      'out-of-stock': { label: 'Out of Stock', class: 'status-danger', icon: <IoBanOutline /> },
      'draft': { label: 'Draft', class: 'status-draft', icon: <IoPauseCircle /> }
    }
    const config = statusConfig[status] || statusConfig['draft']
    return (
      <span className={`product-status ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

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

  // Calculate stats
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const lowStockProducts = products.filter(p => p.status === 'low-stock').length
  const outOfStockProducts = products.filter(p => p.status === 'out-of-stock').length

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
                <span className='stat-card__value'>{totalProducts}</span>
              </div>
            </div>
            <div className='stat-card__trend positive'>
              <IoTrendingUpOutline />
              +12.5%
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
                <span className='stat-card__value'>{activeProducts}</span>
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
                <span className='stat-card__value'>{lowStockProducts}</span>
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
                <span className='stat-card__value'>{outOfStockProducts}</span>
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
              <select>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <div className='select-arrow'></div>
            </div>
            <div className='cyber-select'>
              <select>
                {statuses.map((status, idx) => (
                  <option key={idx} value={status}>{status}</option>
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
              <button className='cyber-btn cyber-btn--sm cyber-btn--danger'>Delete Selected</button>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
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
                        checked={selectedProducts.length === products.length}
                        onChange={handleSelectAll}
                      />
                      <span className='checkmark'></span>
                    </label>
                  </th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Old Price</th>
                  <th>Current Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Sales</th>
                  <th>Warranty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
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
                          <img src={product.image} alt={product.name} className='product-image' />
                          <div className='image-overlay'></div>
                        </div>
                        <div>
                          <span className='product-name'>{product.name}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className='sku-badge'>{product.sku}</span></td>
                    <td><span className='category-tag'>{product.category}</span></td>
                    <td className='price-col' style={{textDecoration: 'line-through', opacity: 0.6}}>
                      {formatPrice(product.oldPrice)}
                    </td>
                    <td className='price-col'>{formatPrice(product.price)}</td>
                    <td>
                      <span className='stock-badge' style={{background: 'rgba(239, 68, 68, 0.15)', color: 'var(--c-neon-danger)'}}>
                        -{product.discount}%
                      </span>
                    </td>
                    <td>
                      <span className={`stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : ''}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className='sales-col'>{product.sales}</td>
                    <td>
                      <span className='sku-badge'>{product.guarantee}</span>
                    </td>
                    <td>{getStatusBadge(product.status)}</td>
                    <td>
                      <div className='actions-cell'>
                        <button className='cyber-action-btn' title='View'>
                          <IoEyeOutline />
                        </button>
                        <button className='cyber-action-btn' title='Edit'>
                          <IoCreateOutline />
                        </button>
                        <div className='action-dropdown'>
                          <button 
                            className='cyber-action-btn'
                            onClick={() => toggleDropdown(product.id)}
                          >
                            <IoEllipsisVerticalOutline />
                          </button>
                          {activeDropdown === product.id && (
                            <div className='cyber-dropdown-menu'>
                              <button className='dropdown-item'>
                                <IoEyeOutline /> View Details
                              </button>
                              <button className='dropdown-item'>
                                <IoCreateOutline /> Edit Product
                              </button>
                              <button className='dropdown-item'>
                                <IoCopyOutline /> Duplicate
                              </button>
                              <div className='dropdown-divider'></div>
                              <button className='dropdown-item danger'>
                                <IoTrashOutline /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className='cyber-grid-container'>
            {products.map((product, index) => (
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
                  <img src={product.image} alt={product.name} />
                  <div className='card__image-overlay'></div>
                  <div className='card__actions-overlay'>
                    <button className='overlay-btn'><IoEyeOutline /></button>
                    <button className='overlay-btn'><IoCreateOutline /></button>
                    <button className='overlay-btn danger'><IoTrashOutline /></button>
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
                    {getStatusBadge(product.status)}
                  </div>
                </div>
                
                <div className='card__body'>
                  <span className='card__category'>{product.category}</span>
                  <h3 className='card__name'>{product.name}</h3>
                  <p className='card__sku'>{product.sku}</p>
                  <div className='card__footer'>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                      <span style={{fontSize: '14px', textDecoration: 'line-through', opacity: 0.6, color: 'var(--c-text-muted)'}}>
                        {formatPrice(product.oldPrice)}
                      </span>
                      <span className='card__price'>{formatPrice(product.price)}</span>
                    </div>
                    {product.discount > 0 && (
                      <span style={{
                        padding: '4px 8px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: 'var(--c-neon-danger)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className='card__meta'>
                    <span><IoCubeOutline /> {product.stock}</span>
                    <span><IoTrendingUpOutline /> {product.sales} sold</span>
                  </div>
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: 'var(--c-text-secondary)'
                  }}>
                    <strong>Warranty:</strong> {product.guarantee}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className='cyber-pagination'>
          <div className='pagination-info'>
            Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
          </div>
          <div className='pagination-controls'>
            <div className='cyber-select sm'>
              <select>
                <option value='10'>10 per page</option>
                <option value='25'>25 per page</option>
                <option value='50'>50 per page</option>
                <option value='100'>100 per page</option>
              </select>
            </div>
            <div className='pagination-buttons'>
              <button className='page-btn' disabled>
                <IoChevronBackOutline />
              </button>
              <button className='page-btn active'>1</button>
              <button className='page-btn'>
                <IoChevronForwardOutline />
              </button>
            </div>
          </div>
          <div className='pagination-glow'></div>
        </div>
      </div>
    </div>
  )
}

export default AllProducts