import React, {
  createContext,
  useReducer,
  useEffect,
} from "react";

import { CartService } from "../services/CartService";

export const CartContext = createContext();

const getInitialCart = () => {
  try {
    const savedCart =
      JSON.parse(
        localStorage.getItem("active_tray_session")
      ) || [];

    return new CartService(savedCart).getItems();
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
};

const initialState = {
  cart: getInitialCart(),
};

const reducer = (state, action) => {
  const cartService = new CartService(state.cart);

  switch (action.type) {
    case "add": {
      const product = action.payload;

      cartService.addItem(
        product,
        product.quantity || 1
      );

      return {
        ...state,
        cart: cartService.getItems(),
      };
    }

    case "decrease": {
      cartService.decreaseItem(action.payload);

      return {
        ...state,
        cart: cartService.getItems(),
      };
    }

  
    case "remove": {
      cartService.removeItem(action.payload);

      return {
        ...state,
        cart: cartService.getItems(),
      };
    }

    case "clear_cart": {
      cartService.clearCart();

      return {
        ...state,
        cart: cartService.getItems(),
      };
    }

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    localStorage.setItem(
      "active_tray_session",
      JSON.stringify(state.cart)
    );
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;