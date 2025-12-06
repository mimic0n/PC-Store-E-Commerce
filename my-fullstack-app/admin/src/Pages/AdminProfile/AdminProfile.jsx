import React, { useState, useRef } from 'react'
import './AdminProfile.css'
import { useAdmin } from '../../context/AdminContext'
import { updateAdminProfile, changePassword } from '../../api/adminAuthService'
import {
    IoPersonOutline,
    IoMailOutline,
    IoCallOutline,
    IoShieldCheckmarkOutline,
    IoCalendarOutline,
    IoCameraOutline,
    IoSaveOutline,
    IoKeyOutline,
    IoEyeOutline,
    IoEyeOffOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoInformationCircleOutline
} from 'react-icons/io5'

const AdminProfile = () => {
    const { admin, updateAdmin } = useAdmin()
    const fileInputRef = useRef(null)

    // Profile form state
    const [profileData, setProfileData] = useState({
        fullName: admin?.fullName || '',
        email: admin?.email || '',
        phone: admin?.phone || '',
    })

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // UI states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isProfileLoading, setIsProfileLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' })
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
    const [avatarPreview, setAvatarPreview] = useState(admin?.avatar || null)

    // Handle profile input change
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle password input change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setProfileMessage({ type: 'error', text: 'Image size must be less than 5MB' })
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Submit profile update
    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setIsProfileLoading(true)
        setProfileMessage({ type: '', text: '' })

        // Validation
        if (!profileData.fullName.trim()) {
            setProfileMessage({ type: 'error', text: 'Please enter your full name' })
            setIsProfileLoading(false)
            return
        }

        if (profileData.fullName.trim().length < 2) {
            setProfileMessage({ type: 'error', text: 'Full name must be at least 2 characters' })
            setIsProfileLoading(false)
            return
        }

        // Validate phone if provided
        if (profileData.phone && !/^[0-9]{10,11}$/.test(profileData.phone)) {
            setProfileMessage({ type: 'error', text: 'Phone number must be 10-11 digits' })
            setIsProfileLoading(false)
            return
        }

        try {
            const response = await updateAdminProfile({
                fullName: profileData.fullName.trim(),
                phone: profileData.phone || null,
            })
            
            if (response.success) {
                updateAdmin({
                    fullName: response.data.fullName,
                    phone: response.data.phone,
                })
                setProfileMessage({ type: 'success', text: 'Profile updated successfully!' })
            }
        } catch (error) {
            setProfileMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update profile' 
            })
        } finally {
            setIsProfileLoading(false)
        }
    }

    // Submit password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setIsPasswordLoading(true)
        setPasswordMessage({ type: '', text: '' })

        // Validation - check empty fields
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Please fill in all password fields' })
            setIsPasswordLoading(false)
            return
        }

        // Validation - check password match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
            setIsPasswordLoading(false)
            return
        }

        // Validation - check minimum length
        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            setIsPasswordLoading(false)
            return
        }

        try {
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            })

            if (response.success) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
                // Clear password fields
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }
        } catch (error) {
            setPasswordMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to change password' 
            })
        } finally {
            setIsPasswordLoading(false)
        }
    }

    // Get initials for avatar
    const getInitials = () => {
        if (!admin?.fullName) return 'AD'
        const names = admin.fullName.split(' ')
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase()
        }
        return names[0].substring(0, 2).toUpperCase()
    }

    // Password strength checker
    const getPasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 6) strength++
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++
        return strength
    }

    const passwordStrength = getPasswordStrength(passwordData.newPassword)
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#06b6d4']

    return (
        <div className='admin-profile'>
            {/* Animated Background */}
            <div className='admin-profile__bg'>
                <div className='admin-profile__grid'></div>
                <div className='admin-profile__particles'>
                    {[...Array(8)].map((_, i) => (
                        <div 
                            key={i} 
                            className='admin-profile__particle'
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 8}s`,
                                animationDuration: `${8 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Header */}
            <header className='admin-profile__header'>
                <div className='admin-profile__header-content'>
                    <h1 className='admin-profile__title'>Profile Settings</h1>
                    <p className='admin-profile__subtitle'>Manage your account information and security settings</p>
                </div>
            </header>

            <div className='admin-profile__content'>
                {/* Profile Card */}
                <section className='admin-profile__card admin-profile__card--info'>
                    <div className='admin-profile__card-header'>
                        <div className='admin-profile__card-icon'>
                            <IoPersonOutline />
                        </div>
                        <div>
                            <h2 className='admin-profile__card-title'>Personal Information</h2>
                            <p className='admin-profile__card-desc'>Update your personal details</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className='admin-profile__form'>
                        {/* Avatar Section */}
                        <div className='admin-profile__avatar-section'>
                            <div className='admin-profile__avatar-wrapper'>
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt='Profile' 
                                        className='admin-profile__avatar-img'
                                    />
                                ) : (
                                    <div className='admin-profile__avatar-placeholder'>
                                        <span>{getInitials()}</span>
                                    </div>
                                )}
                                <button 
                                    type='button'
                                    className='admin-profile__avatar-btn'
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <IoCameraOutline />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleAvatarChange}
                                    className='admin-profile__avatar-input'
                                />
                            </div>
                            <div className='admin-profile__avatar-info'>
                                <span className='admin-profile__avatar-name'>{admin?.fullName || 'Admin User'}</span>
                                <span className='admin-profile__avatar-role'>
                                    <IoShieldCheckmarkOutline />
                                    {admin?.role === 'admin' ? 'Administrator' : 'Super Admin'}
                                </span>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className='admin-profile__form-grid'>
                            <div className='admin-profile__form-group'>
                                <label className='admin-profile__label'>
                                    <IoPersonOutline />
                                    Full Name
                                </label>
                                <input
                                    type='text'
                                    name='fullName'
                                    value={profileData.fullName}
                                    onChange={handleProfileChange}
                                    className='admin-profile__input'
                                    placeholder='Enter your full name'
                                />
                            </div>

                            <div className='admin-profile__form-group'>
                                <label className='admin-profile__label'>
                                    <IoMailOutline />
                                    Email Address
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    value={profileData.email}
                                    className='admin-profile__input admin-profile__input--disabled'
                                    disabled
                                />
                                <span className='admin-profile__input-hint'>
                                    <IoInformationCircleOutline />
                                    Email cannot be changed
                                </span>
                            </div>

                            <div className='admin-profile__form-group'>
                                <label className='admin-profile__label'>
                                    <IoCallOutline />
                                    Phone Number
                                </label>
                                <input
                                    type='tel'
                                    name='phone'
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    className='admin-profile__input'
                                    placeholder='Enter your phone number (10-11 digits)'
                                />
                            </div>

                            <div className='admin-profile__form-group'>
                                <label className='admin-profile__label'>
                                    <IoCalendarOutline />
                                    Member Since
                                </label>
                                <input
                                    type='text'
                                    value={admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'N/A'}
                                    className='admin-profile__input admin-profile__input--disabled'
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Message */}
                        {profileMessage.text && (
                            <div className={`admin-profile__message admin-profile__message--${profileMessage.type}`}>
                                {profileMessage.type === 'success' ? (
                                    <IoCheckmarkCircleOutline />
                                ) : (
                                    <IoCloseCircleOutline />
                                )}
                                {profileMessage.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type='submit' 
                            className='admin-profile__btn admin-profile__btn--primary'
                            disabled={isProfileLoading}
                        >
                            {isProfileLoading ? (
                                <>
                                    <span className='admin-profile__btn-spinner'></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <IoSaveOutline />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </section>

                {/* Security Card */}
                <section className='admin-profile__card admin-profile__card--security'>
                    <div className='admin-profile__card-header'>
                        <div className='admin-profile__card-icon admin-profile__card-icon--security'>
                            <IoKeyOutline />
                        </div>
                        <div>
                            <h2 className='admin-profile__card-title'>Security Settings</h2>
                            <p className='admin-profile__card-desc'>Update your password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className='admin-profile__form'>
                        <div className='admin-profile__form-stack'>
                            <div className='admin-profile__form-group'>
                                <label className='admin-profile__label'>
                                    <IoKeyOutline />
                                    Current Password
                                </label>
                                <div className='admin-profile__input-wrapper'>
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        name='currentPassword'
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className='admin-profile__input'
                                        placeholder='Enter current password'
                                    />
                                    <button
                                        type='button'
                                        className='admin-profile__input-toggle'
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                </div>
                            </div>

                            <div className='admin-profile__form-group'>
                                <label className='admin-profile__label'>
                                    <IoKeyOutline />
                                    New Password
                                </label>
                                <div className='admin-profile__input-wrapper'>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name='newPassword'
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className='admin-profile__input'
                                        placeholder='Enter new password'
                                    />
                                    <button
                                        type='button'
                                        className='admin-profile__input-toggle'
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                </div>
                                
                                {/* Password Strength Indicator */}
                                {passwordData.newPassword && (
                                    <div className='admin-profile__password-strength'>
                                        <div className='admin-profile__strength-bars'>
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`admin-profile__strength-bar ${i < passwordStrength ? 'active' : ''}`}
                                                    style={{
                                                        backgroundColor: i < passwordStrength ? strengthColors[passwordStrength - 1] : ''
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span 
                                            className='admin-profile__strength-label'
                                            style={{ color: strengthColors[passwordStrength - 1] || '#64748b' }}
                                        >
                                            {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Enter password'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className='admin-profile__form-group'>
                                <label className='admin-profile__label'>
                                    <IoKeyOutline />
                                    Confirm New Password
                                </label>
                                <div className='admin-profile__input-wrapper'>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name='confirmPassword'
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className='admin-profile__input'
                                        placeholder='Confirm new password'
                                    />
                                    <button
                                        type='button'
                                        className='admin-profile__input-toggle'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                </div>
                                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                    <span className='admin-profile__input-error'>
                                        <IoCloseCircleOutline />
                                        Passwords do not match
                                    </span>
                                )}
                                {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                                    <span className='admin-profile__input-success'>
                                        <IoCheckmarkCircleOutline />
                                        Passwords match
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className='admin-profile__requirements'>
                            <h4 className='admin-profile__requirements-title'>Password Requirements:</h4>
                            <ul className='admin-profile__requirements-list'>
                                <li className={passwordData.newPassword.length >= 6 ? 'met' : ''}>
                                    {passwordData.newPassword.length >= 6 ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />}
                                    At least 6 characters
                                </li>
                                <li className={/[A-Z]/.test(passwordData.newPassword) ? 'met' : ''}>
                                    {/[A-Z]/.test(passwordData.newPassword) ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />}
                                    One uppercase letter
                                </li>
                                <li className={/[a-z]/.test(passwordData.newPassword) ? 'met' : ''}>
                                    {/[a-z]/.test(passwordData.newPassword) ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />}
                                    One lowercase letter
                                </li>
                                <li className={/[0-9]/.test(passwordData.newPassword) ? 'met' : ''}>
                                    {/[0-9]/.test(passwordData.newPassword) ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />}
                                    One number
                                </li>
                                <li className={/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? 'met' : ''}>
                                    {/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />}
                                    One special character (optional)
                                </li>
                            </ul>
                        </div>

                        {/* Message */}
                        {passwordMessage.text && (
                            <div className={`admin-profile__message admin-profile__message--${passwordMessage.type}`}>
                                {passwordMessage.type === 'success' ? (
                                    <IoCheckmarkCircleOutline />
                                ) : (
                                    <IoCloseCircleOutline />
                                )}
                                {passwordMessage.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type='submit' 
                            className='admin-profile__btn admin-profile__btn--secondary'
                            disabled={isPasswordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        >
                            {isPasswordLoading ? (
                                <>
                                    <span className='admin-profile__btn-spinner'></span>
                                    Changing...
                                </>
                            ) : (
                                <>
                                    <IoKeyOutline />
                                    Change Password
                                </>
                            )}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default AdminProfile