import React from 'react'
import './EmptyState.css'

export const EmptyState = ({ title, description, actionLabel, onAction, icon }) => (
  <div className='dashboard__empty-state'>
    <div className='dashboard__empty-icon'>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {actionLabel && (
      <button className='dashboard__btn dashboard__btn--primary' onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
)

export default EmptyState