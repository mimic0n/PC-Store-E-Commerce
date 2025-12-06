import React, { use, useContext , useState} from 'react'
import "./Login.css"
import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'

import { Link , useNavigate} from 'react-router-dom'; 
import { BsGoogle , BsFacebook, BsApple, BsTwitter } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";
import { BsBoxSeamFill } from "react-icons/bs";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { MyContext } from '../../App';
import { loginUser } from '../../api/authService';


export const Login = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const items = [
        { label: "Home", href: "#" },
    ];
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const History = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('')
    }
    
    const handleLogin = async (e) => { 
        e.preventDefault();

        if(!formData.email || !formData.password){
            setError("Please fill in all fields.");
            context.openAlertPanel("error", "Please fill in all fields.");
            return;
        }
        setIsSubmitting(true)
        setError("")
        try {
            const response = await loginUser(formData)

            if (response.success) { 
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                context.setUser(response.data.user);
                context.setisLogin(true);
                context.openAlertPanel( "success" , "Đăng nhập thành công!");
                History('/');
            }
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
            setError(errorMessage);
            context.openAlertPanel("error", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    const forgotPassword = () => {
        context.openAlertPanel( "success" , "Verification code sent to your email!");
        History('/ForgotPassword/');
    }



    return (

        <section className='Login_Page'>
            <div className='Login_Page_Description_1'>
                <div className='description_content'>
                    <div className='description_icon_box'>
                        <div className='animated_icon'>🛍️</div>
                    </div>
                    <h2 className='description_title'>Welcome Back!</h2>
                    <p className='description_text'>
                        Sign in to access your personalized shopping experience
                    </p>
                    <div className='features_list'>
                        <div className='feature_item'>
                            <div className='feature_icon'>✓</div>
                            <span className='feature_Text'>Track your orders in real-time</span>
                        </div>
                        <div className='feature_item'>
                            <div className='feature_icon'>✓</div>
                            <span className='feature_Text'>Access exclusive deals</span>
                        </div>
                        <div className='feature_item'>
                            <div className='feature_icon'>✓</div>
                            <span className='feature_Text'>Save your favourite items</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ring">
                <i style={{'--clr':'#ffffffff'}}></i>
                <i style={{'--clr':'#8E54E9'}}></i>
                <i style={{'--clr':'#000000ff'}}></i>
                <div className="login">
                    <h2>Login</h2>

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
                    <form onSubmit={handleLogin}>
                        <div className="inputBx">
                            <input 
                                type="text" 
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inputBx">
                            <input 
                                type="password" 
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inputBx">
                            <input 
                                type="submit" 
                                value={isSubmitting ? "Đang xử lý..." : "Sign in"}
                                disabled={isSubmitting}
                                style={{ 
                                    opacity: isSubmitting ? 0.7 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                }}
                            />
                        </div>
                    </form>
                    <div className="links">
                        <a href="/ForgotPassword/" onClick={(e) => {
                                e.preventDefault();
                                forgotPassword();
                            }}>Forget Password
                        </a>
                        <Link to="/Register">Signup</Link>
                    </div>
                    <div className='Alter_Login'>
                        <div className='Alter_Login_Title'>
                            <div className='Alter_Login_Line'></div>
                            <span className='Alter_Login_Text'>Or</span>
                            <div className='Alter_Login_Line'></div>
                        </div>
                        <div className='Alter_Login_Text_2'>Login With</div>
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
            <div className='Login_Page_Description_2'>
                <div className='description_content'>
                    <div className='illustration_container'>
                        <div className='floating_card card_1'>
                            <span className='card_icon'><TiShoppingCart /></span>
                            <span className='card_label'>Shop</span>
                        </div>
                        <div className='floating_card card_2'>
                            <span className='card_icon'><BsFillCreditCard2BackFill /></span>
                            <span className='card_label'>Pay</span>
                        </div>
                        <div className='floating_card card_3'>
                            <span className='card_icon'><BsBoxSeamFill /></span>
                            <span className='card_label'>Receive</span>
                        </div>
                    </div>
                    <GradientText
                        colors={["#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8", "#757F9A" , "#D7DDE8"]}
                        animationSpeed={8}
                        showBorder={false}
                        className="custom-class"
                        >
                        <h2 className='illustration_title'>Shopping Made Simple</h2>
                        <p className='illustration_text'>
                            Browse, buy, and enjoy - all in a few clicks
                        </p>
                    </GradientText>
                    
                </div> 
            </div>
        </section>
    )
}

export default Login