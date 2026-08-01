import React from 'react'
import './BannerBox.css';

export const BannerBox = (props) => {
  return (
      <div className='BannerBox'>
      <a href={props.href}><img src={props.img} className='BannerBoxIMG' alt={props.alt } loading='lazy'></img></a>
    </div>
  )
}

export default BannerBox
