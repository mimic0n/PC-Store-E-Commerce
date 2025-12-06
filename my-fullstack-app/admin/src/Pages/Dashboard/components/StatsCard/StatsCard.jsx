import React from 'react'
import { IoArrowUpOutline, IoArrowDownOutline } from 'react-icons/io5'
import './StatsCard.css'

export const StatsCard = ({ stat }) => {
  const { id, label, value, change, trend, icon, color, description } = stat

  return (
    <article className={`dashboard__stat-card dashboard__stat-card--${color}`}>
      <div className='dashboard__stat-header'>
        <div className={`dashboard__stat-icon dashboard__stat-icon--${color}`}>
          {icon}
        </div>
        <span className={`dashboard__stat-trend dashboard__stat-trend--${trend}`}>
          {trend === 'up' ? <IoArrowUpOutline /> : <IoArrowDownOutline />}
          {change}
        </span>
      </div>
      <div className='dashboard__stat-body'>
        <h3 className='dashboard__stat-value'>{value}</h3>
        <p className='dashboard__stat-label'>{label}</p>
        <span className='dashboard__stat-description'>{description}</span>
      </div>
    </article>
  )
}

export default StatsCard