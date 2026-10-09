import React, { useContext } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { CartContext } from "../../context/CartProvider";

const Cart = () => {
  const { state, dispatch } = useContext(CartContext);

  const navigate = useNavigate();

  /* ==========================================
     CALCULATE GRAND TOTAL
  ========================================== */

  const grandTotal = state.cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  /* ==========================================
     CHECKOUT
  ========================================== */

  const handleCheckoutSubmit = async () => {
    if (state.cart.length === 0) {
      return;
    }

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    };

    try {
      /* --------------------------------------
           CREATE ORDER IN DATABASE
        -------------------------------------- */

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/create`,
        {
          products: state.cart.map((item) => ({
            product_id: item.id,

            quantity: item.quantity,
          })),

          totalAmount: grandTotal,
        },

        config,
      );

      /* --------------------------------------
           GET REAL MONGODB ORDER ID
        -------------------------------------- */

      const newOrderId = res.data?.orderId || res.data?.order?._id;

      if (!newOrderId) {
        throw new Error("Order ID was not returned by server.");
      }

      console.log("Order created:", newOrderId);

      /* --------------------------------------
           GO TO PAYMENT PAGE
        -------------------------------------- */

      navigate("/payment", {
        state: {
          totalAmount: grandTotal,

          newOrderId: newOrderId,
        },
      });

      /* --------------------------------------
           CLEAR CART
        -------------------------------------- */

      dispatch({
        type: "clear_cart",
      });
    } catch (error) {
      console.error("Order creation failed:", error);

      alert("Unable to create your order. Please try again.");
    }
  };

  /* ==========================================
     UI
  ========================================== */

  return (
    <div className="min-h-screen bg-stone-50 p-6 text-stone-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-amber-950 tracking-tight">
              Your Order Selection
            </h1>

            <p className="text-stone-500 text-xs mt-0.5">
              Adjust settings, update item quantities, and checkout.
            </p>
          </div>

          <button
            onClick={() => navigate("/menu")}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 underline decoration-2"
          >
            &larr; Return to Menu
          </button>
        </div>

        {/* ======================================
            CART + TOTAL
        ====================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ====================================
              CART ITEMS
          ==================================== */}

          <div className="md:col-span-2 space-y-4">
            {state.cart.length > 0 ? (
              state.cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs flex items-center justify-between gap-4"
                >
                  {/* PRODUCT INFO */}

                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />

                    <div className="min-w-0">
                      <h3 className="font-bold text-stone-900 text-sm truncate">
                        {item.title}
                      </h3>

                      <p className="text-xs font-mono font-bold text-amber-800 mt-0.5">
                        Rs. {item.price}
                      </p>

                      <p className="text-xs text-stone-500 mt-1">
                        Subtotal: Rs. {Number(item.price) * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* QUANTITY + REMOVE */}

                  <div className="flex items-center gap-3 shrink-0">
                    {/* QUANTITY */}

                    <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg">
                      {/* DECREASE */}

                      <button
                        onClick={() =>
                          dispatch({
                            type: "decrease",

                            payload: item.id,
                          })
                        }
                        className="font-bold text-sm px-1.5 hover:text-amber-800"
                      >
                        -
                      </button>

                      {/* QUANTITY */}

                      <span className="font-mono text-xs font-bold w-4 text-center">
                        {item.quantity}
                      </span>

                      {/* INCREASE */}

                      <button
                        onClick={() =>
                          dispatch({
                            type: "add",

                            payload: {
                              ...item,
                              quantity: 1,
                            },
                          })
                        }
                        className="font-bold text-sm px-1.5 hover:text-amber-800"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}

                    <button
                      onClick={() =>
                        dispatch({
                          type: "remove",

                          payload: item.id,
                        })
                      }
                      className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              /* EMPTY CART */

              <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-6 text-stone-400 text-sm">
                Your cart is empty.
              </div>
            )}
          </div>

          {/* ====================================
              TOTAL
          ==================================== */}

          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs self-start space-y-4">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider border-b border-stone-100 pb-2">
              Total Cost
            </h3>

            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Item Values:</span>

                <span>Rs. {grandTotal}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-stone-900 text-sm">
              <span>Grand Total:</span>

              <span className="text-amber-950 font-mono">Rs. {grandTotal}</span>
            </div>

            {/* CHECKOUT BUTTON */}

            <button
              onClick={handleCheckoutSubmit}
              disabled={state.cart.length === 0}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-2.5 text-xs rounded-lg transition tracking-wider uppercase disabled:opacity-40"
            >
              Confirm Order & Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
