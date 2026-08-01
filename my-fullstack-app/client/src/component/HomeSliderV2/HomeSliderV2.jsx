import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay , EffectFade, Navigation, Pagination } from 'swiper/modules';

import './HomeSliderV2.css';
export const HomeSliderV2 = () => {
  return (
    <Swiper
        spaceBetween={30}
        effect={'fade'}
        loop={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay,EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="/src/assets/Home_Slider_V2/HomeSliderV2-1.png" loading="lazy" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/Home_Slider_V2/HomeSliderV2-2.png" loading="lazy" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/Home_Slider_V2/HomeSliderV2-3.png" loading="lazy" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/Home_Slider_V2/HomeSliderV2-4.png" loading="lazy" />
          </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/Home_Slider_V2/HomeSliderV2-5.png" loading="lazy" />
          </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/Home_Slider_V2/HomeSliderV2-6.png" loading="lazy" />
          </SwiperSlide>
      </Swiper>
  )
}
