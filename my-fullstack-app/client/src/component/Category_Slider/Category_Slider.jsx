import React from 'react'
import './Category_Slider.css'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { BannerBox } from '../BannerBox/Bannerbox';


import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slideData = [
  { id: 1, img: "/src/assets/Category_Slide/Category_Slide_1.png", alt: "Slide Category Banner 1" , title : "Gaming Console" },
  { id: 2, img: "/src/assets/Category_Slide/Category_Slide_2.png", alt: "Slide Category Banner 2" , title : "PC Gaming" },
  { id: 3, img: "/src/assets/Category_Slide/Category_Slide_3.png", alt: "Slide Category Banner 3" , title : "Gaming Gear" },
  { id: 4, img: "/src/assets/Category_Slide/Category_Slide_4.png", alt: "Slide Category Banner 4", title: "Gaming Accessories" },
  { id: 5, img: "/src/assets/Category_Slide/Category_Slide_5.png", alt: "Slide Category Banner 5" , title : "Hardware" },
];

export const Category_Slider = (props) => {
  return (

    <div className='CategorySlide'>
      <div className='container'>
        <>
          <Swiper
                slidesPerView={props.items}
                spaceBetween={20}
                pagination={{
                clickable: true,
                }}
                navigation={false}
                modules={[ Pagination, Navigation]}
                className="mySwiper"
          >
            {slideData.map((slide) => (
              <SwiperSlide className="Category-Slide-content" key={slide.id}>
                <div className='Category-Slide-box'>
                <div className='Category-Image'>
                  <BannerBox img={slide.img} alt={slide.alt} href={slide.link} />
                  </div>
                  
                  <div className="Category-Description">
                  <p>{slide.title}</p>
                  </div>
                </div>
                  </SwiperSlide>
                  ))}
            </Swiper>
        </>
      </div>
    </div>
  )
}

export default Category_Slider