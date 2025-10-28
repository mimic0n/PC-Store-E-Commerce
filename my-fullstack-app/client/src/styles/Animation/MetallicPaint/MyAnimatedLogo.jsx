// src/components/MyAnimatedLogo.jsx

import React, { useState, useEffect } from 'react';
import MetallicPaint, { parseLogoImage } from './animations/MetallicPaint.jsx'; // <-- Chỉnh lại đường dẫn cho đúng
import myLogo from '../../assets/react-16-svgrepo-com.svg'; // <-- Thay bằng logo của bạn

const MyAnimatedLogo = () => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    async function loadLogo() {
      try {
        const response = await fetch(myLogo);
        const blob = await response.blob();
        const file = new File([blob], "logo.svg", { type: blob.type });

        const parsedData = await parseLogoImage(file);
        setImageData(parsedData?.imageData ?? null);
      } catch (err) {
        console.error("Lỗi khi tải logo:", err);
      }
    }
    loadLogo();
  }, []);

  return (
    <div style={{ width: '150px', height: '150px' }}>
      <MetallicPaint 
        imageData={imageData ?? new ImageData(1, 1)} 
        params={{ 
          edge: 2, 
          patternBlur: 0.005, 
          patternScale: 2, 
          refraction: 0.015, 
          speed: 0.3, 
          liquid: 0.07 
        }} 
      />
    </div>
  );
};

export default MyAnimatedLogo;