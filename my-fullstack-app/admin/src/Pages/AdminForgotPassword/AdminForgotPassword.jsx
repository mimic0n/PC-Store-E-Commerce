import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminForgotPassword.css'
import { 
    IoMailOutline, 
    IoLockClosedOutline, 
    IoKeyOutline,
    IoArrowBack,
    IoShieldCheckmarkOutline,
    IoAlertCircleOutline,
    IoCheckmarkCircle
} from 'react-icons/io5'
import { MdAdminPanelSettings } from 'react-icons/md'
import { forgotPassword, verifyForgotPasswordOTP, resetPassword } from '../../api/adminAuthService'

export const AdminForgotPassword = () => {
    const navigate = useNavigate()
    
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // ==========  GỬI EMAIL ==========
    const handleSendOTP = async (e) => {
        e.preventDefault()
        
        if (!email.trim()) {
            setError('Vui lòng nhập email')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email không hợp lệ')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await forgotPassword(email)
            
            if (response.success) {
                setSuccess('Mã OTP đã được gửi đến email của bạn')
                setStep(2)
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Gửi OTP thất bại')
        } finally {
            setIsLoading(false)
        }
    }

    // ========== XÁC THỰC OTP ==========
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return // Chỉ cho 1 ký tự
        
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError('')

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        // Backspace - focus previous
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        
        const otpString = otp.join('')
        if (otpString.length !== 6) {
            setError('Vui lòng nhập đủ 6 số OTP')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await verifyForgotPasswordOTP(email, otpString)
            
            if (response.success) {
                setSuccess('Xác thực OTP thành công')
                setStep(3)
            }
        } catch (error) {
            setError(error.response?.data?.message || 'OTP không hợp lệ')
        } finally {
            setIsLoading(false)
        }
    }

    // ========== ĐẶT LẠI MẬT KHẨU ==========
    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (!passwords.newPassword || !passwords.confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin')
            return
        }

        if (passwords.newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await resetPassword(
                email,
                otp.join(''),
                passwords.newPassword,
                passwords.confirmPassword
            )
            
            if (response.success) {
                setSuccess('Đặt lại mật khẩu thành công!')
                setTimeout(() => {
                    navigate('/admin/login', {
                        state: { message: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.' }
                    })
                }, 2000)
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Đặt lại mật khẩu thất bại')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='AdminForgotPassword_Page'>
            <div className='forgot_container'>
                <div className='forgot_card'>
                    {/* Header */}
                    <div className='forgot_header'>
                        <div className='admin_logo'>
                            <MdAdminPanelSettings />
                        </div>
                        <h2>
                            {step === 1 && 'Forgot Password'}
                            {step === 2 && 'Verify OTP'}
                            {step === 3 && 'New Password'}
                        </h2>
                        <p className='forgot_subtitle'>
                            {step === 1 && 'Enter your email to receive OTP'}
                            {step === 2 && 'Enter the 6-digit code sent to your email'}
                            {step === 3 && 'Create your new password'}
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className='progress_steps'>
                        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <span className='step_number'>1</span>
                            <span className='step_label'>Email</span>
                        </div>
                        <div className='step_line'></div>
                        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <span className='step_number'>2</span>
                            <span className='step_label'>Verify</span>
                        </div>
                        <div className='step_line'></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <span className='step_number'>3</span>
                            <span className='step_label'>Reset</span>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className='message error'>
                            <IoAlertCircleOutline />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className='message success'>
                            <IoCheckmarkCircle />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Step 1: Email Form */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className='forgot_form'>
                            <div className='inputBx'>
                                <IoMailOutline className='input_icon' />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setError('')
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className='submit_btn'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Form */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className='forgot_form'>
                            <div className='otp_container'>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className='otp_input'
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            <p className='otp_hint'>
                                Didn't receive code? 
                                <button 
                                    type="button" 
                                    className='resend_btn'
                                    onClick={() => handleSendOTP({ preventDefault: () => {} })}
                                    disabled={isLoading}
                                >
                                    Resend
                                </button>
                            </p>
                            <button 
                                type="submit" 
                                className='submit_btn'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password Form */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className='forgot_form'>
                            <div className='inputBx'>
                                <IoLockClosedOutline className='input_icon' />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={passwords.newPassword}
                                    onChange={(e) => {
                                        setPasswords(p => ({ ...p, newPassword: e.target.value }))
                                        setError('')
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className='inputBx'>
                                <IoKeyOutline className='input_icon' />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => {
                                        setPasswords(p => ({ ...p, confirmPassword: e.target.value }))
                                        setError('')
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className='submit_btn'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <Link to="/admin/login" className='back_link'>
                        <IoArrowBack />
                        <span>Back to Login</span>
                    </Link>

                    {/* Security Badge */}
                    <div className='security_badge'>
                        <IoShieldCheckmarkOutline />
                        <span>Secure password reset</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminForgotPassword