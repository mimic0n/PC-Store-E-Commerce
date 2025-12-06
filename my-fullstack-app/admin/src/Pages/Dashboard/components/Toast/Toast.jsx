import React, { useEffect } from 'react'
import { 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline, 
  IoWarningOutline 
} from 'react-icons/io5'
import './Toast.css'

export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <IoCheckmarkCircleOutline />,
    error: <IoCloseCircleOutline />,
    warning: <IoWarningOutline />
  }

  return (
    <div className={`dashboard__toast dashboard__toast--${type}`}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose}><IoCloseCircleOutline /></button>
    </div>
  )
}

export default Toast