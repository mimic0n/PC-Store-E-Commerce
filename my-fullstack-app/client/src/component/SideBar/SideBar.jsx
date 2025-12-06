import React from 'react';
import './SideBar.css';
import { CategoryCollapse } from '../CategoryCollapse/CategoryCollapse';
import { Collapse } from 'react-collapse';
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export const SideBar = () => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = React.useState(true);
  const [isOpenProducerFilter, setIsOpenProducerFilter] = React.useState(true);
  const [isOpenPriceFilter, setIsOpenPriceFilter] = React.useState(true);
  return (
    <aside className='sidebar'>
      <div className='Box'>
        <h3 className='sidebar-title'>
          Shop by Categories
          <div className='Expand_Button'>
          <Button
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
            className='Expand_icon'>
            { isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown /> }
            </Button>
          </div>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter}>
        <div className='scroll'>
          <FormControlLabel control={<Checkbox defaultChecked />} label="PC Gaming" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="PC Work Station" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="PC Premium" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Gaming Gear" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Hardware" className='SideBarFilter'/>
          </div>
        </Collapse>
      </div>

      <div className='Box'>
        <h3 className='sidebar-title'>
          Producer
          <div className='Expand_Button'>
          <Button
            onClick={() => setIsOpenProducerFilter(!isOpenProducerFilter)}
            className='Expand_icon'>
            { isOpenProducerFilter ? <FaAngleUp /> : <FaAngleDown /> }
            </Button>
          </div>
        </h3>
        <Collapse isOpened={isOpenProducerFilter}>
        <div className='scroll'>
          <FormControlLabel control={<Checkbox defaultChecked />} label="MSI" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Acer" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Dell" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Asus" className='SideBarFilter'/>
          </div>
        </Collapse>
      </div>

      <div className='Box'>
        <h3 className='sidebar-title'>
          Price
          <div className='Expand_Button'>
          <Button
            onClick={() => setIsOpenPriceFilter(!isOpenPriceFilter)}
            className='Expand_icon'>
            { isOpenPriceFilter ? <FaAngleUp /> : <FaAngleDown /> }
            </Button>
          </div>
        </h3>
        <Collapse isOpened={isOpenPriceFilter}>
        <div className='scroll'>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Under $1000" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="$1000 - $1500" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="$1500 - $2000" className='SideBarFilter'/>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Above $2000" className='SideBarFilter'/>
          </div>
        </Collapse>
      </div>

    </aside>
  )
}

export default SideBar