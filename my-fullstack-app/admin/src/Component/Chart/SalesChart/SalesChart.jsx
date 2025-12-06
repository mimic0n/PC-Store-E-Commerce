import React from 'react'
import './SalesChart.css'

const SalesChart = () => {
  // Mock data cho biểu đồ
  const data = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 78 },
    { day: 'Thu', value: 52 },
    { day: 'Fri', value: 89 },
    { day: 'Sat', value: 95 },
    { day: 'Sun', value: 72 },
  ]

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className='sales-chart'>
      <div className='sales-chart__bars'>
        {data.map((item, idx) => (
          <div key={idx} className='sales-chart__bar-group'>
            <div 
              className='sales-chart__bar'
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.day}: $${item.value * 100}`}
            />
            <span className='sales-chart__label'>{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesChart