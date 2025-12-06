import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminRegister.css'

import { 
    IoShieldCheckmarkOutline,
    IoPersonOutline,
    IoMailOutline,
    IoLockClosedOutline,
    IoCallOutline,
    IoBriefcaseOutline,
    IoCheckmarkSharp,
    IoAlertCircleOutline,
    IoRocketOutline,
    IoStatsChartOutline,
    IoSettingsOutline,
    IoPeopleOutline,
    IoLayersOutline,
    IoSpeedometerOutline
} from 'react-icons/io5'
import { BsGoogle, BsMicrosoft, BsGithub } from 'react-icons/bs'
import { MdAdminPanelSettings } from 'react-icons/md'
import { adminRegister } from '../../api/adminAuthService'

export const AdminRegister = () => {
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        agreeTerms: false
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState({ level: 0, text: '' })
    const [submitError, setSubmitError] = useState('')


    // Check password strength
    const checkPasswordStrength = useCallback((password) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

        const levels = ['', 'Weak', 'Medium', 'Strong', 'Very Strong']
        setPasswordStrength({ level: strength, text: levels[strength] })
    }, [])


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === 'checkbox' ? checked : value

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }))

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
        setSubmitError('')

        if (name === 'password') {
            checkPasswordStrength(value)
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be 10-11 digits'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.role) {
            newErrors.role = 'Please select a role'
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        setSubmitError('')

        try {
            const response = await adminRegister({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
            })

            if (response.success) {
                localStorage.setItem('pendingAdminVerifyEmail', formData.email)
                
                navigate('/admin/verify', { 
                    state: { 
                        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.',
                        email: formData.email
                    } 
                })
            }
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
            setSubmitError(errorMessage)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='AdminRegister_Page'>
            {/* Left Side Panel */}
            <div className='register_description_left'>
                <div className='description_content'>
                    <div className='description_icon_box'>
                        <MdAdminPanelSettings />
                    </div>
                    <h2 className='description_title'>Join Admin Team</h2>
                    <p className='description_text'>
                        Create your admin account to access powerful management tools
                    </p>
                    
                    <div className='features_list'>
                        <div className='feature_item'>
                            <div className='feature_icon'>
                                <IoSpeedometerOutline />
                            </div>
                            <span className='feature_text'>Real-time Dashboard</span>
                        </div>
                        <div className='feature_item'>
                            <div className='feature_icon'>
                                <IoLayersOutline />
                            </div>
                            <span className='feature_text'>Product Management</span>
                        </div>
                        <div className='feature_item'>
                            <div className='feature_icon'>
                                <IoStatsChartOutline />
                            </div>
                            <span className='feature_text'>Analytics & Reports</span>
                        </div>
                        <div className='feature_item'>
                            <div className='feature_icon'>
                                <IoPeopleOutline />
                            </div>
                            <span className='feature_text'>Customer Management</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center - Register Form */}
            <div className='admin_ring'>
                <i></i>
                <i></i>
                <i></i>
                <form className='admin_register' onSubmit={handleSubmit}>
                    {isLoading && (
                        <div className='loading_overlay'>
                            <div className='loading_spinner'></div>
                        </div>
                    )}

                    <div className='admin_logo'>
                        <MdAdminPanelSettings />
                    </div>
                    
                    <h2>Register</h2>
                    <p className='register_subtitle'>Create your admin account</p>

                    {/* Submit Error */}
                    {submitError && (
                        <div className='submit_error'>
                            <IoAlertCircleOutline />
                            <span>{submitError}</span>
                        </div>
                    )}

                    {/* Name Row */}
                    <div className='form_row two_col'>
                        <div className={`inputBx ${errors.firstName ? 'error' : ''}`}>
                            <IoPersonOutline className='input_icon' />
                            <input 
                                type="text" 
                                placeholder="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            {errors.firstName && (
                                <span className='error_message'>
                                    <IoAlertCircleOutline /> {errors.firstName}
                                </span>
                            )}
                        </div>
                        <div className={`inputBx ${errors.lastName ? 'error' : ''}`}>
                            <IoPersonOutline className='input_icon' />
                            <input 
                                 type="text" 
                                 placeholder="Last Name"
                                 name="lastName"
                                 value={formData.lastName}
                                 onChange={handleInputChange}
                                 disabled={isLoading}
                            />
                            {errors.lastName && (
                                <span className='error_message'>
                                    <IoAlertCircleOutline /> {errors.lastName}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className={`inputBx ${errors.email ? 'error' : ''}`}>
                        <IoMailOutline className='input_icon' />
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <span className='error_message'>
                                <IoAlertCircleOutline /> {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Phone */}
                    <div className={`inputBx ${errors.phone ? 'error' : ''}`}>
                        <IoCallOutline className='input_icon' />
                        <input 
                            type="tel" 
                            placeholder="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.phone && (
                            <span className='error_message'>
                                <IoAlertCircleOutline /> {errors.phone}
                            </span>
                        )}
                    </div>

                    {/* Role Select */}
                    <div className={`inputBx ${errors.role ? 'error' : ''}`}>
                        <IoBriefcaseOutline className='input_icon' />
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Administrator</option>
                            <option value="manager">Manager</option>
                            <option value="editor">Editor</option>
                            <option value="support">Support Staff</option>
                        </select>
                        {errors.role && (
                            <span className='error_message'>
                                <IoAlertCircleOutline /> {errors.role}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div className={`inputBx ${errors.password ? 'error' : ''}`}>
                        <IoLockClosedOutline className='input_icon' />
                        <input 
                            type="password" 
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <span className='error_message'>
                                <IoAlertCircleOutline /> {errors.password}
                            </span>
                        )}
                        {formData.password && (
                            <>
                                <div className='password_strength'>
                                    <div className={`strength_bar ${passwordStrength.level >= 1 ? (passwordStrength.level === 1 ? 'weak' : passwordStrength.level === 2 ? 'medium' : 'strong') : ''}`}></div>
                                    <div className={`strength_bar ${passwordStrength.level >= 2 ? (passwordStrength.level === 2 ? 'medium' : 'strong') : ''}`}></div>
                                    <div className={`strength_bar ${passwordStrength.level >= 3 ? 'strong' : ''}`}></div>
                                    <div className={`strength_bar ${passwordStrength.level >= 4 ? 'strong' : ''}`}></div>
                                </div>
                                <span className={`strength_text ${passwordStrength.level === 1 ? 'weak' : passwordStrength.level === 2 ? 'medium' : passwordStrength.level >= 3 ? 'strong' : ''}`}>
                                    {passwordStrength.text}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className={`inputBx ${errors.confirmPassword ? 'error' : ''}`}>
                        <IoLockClosedOutline className='input_icon' />
                        <input 
                            type="password" 
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && (
                            <span className='error_message'>
                                <IoAlertCircleOutline /> {errors.confirmPassword}
                            </span>
                        )}
                    </div>

                    {/* Terms Checkbox */}
                   <label className='terms_checkbox'>
                        <input 
                            type="checkbox" 
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        <span className='custom_checkbox'>
                            <IoCheckmarkSharp />
                        </span>
                        <span className='terms_text'>
                            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                        </span>
                    </label>
                    {errors.agreeTerms && (
                        <span className='error_message terms_error'>
                            <IoAlertCircleOutline /> {errors.agreeTerms}
                        </span>
                    )}

                    {/* Submit Button */}
                    <div className='inputBx'>
                        <input 
                            type="submit" 
                            value={isLoading ? "Creating Account..." : "Create Account"}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Links */}
                    <div className='links'>
                        <span>Already have an account?</span>
                        <Link to="/admin/login">Sign In</Link>
                    </div>

                    {/* Divider */}
                    <div className='divider'>
                        <div className='divider_line'></div>
                        <span className='divider_text'>Or</span>
                        <div className='divider_line'></div>
                    </div>

                    {/* Social Register */}
                    <div className='social_register'>
                        <a href="#" className='social_btn google'>
                            <BsGoogle />
                        </a>
                        <a href="#" className='social_btn microsoft'>
                            <BsMicrosoft />
                        </a>
                        <a href="#" className='social_btn github'>
                            <BsGithub />
                        </a>
                    </div>

                    {/* Security Badge */}
                    <div className='security_badge'>
                        <IoShieldCheckmarkOutline />
                        <span>Your data is protected with 256-bit encryption</span>
                    </div>
                </form>
            </div>

            {/* Right Side Panel */}
            <div className='register_description_right'>
                <div className='description_content'>
                    <div className='stats_grid'>
                        <div className='stat_card'>
                            <div className='stat_number'>10K+</div>
                            <div className='stat_label'>Products</div>
                        </div>
                        <div className='stat_card'>
                            <div className='stat_number'>50K+</div>
                            <div className='stat_label'>Customers</div>
                        </div>
                        <div className='stat_card'>
                            <div className='stat_number'>99.9%</div>
                            <div className='stat_label'>Uptime</div>
                        </div>
                        <div className='stat_card'>
                            <div className='stat_number'>24/7</div>
                            <div className='stat_label'>Support</div>
                        </div>
                    </div>

                    <div className='floating_cards'>
                        <div className='floating_card card_1'>
                            <span className='card_icon'><IoRocketOutline /></span>
                            <span className='card_label'>Fast</span>
                        </div>
                        <div className='floating_card card_2'>
                            <span className='card_icon'><IoShieldCheckmarkOutline /></span>
                            <span className='card_label'>Secure</span>
                        </div>
                        <div className='floating_card card_3'>
                            <span className='card_icon'><IoSettingsOutline /></span>
                            <span className='card_label'>Powerful</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminRegister