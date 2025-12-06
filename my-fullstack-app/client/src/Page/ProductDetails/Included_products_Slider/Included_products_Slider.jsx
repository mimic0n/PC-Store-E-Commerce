import React from 'react'


import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { Included_products_Item } from './Included_products_Item/Included_products_Item';


import './Included_products_Slider.css'
import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const Included_products_Slider = (props) => {
  return (
     <section className='Included_products_Slider'>
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
          <Included_products_Item/>
        </SwiperSlide>

        <SwiperSlide>
          <Included_products_Item/>
        </SwiperSlide>

        <SwiperSlide>
          <Included_products_Item/>
        </SwiperSlide>

      </Swiper>
    </section>
  )
}
