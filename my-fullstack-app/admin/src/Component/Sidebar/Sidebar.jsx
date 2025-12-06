import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'
import { 
  IoHomeOutline, 
  IoCartOutline, 
  IoPeopleOutline, 
  IoStatsChartOutline,
  IoSettingsOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoLayersOutline,
  IoWalletOutline,
  IoMailOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
  IoStorefrontOutline,
  IoTicketOutline,
  IoPricetagsOutline
} from 'react-icons/io5'
import { HiOutlineChartSquareBar } from 'react-icons/hi'
import { BiPackage } from 'react-icons/bi'

const Sidebar = ({ isCollapsed, isOpen, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [expandedMenus, setExpandedMenus] = useState([''])
  const location = useLocation()

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const menuItems = [
    {
      group: 'MAIN MENU',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <IoHomeOutline />, path: '/dashboard' },
        { 
          id: 'products', 
          label: 'Products', 
          icon: <BiPackage />,
          submenu: [
            { id: 'all-products', label: 'All Products', path: '/products/AllProducts' },
            { id: 'add-product', label: 'Add Product', path: '/products/AddProducts' },
            { id: 'categories', label: 'Categories', path: '/products/categories' },
            { id: 'inventory', label: 'Inventory', path: '/products/inventory' },
          ]
        },
        { 
          id: 'orders', 
          label: 'Orders', 
          icon: <IoCartOutline />,
          badge: '12',
          submenu: [
            { id: 'all-orders', label: 'All Orders', path: '/orders' },
            { id: 'pending', label: 'Pending', path: '/orders/pending' },
            { id: 'completed', label: 'Completed', path: '/orders/completed' },
            { id: 'refunds', label: 'Refunds', path: '/orders/refunds' },
          ]
        },
        { 
          id: 'customers', 
          label: 'Customers', 
          icon: <IoPeopleOutline />,
          submenu: [
            { id: 'all-customers', label: 'All Customers', path: "customers/All_Customer" },
            { id: 'customer-groups', label: 'Customer Groups', path: '/customers/groups' },
          ]
        },
      ]
    },
    {
      group: 'SALES & MARKETING',
      items: [
        { id: 'coupons', label: 'Coupons', icon: <IoTicketOutline />, path: '/coupons' },
        { id: 'discounts', label: 'Discounts', icon: <IoPricetagsOutline />, path: '/discounts' },
        { id: 'store', label: 'Storefront', icon: <IoStorefrontOutline />, path: '/store' },
      ]
    },
    {
      group: 'ANALYTICS',
      items: [
        { 
          id: 'reports', 
          label: 'Reports', 
          icon: <IoStatsChartOutline />,
          submenu: [
            { id: 'sales-report', label: 'Sales Report', path: '/reports/sales' },
            { id: 'traffic', label: 'Traffic Analytics', path: '/reports/traffic' },
            { id: 'revenue', label: 'Revenue', path: '/reports/revenue' },
          ]
        },
        { id: 'statistics', label: 'Statistics', icon: <HiOutlineChartSquareBar />, path: '/statistics' },
      ]
    },
    {
      group: 'FINANCE',
      items: [
        { id: 'transactions', label: 'Transactions', icon: <IoWalletOutline />, path: '/transactions' },
        { id: 'payouts', label: 'Payouts', icon: <IoLayersOutline />, path: '/payouts' },
      ]
    },
    {
      group: 'SUPPORT',
      items: [
        { id: 'messages', label: 'Messages', icon: <IoMailOutline />, badge: '5', path: '/messages' },
        { id: 'help', label: 'Help Center', icon: <IoHelpCircleOutline />, path: '/help' },
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { 
          id: 'settings', 
          label: 'Settings', 
          icon: <IoSettingsOutline />,
          submenu: [
            { id: 'general', label: 'General', path: '/settings/general' },
            { id: 'security', label: 'Security', path: '/settings/security' },
            { id: 'notifications-settings', label: 'Notifications', path: '/settings/notifications' },
            { id: 'api', label: 'API Keys', path: '/settings/api' },
          ]
        },
      ]
    }
  ]

  const renderMenuItem = (item) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const isExpanded = expandedMenus.includes(item.id)
    const isActive = location.pathname === item.path || 
                     (hasSubmenu && item.submenu.some(sub => location.pathname === sub.path))

    return (
      <li key={item.id} className='admin-sidebar__menu-item'>
        {hasSubmenu ? (
          <a 
            href='#'
            className={`admin-sidebar__menu-link ${isActive ? 'active' : ''} has-submenu`}
            onClick={(e) => {
              e.preventDefault()
              toggleSubmenu(item.id)
            }}
          >
            <span className='admin-sidebar__menu-icon'>{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className='admin-sidebar__menu-label'>{item.label}</span>
                {item.badge && (
                  <span className='admin-sidebar__menu-badge'>{item.badge}</span>
                )}
                <span className='admin-sidebar__menu-arrow'>
                  {isExpanded ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
                </span>
              </>
            )}
          </a>
        ) : (
          <Link 
            to={item.path}
            className={`admin-sidebar__menu-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className='admin-sidebar__menu-icon'>{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className='admin-sidebar__menu-label'>{item.label}</span>
                {item.badge && (
                  <span className='admin-sidebar__menu-badge'>{item.badge}</span>
                )}
              </>
            )}
          </Link>
        )}
        
        {hasSubmenu && !isCollapsed && (
          <ul className={`admin-sidebar__submenu ${isExpanded ? 'expanded' : ''}`}>
            {item.submenu.map(subItem => (
              <li key={subItem.id} className='admin-sidebar__submenu-item'>
                <Link 
                  to={subItem.path}
                  className={`admin-sidebar__submenu-link ${location.pathname === subItem.path ? 'active' : ''}`}
                >
                  {subItem.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className='admin-sidebar__header'>
        <div className='admin-sidebar__logo'>
          <div className='admin-sidebar__logo-icon'>
            <span>E</span>
          </div>
          {!isCollapsed && (
            <div className='admin-sidebar__logo-text'>
              <span className='admin-sidebar__brand-name'>E-Commerce</span>
              <span className='admin-sidebar__brand-label'>Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className='admin-sidebar__nav'>
        {menuItems.map((group, index) => (
          <div key={index} className='admin-sidebar__menu-group'>
            {!isCollapsed && (
              <span className='admin-sidebar__group-label'>{group.group}</span>
            )}
            <ul className='admin-sidebar__menu-list'>
              {group.items.map(item => renderMenuItem(item))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className='admin-sidebar__footer'>
        <a href='#' className='admin-sidebar__logout'>
          <span className='admin-sidebar__menu-icon'><IoLogOutOutline /></span>
          {!isCollapsed && <span>Logout</span>}
        </a>
        
        {!isCollapsed && (
          <div className='admin-sidebar__version'>
            <span>Version 2.0.1</span>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar