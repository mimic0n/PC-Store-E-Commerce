import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../api/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // NEW: State cho selected items để checkout
    const [selectedItems, setSelectedItems] = useState([]);
    const [checkoutItems, setCheckoutItems] = useState([]); // Items sẽ được checkout

    const isLoggedIn = () => {
        return !!localStorage.getItem('accessToken');
    };

    // Lấy cart từ localStorage (cho guest user)
    const getLocalCart = () => {
        const localCart = localStorage.getItem('guestCart');
        return localCart ? JSON.parse(localCart) : [];
    };

    // Lưu cart vào localStorage (cho guest user)
    const saveLocalCart = (items) => {
        localStorage.setItem('guestCart', JSON.stringify(items));
    };

    const calculateCartSummary = (items) => {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const total = items.reduce((sum, item) => {
            const price = item.product?.salePrice || item.product?.price || item.price || 0;
            return sum + (price * item.quantity);
        }, 0);
        setCartCount(count);
        setCartTotal(total);
    };

    // NEW: Tính tổng cho các items được chọn
    const calculateSelectedTotal = useCallback(() => {
        return selectedItems.reduce((sum, itemId) => {
            const item = cartItems.find(i => (i.id || i.productId) === itemId);
            if (item) {
                const price = item.product?.salePrice || item.product?.price || item.price || 0;
                return sum + (price * item.quantity);
            }
            return sum;
        }, 0);
    }, [selectedItems, cartItems]);

    // NEW: Toggle chọn một item
    const toggleSelectItem = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    // NEW: Chọn tất cả items
    const selectAllItems = () => {
        const allIds = cartItems.map(item => item.id || item.productId);
        setSelectedItems(allIds);
    };

    // NEW: Bỏ chọn tất cả items
    const deselectAllItems = () => {
        setSelectedItems([]);
    };

    // NEW: Kiểm tra item có được chọn không
    const isItemSelected = (itemId) => {
        return selectedItems.includes(itemId);
    };

    // NEW: Set items để checkout (có thể là selected items hoặc 1 item cụ thể)
    const setItemsForCheckout = (items = null) => {
        if (items) {
            // Checkout items cụ thể (Buy Now cho 1 product)
            setCheckoutItems(items);
        } else {
            // Checkout các items đã select
            const itemsToCheckout = cartItems.filter(item => 
                selectedItems.includes(item.id || item.productId)
            );
            setCheckoutItems(itemsToCheckout);
        }
    };

    // NEW: Clear checkout items
    const clearCheckoutItems = () => {
        setCheckoutItems([]);
    };

    // NEW: Get checkout items (nếu không có thì lấy tất cả cart)
    const getCheckoutItems = () => {
        return checkoutItems.length > 0 ? checkoutItems : cartItems;
    };

    // NEW: Tính tổng cho checkout items
    const getCheckoutTotal = () => {
        const items = getCheckoutItems();
        return items.reduce((sum, item) => {
            const price = item.product?.salePrice || item.product?.price || item.price || 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    // Fetch cart từ server
    const fetchCart = useCallback(async () => {
        if (!isLoggedIn()) {
            const localItems = getLocalCart();
            setCartItems(localItems);
            calculateCartSummary(localItems);
            return;
        }

        setLoading(true);
        try {
            const response = await cartService.getCart();
            if (response.success) {
                setCart(response.data);
                const items = response.data?.items || [];
                setCartItems(items);
                calculateCartSummary(items);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Thêm sản phẩm vào cart
    const addToCart = async (product, quantity = 1) => {
        if (!isLoggedIn()) {
            const localItems = getLocalCart();
            const existingIndex = localItems.findIndex(item => item.productId === product.id);

            if (existingIndex >= 0) {
                localItems[existingIndex].quantity += quantity;
            } else {
                localItems.push({
                    productId: product.id,
                    quantity,
                    price: product.salePrice || product.price,
                    product: {
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        salePrice: product.salePrice,
                        thumbnail: product.thumbnail
                    }
                });
            }

            saveLocalCart(localItems);
            setCartItems(localItems);
            calculateCartSummary(localItems);
            toast.success('Đã thêm vào giỏ hàng!');
            return { success: true };
        }

        setLoading(true);
        try {
            const response = await cartService.addToCart(product.id, quantity);
            if (response.success) {
                await fetchCart();
                toast.success('Đã thêm vào giỏ hàng!');
                return response;
            } else {
                toast.error(response.message || 'Không thể thêm vào giỏ hàng');
                return response;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (!isLoggedIn()) {
            const localItems = getLocalCart();
            const index = localItems.findIndex(item => item.productId === cartItemId);
            if (index >= 0) {
                if (quantity <= 0) {
                    localItems.splice(index, 1);
                } else {
                    localItems[index].quantity = quantity;
                }
                saveLocalCart(localItems);
                setCartItems(localItems);
                calculateCartSummary(localItems);
            }
            return { success: true };
        }

        setLoading(true);
        try {
            const response = await cartService.updateCartItem(cartItemId, quantity);
            if (response.success) {
                await fetchCart();
                return response;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (cartItemId) => {
        if (!isLoggedIn()) {
            const localItems = getLocalCart();
            const filteredItems = localItems.filter(item => item.productId !== cartItemId);
            saveLocalCart(filteredItems);
            setCartItems(filteredItems);
            calculateCartSummary(filteredItems);
            // Xóa khỏi selectedItems nếu có
            setSelectedItems(prev => prev.filter(id => id !== cartItemId));
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
            return { success: true };
        }

        setLoading(true);
        try {
            const response = await cartService.removeFromCart(cartItemId);
            if (response.success) {
                await fetchCart();
                setSelectedItems(prev => prev.filter(id => id !== cartItemId));
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
                return response;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const clearCartItems = async () => {
        if (!isLoggedIn()) {
            localStorage.removeItem('guestCart');
            setCartItems([]);
            setCartCount(0);
            setCartTotal(0);
            setSelectedItems([]);
            return { success: true };
        }

        setLoading(true);
        try {
            const response = await cartService.clearCart();
            if (response.success) {
                await fetchCart();
                setSelectedItems([]);
                return response;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const syncCartOnLogin = async () => {
        const localItems = getLocalCart();
        if (localItems.length > 0) {
            try {
                await cartService.syncCart(localItems);
                localStorage.removeItem('guestCart');
            } catch (error) {
                console.error('Error syncing cart:', error);
            }
        }
        await fetchCart();
    };

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const value = {
        cart,
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clearCartItems,
        fetchCart,
        syncCartOnLogin,
        isLoggedIn,
        // NEW: Exported functions cho selective checkout
        selectedItems,
        toggleSelectItem,
        selectAllItems,
        deselectAllItems,
        isItemSelected,
        calculateSelectedTotal,
        setItemsForCheckout,
        clearCheckoutItems,
        getCheckoutItems,
        getCheckoutTotal,
        checkoutItems
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;