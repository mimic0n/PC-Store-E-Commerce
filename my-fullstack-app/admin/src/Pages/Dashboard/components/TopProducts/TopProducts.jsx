import React from 'react'
import { Link } from 'react-router-dom'
import { IoCubeOutline, IoArrowUpOutline, IoArrowDownOutline } from 'react-icons/io5'
import { SkeletonProduct } from '../Skeleton'
import './TopProducts.css'

export const TopProducts = ({ products, isLoading }) => {
  return (
    <div className='dashboard__card'>
      <div className='dashboard__card-header'>
        <div className='dashboard__card-header-left'>
          <h3 className='dashboard__card-title'>Top Products</h3>
          <p className='dashboard__card-subtitle'>Best selling this month</p>
        </div>
        <a href='/products' className='dashboard__card-link'>View All</a>
      </div>
      <div className='dashboard__card-body dashboard__card-body--no-padding'>
        <div className='dashboard__products-list'>
          {isLoading ? (
            Array(5).fill(0).map((_, idx) => <SkeletonProduct key={idx} />)
          ) : (
            products.map((product, idx) => (
              <div key={product.id} className='dashboard__product-item'>
                <span className={`dashboard__product-rank dashboard__product-rank--${idx + 1}`}>
                  {idx + 1}
                </span>
                <Link to={`/ProductDetails/${product.id}`}>
                  <div className='dashboard__product-image'>
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <IoCubeOutline />
                    )}
                  </div>
                </Link>
                <div className='dashboard__product-info'>
                  <Link to={`/ProductDetails/${product.id}`}>
                    <h4>{product.name}</h4>
                  </Link>
                  <span>{product.category}</span>
                </div>
                <div className='dashboard__product-stats'>
                  <span className='dashboard__product-amount'>{product.revenue}</span>
                  <span className='dashboard__product-sold'>{product.sold} sold</span>
                </div>
                <span className={`dashboard__product-trend dashboard__product-trend--${product.trend}`}>
                  {product.trend === 'up' ? <IoArrowUpOutline /> : <IoArrowDownOutline />}
                  {product.trendValue}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TopProducts