import React, { useState } from 'react';
import './AddProducts.css';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Chip, Box, IconButton } from '@mui/material';
import { IoMdCloudUpload } from "react-icons/io";
import { BiPackage } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";

const AddProducts = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        oldPrice: '',
        currentPrice: '',
        discount: '',
        state: 'Available',
        guarantee: '36M',
        description: '',
        images: [],
        specifications: [
            { rank: 1, category: 'CPU', description: '', quantity: 1, guarantee: '36M' },
            { rank: 2, category: 'Mainboard', description: '', quantity: 1, guarantee: '36M' },
            { rank: 3, category: 'Ram', description: '', quantity: 1, guarantee: '36M' },
            { rank: 4, category: 'SSD hard drive', description: '', quantity: 1, guarantee: '36M' },
            { rank: 5, category: 'Power Supply Unit (PSU)', description: '', quantity: 1, guarantee: '36M' },
            { rank: 6, category: 'VGA', description: '', quantity: 1, guarantee: '36M' },
            { rank: 7, category: 'Water Cooling', description: '', quantity: 1, guarantee: '36M' },
            { rank: 8, category: 'CASE', description: '', quantity: 1, guarantee: '36M' },
            { rank: 9, category: 'Extension Power Cord', description: '', quantity: 1, guarantee: '36M' },
            { rank: 10, category: 'Accessories', description: '', quantity: 1, guarantee: '36M' },
        ]
    });

    const [previewImages, setPreviewImages] = useState([]);

    const categories = [
        'PC AMD Gaming',
        'PC Intel Gaming',
        'Laptop Gaming',
        'Components',
        'Peripherals',
        'Accessories'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto calculate discount
        if (name === 'oldPrice' || name === 'currentPrice') {
            const oldPrice = name === 'oldPrice' ? parseFloat(value) : parseFloat(formData.oldPrice);
            const currentPrice = name === 'currentPrice' ? parseFloat(value) : parseFloat(formData.currentPrice);
            
            if (oldPrice && currentPrice && oldPrice > currentPrice) {
                const discount = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
                setFormData(prev => ({ ...prev, discount: discount.toString() }));
            }
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        
        setPreviewImages(prev => [...prev, ...newImages]);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const handleRemoveImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSpecificationChange = (index, field, value) => {
        const updatedSpecs = [...formData.specifications];
        updatedSpecs[index][field] = value;
        setFormData(prev => ({
            ...prev,
            specifications: updatedSpecs
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Product Data:', formData);
        // Add API call here
    };

    return (
        <div className='AddProducts'>
            <div className='AddProducts_Header'>
                            <div className='header-icon'>
                              <BiPackage />
                              <div className='icon-glow'></div>
                            </div>
                <h1 className='AddProducts_Title'>Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className='AddProducts_Form'>
                {/* Basic Information */}
                <div className='AddProducts_Section'>
                    <h2 className='AddProducts_Section_Title'>Basic Information</h2>
                    
                    <TextField
                        fullWidth
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className='AddProducts_Input'
                        placeholder="PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC"
                    />

                    <FormControl fullWidth className='AddProducts_Input'>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className='AddProducts_Price_Group'>
                        <TextField
                            label="Old Price (VND)"
                            name="oldPrice"
                            type="number"
                            value={formData.oldPrice}
                            onChange={handleInputChange}
                            required
                            className='AddProducts_Input'
                        />
                        
                        <TextField
                            label="Current Price (VND)"
                            name="currentPrice"
                            type="number"
                            value={formData.currentPrice}
                            onChange={handleInputChange}
                            required
                            className='AddProducts_Input'
                        />
                        
                        <TextField
                            label="Discount (%)"
                            name="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            className='AddProducts_Input'
                            InputProps={{ readOnly: true }}
                        />
                    </div>

                    <div className='AddProducts_State_Group'>
                        <FormControl className='AddProducts_Input'>
                            <InputLabel>Product State</InputLabel>
                            <Select
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="Available">Available</MenuItem>
                                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                                <MenuItem value="Pre-order">Pre-order</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className='AddProducts_Input'>
                            <InputLabel>Warranty Period</InputLabel>
                            <Select
                                name="guarantee"
                                value={formData.guarantee}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="12M">12 Months</MenuItem>
                                <MenuItem value="24M">24 Months</MenuItem>
                                <MenuItem value="36M">36 Months</MenuItem>
                                <MenuItem value="60M">60 Months</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* Product Images */}
                <div className='AddProducts_Section'>
                    <h2 className='AddProducts_Section_Title'>Product Images</h2>
                    
                    <div className='AddProducts_Image_Upload'>
                        <input
                            type="file"
                            id="product-images"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="product-images" className='AddProducts_Upload_Label'>
                            <IoMdCloudUpload size={48} />
                            <span>Click to upload images</span>
                            <span className='AddProducts_Upload_Hint'>PNG, JPG, WEBP (max 5MB each)</span>
                        </label>
                    </div>

                    <div className='AddProducts_Image_Preview'>
                        {previewImages.map((img, index) => (
                            <div key={index} className='AddProducts_Image_Item'>
                                <img src={img.preview} alt={`Preview ${index + 1}`} />
                                <IconButton 
                                    className='AddProducts_Image_Remove'
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <MdDelete />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Specifications Table */}
                <div className='AddProducts_Section'>
                    <h2 className='AddProducts_Section_Title'>Product Specifications</h2>
                    
                    <div className='AddProducts_Specifications_Table'>
                        <div className='AddProducts_Table_Header'>
                            <span>Rank</span>
                            <span>Category</span>
                            <span>Description</span>
                            <span>Quantity</span>
                            <span>Warranty</span>
                        </div>

                        {formData.specifications.map((spec, index) => (
                            <div key={index} className='AddProducts_Table_Row'>
                                <span className='AddProducts_Table_Cell'>{spec.rank}</span>
                                
                                <TextField
                                    value={spec.category}
                                    onChange={(e) => handleSpecificationChange(index, 'category', e.target.value)}
                                    className='AddProducts_Table_Input'
                                    size="small"
                                />
                                
                                <TextField
                                    value={spec.description}
                                    onChange={(e) => handleSpecificationChange(index, 'description', e.target.value)}
                                    className='AddProducts_Table_Input'
                                    size="small"
                                    placeholder="Enter component details"
                                    multiline
                                />
                                
                                <TextField
                                    type="number"
                                    value={spec.quantity}
                                    onChange={(e) => handleSpecificationChange(index, 'quantity', e.target.value)}
                                    className='AddProducts_Table_Input AddProducts_Table_Input_Small'
                                    size="small"
                                    inputProps={{ min: 1 }}
                                />
                                
                                <Select
                                    value={spec.guarantee}
                                    onChange={(e) => handleSpecificationChange(index, 'guarantee', e.target.value)}
                                    className='AddProducts_Table_Input AddProducts_Table_Input_Small'
                                    size="small"
                                >
                                    <MenuItem value="12M">12M</MenuItem>
                                    <MenuItem value="24M">24M</MenuItem>
                                    <MenuItem value="36M">36M</MenuItem>
                                    <MenuItem value="60M">60M</MenuItem>
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Description */}
                <div className='AddProducts_Section'>
                    <h2 className='AddProducts_Section_Title'>Product Description</h2>
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={8}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter detailed product description..."
                        className='AddProducts_Input'
                    />
                </div>

                {/* Submit Button */}
                <div className='AddProducts_Actions'>
                    <Button
                        type="submit"
                        variant="contained"
                        className='AddProducts_Submit_Btn'
                        startIcon={<FaSave />}
                    >
                        Save Product
                    </Button>
                    
                    <Button
                        type="button"
                        variant="outlined"
                        className='AddProducts_Cancel_Btn'
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProducts;