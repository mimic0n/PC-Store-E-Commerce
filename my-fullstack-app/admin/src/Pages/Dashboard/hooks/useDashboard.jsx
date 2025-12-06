import { useState, useEffect, useCallback } from 'react'
import { 
  IoWalletOutline, 
  IoCartOutline, 
  IoPeopleOutline, 
  IoAlertCircleOutline 
} from 'react-icons/io5'

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [orders, setOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [toasts, setToasts] = useState([])
  const [dateRange, setDateRange] = useState('7days')


  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats([
          { 
            id: 1,
            label: 'Total Revenue', 
            value: '$128,430', 
            change: '+12.5%', 
            trend: 'up',
            icon: <IoWalletOutline />, 
            color: 'success',
            description: 'vs last month'
          },
          { 
            id: 2,
            label: 'New Orders', 
            value: '284', 
            change: '+8.2%', 
            trend: 'up',
            icon: <IoCartOutline />, 
            color: 'info',
            description: 'vs last month'
          },
          { 
            id: 3,
            label: 'New Customers', 
            value: '1,429', 
            change: '-2.4%', 
            trend: 'down',
            icon: <IoPeopleOutline />, 
            color: 'warning',
            description: 'vs last month'
          },
          { 
            id: 4,
            label: 'Low Stock Items', 
            value: '23', 
            change: '+5', 
            trend: 'up',
            icon: <IoAlertCircleOutline />, 
            color: 'danger',
            description: 'items need restock'
          },
        ])
  
        setOrders([
          { id: 'ORD-001', customer: 'Nguyễn Văn A', email: 'nguyenvana@email.com', products: 'PC AMD Gaming Luxury', total: '48,800,000 VND', status: 'completed', date: '2024-01-15 14:30' },
          { id: 'ORD-002', customer: 'Trần Thị B', email: 'tranthib@email.com', products: 'NVIDIA RTX 4090, RAM 64GB', total: '35,200,000 VND', status: 'pending', date: '2024-01-15 13:45' },
          { id: 'ORD-003', customer: 'Lê Văn C', email: 'levanc@email.com', products: 'AMD Ryzen 9 9950X3D', total: '18,500,000 VND', status: 'processing', date: '2024-01-15 12:20' },
          { id: 'ORD-004', customer: 'Phạm Thị D', email: 'phamthid@email.com', products: 'ASUS ROG STRIX X870E', total: '12,900,000 VND', status: 'completed', date: '2024-01-15 11:00' },
          { id: 'ORD-005', customer: 'Hoàng Văn E', email: 'hoangvane@email.com', products: 'Gaming Setup Bundle', total: '28,600,000 VND', status: 'cancelled', date: '2024-01-15 10:30' },
        ])
  
        setTopProducts([
          { 
            id: 1, 
            name: 'PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090', 
            category: 'Complete PC', 
            sold: 89, 
            revenue: '4,342,000,000 VND', 
            trend: 'up', 
            trendValue: '+25%',
            image: '/path/to/pc-image.jpg'
          },
          { 
            id: 2, 
            name: 'NVIDIA RTX 5090 32GB GDDR7 OC Edition', 
            category: 'Graphics Card', 
            sold: 156, 
            revenue: '3,744,000,000 VND', 
            trend: 'up', 
            trendValue: '+18%',
            image: '/path/to/rtx-image.jpg'
          },
          { 
            id: 3, 
            name: 'AMD Ryzen 9 9950X3D (16 cores 32 threads)', 
            category: 'CPU', 
            sold: 234, 
            revenue: '4,329,000,000 VND', 
            trend: 'up', 
            trendValue: '+22%',
            image: '/path/to/cpu-image.jpg'
          },
          { 
            id: 4, 
            name: 'ASUS ROG STRIX X870E-E Gaming Wifi DDR5', 
            category: 'Mainboard', 
            sold: 178, 
            revenue: '2,297,000,000 VND', 
            trend: 'up', 
            trendValue: '+15%',
            image: '/path/to/mainboard-image.jpg'
          },
          { 
            id: 5, 
            name: 'G.SKILL Trident Z5 RGB 64GB DDR5 6000MHz', 
            category: 'RAM', 
            sold: 312, 
            revenue: '1,872,000,000 VND', 
            trend: 'up', 
            trendValue: '+12%',
            image: '/path/to/ram-image.jpg'
          },
        ])
  
        setIsLoading(false)
      }, 1500)
    }
  
    fetchData()
  }, [])

  // Toast handlers
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Order handlers
  const handleOrderAction = useCallback((orderId, action) => {
    switch (action) {
      case 'view':
        addToast(`Viewing order ${orderId}`, 'success')
        break
      case 'edit':
        addToast(`Editing order ${orderId}`, 'success')
        break
      case 'delete':
        addToast(`Order ${orderId} deleted`, 'success')
        break
      default:
        break
    }
  }, [addToast])

  const handleBulkAction = useCallback((action, selectedOrders) => {
    switch (action) {
      case 'complete':
        addToast(`${selectedOrders.length} orders marked as completed`, 'success')
        break
      case 'delete':
        addToast(`${selectedOrders.length} orders deleted`, 'success')
        break
      default:
        break
    }
  }, [addToast])

  return {
    isLoading,
    stats,
    orders,
    topProducts,
    toasts,
    dateRange,
    setDateRange,
    addToast,
    removeToast,
    handleOrderAction,
    handleBulkAction
  }
}

export default useDashboard