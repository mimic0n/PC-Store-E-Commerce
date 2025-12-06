import React, { useState } from 'react'
import './ProductDetails.css'

import Product_List_Slider from '/src/component/Product_List_Slider/Product_List_Slider.jsx'

import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import Home from '@mui/icons-material/Home';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";

import { emphasize, styled } from '@mui/material/styles';
import { ProductZoom } from '../../component/ProductZoom/ProductZoom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [value, setValue] = useState(5);
    const [activeTab, setActiveTab] = useState(0);
    const [visibleReviews, setVisibleReviews] = useState(5);
    const [isLoading, setIsLoading] = useState(false);

    function handleClick(event) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    
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

    
    const handleLoadMore = () => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setVisibleReviews(prev => prev + 5);
            setIsLoading(false);
        }, 500);
    };

    const ReviewSkeleton = () => (
        <div className='ProductDetails_Reviews_Item ProductDetails_Reviews_Item_Skeleton'>
            <div className='ProductDetails_Reviews_UserInfo'>
                <div className='skeleton skeleton-avatar'></div>
                <div style={{flex: 1}}>
                    <div className='skeleton skeleton-text' style={{width: '30%', marginBottom: '8px'}}></div>
                    <div className='skeleton skeleton-text' style={{width: '20%', marginBottom: '8px'}}></div>
                    <div className='skeleton skeleton-text' style={{width: '100%'}}></div>
                </div>
            </div>
        </div>
    );

    const StyledBreadcrumb = styled(Chip)(({ theme }) => {
        return {
            backgroundColor: theme.palette.grey[100],
            height: theme.spacing(3),
            color: (theme.vars || theme).palette.text.primary,
            fontWeight: theme.typography.fontWeightRegular,
            '&:hover, &:focus': {
                backgroundColor: emphasize(theme.palette.grey[100], 0.06),
                ...theme.applyStyles('dark', {
                    backgroundColor: emphasize(theme.palette.grey[800], 0.06),
                }),
            },
            '&:active': {
                boxShadow: theme.shadows[1],
                backgroundColor: emphasize(theme.palette.grey[100], 0.12),
                ...theme.applyStyles('dark', {
                    backgroundColor: emphasize(theme.palette.grey[800], 0.12),
                }),
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
            }),
        };
    });

    function createData (Rank, Category, Descriptions, Quantity, Guarantee) {
        return { Rank , Category, Descriptions, Quantity, Guarantee };
    }
    
    const rows = [
        createData(1, 'CPU', 'AMD Ryzen 9 9950X3D (16 cores 32 threads, 4.3GHz up to 5.7GHz, 144MB Cache)', 1, '36M'),
        createData(2, 'Mainboard', 'Asus ROG STRIX X870E-E Gaming Wifi DDR5', 1, '36M'),
        createData(3, 'Ram', 'PC G.SKILL Trident Z5 RGB 64GB(32GBx2) BUS 6000MHz DDR5', 1, '36M'),
        createData(4, 'SSD hard drive', 'Samsung 990 PRO 2TB M.2 NVMe M.2 2280 PCIe Gen4.0 x4', 1, '36M'),
        createData(5, 'Power Supply Unit (PSU)', 'SuperFlower Leadex VII PRO 1200W ATX3.1 80 Plus Platinum SF-1200F14XP', 1, '36M'),
        createData(6, 'VGA', 'ASUS ROG Astral GeForce RTX 5090 32GB GDDR7 OC Edition', 1, '36M'),
        createData(7, 'Water Cooling', 'TRYX PANORAMA ARGB 360 (6.5" AMOLED Screen/ASETEK 8 Pump)', 1, '36M'),
        createData(8, 'CASE', 'HYTE Y70 - BLACK (ATX/MID TOWER/BLACK)', 1, '36M'),
        createData(9, 'Extension Power Cord', 'Lian Li Strimer Plus 24 Pin ARGB', 1, '36M'),
        createData(10, 'Accessories', 'JONSBO ZA-360 ARGB BLACK Case Fan', 1, '36M'),
    ];

