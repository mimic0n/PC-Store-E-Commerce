import React, { useState, useRef, useEffect } from 'react';
import './OTPinput.css'

export const OTPInput = ({ length = 6, onOtpSubmit }) => {
    // Tạo mảng chứa giá trị của các ô input (ban đầu là chuỗi rỗng)
    const [otp, setOtp] = useState(new Array(length).fill(""));
    
    // Tạo mảng refs để truy cập trực tiếp vào các thẻ input DOM
    const inputRefs = useRef([]);
  
    // Hàm tự động focus vào ô đầu tiên khi component được render
    useEffect(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, []);
  
    const handleChange = (index, e) => {
      const value = e.target.value;
      
      if (isNaN(value)) return;
  
      const newOtp = [...otp];
      
      // Lấy ký tự cuối cùng (đề phòng trường hợp input có sẵn giá trị)
      // substring(value.length - 1) giúp lấy số vừa nhập
      newOtp[index] = value.substring(value.length - 1);
      setOtp(newOtp);
  
      // Gửi OTP đi nếu đã nhập đủ
      const combinedOtp = newOtp.join("");
      if (combinedOtp.length === length) onOtpSubmit(combinedOtp);
  
      // Tự động chuyển focus sang ô tiếp theo nếu có giá trị và chưa phải ô cuối
      if (value && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    };
  
    // Xử lý khi nhấn các phím đặc biệt (Backspace, Arrow)
    const handleKeyDown = (index, e) => {
      // Nếu nhấn Backspace và ô hiện tại rỗng, lùi focus về ô trước
      if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    };
  
    // Xử lý khi click vào ô input (đưa con trỏ về cuối)
    const handleClick = (index) => {
      inputRefs.current[index].setSelectionRange(1, 1);
      
      // Optional: Nếu các ô trước chưa nhập, force focus về ô trống đầu tiên
      if (index > 0 && !otp[index - 1]) {
         inputRefs.current[otp.indexOf("")].focus();
      }
    };
  
    // Xử lý sự kiện Dán (Paste)
    const handlePaste = (e) => {
      e.preventDefault();
      const data = e.clipboardData.getData("text").split(""); // Tách chuỗi clipboard thành mảng
      
      // Chỉ lấy các ký tự là số và giới hạn độ dài
      const cleanData = data.filter(item => !isNaN(item)).slice(0, length);
  
      const newOtp = [...otp];
      cleanData.forEach((value, index) => {
          newOtp[index] = value;
      });
      
      setOtp(newOtp);
      
      // Gửi OTP nếu đủ
      const combinedOtp = newOtp.join("");
      if (combinedOtp.length === length) onOtpSubmit(combinedOtp);
  
      // Focus vào ô trống tiếp theo hoặc ô cuối cùng
      const nextFocusIndex = cleanData.length < length ? cleanData.length : length - 1;
      if(inputRefs.current[nextFocusIndex]){
          inputRefs.current[nextFocusIndex].focus();
      }
    };
  
    return (
      <div className="otp-wrapper">
        {otp.map((value, index) => {
          return (
            <input
              key={index}
              type="text"
              ref={(input) => (inputRefs.current[index] = input)}
              value={value}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onClick={() => handleClick(index)}
              onPaste={handlePaste} // Chỉ cần gắn vào 1 ô hoặc tất cả đều được
              className="otp-field"
              maxLength={1} // Tuyệt đối chỉ nhận 1 ký tự visual
              inputMode="numeric" // Hiển thị bàn phím số trên mobile
            />
          );
        })}
      </div>
    );
  };
  
export default OTPInput;