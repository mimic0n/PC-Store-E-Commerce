import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AdminProvider, useAdmin } from './context/AdminContext'
import { Dashboard } from './Pages/Dashboard/Dashboard.jsx'
import Header from './Component/Header/Header.jsx'
import Sidebar from './Component/Sidebar/Sidebar.jsx'
import AdminLogin from './Pages/AdminLogin/AdminLogin.jsx'
import AdminRegister from './Pages/AdminRegister/AdminRegister.jsx'
import AdminForgotPassword from './Pages/AdminForgotPassword/AdminForgotPassword.jsx'
import AdminVerify from './Pages/AdminVerify/AdminVerify.jsx'
import AllProducts from './Pages/Products/AllProducts/AllProducts.jsx'
import AddProducts from './Pages/Products/AddProducts/AddProducts.jsx'
import Categories from './Pages/Products/Categories/Categories.jsx'
import All_Customer from './Pages/Customer/All_Customer/All_Customer.jsx'
import AdminProfile from './Pages/AdminProfile/AdminProfile.jsx'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdmin()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

// Layout component for authenticated pages
const AdminLayout = ({ isSidebarCollapsed, isSidebarOpen, toggleSidebar, closeSidebar }) => {
  return (
    <ProtectedRoute>
      <div className='admin-layout'>
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar} 
        />
        <div 
          className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
        <div className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
          <main className='admin-content'>
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Main App Content
function AppContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }
  
  const router = createBrowserRouter([
      // Auth routes (no sidebar/header)
      {
        path: "/admin/login",
        element: <AdminLogin />
      },
      {
        path: "/admin/register",
        element: <AdminRegister />
      },
      {
        path: "/admin/forgot-password",
        element: <AdminForgotPassword />
      },
      {
        path: "/admin/verify",
        element: <AdminVerify />
      },
      {
        path: "/admin/profile",
        element: <AdminProfile />
      },
      // Protected routes with layout
      {
        path: "/",
        element: (
          <AdminLayout 
            isSidebarCollapsed={isSidebarCollapsed}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            closeSidebar={closeSidebar}
          />
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />
          },
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "products/AllProducts",
            element: <AllProducts />
          },
          {
            path: "products/AddProducts",
            element: <AddProducts />
          },
          {
            path: "products/Categories",
            element: <Categories />
          },
          {
            path: "customers/All_Customer",
            element: <All_Customer />
          },
        ]
      },
      {
        path: "*",
        element: <Navigate to="/admin/login" replace />
      }
    ]);
  
  return <RouterProvider router={router} />
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  )
}

export default App