const allReviews = [
    { 
        id: 1, 
        name: 'Austrian Artist', 
        date: 'August 2, 2025', 
        comment: 'I drew entire Europe map with this PC! Das ist großartig.', 
        rating: 5,
        avatar: '/src/assets/User/User_Avatar/Austrian artist-1933.webp'
    },
    { 
        id: 2, 
        name: 'Albert Einstein', 
        date: 'July 28, 2025', 
        comment: 'Best PC I ever owned. I discovered the Theory Of Relativity thanks to this PC!', 
        rating: 5,
        avatar: '/src/assets/User/User_Avatar/Albert_Einstein.jpg'
    },
    { 
        id: 3, 
        name: 'Elon Musk', 
        date: 'July 25, 2025', 
        comment: 'I was able to launch Falcon 1 into space thanks to the PC I bought from this store. I am planning to update this PC for all employees in the Rocket Research and Development department at SpaceX.', 
        rating: 4,
        avatar: '/src/assets/User/User_Avatar/Elon_Musk.jpg'
    },
    { 
        id: 4, 
        name: 'Soltuné Montepré', 
        date: 'July 20, 2025', 
        comment: 'Mon Dieu! What sorcery is this magnificent contraption? As I first laid mine eyes upon this resplendent machine, adorned with luminous jewels that dance like fireflies in the twilight, I was utterly transported. The crystalline glass panel reveals intricate mechanisms within - a testament to human ingenuity that would make even Da Vinci weep with envy. When I did activate this mechanical marvel, it awakened with a gentle hum, as melodious as a harpsichord\'s whisper. The illuminated texts appeared before me with such clarity, as if conjured by Merlin himself! I composed my latest treatise "De Natura Machinarum Mirabilium" upon this device, and lo, the quill moved by invisible hands! The speed at which my thoughts manifested into written word - \'twas faster than any scribe in my château could ever dream! The moving pictures - oh, how they captivate! \'Tis as if I possess a window to realms beyond mortal comprehension. I witnessed battles of mythical beasts rendered in colors more vivid than the finest Flemish tapestries. This apparatus has elevated my scholarly pursuits to heights previously unattainable. I dare say, this is not merely a machine - \'tis a portal to the divine realm of knowledge itself! Should the Sun King Louis himself inquire, I would declare without hesitation: this is the most extraordinary acquisition of my entire noble lineage. Bravo to the artisans who crafted such magnificence!', 
        rating: 5,
        avatar: '/src/assets/User/User_Avatar/Soltuné Montepré.jpg'
    },
    { 
        id: 5, 
        name: 'Vanga', 
        date: 'July 15, 2025', 
        comment: '# # # # # / - .... .. -..-. -. / -.-. # / -... # - / -.- .... # / .-.. # / # # # # # # # / - .. # - / .-.. # ..- / - .... .. -..-. -. / -.-. # / - # .. / -. .- -. / # .--.- --- / -.--. .-.. # / - .... .. -..-. -. / -.-. # --..-- / - # .. / -.- .... ---. / - .... --- .--.- - -.--.- / # # # # # # # / - .-. .. / -- # -. .... / - .... ..- # -. / - .... .. -..-. -. / - .--.- -- / - # / .- -. / -.--. -... .. # - / -- # -. .... --..-- / - .... ..- # -. / - .-. # .. --..-- / .-.. ---. -. --. / - # / -.-- -..-. -. -.--.- / # # # # # # # / -- # -.-. / ...- # -. / - .. # -. / - .-. .---. -. .... / -.. # / .... # ..- / .-.. # / -.--. -.-. .... # / .... # .. / # # # -. --. / - .-. # # -.-. / ...- .--.- / ... .- ..- -.--.- / # # # # # # # / -- .. -. .... / -- .. -. .... / -.-. .... .. / - .-. ..- -. --. / .... # ..- / # # -. .... / ... # / -.--. - .-. --- -. --. / -- # / -- # - / -.-. ---. / ... # / # # -. .... -.--.- / # # # # # # # / - .-. # / --. .. # / .... .--.- -- / -- # -.-. / - .... # / - .... .. -..-. -. / --.- ..- -.-- / -.--. -. --. # # .. / - .-. # / .. -- / .-.. # -. --. / --. .. # / --.- ..- -.-- / - .-. # .. -.--.- / # # # # # # # / -. --. ..- / --. .. # / ...- # -. --. / -. --. ---. -. / -.-. .... .. -..-. ..- / .... # .- / - .- .. / -.--. -.- # / -. --. ..- / -. ---. .. / -... # -.-- / -- # .. / .... # .- / - .- .. -.--.- / # # # # # # # / - .... .. -..-. -. / # # --- / - ..- # -. / .... --- .--.- -. / -... .--.- --- / # -. --. / -- .. -. .... / -.--. - .... .. -..-. -. / # # --- / .-.. ..- .--.- -. / .... # .. --..-- / -... .--.- --- / # -. --. / .-. # / .-. .--.- -. --. -.--.-', 
        rating: 5,
        avatar: '/src/assets/User/User_Avatar/Vanga.jpg'
    },
    // ...existing code...

    { 
        id: 6, 
        name: 'Gia Cát Lượng', 
        date: 'July 10, 2025', 
        comment: `  \n天機不可露
                    \nThiên cơ bất khả lộ\n
                    \n泄漏天機罪難逃
                    \nTiết lậu thiên cơ tội nan đào
                    \n(Lộ thiên cơ, tội khó thoát)\n
                    \n知命順天心自安
                    \nTri mệnh thuận thiên tâm tự an
                    \n(Biết mệnh, thuận trời, lòng tự yên)\n
                    \n莫問前程與後路
                    \nMạc vấn tiền trình dữ hậu lộ
                    \n(Chớ hỏi đường trước và sau)\n
                    \n冥冥之中有定數
                    \nMinh minh chi trung hữu định số
                    \n(Trong mờ mịt có số định)\n
                    \n智者緘默守天規
                    \nTrí giả hàm mặc thủ thiên quy
                    \n(Người trí im lặng giữ quy trời)\n
                    \n愚者妄言招禍災
                    \nNgu giả vọng ngôn chiêu họa tai
                    \n(Kẻ ngu nói bậy mời họa tai)\n
                    \n天道循環報應明
                    \nThiên đạo tuần hoàn báo ứng minh
                    \n(Thiên đạo luân hồi, báo ứng rõ ràng)`, 
        rating: 5,
        avatar: '/src/assets/User/User_Avatar/Gia Cát Lượng.jpg'
    },

// ...existing code...
];

    return (
        <>
        <section className='ProductDetailsSection'>
            <div className='ProductDetailsSection-1'>
                <div className='BreadcrumbsWrapper'>
                    <div role="presentation" onClick={handleClick}>
                        <Breadcrumbs aria-label="breadcrumb" separator="›">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Home"
                                icon={<Home fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="PC AMD Gaming"
                                deleteIcon={<ExpandMore />}
                                onDelete={handleClick}
                            />
                            <StyledBreadcrumb
                                label="PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC"
                                deleteIcon={<ExpandMore />}
                                onDelete={handleClick}
                            />
                        </Breadcrumbs>
                    </div>
                </div>
            </div>

            <section className='ProductDetailsSection-2'>
                <div className='ProductDetailsSection-2-Container-1'>
             
                    <div className='ProductZoomContainer'>
                        <ProductZoom />
                    </div>

                    <div className='ProductDetails_Info'>
                        <h2 className='ProductDetails_Name'>
                            <GradientText
                                colors={["#757F9A" , "#ffffffff", "#757F9A" , "#ffffffff", "#757F9A" , "#D7DDE8"]}
                                animationSpeed={8}
                                showBorder={false}
                                className="Gradient-Name"
                            >
                            PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC
                            </GradientText>
                           
                            <span className='ProductDetails_Guarantee'> [ 36 months warranty ]</span>
                        </h2>

                        <div className='ProductDetails_Price'>
                            <div className='ProductDetails_Price_Label'>
                                <h5 className='ProductDetails_Price_Title'>Price:</h5>
                            </div>
                            <div className='ProductDetails_Price_Value'>
                                <h5 className='ProductDetails_Old_Price'>52.700.000 VND</h5>
                                <h4 className='ProductDetails_Now_Price'>48.800.000 VND</h4>
                            </div>
                            <div className='ProductDetails_Price_Sale'>
                                <p className='ProductDetails_Price_Sale_Text'>-18%</p>
                            </div>
                        </div>

                        <div className='ProductDetails_State_Section'>
                            <div className='ProductDetails_State'>
                                <h4 className='ProductDetails_State_Title'>Product State:</h4>
                                <span className='ProductDetails_State_Specification'>Available</span>
                            </div>
                        </div>

                        <div className='ProductDetails_Rating_Section'>
                            <div className='ProductDetails_Rating'>
                                <h4 className='ProductDetails_Rating_Title'>Rating:</h4>
                                <Rating name="product-rating" value={value} readOnly size="large" />
                                <span className='ProductDetails_Rating_Count'>(128 reviews)</span>
                            </div>
                        </div>

                        <div className='ProductDetails_Quantity_Section'>
                            <div className='ProductDetails_Quantity_Area'>
                                <h4 className='ProductDetails_Quantity_Title'>Quantity:</h4>
                                <div className='ProductDetails_Quantity_Controls'>
                                    <button
                                        type="button"
                                        onClick={handleMinusQuantity}
                                        className='ProductDetails_Qty_Btn_Minus'
                                    >
                                        <svg focusable="false" className="icon icon--minus" viewBox="0 0 10 2" role="presentation">
                                            <path d="M10 0v2H0V0z"></path>
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        id="quantity"
                                        name="quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        className='ProductDetails_Quantity_Input'
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePlusQuantity}
                                        className='ProductDetails_Qty_Btn_Plus'
                                    >
                                        <svg focusable="false" className="icon icon--plus" viewBox="0 0 10 10" role="presentation">
                                            <path d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        
                
                        <div className='ProductDetails_Actions'>
                            <div className='ProductDetails_Wishlist_Actions'>
                                <Button className='ProductDetails_Action_Btn ProductDetails_Wishlist_Btn'>
                                    <FaHeart />
                                    <span>Add to Wishlist</span>
                                </Button>
                                <Button className='ProductDetails_Action_Btn ProductDetails_Compare_Btn'>
                                    <FaCodeCompare />
                                    <span>Compare</span>
                                </Button>
                            </div>

                            <div className='ProductDetails_Cart_Actions'>
                                <button
                                    type="button"
                                    className='ProductDetails_AddToCart_Btn'
                                >
                                    <FaCartShopping />
                                    <span>Add to Cart</span>
                                </button>

                                <button
                                    type="button"
                                    className='ProductDetails_BuyNow_Btn'
                                >
                                    <span>Buy Now</span>
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
            </section>

            <div className='ProductDetails_Description'>
                    
                <div className='ProductDetails_Description_Title'>
                    <span className='ProductDetails_Description_Link' 
                        onClick={()=> setActiveTab(0)}
                    > Description 
                    </span>

                    <span className='ProductDetails_Description_Link' 
                        onClick={()=> setActiveTab(1)}
                    > Specifications
                    </span>

                    <span className='ProductDetails_Description_Link' 
                        onClick={()=> setActiveTab(2)}
                    > Reviews (36) 
                    </span>
                </div>

                {activeTab === 0 &&
                    <div className='ProductDetails_Description_Content'>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>CPU:</span>
                            <span className='ProductDetails_Spec_Value'>AMD Ryzen 9 9950X3D (16 cores 32 threads, 4.3GHz up to 5.7GHz, 144MB Cache)</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>Mainboard:</span>
                            <span className='ProductDetails_Spec_Value'>Asus ROG STRIX X870E-E Gaming Wifi DDR5</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>Ram:</span>
                            <span className='ProductDetails_Spec_Value'>PC G.SKILL Trident Z5 RGB 64GB(32GBx2) BUS 6000MHz DDR5</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>SSD hard drive:</span>
                            <span className='ProductDetails_Spec_Value'>Samsung 990 PRO 2TB M.2 NVMe M.2 2280 PCIe Gen4.0 x4</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>Power Supply Unit (PSU):</span>
                            <span className='ProductDetails_Spec_Value'>SuperFlower Leadex VII PRO 1200W ATX3.1 80 Plus Platinum SF-1200F14XP</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>VGA:</span>
                            <span className='ProductDetails_Spec_Value'>ASUS ROG Astral GeForce RTX 5090 32GB GDDR7 OC Edition</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>Water Cooling:</span>
                            <span className='ProductDetails_Spec_Value'>TRYX PANORAMA ARGB 360 (6.5" AMOLED Screen/ASETEK 8 Pump)</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>CASE:</span>
                            <span className='ProductDetails_Spec_Value'>HYTE Y70 - BLACK (ATX/MID TOWER/BLACK)</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>Extension Power Cord:</span>
                            <span className='ProductDetails_Spec_Value'>Lian Li Strimer Plus 24 Pin ARGB</span>
                        </p>
                        <p className='ProductDetails_Spec_Item'>
                            <span className='ProductDetails_Spec_Label'>Accessories:</span>
                            <span className='ProductDetails_Spec_Value'>JONSBO ZA-360 ARGB BLACK Case Fan</span>
                        </p>
                    </div>
                }

                {activeTab === 1 &&
                    <div className='ProductDetails_Specifications_Table'>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="specifications table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Rank</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Descriptions</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center">Guarantee</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.Rank}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.Rank}
                                            </TableCell>
                                            <TableCell>{row.Category}</TableCell>
                                            <TableCell>{row.Descriptions}</TableCell>
                                            <TableCell align="center">{row.Quantity}</TableCell>
                                            <TableCell align="center">{row.Guarantee}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }

                {activeTab === 2 && 
                    <div className='ProductDetails_Reviews_Content'>
                        <div className='ProductDetails_Reviews_Content_Wrapper'>
                            <div className='ProductDetails_Reviews_Title'>Customer Reviews ({allReviews.length})</div>
                                
                            <div className='ProductDetails_ReviewForm'>
                                <div className='ProductDetails_ReviewForm_Action' > Add a review </div>
                                <TextField
                                    id="outlined-multiline-static"
                                    placeholder='Write a Reviews'
                                    multiline
                                    rows={4}
                                    defaultValue="Default Value"
                                    className='ProductDetails_ReviewForm_Input'
                                    />
                                
                                <div className='ProductDetails_ReviewForm_Input_Rating'>
                                    <span> Rating : </span>
                                    <Rating 
                                        name="simple-controlled"
                                        value={value}
                                        onChange={(event, newValue) => {
                                        setValue(newValue);
                                        }}
                                    /> 
                                </div>
                                    <div className='ProductDetails_ReviewForm_Submit_Btn_Container'>
                                        <Button variant="contained" color="primary" className='ProductDetails_ReviewForm_Submit_Btn'>
                                            Submit Review
                                        </Button>
                                </div>
                            </div>    
                                    
                            <div className='ProductDetails_Reviews_Container'>
                                {allReviews.slice(0, visibleReviews).map((review) => (
                                    <div key={review.id} className='ProductDetails_Reviews_Item'>
                                        <div className='ProductDetails_Reviews_UserInfo'>
                                            <div className='ProductDetails_Reviews_UserAvatar'>
                                                <img 
                                                    src={review.avatar || 'https://via.placeholder.com/50'} 
                                                    alt={review.name}
                                                    className='ProductDetails_Reviews_UserAvatar_Img'
                                                />
                                            </div>
                                            <div className='ProductDetails_Reviews_UserName_Date_Comment'>
                                                <div className='ProductDetails_Reviews_UserName'>{review.name}</div>
                                                <div className='ProductDetails_Reviews_Date'>{review.date}</div>
                                                <div className='ProductDetails_Reviews_Rating'>
                                                    <Rating 
                                                        name={`review-rating-${review.id}`} 
                                                        value={review.rating} 
                                                        readOnly 
                                                        size="Large"
                                                    />
                                                </div>
                                                <p className='ProductDetails_Reviews_UserComment'>{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                    
                                    {isLoading && (
                                        <>
                                            <ReviewSkeleton />
                                            <ReviewSkeleton />
                                            <ReviewSkeleton />
                                            <ReviewSkeleton />
                                            <ReviewSkeleton />
                                        </>
                                    )}
                            </div>

                            {visibleReviews < allReviews.length && (
                                <button 
                                    onClick={handleLoadMore}
                                    className='ProductDetails_LoadMore_Btn'
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Load More Reviews'}
                                </button>
                            )}
                        </div>
                    </div>
                }
            </div>
                
            <div className='Same_Category_Products_Slider'>
                <div className='Same_Category_Products_Slider_Title'>Same Category Products : </div>
                <section className='Same_Category_Products_Slider_section' style={{marginBottom: '30px' }}>
                    <div className='Same_Category_Products_Slider_container'>
                        <Product_List_Slider items={5} className='Related_Products_Slider_Items' />
                    </div>
                </section>
            </div>
                
            <div className='Related_Products_Slider'>
                <div className='Related_Products_Slider_Title'>You Might Also Like : </div>
                <section className='Related_Products_Slider_section' style={{marginBottom: '30px' }}>
                    <div className='Related_Products_Slider_container'>
                        <Product_List_Slider items={5} className='Related_Products_Slider_Items' />
                    </div>
                </section>
            </div>
                

        </section>
        </>
    )
}

export default ProductDetails