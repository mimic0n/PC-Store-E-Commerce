import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { ProductItems } from '../ProductItems/ProductItems';


import './Product_List_Slider.css'
import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const Product_List_Slider = (props) => {
  return (
    <section className='Products_Slide'>
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        pagination={{
        clickable: true,
        }}
        navigation={false}
        modules={[ Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <ProductItems/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductItems/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductItems/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductItems/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductItems/>
        </SwiperSlide>

        <SwiperSlide>
          <ProductItems/>
        </SwiperSlide>
      </Swiper>
    </section>
  )
}

export default Product_List_Slider