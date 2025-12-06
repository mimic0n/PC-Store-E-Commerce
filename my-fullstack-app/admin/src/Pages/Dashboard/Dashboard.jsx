import React, { lazy, Suspense } from 'react'
import './Dashboard.css'
import { 
  IoCalendarOutline,
  IoChevronDownOutline,
  IoDownloadOutline,
  IoRefreshOutline
} from 'react-icons/io5'

// Components
import { Toast } from './components/Toast/Toast'
import { SkeletonCard, SkeletonChart } from './components/Skeleton'
import { StatsCard } from './components/StatsCard/StatsCard'
import { TopProducts } from './components/TopProducts/TopProducts'
import { OrdersTable } from './components/OrdersTable/OrdersTable'

// Hooks
import { useDashboard } from './hooks/useDashboard.jsx'

// Lazy load heavy components
const SalesChart = lazy(() => import('../../Component/Chart/SalesChart/SalesChart'))

export const Dashboard = () => {
  const {
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
  } = useDashboard()

  return (
    <div className='dashboard'>
      {/* Toast Notifications */}
      <div className='dashboard__toast-container' role="region" aria-label="Notifications">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>

      {/* Skip Link */}
      <a href="#main-content" className="dashboard__skip-link">
        Skip to main content
      </a>

      <main id="main-content" role="main">
        {/* ==================== HEADER ==================== */}
        <header className='dashboard__header'>
          <div className='dashboard__header-left'>
            <h1 className='dashboard__title'>Dashboard</h1>
            <p className='dashboard__subtitle'>Welcome back! Here's your store overview.</p>
          </div>
          <div className='dashboard__header-actions'>
            <button className='dashboard__date-picker'>
              <IoCalendarOutline />
              <span>Last 7 days</span>
              <IoChevronDownOutline />
            </button>
            <button className='dashboard__btn dashboard__btn--outline'>
              <IoDownloadOutline />
              Export
            </button>
            <button className='dashboard__btn dashboard__btn--primary'>
              <IoRefreshOutline />
              Refresh
            </button>
          </div>
        </header>

        {/* ==================== TẦNG 1: KPI STATS ==================== */}
        <section className='dashboard__section' aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="dashboard__sr-only">Key Performance Indicators</h2>
          <div className='dashboard__stats-grid'>
            {isLoading ? (
              Array(4).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
            ) : (
              stats.map((stat) => <StatsCard key={stat.id} stat={stat} />)
            )}
          </div>
        </section>

        {/* ==================== TẦNG 2: CHARTS & TOP PRODUCTS ==================== */}
        <section className='dashboard__section'>
          <div className='dashboard__charts-grid'>
            {/* Sales Chart */}
            <div className='dashboard__card dashboard__card--lg'>
              <div className='dashboard__card-header'>
                <div className='dashboard__card-header-left'>
                  <h3 className='dashboard__card-title'>Sales Overview</h3>
                  <p className='dashboard__card-subtitle'>Revenue vs Orders trend</p>
                </div>
                <div className='dashboard__card-actions'>
                  <select 
                    className='dashboard__select' 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className='dashboard__card-body'>
                {isLoading ? (
                  <SkeletonChart />
                ) : (
                  <Suspense fallback={<SkeletonChart />}>
                    <SalesChart />
                  </Suspense>
                )}
              </div>
            </div>

            {/* Top Products */}
            <TopProducts products={topProducts} isLoading={isLoading} />
          </div>
        </section>

        {/* ==================== TẦNG 3: RECENT ORDERS TABLE ==================== */}
        <section className='dashboard__section' aria-labelledby="orders-heading">
          <OrdersTable 
            orders={orders}
            isLoading={isLoading}
            onOrderAction={handleOrderAction}
            onBulkAction={handleBulkAction}
            addToast={addToast}
          />
        </section>
      </main>
    </div>
  )
}

export default Dashboard