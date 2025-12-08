import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { ProductItems } from '../ProductItems/ProductItems';

import './Product_List_Slider.css'
import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Loading Skeleton Component
const ProductSkeleton = () => (
  <div className='ProductItem ProductItem-Skeleton'>
    <div className='imgWrapper'>
      <div className='skeleton skeleton-image'></div>
    </div>
    <div className='Product_Info'>
      <div className='skeleton skeleton-text' style={{width: '80%', height: '20px', marginBottom: '10px'}}></div>
      <div className='skeleton skeleton-text' style={{width: '60%', height: '24px', marginBottom: '8px'}}></div>
      <div className='skeleton skeleton-text' style={{width: '40%', height: '16px', marginBottom: '10px'}}></div>
      <div className='skeleton skeleton-text' style={{width: '100%', height: '40px'}}></div>
    </div>
  </div>
);

export const Product_List_Slider = ({ items = 5, products = [], loading = false }) => {
  // Nếu đang loading hoặc không có products, hiển thị skeleton
  if (loading) {
    return (
      <section className='Products_Slide'>
        <Swiper
          slidesPerView={items}
          spaceBetween={10}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {[...Array(items)].map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`}>
              <ProductSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  }

  // Nếu có products từ server
  if (products.length > 0) {
    return (
      <section className='Products_Slide'>
        <Swiper
          slidesPerView={items}
          spaceBetween={10}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductItems product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  }

  // Fallback nếu không có products (hiển thị default)
  return (
    <section className='Products_Slide'>
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        pagination={{ clickable: true }}
        navigation={false}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {[...Array(6)].map((_, index) => (
          <SwiperSlide key={`default-${index}`}>
            <ProductItems />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Product_List_Slider