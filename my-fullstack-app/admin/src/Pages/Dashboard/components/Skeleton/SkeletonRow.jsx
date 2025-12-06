import React from 'react'


export const SkeletonRow = () => (
  <tr className='skeleton-row'>
    <td><div className='skeleton skeleton--checkbox'></div></td>
    <td><div className='skeleton skeleton--text-sm'></div></td>
    <td>
      <div className='skeleton skeleton--avatar'></div>
      <div className='skeleton skeleton--text-md'></div>
    </td>
    <td><div className='skeleton skeleton--text'></div></td>
    <td><div className='skeleton skeleton--badge'></div></td>
    <td><div className='skeleton skeleton--text-sm'></div></td>
    <td><div className='skeleton skeleton--actions'></div></td>
  </tr>
)

export default SkeletonRow