import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';
import { uploadMultiple } from '../middlewares/multer.js';
import {
    uploadImages,
    createProduct,
    getAllProducts,
    getProduct,
    getAllProductsByCatId,
    getAllProductsByCatName,
    getAllProductsBySubCatId,
    getAllProductsBySubCatName,
    getAllProductsByThirdLevelCatId,
    getAllProductsByThirdLevelCatName,
    getAllProductsByPrice,
    getAllProductsByRating,
    getProductsCount,
    getAllFeaturedProducts,
    updateProduct,
    deleteProduct,
    removeImageFromCloudinary
} from '../controllers/Product.controller.js';

const productRouter = Router();

// ========== PUBLIC ROUTES ==========
productRouter.get('/getAllProducts', getAllProducts);
productRouter.get('/getAllProductsByCatId/:id', getAllProductsByCatId);
productRouter.get('/getAllProductsByCatName', getAllProductsByCatName);
productRouter.get('/getAllProductsBySubCatId/:id', getAllProductsBySubCatId);
productRouter.get('/getAllProductsBySubCatName', getAllProductsBySubCatName);
productRouter.get('/getAllProductsByThirdLavelCat/:id', getAllProductsByThirdLevelCatId);
productRouter.get('/getAllProductsByThirdLavelCatName', getAllProductsByThirdLevelCatName);
productRouter.get('/getAllProductsByPrice', getAllProductsByPrice);
productRouter.get('/getAllProductsByRating', getAllProductsByRating);
productRouter.get('/getAllProductsCount', getProductsCount);
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts);
productRouter.get('/:id', getProduct);

// ========== ADMIN ROUTES ==========
productRouter.post('/uploadImages', auth, uploadMultiple, uploadImages);
productRouter.post('/create', auth, adminAuth, createProduct);
productRouter.put('/updateProduct/:id', auth, adminAuth, updateProduct);
productRouter.delete('/:id', auth, adminAuth, deleteProduct);
productRouter.delete('/deleteImage', auth, adminAuth, removeImageFromCloudinary);

export default productRouter;