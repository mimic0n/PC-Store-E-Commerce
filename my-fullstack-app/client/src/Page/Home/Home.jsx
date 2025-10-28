import React from 'react'

import { FaShippingFast } from "react-icons/fa";

import { HomeSlider } from '../../component/HomeSlider/HomeSlider'
import { HomeSliderV2 } from '../../component/HomeSliderV2/HomeSliderV2'
import { HomeCatSlider } from '../../component/HomeCatSlider/HomeCatSlider'
import { AdsBannerSlide } from '../../component/AdsBannerSlide/AdBannerSlide';
import { Category_Slider } from '../../component/Category_Slider/Category_Slider';
import { Product_List_Slider } from '../../component/Product_List_Slider/Product_List_Slider';
import { BrandBar } from '../../component/BrandBar/BrandBar.jsx';
import '/src/styles/Home.css'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';



export const Home = () => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
      <>
      <HomeSlider />

      {/* <section>
        <div className='HomeSliderV2-container'>
          <div className='part1'>
            <HomeSliderV2 />
          </div>
        </div>
      </section> */}
      <HomeCatSlider />

      <section  style={{ marginBottom: '30px' }}>
        <Category_Slider items={5} />
      </section>
      
      <section className='ProductBox_1_section'>
      <div className='ProductBox_1'>
        <div className='ProductBox_1_container'>
          <div className='ProductBox_1_content'>
            <h2 className='ProductBox_1_Font'>Popular Product</h2>
          </div>
            
            <div className="Product_Nav">
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
              >
                <Tab value="1" label="PC Gaming" />
                <Tab value="2" label="PC Workstation" />
                <Tab value="3" label="Gaming Gear" />
                <Tab value="4" label="Hardware" />
              </Tabs>
            </div>
        </div>
        </div>
      </section>

       <section className='ProductBox_section' style={{marginBottom: '30px' }}>
        <div className='ProductBox_container'>
          <div className='ProductBox_Content'>
          </div>
          <Product_List_Slider items={5}/>
        </div>
      </section>
{/*       
      <section className='ADSBox_section'>
        <div className='ADSBox_container'>
          <div className='freeShipping'>
            <div className='col1'>
              <FaShippingFast className='IconShipping' />
              <span className='FontShipping'> Free Shipping </span>
            </div>

            <div className='col2'>
              <p>Free Delivery On Your First Order And Over $5</p>
            </div>
            <p className='col3'> Cost You Only $5</p>
          </div>
        </div>
        <AdsBannerSlide items={3} />
      </section >
 */}


      <section className ='ProductBox_2' style={{marginBottom: '30px' }} >
      </section>
      
       <section  style={{ marginBottom: '30px' }}>
        <BrandBar />
      </section>
      </>
  )
}
