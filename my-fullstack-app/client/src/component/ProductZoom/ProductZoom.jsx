import React, { useRef , useState} from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation , Thumbs , Pagination} from 'swiper/modules';

import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ProductZoom.css';

export const ProductZoom = () => {
  
  const zoomSliderBig = useRef();
  const zoomSliderSmall = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const goto = (index) => {
    zoomSliderSmall.current?.swiper?.slideToLoop(index); 
    zoomSliderBig.current?.swiper?.slideToLoop(index); 
  };

  const images = [
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_2.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_3.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_4.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_5.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_6.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_7.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_8.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_9.jpg",
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_10.jpg",
  ];

  return (
    <>
      <div className='ProductZoomWrapper'>
        <div className='Swiper-ProductZoom'>
          <Swiper
            ref={zoomSliderSmall}
            direction={'vertical'}
            modules={[Navigation , Thumbs , Pagination]}
            slidesPerView={"auto"}
            spaceBetween={10}
            navigation={true}
            pagination={true}
            loop={true}
            className='Swiper-ProductZoom-Container'
            onSlideChange={(swiper) => {
              zoomSliderBig.current?.swiper?.slideToLoop(swiper.realIndex);
              setActiveIndex(swiper.realIndex);
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}
                          className={`Swiper-ProductZoom-Image ${activeIndex === index ? 'active' : ''}`}
              >
                <div onClick={() => goto(index)}>
                  <img
                    className='Swiper-ProductZoom-Image-item'
                    src={image}
                    alt={`Product ${index + 1}`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className='InnerImageZoom-ProductZoom'>
          <Swiper
            ref={zoomSliderBig}
            direction={'vertical'}
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            loop={true}
            className='Swiper-ProductZoom-Container-2'
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={image}
                  zoomSrc={image}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};