import React, { useState, useEffect , useContext } from 'react'
import { useParams } from 'react-router-dom'
import './ProductDetails.css'
import { useCart } from '../../context/CartContext';
import { MyContext } from '../../App';

import Product_List_Slider from '/src/component/Product_List_Slider/Product_List_Slider.jsx'

import GradientText from '/src/styles/Animation/Gradient Text/GradientText.jsx'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import Home from '@mui/icons-material/Home';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
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

import { getProductById, getAllProducts } from '../../api/productService';

// Mapping cho specification keys sang tên hiển thị đẹp hơn
const specificationLabels = {
    cpu: 'CPU',
    mainboard: 'Mainboard',
    ram: 'RAM',
    ssd: 'SSD Hard Drive',
    hdd: 'HDD Hard Drive',
    psu: 'Power Supply Unit (PSU)',
    vga: 'VGA / Graphics Card',
    cooling: 'Water Cooling',
    case: 'CASE',
    extension: 'Extension Power Cord',
    accessories: 'Accessories',
    warranty: 'Warranty',
    monitor: 'Monitor',
    keyboard: 'Keyboard',
    mouse: 'Mouse',
    headset: 'Headset',
    mousepad: 'Mousepad',
    storage: 'Storage',
    os: 'Operating System',
    network: 'Network',
    audio: 'Audio',
    ports: 'Ports',
    weight: 'Weight',
    dimensions: 'Dimensions',
    color: 'Color',
    material: 'Material',
    connectivity: 'Connectivity',
    battery: 'Battery',
    display: 'Display',
    resolution: 'Resolution',
    refreshRate: 'Refresh Rate',
    responseTime: 'Response Time',
    panelType: 'Panel Type',
    switchType: 'Switch Type',
    dpi: 'DPI',
    sensor: 'Sensor',
    frequency: 'Frequency',
    driver: 'Driver',
    impedance: 'Impedance',
    microphone: 'Microphone'
};

// Function để lấy label hiển thị từ key
const getSpecLabel = (key) => {
    return specificationLabels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
};

