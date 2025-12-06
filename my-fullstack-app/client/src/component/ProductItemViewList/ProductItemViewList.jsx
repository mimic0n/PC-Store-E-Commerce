import React, { useState ,useContext  } from 'react'
import './ProductItemViewList.css'
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';




export const ProductItems = () => {
  const [quantity, setQuantity] = useState(1);

  const handleMinusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlusQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const [value, setValue] = React.useState(5);
  const context = useContext(MyContext);

  return (
      <div className='ProductItemViewList'>
          <div className='imgWrapper'>  
              <Link to='/'>
                <div className='Product_Image_Box'>
                    <img src="/src/assets/AdsBannerSlide/AdsBannerSlide_1.jpg" className='image_1'></img>
                    <img src="/src/assets/AdsBannerSlide/AdsBannerSlide_2.jpg" className='image_2'></img>
                    <div className='Discount'>-18%</div>
                    <div className='Product_Box_Button'>
                    <Button className='Complex_Button'
                            onClick={() => context.setOpenProductDetailsModel(true)}><FaHeart /></Button>
                    <Button className='Complex_Button'><FaCodeCompare /></Button>
                    <Button className='Complex_Button'><RiShoppingBasket2Fill /></Button>
                    </div>
                </div>
            </Link>
          </div>
          
      

<div className='Product_Interact'>
<div className='Product_Info'>
  <h5 className='Product_Name'><a href='#'> PC KCC AMD R7-9800x3d / RTX 4070 super</a></h5>
  
  <div className='Product_Price'>
    <div>
      <h5 className='Product_Price_Title'>Price : </h5>
    </div>
    <div className='Product_Price_Value'>
      <h5 className='Old-Price'> 52.700.000 VND</h5>
      <h4 className="Now-Price"> 48.800.000 VND </h4>
      </div>
      <div className='Product_Price_Sale'>
        <p className='Product_Price_Sale_text'>
        -18%
        </p>
     </div>
  </div>

  <div className='Product_Bottom_Section'>
    <div className='Product_Detail_Info'>
      <h4 className='Product_State'> Product State : </h4>
      <div className='Product_State_Specification'>
        <h5> Available </h5>
      </div>
    </div>
          </div>
          <div class="quantity-area">
					<div class="quantity-title">Quantity : </div>
					<button type="button" onClick={handleMinusQuantity} className="qty-btn">
					<svg focusable="false" className="icon icon--minus " viewBox="0 0 10 2" role="presentation">
						<path d="M10 0v2H0V0z"></path>
					</svg>
					</button>
          <input type="text" id="quantity" name="quantity" value={quantity} onChange={handleQuantityChange} min="1" class="quantity-input"/>
          <button type="button" onClick={handlePlusQuantity} className="qty-btn">
					<svg focusable="false" className="icon icon--plus " viewBox="0 0 10 10" role="presentation">
						<path d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z"></path>
					</svg>
				</button>
          </div>
          <div className='Product-Rating'>
            <div class="Rating-title">Rating : </div>
            <Rating name="read-only" value={value} readOnly />
    </div>
    
    <div className='addcart-area'>
      <button type="button"
              id="add-to-cart"
              className="add-to-cartProduct button dark btn-addtocart addtocart-modal"
              name="add">
        Add to cart
      </button>

      <button type="button"
              id="buy-now"
              className="button dark btn-buynow btnBUY addtocart-modal"
              name="add">
        Buy Now
      </button>
    </div>
  </div>

      </div>
    </div>
    
    
  )
}

export default ProductItems