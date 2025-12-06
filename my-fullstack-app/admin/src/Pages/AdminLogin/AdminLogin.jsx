import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminLogin.css'
import { 
  IoShieldCheckmark, 
  IoLockClosed, 
  IoMail, 
  IoEye, 
  IoEyeOff,
  IoFingerPrint,
  IoKey,
  IoServer,
  IoAlertCircle
} from 'react-icons/io5'
import { MdAdminPanelSettings, MdSecurity, MdVerifiedUser } from 'react-icons/md'
import { HiChartBar } from 'react-icons/hi'
import { adminLogin } from '../../api/adminAuthService'
import { AdminContext } from '../../context/AdminContext'

export const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { handleLogin } = useContext(AdminContext)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('') 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await adminLogin({
        email: formData.email,
        password: formData.password
      })

      if (response.success) {
        if (response.data.user.role !== 'admin') {
          setError('Bạn không có quyền truy cập Admin Dashboard')
          return
        }

        // Lưu thông tin và chuyển hướng
        handleLogin(response.data.user, response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='AdminLogin_Page'>
      {/* Left Side - Security Features */}
      <div className='AdminLogin_Description_1'>
        <div className='description_content'>
          <div className='admin_badge'>
            <MdAdminPanelSettings className='badge_icon' />
            <span>ADMIN PORTAL</span>
          </div>
          <h2 className='description_title'>Secure Access</h2>
          <p className='description_text'>
            Enterprise-grade security for your administrative operations
          </p>
          <div className='security_features'>
            <div className='security_item'>
              <div className='security_icon'>
                <IoShieldCheckmark />
              </div>
              <div className='security_info'>
                <span className='security_label'>256-bit Encryption</span>
                <span className='security_desc'>End-to-end secure connection</span>
              </div>
            </div>
            <div className='security_item'>
              <div className='security_icon'>
                <IoFingerPrint />
              </div>
              <div className='security_info'>
                <span className='security_label'>2FA Authentication</span>
                <span className='security_desc'>Multi-factor verification</span>
              </div>
            </div>
            <div className='security_item'>
              <div className='security_icon'>
                <MdSecurity />
              </div>
              <div className='security_info'>
                <span className='security_label'>Session Protection</span>
                <span className='security_desc'>Auto-logout & IP tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Login Form */}
      <div className="admin_ring">
        <i style={{'--clr':'#6366f1'}}></i>
        <i style={{'--clr':'#8b5cf6'}}></i>
        <i style={{'--clr':'#06b6d4'}}></i>
        <div className="admin_login">
          <div className='admin_logo'>
            <MdAdminPanelSettings />
          </div>
          <h2>Admin Login</h2>
          <p className='login_subtitle'>Access your dashboard</p>

          {/* Error Message */}
          {error && (
            <div className='error_alert'>
              <IoAlertCircle />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="Admin_login_form">
            <div className="inputBx">
              <IoMail className='input_icon' />
              <input 
                type="email" 
                placeholder="Admin Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
              <span className='input_highlight'></span>
            </div>
            
            <div className="inputBx">
              <IoLockClosed className='input_icon' />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
              <button 
                type="button"
                className='password_toggle'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
              <span className='input_highlight'></span>
            </div>

            <div className="options_row">
              <label className="remember_me">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                <span className="label_text">Remember me</span>
              </label>
              <Link to="/admin/forgot-password" className='forgot_link'>
                Forgot Password?
              </Link>
            </div>

            <div className="inputBx">
              <button 
                type="submit" 
                className={`submit_btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loader"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <IoKey />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </div>
          </form>

          <div className='links'>
            <span>Don't have an account?</span>
            <Link to="/admin/register">Request Access</Link>
          </div>

          <div className='security_notice'>
            <IoShieldCheckmark />
            <span>Protected by enterprise security</span>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Preview */}
      <div className='AdminLogin_Description_2'>
        <div className='description_content'>
          <div className='dashboard_preview'>
            <div className='preview_card card_1'>
              <span className='card_icon'><HiChartBar /></span>
              <span className='card_label'>Analytics</span>
              <span className='card_value'>+24%</span>
            </div>
            <div className='preview_card card_2'>
              <span className='card_icon'><IoServer /></span>
              <span className='card_label'>Orders</span>
              <span className='card_value'>1,234</span>
            </div>
            <div className='preview_card card_3'>
              <span className='card_icon'><MdVerifiedUser /></span>
              <span className='card_label'>Users</span>
              <span className='card_value'>5,678</span>
            </div>
          </div>
          <div className='preview_text'>
            <h2 className='illustration_title'>Command Center</h2>
            <p className='illustration_text'>
              Full control over your e-commerce platform
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminLogin