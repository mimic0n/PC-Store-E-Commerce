import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CheckOut.css';
import { MyContext } from '../../App';
import { useCart } from '../../context/CartContext';
import { createOrder, validateVoucher } from '../../api/orderService';
import toast from 'react-hot-toast';

export const CheckOut = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const { 
    cartItems, 
    loading: cartLoading, 
    fetchCart,
    // NEW: Import checkout functions
    getCheckoutItems,
    getCheckoutTotal,
    checkoutItems,
    clearCheckoutItems
  } = useCart();

  // NEW: Lấy items để checkout (có thể là selected items hoặc tất cả)
  const itemsToCheckout = getCheckoutItems();
  const checkoutSubtotal = getCheckoutTotal();

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: '',
    shippingMethod: 'standard',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!context.isLogin) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/Login', { state: { from: '/CheckOut' } });
    }
  }, [context.isLogin, navigate]);

  // Pre-fill email từ user info
  useEffect(() => {
    if (context.user?.email) {
      setFormData(prev => ({ ...prev, email: context.user.email }));
    }
  }, [context.user]);

  // NEW: Redirect nếu không có items để checkout
  // useEffect(() => {
  //   if (!cartLoading && itemsToCheckout.length === 0) {
  //     toast.error('Không có sản phẩm nào để thanh toán');
  //     navigate('/CartPage');
  //   }
  // }, [itemsToCheckout, cartLoading, navigate]);

  // NEW: Clear checkout items khi unmount
  useEffect(() => {
    return () => {
      // Không clear ngay, để OrderSuccess có thể sử dụng
    };
  }, []);

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code'
    }).format(amount);
  };

  // Calculations - sử dụng checkoutSubtotal thay vì cartTotal
  const subtotal = checkoutSubtotal;
  const shippingFee = formData.shippingMethod === 'express' ? 50000 : 
                      formData.shippingMethod === 'same_day' ? 80000 : 30000;
  const discount = appliedVoucher?.discountAmount || 0;
  const grandTotal = subtotal + shippingFee - discount;

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate Voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setVoucherLoading(true);
    try {
      const response = await validateVoucher(voucherCode.toUpperCase(), subtotal);
      if (response.success) {
        setAppliedVoucher(response.data);
        toast.success('Áp dụng mã giảm giá thành công!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Mã giảm giá không hợp lệ';
      toast.error(message);
      setAppliedVoucher(null);
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  // Simple Validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên là bắt buộc';
    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!formData.province) newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // NEW: Gửi thông tin items được chọn để checkout
      const orderData = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        address: formData.address,
        note: formData.note,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        voucherCode: appliedVoucher?.code || null,
        // NEW: Gửi danh sách product IDs được chọn
        selectedProductIds: itemsToCheckout.map(item => item.productId || item.product?.id)
      };

      const response = await createOrder(orderData);
      
      if (response.success) {
        toast.success('Đặt hàng thành công!');
        clearCheckoutItems(); // Clear checkout items sau khi order thành công
        await fetchCart(); // Refresh cart
        navigate(`/order-success/${response.data.id}`, { 
          state: { order: response.data } 
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="checkout-root">
        <div className="checkout-loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="checkout-root">
      <div className="checkout-bg-overlay"></div>
      
      {/* Breadcrumbs */}
      <div className="checkout-breadcrumbs">
        <Link to="/CartPage">CART</Link> <span className="separator">&gt;</span>
        <span className="active">CHECKOUT</span> <span className="separator">&gt;</span>
        <span>PAYMENT</span> <span className="separator">&gt;</span>
        <span>COMPLETE</span>
      </div>

      <h1 className="checkout-title glitch" data-text="CHECKOUT">CHECKOUT</h1>

      {/* NEW: Hiển thị thông báo nếu checkout partial */}
      {checkoutItems.length > 0 && checkoutItems.length < cartItems.length && (
        <div className="checkout-partial-notice">
          <span>📦 You are checking out {checkoutItems.length} of {cartItems.length} items in your cart</span>
        </div>
      )}

      <form className="checkout-layout" onSubmit={handleSubmit}>
        {/* LEFT COLUMN: INPUT FORMS */}
        <div className="checkout-left">
          
          {/* Shipping Info Block */}
          <section className="checkout-block">
            <h2 className="block-title">SHIPPING INFORMATION</h2>
            
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input 
                type="text" 
                name="fullName" 
                placeholder="Ex: Nguyen Van A" 
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="Ex: 0901234567" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Ex: email@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="address-grid">
              <div className="form-group">
                <label>City / Province <span className="required">*</span></label>
                <select 
                  name="province" 
                  value={formData.province} 
                  onChange={handleInputChange} 
                  className={errors.province ? 'input-error' : ''}
                >
                  <option value="">Select City</option>
                  <option value="Ho Chi Minh">Ho Chi Minh</option>
                  <option value="Ha Noi">Ha Noi</option>
                  <option value="Da Nang">Da Nang</option>
                </select>
                {errors.province && <span className="error-msg">{errors.province}</span>}
              </div>
              <div className="form-group">
                <label>District</label>
                <select name="district" value={formData.district} onChange={handleInputChange}>
                  <option value="">Select District</option>
                  <option value="District 1">District 1</option>
                  <option value="District 2">District 2</option>
                  <option value="District 3">District 3</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ward</label>
                <select name="ward" value={formData.ward} onChange={handleInputChange}>
                  <option value="">Select Ward</option>
                  <option value="Ward 1">Ward 1</option>
                  <option value="Ward 2">Ward 2</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Street Address <span className="required">*</span></label>
              <input 
                type="text" 
                name="address" 
                placeholder="House number, street name" 
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'input-error' : ''}
              />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Note (Optional)</label>
              <textarea 
                name="note" 
                placeholder="Ex: Deliver during office hours"
                value={formData.note}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </section>

          {/* Shipping Method Block */}
          <section className="checkout-block">
            <h2 className="block-title">SHIPPING METHOD</h2>
            <div className="radio-group">
              <label className={`radio-card ${formData.shippingMethod === 'standard' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="standard" 
                  checked={formData.shippingMethod === 'standard'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">Standard Delivery (3-5 days)</span>
                  <span className="radio-price">{formatCurrency(30000)}</span>
                </div>
              </label>

              <label className={`radio-card ${formData.shippingMethod === 'express' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="express" 
                  checked={formData.shippingMethod === 'express'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">Express Delivery (1-2 days)</span>
                  <span className="radio-price">{formatCurrency(50000)}</span>
                </div>
              </label>

              <label className={`radio-card ${formData.shippingMethod === 'same_day' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shippingMethod" 
                  value="same_day" 
                  checked={formData.shippingMethod === 'same_day'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">Same Day Delivery</span>
                  <span className="radio-price">{formatCurrency(80000)}</span>
                </div>
              </label>
            </div>
          </section>

          {/* Payment Method Block */}
          <section className="checkout-block">
            <h2 className="block-title">PAYMENT METHOD</h2>
            <div className="radio-group vertical">
              <label className={`radio-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">💵 Cash On Delivery (COD)</span>
                </div>
              </label>

              <label className={`radio-card ${formData.paymentMethod === 'banking' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="banking" 
                  checked={formData.paymentMethod === 'banking'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">🏦 Bank Transfer</span>
                </div>
              </label>
              
              {formData.paymentMethod === 'banking' && (
                <div className="banking-info">
                  <p><strong>Bank:</strong> MB Bank</p>
                  <p><strong>Account:</strong> 999988887777</p>
                  <p><strong>Name:</strong> HKT STORE</p>
                  <p className="banking-note">* Transfer content: [Your Phone Number]</p>
                </div>
              )}

              <label className={`radio-card ${formData.paymentMethod === 'momo' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="momo" 
                  checked={formData.paymentMethod === 'momo'}
                  onChange={handleInputChange}
                />
                <div className="radio-content">
                  <span className="radio-label">📱 MoMo Wallet</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="checkout-right">
          <div className="order-summary-card">
            <h2 className="block-title">ORDER SUMMARY</h2>
            
            {/* NEW: Sử dụng itemsToCheckout thay vì cartItems */}
            <div className="product-list">
              {itemsToCheckout.map((item) => {
                const product = item.product || item;
                const itemPrice = product.salePrice || product.price || item.price;
                const itemId = item.id || item.productId;
                
                return (
                  <div key={itemId} className="product-item">
                    <div className="product-img-wrapper">
                      <img 
                        src={product.thumbnail || '/src/assets/placeholder.jpg'} 
                        alt={product.name} 
                      />
                      <span className="product-qty">{item.quantity}</span>
                    </div>
                    <div className="product-info">
                      <p className="product-name">{product.name}</p>
                      <p className="product-price">{formatCurrency(itemPrice)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="coupon-section">
              {!appliedVoucher ? (
                <>
                  <input 
                    type="text" 
                    placeholder="Coupon Code" 
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyVoucher())}
                  />
                  <button 
                    type="button" 
                    className="btn-apply"
                    onClick={handleApplyVoucher}
                    disabled={voucherLoading}
                  >
                    {voucherLoading ? '...' : 'APPLY'}
                  </button>
                </>
              ) : (
                <div className="voucher-applied">
                  <span className="voucher-code">✓ {appliedVoucher.code}</span>
                  <span className="voucher-discount">-{formatCurrency(discount)}</span>
                  <button 
                    type="button" 
                    className="btn-remove-voucher"
                    onClick={handleRemoveVoucher}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal ({itemsToCheckout.length} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="price-row discount">
                  <span>Discount</span>
                  <span className="discount-value">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="price-row total">
                <span>GRAND TOTAL</span>
                <span className="neon-text">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-place-order"
              disabled={isSubmitting || itemsToCheckout.length === 0}
            >
              {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>

            <p className="checkout-terms">
              By placing your order, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;