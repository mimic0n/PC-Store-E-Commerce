import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HomeCatSlider.css';



export const HomeCatSlider = () => {
  return (
      <div className='homeCatSlider'>
          <div className='container'>
          <>
            <Swiper
                slidesPerView={4}
                spaceBetween={20}
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
                      <SwiperSlide>
                          <div className="slide-content">
                            <img src = "/src/assets/Home_Cat_Slider/Home_Cat_Slider_1.jpg" alt='Banner' className='image' loading="lazy"></img>
                          </div>
                      </SwiperSlide>

                      <SwiperSlide>
                          <div className="slide-content">
                            <img src = "/src/assets/Home_Cat_Slider/Home_Cat_Slider_2.jpg" alt='Banner' className='image' loading="lazy"></img>
                          </div>
                      </SwiperSlide>

                      <SwiperSlide>
                          <div className="slide-content">
                            <img src = "/src/assets/Home_Cat_Slider/Home_Cat_Slider_3.png" alt='Banner' className='image' loading="lazy"></img>
                          </div>
                      </SwiperSlide>

                      <SwiperSlide>
                          <div className="slide-content">
                            <img src = "/src/assets/Home_Cat_Slider/HomeCatSlider_4.jpg" alt='Banner' className='image' loading="lazy"></img>
                          </div>
                      </SwiperSlide>

            </Swiper>
        </>
          </div>  
      </div>
  )
}

export default HomeCatSlider