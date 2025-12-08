import React, { useRef, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';

import '/src/App.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ProductZoom.css';

export const ProductZoom = ({ images = [], thumbnail }) => {
  const zoomSliderBig = useRef();
  const zoomSliderSmall = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const goto = (index) => {
    zoomSliderSmall.current?.swiper?.slideToLoop(index);
    zoomSliderBig.current?.swiper?.slideToLoop(index);
  };

  // Default images nếu không có từ props
  const defaultImages = [
    "/src/assets/Product/PC/PC-AMD-Gaming/PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC/PC_AMD_GAMING_LUXURY_RYZEN_9_9950X3D-RTX_5090_32GB_OC_1.jpg",
  ];

  // Xử lý images từ props
  const getImageList = () => {
    if (images && images.length > 0) {
      return images.map(img => img.url || img);
    }
    if (thumbnail) {
      return [thumbnail];
    }
    return defaultImages;
  };

  const imageList = getImageList();

  return (
    <>
      <div className='ProductZoomWrapper'>
        <div className='Swiper-ProductZoom'>
          <Swiper
            ref={zoomSliderSmall}
            direction={'vertical'}
            modules={[Navigation, Thumbs, Pagination]}
            slidesPerView={"auto"}
            spaceBetween={10}
            navigation={true}
            pagination={true}
            loop={imageList.length > 1}
            className='Swiper-ProductZoom-Container'
            onSlideChange={(swiper) => {
              zoomSliderBig.current?.swiper?.slideToLoop(swiper.realIndex);
              setActiveIndex(swiper.realIndex);
            }}
          >
            {imageList.map((image, index) => (
              <SwiperSlide
                key={index}
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
            loop={imageList.length > 1}
            className='Swiper-ProductZoom-Container-2'
          >
            {imageList.map((image, index) => (
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

export default ProductZoom;