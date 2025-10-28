// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Header from './component/header/Header';
import ClickSpark from "/src/styles/Animation/ClickSpark.jsx"
import { Home } from '/src/Page/Home/Home';
import Footer from './component/footer/Footer.jsx';


function App() {
  const [message, setMessage] = useState('');
        
  useEffect(() => {
    // Gọi API từ backend
    fetch('http://localhost:3001/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error("Lỗi khi fetch data:", err));
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  return (
    <>
      <BrowserRouter>
      <ClickSpark
                  sparkColor='#fff'
                  sparkSize={10}
                  sparkRadius={15}
                  sparkCount={8}
                  duration={400}>
        <div className='rootContainer'>
          <Header className="Header" />
        </div>

        <div className='Swiper_Banner'>
          <Home className="Home"/>
        </div>

        <Footer />
            <div className="card">
          {/* Hiển thị tin nhắn từ backend */}
          <p>{message || "Đang tải dữ liệu từ backend..."}</p>
        </div>
        </ClickSpark>
      </BrowserRouter>
    </>
     
  );
}

export default App;