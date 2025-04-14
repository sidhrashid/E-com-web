/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const user = localStorage.getItem("user_Id");
    console.log( "user", user);
    const BASE_URL = "http://https://e-com-web-n1aw.onrender.com";

    const hasSyncedCart = useRef(false); // ✅ Prevent multiple syncs

    // Load cart based on login status
    useEffect(() => {
        const loadCart = async () => {
            if (user && !hasSyncedCart.current) {
                hasSyncedCart.current = true;

                const localCart = JSON.parse(localStorage.getItem("cart")) || [];

                if (localCart.length > 0) {
                    try {
                        await axios.post(`${BASE_URL}/sync-cart-item`, {
                            user_id: user,
                            cartItems: localCart,
                        });
                        localStorage.removeItem("cart"); // ✅ Remove local cart
                        setCart([]); // ✅ Clear React cart state
                    } catch (error) {
                        console.error("Error syncing cart:", error);
                    }
                }

                try {
                    const { data } = await axios.get(`${BASE_URL}/get-cart-item/${user}`);
                    setCart(data);
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            } else {
                const savedCart = localStorage.getItem("cart");
                setCart(savedCart ? JSON.parse(savedCart) : []);
            }
        };

        loadCart();
    }, [user]);

    // Save cart to localStorage if not logged in
    useEffect(() => {
        if (!user) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, user]);

    // Add to cart
    const addToCart = async (product) => {
        if (!user) {
            setCart((prevCart) => {
                const existingItem = prevCart.find((item) => item.id === product.id);
                if (existingItem) {
                    return prevCart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevCart, { ...product, quantity: 1 }];
                }
            });
        } else {
            try {
                await axios.post(`${BASE_URL}/add-cart-item`, {
                    user_id: user,
                    product_id: product.id,
                    quantity: 1,
                });
                const { data } = await axios.get(`${BASE_URL}/get-cart-item/${user}`);
                setCart(data);
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        }
    };

    // Update cart quantity
    const updateCartQuantity = async (id, newQuantity) => {
        if (!user) {
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        } else {
            try {
                await axios.put(`${BASE_URL}/update-cart-item`, {
                    user_id: user,
                    product_id: id,
                    quantity: newQuantity,
                });
                const { data } = await axios.get(`${BASE_URL}/get-cart-item/${user}`);
                setCart(data);
            } catch (error) {
                console.error("Error updating quantity:", error);
            }
        }
    };

    const increaseQty = (id) => {
        const item = cart.find((item) => item.id === id);
        if (item) updateCartQuantity(id, Math.min(10, item.quantity + 1));
    };

    const decreaseQty = (id) => {
        const item = cart.find((item) => item.id === id);
        if (item) updateCartQuantity(id, Math.max(1, item.quantity - 1));
    };

    const removeItem = async (id) => {
        if (!user) {
            setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        } else {
            try {
                await axios.delete(`${BASE_URL}/delete-cart-item`, {
                    data: { user_id: user, product_id: id },
                });
                const { data } = await axios.get(`${BASE_URL}/get-cart-item/${user}`);
                setCart(data);
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }
    };

    const totalAmount = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const totalItems = cart.length;

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addToCart,
                increaseQty,
                decreaseQty,
                removeItem,
                totalAmount,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};