import React, { useState } from 'react'
import "./OrdersTable.css"
import {
  IoSearchOutline,
  IoFunnelOutline,
  IoChevronDownOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCheckboxOutline,
  IoSquareOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoRefreshOutline,
  IoWarningOutline,
  IoEyeOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoCartOutline
} from 'react-icons/io5'
import { SkeletonRow } from '../Skeleton'
import { EmptyState } from '../EmptyState/EmptyState'
import './OrdersTable.css'

export const OrdersTable = ({ 
  orders, 
  isLoading, 
  onOrderAction, 
  onBulkAction,
  addToast 
}) => {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const itemsPerPage = 10

  // Filter & Sort logic
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || order.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      }
      if (sortConfig.key === 'total') {
        const aValue = parseFloat(a.total.replace(/[$,]/g, ''))
        const bValue = parseFloat(b.total.replace(/[$,]/g, ''))
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handlers
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id))
    }
  }

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      addToast('Please select at least one order', 'warning')
      return
    }
    onBulkAction(action, selectedOrders)
    setSelectedOrders([])
  }

  // Status badge renderer
  const renderStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', icon: <IoCheckmarkCircleOutline /> },
      pending: { label: 'Pending', icon: <IoTimeOutline /> },
      processing: { label: 'Processing', icon: <IoRefreshOutline /> },
      cancelled: { label: 'Cancelled', icon: <IoCloseCircleOutline /> },
      refunded: { label: 'Refunded', icon: <IoWarningOutline /> },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`dashboard__badge dashboard__badge--${status}`}>
        {config.icon}
        {config.label}
      </span>
    )
  }

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='dashboard__card dashboard__card--full-width'>
      <div className='dashboard__card-header'>
        <div className='dashboard__card-header-left'>
          <h3 className='dashboard__card-title'>Recent Orders</h3>
          <p className='dashboard__card-subtitle'>Manage and track your orders</p>
        </div>
        <a href='/orders' className='dashboard__card-link'>View All Orders</a>
      </div>

      {/* Table Toolbar */}
      <div className='dashboard__table-toolbar'>
        <div className='dashboard__table-toolbar-left'>
          {/* Search */}
          <div className='dashboard__search'>
            <IoSearchOutline className='dashboard__search-icon' />
            <input
              type='search'
              className='dashboard__search-input'
              placeholder='Search orders...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className='dashboard__filter'>
            <button
              className={`dashboard__filter-btn ${showFilterDropdown ? 'active' : ''}`}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <IoFunnelOutline />
              <span>Status</span>
              {filterStatus !== 'all' && <span className='dashboard__filter-badge'>1</span>}
              <IoChevronDownOutline />
            </button>
            {showFilterDropdown && (
              <div className='dashboard__filter-dropdown'>
                {['all', 'pending', 'processing', 'completed', 'cancelled', 'refunded'].map(status => (
                  <button
                    key={status}
                    className={`dashboard__filter-option ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => {
                      setFilterStatus(status)
                      setShowFilterDropdown(false)
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {filterStatus === status && <IoCheckmarkCircleOutline />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='dashboard__table-toolbar-right'>
          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className='dashboard__bulk-actions'>
              <span>{selectedOrders.length} selected</span>
              <button 
                className='dashboard__btn dashboard__btn--sm dashboard__btn--success-outline'
                onClick={() => handleBulkAction('complete')}
              >
                Mark Complete
              </button>
              <button 
                className='dashboard__btn dashboard__btn--sm dashboard__btn--danger-outline'
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='dashboard__table-container'>
        <table className='dashboard__table' role="grid">
          <thead className='dashboard__table-header'>
            <tr>
              <th className='dashboard__table-checkbox'>
                <button
                  className={`dashboard__checkbox ${selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? 'checked' : ''}`}
                  onClick={handleSelectAll}
                >
                  {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 
                    ? <IoCheckboxOutline /> 
                    : <IoSquareOutline />
                  }
                </button>
              </th>
              <th 
                className={`dashboard__table-sortable ${sortConfig.key === 'id' ? 'active' : ''}`}
                onClick={() => handleSort('id')}
              >
                Order ID
                <IoChevronDownOutline className={`dashboard__sort-icon ${sortConfig.key === 'id' ? sortConfig.direction : ''}`} />
              </th>
              <th>Customer</th>
              <th>Products</th>
              <th>Status</th>
              <th 
                className={`dashboard__table-sortable ${sortConfig.key === 'total' ? 'active' : ''}`}
                onClick={() => handleSort('total')}
              >
                Total
                <IoChevronDownOutline className={`dashboard__sort-icon ${sortConfig.key === 'total' ? sortConfig.direction : ''}`} />
              </th>
              <th 
                className={`dashboard__table-sortable ${sortConfig.key === 'date' ? 'active' : ''}`}
                onClick={() => handleSort('date')}
              >
                Date
                <IoChevronDownOutline className={`dashboard__sort-icon ${sortConfig.key === 'date' ? sortConfig.direction : ''}`} />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, idx) => <SkeletonRow key={idx} />)
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title="No orders found"
                    description="Try adjusting your search or filter criteria."
                    icon={<IoCartOutline />}
                  />
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className={`dashboard__table-row ${selectedOrders.includes(order.id) ? 'selected' : ''}`}
                >
                  <td className='dashboard__table-checkbox'>
                    <button
                      className={`dashboard__checkbox ${selectedOrders.includes(order.id) ? 'checked' : ''}`}
                      onClick={() => handleSelectOrder(order.id)}
                    >
                      {selectedOrders.includes(order.id) 
                        ? <IoCheckboxOutline /> 
                        : <IoSquareOutline />
                      }
                    </button>
                  </td>
                  <td>
                    <a href={`/orders/${order.id}`} className='dashboard__order-id'>
                      {order.id}
                    </a>
                  </td>
                  <td>
                    <div className='dashboard__customer'>
                      <div className='dashboard__customer-avatar'>
                        {order.customer.charAt(0)}
                      </div>
                      <div className='dashboard__customer-info'>
                        <span className='dashboard__customer-name'>{order.customer}</span>
                        <span className='dashboard__customer-email'>{order.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className='dashboard__products-text'>{order.products}</span>
                  </td>
                  <td>{renderStatusBadge(order.status)}</td>
                  <td><strong>{order.total}</strong></td>
                  <td>{formatDate(order.date)}</td>
                    <td className='dashboard__actions-cell'>
                    <div className='dashboard__actions'>
                    <button 
                        className='dashboard__action-btn' 
                        title='View'
                        onClick={() => onOrderAction(order.id, 'view')}
                        aria-label={`View order ${order.id}`}
                    >
                        <IoEyeOutline />
                    </button>
                    <button 
                        className='dashboard__action-btn' 
                        title='Edit'
                        onClick={() => onOrderAction(order.id, 'edit')}
                        aria-label={`Edit order ${order.id}`}
                    >
                        <IoCreateOutline />
                    </button>
                    <button 
                        className='dashboard__action-btn dashboard__action-btn--danger' 
                        title='Delete'
                        onClick={() => onOrderAction(order.id, 'delete')}
                        aria-label={`Delete order ${order.id}`}
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

      {/* Pagination */}
      {!isLoading && filteredOrders.length > 0 && (
        <nav className='dashboard__pagination' aria-label="Orders pagination">
          <p className='dashboard__pagination-info'>
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</strong> of{' '}
            <strong>{filteredOrders.length}</strong> orders
          </p>
          <div className='dashboard__pagination-controls'>
            <button
              className='dashboard__pagination-btn'
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <IoChevronBackOutline />
              <IoChevronBackOutline />
            </button>
            <button
              className='dashboard__pagination-btn'
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              <IoChevronBackOutline />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page
              if (totalPages <= 5) {
                page = i + 1
              } else if (currentPage <= 3) {
                page = i + 1
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i
              } else {
                page = currentPage - 2 + i
              }
              return (
                <button
                  key={page}
                  className={`dashboard__pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              className='dashboard__pagination-btn'
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
            >
              <IoChevronForwardOutline />
            </button>
            <button
              className='dashboard__pagination-btn'
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <IoChevronForwardOutline />
              <IoChevronForwardOutline />
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}

export default OrdersTable