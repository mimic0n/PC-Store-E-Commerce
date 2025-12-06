import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import './AdminVerify.css'
import { 
    IoShieldCheckmarkOutline, 
    IoAlertCircleOutline,
    IoCheckmarkCircle,
    IoMailOutline,
    IoTimeOutline,
    IoRefreshOutline,
    IoArrowBackOutline
} from 'react-icons/io5'
import { MdAdminPanelSettings, MdSecurity, MdVerifiedUser } from 'react-icons/md'
import { verifyEmail, resendOTP } from '../../api/adminAuthService'

export const AdminVerify = () => {
    const navigate = useNavigate()
    const location = useLocation()
    
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        // Lấy email từ location state hoặc localStorage
        const stateEmail = location.state?.email
        const savedEmail = localStorage.getItem('pendingAdminVerifyEmail')
        
        if (stateEmail) {
            setEmail(stateEmail)
        } else if (savedEmail) {
            setEmail(savedEmail)
        } else {
            navigate('/admin/register')
        }

        // Hiển thị message nếu có
        if (location.state?.message) {
            setSuccess(location.state.message)
        }
    }, [location, navigate])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    const handleOtpChange = (index, value) => {
        // Chỉ cho phép số
        if (!/^\d*$/.test(value)) return
        if (value.length > 1) return
        
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError('')

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`admin-otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`admin-otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char
        })
        setOtp(newOtp)
        
        // Focus last filled input or last input
        const lastIndex = Math.min(pastedData.length - 1, 5)
        document.getElementById(`admin-otp-${lastIndex}`)?.focus()
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        
        const otpString = otp.join('')
        if (otpString.length !== 6) {
            setError('Vui lòng nhập đủ 6 số OTP')
            return
        }

        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await verifyEmail(email, otpString)
            
            if (response.success) {
                setSuccess('Xác thực email thành công! Đang chuyển hướng...')
                localStorage.removeItem('pendingAdminVerifyEmail')
                
                setTimeout(() => {
                    navigate('/admin/login', {
                        state: { message: 'Xác thực thành công! Vui lòng đăng nhập.' }
                    })
                }, 2000)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại.'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (!canResend) return

        setIsResending(true)
        setError('')
        setSuccess('')

        try {
            const response = await resendOTP(email)
            
            if (response.success) {
                setSuccess('Mã OTP mới đã được gửi đến email của bạn!')
                setCountdown(60)
                setCanResend(false)
                setOtp(['', '', '', '', '', ''])
                document.getElementById('admin-otp-0')?.focus()
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gửi lại OTP thất bại. Vui lòng thử lại.'
            setError(errorMessage)
        } finally {
            setIsResending(false)
        }
    }

    const maskEmail = (email) => {
        if (!email) return ''
        const [name, domain] = email.split('@')
        const maskedName = name.slice(0, 2) + '*'.repeat(Math.max(name.length - 4, 2)) + name.slice(-2)
        return `${maskedName}@${domain}`
    }

    return (
        <section className='AdminVerify_Page'>
            {/* Left Side - Security Info */}
            <div className='AdminVerify_Description'>
                <div className='description_content'>
                    <div className='admin_badge'>
                        <MdAdminPanelSettings className='badge_icon' />
                        <span>ADMIN VERIFICATION</span>
                    </div>
                    <h2 className='description_title'>Email Verification</h2>
                    <p className='description_text'>
                        Verify your identity to complete admin registration
                    </p>
                    <div className='security_features'>
                        <div className='security_item'>
                            <div className='security_icon'>
                                <IoShieldCheckmarkOutline />
                            </div>
                            <div className='security_info'>
                                <span className='security_label'>OTP Security</span>
                                <span className='security_desc'>6-digit verification code</span>
                            </div>
                        </div>
                        <div className='security_item'>
                            <div className='security_icon'>
                                <IoTimeOutline />
                            </div>
                            <div className='security_info'>
                                <span className='security_label'>Time Limited</span>
                                <span className='security_desc'>Code expires in 10 minutes</span>
                            </div>
                        </div>
                        <div className='security_item'>
                            <div className='security_icon'>
                                <MdSecurity />
                            </div>
                            <div className='security_info'>
                                <span className='security_label'>Account Protection</span>
                                <span className='security_desc'>Secure admin access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center - Verification Form */}
            <div className="admin_ring">
                <i style={{'--clr':'#6366f1'}}></i>
                <i style={{'--clr':'#8b5cf6'}}></i>
                <i style={{'--clr':'#06b6d4'}}></i>
                <div className="admin_verify_box">
                    <div className='admin_logo'>
                        <MdVerifiedUser />
                    </div>
                    <h2>Verify Email</h2>
                    <p className='verify_subtitle'>Enter the verification code</p>

                    {/* Email Display */}
                    <div className='email_display'>
                        <IoMailOutline className='email_icon' />
                        <span>Code sent to: <strong>{maskEmail(email)}</strong></span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className='error_alert'>
                            <IoAlertCircleOutline />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className='success_alert'>
                            <IoCheckmarkCircle />
                            <span>{success}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleVerify} className="Admin_verify_form">
                        {/* OTP Input */}
                        <div className='otp_container'>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`admin-otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={index === 0 ? handleOtpPaste : undefined}
                                    className={`otp_input ${digit ? 'filled' : ''} ${error ? 'error' : ''}`}
                                    disabled={isLoading}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {/* Countdown Timer */}
                        <div className='countdown_container'>
                            {!canResend ? (
                                <p className='countdown_text'>
                                    <IoTimeOutline />
                                    Gửi lại mã sau <span className='countdown_time'>{countdown}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isResending}
                                    className='resend_btn'
                                >
                                    <IoRefreshOutline className={isResending ? 'spinning' : ''} />
                                    {isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
                                </button>
                            )}
                        </div>

                        {/* Verify Button */}
                        <button 
                            type="submit" 
                            className='verify_btn'
                            disabled={isLoading || otp.join('').length !== 6}
                        >
                            {isLoading ? (
                                <>
                                    <span className='btn_loader'></span>
                                    Đang xác thực...
                                </>
                            ) : (
                                <>
                                    <IoShieldCheckmarkOutline />
                                    Xác thực
                                </>
                            )}
                        </button>

                        {/* Back to Register */}
                        <div className='back_link'>
                            <Link to="/admin/register">
                                <IoArrowBackOutline />
                                Quay lại đăng ký
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Instructions */}
            <div className='AdminVerify_Instructions'>
                <div className='instructions_content'>
                    <h3 className='instructions_title'>
                        <IoShieldCheckmarkOutline />
                        Instructions
                    </h3>
                    <ul className='instructions_list'>
                        <li>
                            <span className='step_number'>1</span>
                            <span>Check your email inbox for the verification code</span>
                        </li>
                        <li>
                            <span className='step_number'>2</span>
                            <span>Enter the 6-digit code in the fields above</span>
                        </li>
                        <li>
                            <span className='step_number'>3</span>
                            <span>Click "Verify" to complete registration</span>
                        </li>
                        <li>
                            <span className='step_number'>4</span>
                            <span>If you didn't receive it, check spam folder</span>
                        </li>
                    </ul>
                    <div className='help_text'>
                        <p>Having trouble? Contact support at</p>
                        <a href="mailto:support@hktstore.com">support@hktstore.com</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminVerify