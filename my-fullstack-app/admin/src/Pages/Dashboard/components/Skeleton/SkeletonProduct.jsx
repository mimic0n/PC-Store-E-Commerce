import React from 'react'


export const SkeletonProduct = () => (
  <div className='dashboard__product-item'>
    <div className='skeleton skeleton--rank'></div>
    <div className='skeleton skeleton--product-img'></div>
    <div className='dashboard__product-info'>
      <div className='skeleton skeleton--text-md'></div>
      <div className='skeleton skeleton--text-sm'></div>
    </div>
    <div className='skeleton skeleton--text-sm'></div>
  </div>
)

export default SkeletonProduct