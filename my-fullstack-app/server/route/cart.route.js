import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    syncCart
} from '../controllers/Cart.controller.js';

const cartRouter = Router();
cartRouter.use(auth);

cartRouter.get('/', getCart);
cartRouter.get('/count', getCartItemsCount);
cartRouter.post('/add',addToCart);
cartRouter.put('/update/:cartItemId', updateCartItem);
cartRouter.delete('/remove/:cartItemId', removeFromCart);
cartRouter.delete('/clear', clearCart);
cartRouter.post('/sync', syncCart);

export default cartRouter;