export const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [quantity, setQuantity] = useState(1);
    const [value, setValue] = useState(5);
    const [activeTab, setActiveTab] = useState(0);
    const [visibleReviews, setVisibleReviews] = useState(5);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getProductById(id);
                if (response.success) {
                    setProduct(response.data);
                    setValue(response.data.rating || 5);
                }

                // Fetch related products
                const relatedRes = await getAllProducts({ limit: 10 });
                if (relatedRes.success) {
                    setRelatedProducts(relatedRes.data.filter(p => p.id !== parseInt(id)));
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
    };

    // Calculate discount
    const calculateDiscount = (price, salePrice) => {
        if (!salePrice || salePrice >= price) return 0;
        return Math.round(((price - salePrice) / price) * 100);
    };

    // Parse images from JSON string
    const getImages = () => {
        if (!product?.images) return [];
        if (typeof product.images === 'string') {
            try {
                return JSON.parse(product.images);
            } catch (e) {
                return [];
            }
        }
        return product.images;
    };

    // Parse specifications from JSON string or object
    const getSpecifications = () => {
        if (!product?.specifications) return {};
        if (typeof product.specifications === 'string') {
            try {
                return JSON.parse(product.specifications);
            } catch (e) {
                return {};
            }
        }
        return product.specifications;
    };

    // Convert specifications object to array for table display
    const getSpecificationsArray = () => {
        const specs = getSpecifications();
        if (!specs || typeof specs !== 'object') return [];
        
        // Nếu specs là array thì return luôn
        if (Array.isArray(specs)) return specs;
        
        // Convert object to array, loại bỏ warranty vì đã hiển thị riêng
        return Object.entries(specs)
            .filter(([key]) => key !== 'warranty')
            .map(([key, value], index) => ({
                rank: index + 1,
                category: getSpecLabel(key),
                description: value,
                quantity: 1,
                guarantee: specs.warranty || product.warranty || '36M'
            }));
    };

    // Get warranty from specifications
    const getWarranty = () => {
        const specs = getSpecifications();
        return specs?.warranty || product?.warranty || '36 months';
    };

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

    // Loading state
    if (loading) {
        return (
            <div className='ProductDetailsSection' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </div>
        );
    }

    // Not found state
    if (!product) {
        return (
            <div className='ProductDetailsSection' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <h2>Product not found</h2>
            </div>
        );
    }

    const discount = calculateDiscount(product.price, product.salePrice);
    const images = getImages();
    const specifications = getSpecifications();
    const specificationsArray = getSpecificationsArray();
    const warranty = getWarranty();

    // Sample reviews 
    const allReviews = [
        { id: 1, name: 'Customer 1', date: 'December 1, 2025', comment: 'Great product!', rating: 5, avatar: '' },
        { id: 2, name: 'Customer 2', date: 'November 28, 2025', comment: 'Very satisfied with my purchase.', rating: 4, avatar: '' },
    ];

    const { addToCart, loading: cartLoading } = useCart();
    const context = useContext(MyContext);

    const handleAddToCart = async () => {
    if (product) {
        await addToCart(product, quantity);
        context.setOpenCartPanel(true);
    }
    };

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
                                label={product.category?.name || 'Category'}
                                deleteIcon={<ExpandMore />}
                                onDelete={handleClick}
                            />
                            <StyledBreadcrumb
                                label={product.name}
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
                        <ProductZoom images={images} thumbnail={product.thumbnail} />
                    </div>

                    <div className='ProductDetails_Info'>
                        <h2 className='ProductDetails_Name'>
                            <GradientText
                                colors={["#757F9A", "#ffffffff", "#757F9A", "#ffffffff", "#757F9A", "#D7DDE8"]}
                                animationSpeed={8}
                                showBorder={false}
                                className="Gradient-Name"
                            >
                                {product.name}
                            </GradientText>
                            <span className='ProductDetails_Guarantee'> [{warranty} warranty]</span>
                        </h2>

                        <div className='ProductDetails_Price'>
                            <div className='ProductDetails_Price_Label'>
                                <h5 className='ProductDetails_Price_Title'>Price:</h5>
                            </div>
                            <div className='ProductDetails_Price_Value'>
                                {product.salePrice && product.salePrice < product.price && (
                                    <h5 className='ProductDetails_Old_Price'>{formatPrice(product.price)}</h5>
                                )}
                                <h4 className='ProductDetails_Now_Price'>
                                    {formatPrice(product.salePrice || product.price)}
                                </h4>
                            </div>
                            {discount > 0 && (
                                <div className='ProductDetails_Price_Sale'>
                                    <p className='ProductDetails_Price_Sale_Text'>-{discount}%</p>
                                </div>
                            )}
                        </div>

                        <div className='ProductDetails_State_Section'>
                            <div className='ProductDetails_State'>
                                <h4 className='ProductDetails_State_Title'>Product State:</h4>
                                <span className='ProductDetails_State_Specification'>
                                    {product.quantity > 0 ? 'Available' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className='ProductDetails_Rating_Section'>
                            <div className='ProductDetails_Rating'>
                                <h4 className='ProductDetails_Rating_Title'>Rating:</h4>
                                <Rating name="product-rating" value={value} readOnly size="large" />
                                <span className='ProductDetails_Rating_Count'>({allReviews.length} reviews)</span>
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
                                    disabled={product.quantity <= 0 || cartLoading}
                                    onClick={handleAddToCart}
                                    >
                                    <FaCartShopping />
                                    <span>{cartLoading ? 'Adding...' : 'Add to Cart'}</span>
                                </button>

                                <button
                                    type="button"
                                    className='ProductDetails_BuyNow_Btn'
                                    disabled={product.quantity <= 0}
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
                    <span 
                        className={`ProductDetails_Description_Link ${activeTab === 0 ? 'active' : ''}`} 
                        onClick={() => setActiveTab(0)}
                    >
                        Description
                    </span>
                    <span 
                        className={`ProductDetails_Description_Link ${activeTab === 1 ? 'active' : ''}`} 
                        onClick={() => setActiveTab(1)}
                    >
                        Specifications
                    </span>
                    <span 
                        className={`ProductDetails_Description_Link ${activeTab === 2 ? 'active' : ''}`} 
                        onClick={() => setActiveTab(2)}
                    >
                        Reviews ({allReviews.length})
                    </span>
                </div>

                {activeTab === 0 && (
                    <div className='ProductDetails_Description_Content'>
                        {/* Hiển thị specifications dạng list trong Description */}
                        {specificationsArray.length > 0 ? (
                            specificationsArray.map((spec, index) => (
                                <p className='ProductDetails_Spec_Item' key={index}>
                                    <span className='ProductDetails_Spec_Label'>{spec.category}:</span>
                                    <span className='ProductDetails_Spec_Value'>{spec.description}</span>
                                </p>
                            ))
                        ) : product.description ? (
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : (
                            <p>No description available.</p>
                        )}
                    </div>
                )}

                {activeTab === 1 && (
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
                                    {specificationsArray.length > 0 ? (
                                        specificationsArray.map((spec, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{spec.rank || index + 1}</TableCell>
                                                <TableCell>{spec.category}</TableCell>
                                                <TableCell>{spec.description}</TableCell>
                                                <TableCell align="center">{spec.quantity || 1}</TableCell>
                                                <TableCell align="center">{spec.guarantee || warranty}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No specifications available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}

                {activeTab === 2 && (
                    <div className='ProductDetails_Reviews_Content'>
                        <div className='ProductDetails_Reviews_Content_Wrapper'>
                            <div className='ProductDetails_Reviews_Title'>Customer Reviews ({allReviews.length})</div>

                            <div className='ProductDetails_ReviewForm'>
                                <div className='ProductDetails_ReviewForm_Action'>Add a review</div>
                                <TextField
                                    id="outlined-multiline-static"
                                    placeholder='Write a Review'
                                    multiline
                                    rows={4}
                                    className='ProductDetails_ReviewForm_Input'
                                />
                                <div className='ProductDetails_ReviewForm_Input_Rating'>
                                    <span>Rating:</span>
                                    <Rating
                                        name="simple-controlled"
                                        value={value}
                                        onChange={(event, newValue) => setValue(newValue)}
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
                                                        size="large"
                                                    />
                                                </div>
                                                <p className='ProductDetails_Reviews_UserComment'>{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && [...Array(5)].map((_, i) => <ReviewSkeleton key={i} />)}
                            </div>

                            {visibleReviews < allReviews.length && (
                                <button onClick={handleLoadMore} className='ProductDetails_LoadMore_Btn' disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Load More Reviews'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className='Same_Category_Products_Slider'>
                <div className='Same_Category_Products_Slider_Title'>Same Category Products:</div>
                <section className='Same_Category_Products_Slider_section' style={{ marginBottom: '30px' }}>
                    <div className='Same_Category_Products_Slider_container'>
                        <Product_List_Slider items={5} products={relatedProducts} />
                    </div>
                </section>
            </div>

            <div className='Related_Products_Slider'>
                <div className='Related_Products_Slider_Title'>You Might Also Like:</div>
                <section className='Related_Products_Slider_section' style={{ marginBottom: '30px' }}>
                    <div className='Related_Products_Slider_container'>
                        <Product_List_Slider items={5} products={relatedProducts} />
                    </div>
                </section>
            </div>
        </section>
        </>
    )
}

export default ProductDetails