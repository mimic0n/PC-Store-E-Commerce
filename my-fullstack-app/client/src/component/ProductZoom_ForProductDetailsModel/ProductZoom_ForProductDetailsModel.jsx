import React, { useRef, useState, useContext } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';

import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ProductZoom_ForProductDetailsModel.css';

import { MyContext } from '../../App';

export const ProductZoom_ForProductDetailsModel = () => {
  const context = useContext(MyContext);
  const product = context.selectedProduct;

  const zoomSliderBig = useRef();
  const zoomSliderSmall = useRef();

  // Parse images từ product
  const getImages = () => {
    if (!product) return [];

    let images = product.images;
    
    // Nếu images là string JSON, parse nó
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [];
      }
    }

    // Nếu images là array với các object có url
    if (Array.isArray(images) && images.length > 0) {
      return images.map(img => img.url || img);
    }

    // Fallback: sử dụng thumbnail nếu có
    if (product.thumbnail) {
      return [product.thumbnail];
    }

    // Default fallback image
    return ['/src/assets/AdsBannerSlide/AdsBannerSlide_1.jpg'];
  };

  const images = getImages();

  // Nếu không có product, hiển thị placeholder
  if (!product) {
    return (
      <div className='ProductZoomWrapper'>
        <div className='InnerImageZoom-ProductZoom'>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='ProductZoomWrapper'>
        <div className='InnerImageZoom-ProductZoom'>
          <Swiper
            direction={'vertical'}
            modules={[Navigation, Thumbs, Pagination]}
            slidesPerView={images.length > 8 ? 8 : images.length}
            spaceBetween={1}
            navigation={true}
            pagination={true}
            loop={images.length > 1}
            className='Swiper-ProductZoom-Container-2'
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={image}
                  zoomSrc={image}
                  alt={`${product.name} - Image ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProductZoom_ForProductDetailsModel;