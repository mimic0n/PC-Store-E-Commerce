import React, { useState, useContext } from 'react'
import "./Register.css"
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'

import { Link, useNavigate } from 'react-router-dom'; 
import { BsGoogle, BsFacebook, BsGithub, BsApple, BsTwitter } from "react-icons/bs";
import { FaGift } from "react-icons/fa6";
import { FaRocket } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { MyContext } from '../../App';
import { registerUser } from '../../api/authService';

export const Register = () => {
    const context = useContext(MyContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    }; 

    const handleRegister = async (e) => { 
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            context.openAlertPanel("error", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            context.openAlertPanel("error", "Email không hợp lệ");
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            context.openAlertPanel("error", "Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            context.openAlertPanel("error", "Mật khẩu xác nhận không khớp");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await registerUser({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            
            if (response.success) {
                context.openAlertPanel("success", response.message);
                
                // Lưu email tạm thời để sử dụng trong trang Verify
                localStorage.setItem('pendingVerifyEmail', formData.email);
                
                // Chuyển hướng đến trang xác thực email
                navigate('/Verify');
            }
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
            setError(errorMessage);
            context.openAlertPanel("error", errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className='Register_Page'>
            {/* Left Side - Benefits of Joining */}
            <div className='Register_Page_Description_1'>
                <div className='description_content'>
                    <div className='description_icon_box'>
                        <div className='animated_icon'><FaUserPlus /></div>
                    </div>
                    <h2 className='description_title'>Join Us Today!</h2>
                    <p className='description_text'>
                        Create an account to unlock full features and benefits
                    </p>
                    <div className='features_list'>
                        <div className='feature_item'>
                            <div className='feature_icon'>✓</div>
                            <span className='feature_Text'>Fast & Secure Checkout</span>
                        </div>
                        <div className='feature_item'>
                            <div className='feature_icon'>✓</div>
                            <span className='feature_Text'>Exclusive Member Discounts</span>
                        </div>
                        <div className='feature_item'>
                            <div className='feature_icon'>✓</div>
                            <span className='feature_Text'>24/7 Customer Support</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center - Register Form */}
            <div className="ring">
                <i style={{'--clr':'#ffffffff'}}></i>
                <i style={{'--clr':'#8E54E9'}}></i>
                <i style={{'--clr':'#000000ff'}}></i>
                <div className="register">
                    <h2>Register</h2>

                    {error && (
                        <div className="error-message" style={{
                            color: '#ff4444',
                            marginBottom: '10px',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleRegister}>
                    <div className="inputBx">
                        <input type="text"
                                placeholder="Username"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                disabled={isSubmitting}/>
                    </div>
                    <div className="inputBx">
                        <input type="email" 
                                placeholder="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isSubmitting}/>
                    </div>
                    <div className="inputBx">
                        <input type="password" 
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={isSubmitting}/>
                    </div>
                    <div className="inputBx">
                        <input  type="password" 
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                disabled={isSubmitting}/>
                    </div>
                    
                    <div className="inputBx">
                        <input 
                            type="submit" 
                            value={isSubmitting ? "Đang xử lý..." : "Sign Up"}
                            disabled={isSubmitting}
                            style={{ 
                                opacity: isSubmitting ? 0.7 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                        />
                    </div>
                    </form>
                    <div className="links">
                        <span>Already have an account?</span>
                        <Link to="/login">Sign In</Link>
                    </div>

                    <div className='Alter_Register'>
                        <div className='Alter_Register_Title'>
                            <div className='Alter_Register_Line'></div>
                            <span className='Alter_Register_Text'>Or</span>
                            <div className='Alter_Register_Line'></div>
                        </div>
                        <div className='Alter_Register_Text_2'>Sign Up With</div>
                        <ul className='social-list'>
                            <li className='social_link' >
                                <Link to='/' className='social_icon'>
                                    <BsGoogle className='social_icon_Link' />
                                </Link>
                            </li>
                            <li className='social_link' >
                                <Link to='/' className='social_icon'>
                                    <BsApple className='social_icon_Link' />
                                </Link>
                            </li>
                            <li className='social_link' >
                                <Link to='/' className='social_icon'>
                                    <BsFacebook className='social_icon_Link' />
                                </Link>
                            </li>
                            <li className='social_link' >
                                <Link to='/' className='social_icon'>
                                    <BsTwitter className='social_icon_Link' />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Side - Visuals */}
            <div className='Register_Page_Description_2'>
                <div className='description_content'>
                    <div className='illustration_container'>
                        <div className='floating_card card_1'>
                            <span className='card_icon'><FaGift /></span>
                            <span className='card_label'>Rewards</span>
                        </div>
                        <div className='floating_card card_2'>
                            <span className='card_icon'><FaRocket /></span>
                            <span className='card_label'>Fast</span>
                        </div>
                        <div className='floating_card card_3'>
                            <span className='card_icon'><FaShieldAlt /></span>
                            <span className='card_label'>Secure</span>
                        </div>
                    </div>
                    <GradientText
                        colors={["#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8"]}
                        animationSpeed={8}
                        showBorder={false}
                        className="custom-class"
                        >
                        <h2 className='illustration_title'>Start Your Journey</h2>
                        <p className='illustration_text'>
                            Join thousands of happy customers shopping with us
                        </p>
                    </GradientText>
                </div> 
            </div>
        </section>
    )
}

export default Register