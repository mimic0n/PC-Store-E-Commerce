import { Router } from 'express';
import auth from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
    getCategoryTree
} from '../controllers/Category.controller.js';

const categoryRouter = Router();

// ========== PUBLIC ROUTES ==========
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/tree', getCategoryTree);
categoryRouter.get('/id/:id', getCategoryById);
categoryRouter.get('/slug/:slug', getCategoryBySlug);

// ========== ADMIN ROUTES  ==========
categoryRouter.post('/create', auth, adminAuth, createCategory);
categoryRouter.put('/update/:id', auth, adminAuth, updateCategory);
categoryRouter.delete('/delete/:id', auth, adminAuth, deleteCategory);

export default categoryRouter;