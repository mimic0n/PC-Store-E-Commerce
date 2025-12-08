import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddProducts.css';
import { 
    TextField, Button, MenuItem, Select, FormControl, 
    InputLabel, IconButton, CircularProgress, Snackbar, Alert 
} from '@mui/material';
import { IoMdCloudUpload } from "react-icons/io";
import { BiPackage } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { 
    uploadProductImages, 
    createProduct, 
    getProductById, 
    updateProduct 
} from '../../../api/productService';
import { getCategoryTree } from '../../../api/categoryService';

const AddProducts = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Nếu có id thì là edit mode
    const isEditMode = Boolean(id);
    
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [categories, setCategories] = useState([]);
    const [flatCategories, setFlatCategories] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        price: '',
        salePrice: '',
        quantity: '',
        brand: '',
        description: '',
        images: [],
        thumbnail: '',
        isFeatured: false,
        isActive: true,
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
    const [pendingFiles, setPendingFiles] = useState([]);

    // Flatten category tree for select dropdown
    const flattenCategories = (categories, level = 0) => {
        let result = [];
        categories.forEach(cat => {
            result.push({
                id: cat.id,
                name: cat.name,
                level: level,
                displayName: '—'.repeat(level) + ' ' + cat.name
            });
            if (cat.children && cat.children.length > 0) {
                result = result.concat(flattenCategories(cat.children, level + 1));
            }
        });
        return result;
    };

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await getCategoryTree();
                if (response.success) {
                    setCategories(response.data);
                    setFlatCategories(flattenCategories(response.data));
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                showSnackbar('Error loading categories', 'error');
            }
        };
        loadCategories();
    }, []);

    // Load product data if edit mode
    useEffect(() => {
        if (isEditMode) {
            const loadProduct = async () => {
                setLoading(true);
                try {
                    const response = await getProductById(id);
                    if (response.success) {
                        const product = response.data;
                        setFormData({
                            name: product.name || '',
                            categoryId: product.categoryId || '',
                            price: product.price || '',
                            salePrice: product.salePrice || '',
                            quantity: product.quantity || '',
                            brand: product.brand || '',
                            description: product.description || '',
                            images: product.images || [],
                            thumbnail: product.thumbnail || '',
                            isFeatured: product.isFeatured || false,
                            isActive: product.isActive !== false,
                            specifications: product.specifications || formData.specifications
                        });
                        // Set preview images from existing images
                        if (product.images && Array.isArray(product.images)) {
                            setPreviewImages(product.images.map(img => ({
                                url: typeof img === 'string' ? img : img.url,
                                publicId: typeof img === 'string' ? null : img.publicId,
                                isExisting: true
                            })));
                        }
                    }
                } catch (error) {
                    console.error('Error loading product:', error);
                    showSnackbar('Error loading product', 'error');
                } finally {
                    setLoading(false);
                }
            };
            loadProduct();
        }
    }, [id, isEditMode]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            isExisting: false
        }));
        
        setPreviewImages(prev => [...prev, ...newPreviews]);
        setPendingFiles(prev => [...prev, ...files]);
    };

    const handleRemoveImage = (index) => {
        const imageToRemove = previewImages[index];
        
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        
        if (!imageToRemove.isExisting) {
            // Remove from pending files
            const pendingIndex = pendingFiles.findIndex(f => 
                URL.createObjectURL(f) === imageToRemove.preview
            );
            if (pendingIndex > -1) {
                setPendingFiles(prev => prev.filter((_, i) => i !== pendingIndex));
            }
        } else {
            // Remove from formData.images
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSetThumbnail = (index) => {
        const image = previewImages[index];
        if (image.isExisting) {
            setFormData(prev => ({
                ...prev,
                thumbnail: image.url
            }));
        }
        showSnackbar('Thumbnail will be set after saving', 'info');
    };

    const handleSpecificationChange = (index, field, value) => {
        const updatedSpecs = [...formData.specifications];
        updatedSpecs[index][field] = value;
        setFormData(prev => ({
            ...prev,
            specifications: updatedSpecs
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name || !formData.price || !formData.categoryId) {
            showSnackbar('Please fill in all required fields (Name, Price, Category)', 'error');
            return;
        }

        setLoading(true);
        
        try {
            let uploadedImages = [...(formData.images || [])];
            
            // Upload new images if any
            if (pendingFiles.length > 0) {
                setUploadingImages(true);
                const uploadResponse = await uploadProductImages(pendingFiles);
                if (uploadResponse.success) {
                    uploadedImages = [...uploadedImages, ...uploadResponse.data];
                }
                setUploadingImages(false);
            }

            const productData = {
                name: formData.name,
                categoryId: parseInt(formData.categoryId),
                price: parseFloat(formData.price),
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
                quantity: parseInt(formData.quantity) || 0,
                brand: formData.brand || null,
                description: formData.description || null,
                images: uploadedImages,
                thumbnail: uploadedImages.length > 0 ? 
                    (typeof uploadedImages[0] === 'string' ? uploadedImages[0] : uploadedImages[0].url) : null,
                isFeatured: formData.isFeatured,
                isActive: formData.isActive,
                specifications: formData.specifications
            };

            let response;
            if (isEditMode) {
                response = await updateProduct(id, productData);
            } else {
                response = await createProduct(productData);
            }

            if (response.success) {
                showSnackbar(
                    isEditMode ? 'Product updated successfully!' : 'Product created successfully!', 
                    'success'
                );
                setTimeout(() => {
                    navigate('/products/AllProducts');
                }, 1500);
            } else {
                showSnackbar(response.message || 'Error saving product', 'error');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            showSnackbar(error.response?.data?.message || 'Error saving product', 'error');
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className='AddProducts' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className='AddProducts'>
            <div className='AddProducts_Header'>
                <Button 
                    className='AddProducts_Back_Btn'
                    onClick={() => navigate('/products/AllProducts')}
                    startIcon={<IoArrowBack />}
                >
                    Back
                </Button>
                <div className='header-icon'>
                    <BiPackage />
                    <div className='icon-glow'></div>
                </div>
                <h1 className='AddProducts_Title'>
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className='AddProducts_Form'>
                {/* Basic Information */}
                <div className='AddProducts_Section'>
                    <h2 className='AddProducts_Section_Title'>Basic Information</h2>
                    
                    <TextField
                        fullWidth
                        label="Product Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className='AddProducts_Input'
                        placeholder="PC AMD GAMING LUXURY RYZEN 9 9950X3D - RTX 5090 32GB OC"
                    />

                    <FormControl fullWidth className='AddProducts_Input'>
                        <InputLabel>Category *</InputLabel>
                        <Select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleInputChange}
                            required
                        >
                            {flatCategories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.displayName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className='AddProducts_Input'
                        placeholder="e.g., ASUS, MSI, Gigabyte"
                    />

                    <div className='AddProducts_Price_Group'>
                        <TextField
                            label="Price (VND) *"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            className='AddProducts_Input'
                        />
                        
                        <TextField
                            label="Sale Price (VND)"
                            name="salePrice"
                            type="number"
                            value={formData.salePrice}
                            onChange={handleInputChange}
                            className='AddProducts_Input'
                        />
                        
                        <TextField
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className='AddProducts_Input'
                            inputProps={{ min: 0 }}
                        />
                    </div>

                    <div className='AddProducts_State_Group'>
                        <FormControl className='AddProducts_Input'>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="isActive"
                                value={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value }))}
                            >
                                <MenuItem value={true}>Active</MenuItem>
                                <MenuItem value={false}>Inactive</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className='AddProducts_Input'>
                            <InputLabel>Featured</InputLabel>
                            <Select
                                name="isFeatured"
                                value={formData.isFeatured}
                                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.value }))}
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
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
                            disabled={uploadingImages}
                        />
                        <label htmlFor="product-images" className='AddProducts_Upload_Label'>
                            {uploadingImages ? (
                                <CircularProgress size={48} />
                            ) : (
                                <IoMdCloudUpload size={48} />
                            )}
                            <span>{uploadingImages ? 'Uploading...' : 'Click to upload images'}</span>
                            <span className='AddProducts_Upload_Hint'>PNG, JPG, WEBP (max 5MB each)</span>
                        </label>
                    </div>

                    <div className='AddProducts_Image_Preview'>
                        {previewImages.map((img, index) => (
                            <div key={index} className='AddProducts_Image_Item'>
                                <img 
                                    src={img.isExisting ? img.url : img.preview} 
                                    alt={`Preview ${index + 1}`} 
                                />
                                {index === 0 && (
                                    <span className='AddProducts_Thumbnail_Badge'>Thumbnail</span>
                                )}
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
                                    onChange={(e) => handleSpecificationChange(index, 'quantity', parseInt(e.target.value) || 1)}
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
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FaSave />}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Save Product')}
                    </Button>
                    
                    <Button
                        type="button"
                        variant="outlined"
                        className='AddProducts_Cancel_Btn'
                        onClick={() => navigate('/products/AllProducts')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddProducts;