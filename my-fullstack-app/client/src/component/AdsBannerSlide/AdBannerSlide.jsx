import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { BannerBox } from '../BannerBox/Bannerbox';

import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './AdsBannerSlide.css';

const slideData = [
  { id: 1, img: "/src/assets/Banner_ADS_Box/Banner_ADS_Box_1.jpg", alt: "Ad Banner 1" },
  { id: 2, img: "/src/assets/Banner_ADS_Box/Banner_ADS_Box_2.jpg", alt: "Ad Banner 2" },
  { id: 3, img: "/src/assets/Banner_ADS_Box/Banner_ADS_Box_3.jpg", alt: "Ad Banner 3" },
  { id: 4, img: "/src/assets/Banner_ADS_Box/Banner_ADS_Box_4.jpg", alt: "Ad Banner 4" },
  { id: 5, img: "/src/assets/Banner_ADS_Box/Banner_ADS_Box_5.png", alt: "Ad Banner 5" },
  { id: 6, img: "/src/assets/Banner_ADS_Box/Banner_ADS_Box_6.jpg", alt: "Ad Banner 6" },
  { id: 7, img: "/src/assets/Banner_ADS_Box/Banner_ADS_Box_7.jpg", alt: "Ad Banner 7" },
];

export const AdsBannerSlide = (props) => {
  return (
      <div className='AdsBannerSlide'>
          <Swiper
            slidesPerView={props.items}
            spaceBetween={10}
            loop={true}
            navigation={true}
            className="mySwiper"
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
         }}
            modules={[Autoplay, Pagination, Navigation]}
          >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <BannerBox img={slide.img} alt={slide.alt} href={slide.link} />
          </SwiperSlide>
        ))}
              
          </Swiper>
      </div>
  )
}

export default AdsBannerSlide