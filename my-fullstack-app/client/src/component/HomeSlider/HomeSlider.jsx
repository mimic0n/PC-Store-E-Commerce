import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HomeSlider.css';



export const HomeSlider = () => {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide><div className="slide_content"><img src = "/src/assets/Home_Banner/HomeSlider_1-1920x560px.jpg" alt='Banner'></img></div></SwiperSlide>
        <SwiperSlide><div className="slide_content"><img src = "/src/assets/Home_Banner/HomeSlider_2-1920x560px.jpg" alt='Banner'></img></div></SwiperSlide>
        <SwiperSlide><div className="slide_content"><img src = "/src/assets/Home_Banner/HomeSlider_3-1920x560px.jpg" alt='Banner'></img></div></SwiperSlide>
        <SwiperSlide><div className="slide_content"><img src = "/src/assets/Home_Banner/HomeSlider_4-1920x560px.jpg" alt='Banner'></img></div></SwiperSlide>

      </Swiper>
    </>
  )
}
 