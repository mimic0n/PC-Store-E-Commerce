import React from 'react'


export const SkeletonCard = () => (
  <div className='dashboard__stat-card dashboard__stat-card--skeleton'>
    <div className='dashboard__stat-header'>
      <div className='skeleton skeleton--icon'></div>
      <div className='skeleton skeleton--trend'></div>
    </div>
    <div className='dashboard__stat-body'>
      <div className='skeleton skeleton--value'></div>
      <div className='skeleton skeleton--text'></div>
    </div>
  </div>
)

export default SkeletonCard