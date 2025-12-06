import React, { useState, useEffect, useRef } from 'react'
import './Header.css'
import { IoSearchOutline, IoNotificationsOutline, IoMoonOutline, IoSunnyOutline, IoMenu } from 'react-icons/io5'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { IoLogOutOutline, IoSettingsOutline, IoKeyOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const Header = ({ toggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate()
  const { admin, handleLogout } = useAdmin()
  
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const profileRef = useRef(null)
  const notificationRef = useRef(null)

  const breadcrumbs = ['Dashboard', 'Overview']

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const handleLogoutClick = async () => { 
    try {
      await handleLogout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
      setShowProfileMenu(false)
    }
  }

  const getInitials = () => {
    if (!admin?.fullName) return 'ADMIN'
    const names = admin.fullName.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }

  // Get display name
  const getDisplayName = () => {
    return admin?.fullName || 'Admin User'
  }

  // Get role display
  const getRoleDisplay = () => {
    return admin?.role === 'admin' ? 'Administrator' : 'Super Admin'
  }

  return (
    <header className='admin-header'>
      <div className='admin-header__left'>
        <button 
          className='admin-header__menu-btn'
          onClick={toggleSidebar}
        >
          <IoMenu />
        </button>
        
        <nav className='admin-header__breadcrumbs'>
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className='admin-header__breadcrumb-item'>
            {index > 0 && <MdKeyboardArrowRight className='admin-header__breadcrumb-separator' />}
            <a href='#' className={index === breadcrumbs.length - 1 ? 'active' : ''}>
              {crumb}
            </a>
          </span>
        ))}
      </nav>
    </div>

      <div className='admin-header__center'>
        <div className='admin-header__search'>
          <IoSearchOutline className='admin-header__search-icon' />
          <input 
            type='text' 
            placeholder='Search orders, customers, products...' 
            className='admin-header__search-input'
          />
          <span className='admin-header__search-shortcut'>Ctrl+K</span>
        </div>
      </div>

      <div className='admin-header__right'>
        <button 
          className='admin-header__icon-btn'
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <IoSunnyOutline /> : <IoMoonOutline />}
        </button>

        <div className='admin-header__notifications' ref={notificationRef}>
          <button 
            className='admin-header__icon-btn'
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <IoNotificationsOutline />
            <span className='admin-header__notification-badge'>3</span>
          </button>
          
          {showNotifications && (
            <div className='admin-header__dropdown admin-header__notifications-dropdown'>
              <div className='admin-header__dropdown-header'>
                <h4>Notifications</h4>
                <a href='#'>Mark all as read</a>
              </div>
              <div className='admin-header__dropdown-content'>
                <div className='admin-header__notification-item unread'>
                  <div className='admin-header__notification-dot'></div>
                  <div className='admin-header__notification-info'>
                    <p>New order #12345 received</p>
                    <span>2 minutes ago</span>
                  </div>
                </div>
                <div className='admin-header__notification-item unread'>
                  <div className='admin-header__notification-dot'></div>
                  <div className='admin-header__notification-info'>
                    <p>System update completed</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
                <div className='admin-header__notification-item'>
                  <div className='admin-header__notification-info'>
                    <p>New user registered</p>
                    <span>3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='admin-header__profile' ref={profileRef}>
          <button 
            className='admin-header__profile-btn'
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <span className='admin-header__avatar'>
              <span>{getInitials()}</span>
            </span>
            <div className='admin-header__user-info'>
              <span className='admin-header__user-name'>{getDisplayName()}</span>
              <div className='admin-header__user-role'>{getRoleDisplay()}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className='admin-header__dropdown admin-header__profile-dropdown'>
              <div className='admin-header__dropdown-item-setting'>
                <button 
                    className='admin-header__dropdown-item'
                    onClick={() => {
                      setShowProfileMenu(false)
                      navigate('/admin/profile')
                    }}
                    >
                    <IoSettingsOutline className='admin-header__dropdown-icon' />
                    Profile Settings
                  </button>
                <button 
                  className='admin-header__dropdown-item'
                  onClick={() => {
                    setShowProfileMenu(false)
                    // navigate('/change-password') // Uncomment khi có trang đổi mật khẩu
                  }}
                >
                  <IoKeyOutline className='admin-header__dropdown-icon' />
                  Change Password
                </button>
              </div>
              <div className='admin-header__dropdown-divider'></div>
              <button 
                className='admin-header__dropdown-item logout'
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <IoLogOutOutline className='admin-header__dropdown-icon' />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header