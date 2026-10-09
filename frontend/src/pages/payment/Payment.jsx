import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";

/* ==========================================
   ESEWA PAYMENT SERVICE
========================================== */

export class EsewaPaymentService {
  constructor(totalAmount = 0, transactionUuid = "") {
    this.totalAmount = String(totalAmount || 0).trim();
    this.transactionUuid = String(transactionUuid || "").trim();

    this.productCode = "EPAYTEST";
    this.secretKey = "8gBm/:&EnhH.1/q";

    this.gatewayUrl =
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
  }

  get isValid() {
    return (
      Boolean(this.transactionUuid) &&
      this.totalAmount !== "0"
    );
  }

  generateSignature() {
    const message =
      `total_amount=${this.totalAmount},transaction_uuid=${this.transactionUuid},product_code=${this.productCode}`;

    const hash = CryptoJS.HmacSHA256(
      message,
      this.secretKey
    );

    return CryptoJS.enc.Base64.stringify(hash);
  }

  getFormPayload(
    baseUrl = import.meta.env.VITE_API_URL
  ) {
    return {
      amount: this.totalAmount,
      tax_amount: "0",
      total_amount: this.totalAmount,
      transaction_uuid: this.transactionUuid,
      product_code: this.productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",

      success_url:
        `${baseUrl}/api/orders/success`,

      failure_url:
        `${baseUrl}/api/orders/failure`,

      signed_field_names:
        "total_amount,transaction_uuid,product_code",

      signature: this.generateSignature(),
    };
  }
}

/* ==========================================
   PAYMENT COMPONENT
========================================== */

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const totalAmount =
    location.state?.totalAmount;

  const orderId =
    location.state?.newOrderId;

  const paymentService =
    new EsewaPaymentService(
      totalAmount,
      orderId
    );

  /* ==========================================
     CASH ON DELIVERY
  ========================================== */

  const handleCashOnDelivery = async () => {
    if (!paymentService.isValid) {
      alert("Invalid order information.");
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cod`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      navigate(`/success/${orderId}`, {
        state: {
          paymentMethod: "Cash on Delivery",
        },
      });
    } catch (error) {
      console.error(
        "COD confirmation error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to confirm COD order."
      );
    }
  };

  /* ==========================================
     INVALID ORDER
  ========================================== */

  if (!paymentService.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white rounded-xl shadow-md p-5 text-center">

          <h2 className="text-lg font-bold text-gray-800">
            Invalid Order
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Order information is missing.
          </p>

          <button
            onClick={() => navigate("/cart")}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-xs font-semibold transition"
          >
            Back to Cart
          </button>

        </div>
      </div>
    );
  }

  const payload =
    paymentService.getFormPayload();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-sm">

        {/* BACK BUTTON */}

        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-orange-500 mb-2 transition"
        >
          <FaArrowLeft size={9} />
          Back to Cart
        </button>

        {/* MAIN CARD */}

        <div className="bg-white rounded-xl shadow-md p-5">

          {/* HEADER */}

          <div className="text-center">

            <h1 className="text-xl font-bold text-gray-800">
              Payment
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Choose your payment method
            </p>

          </div>

          {/* TOTAL */}

          <div className="bg-orange-50 rounded-lg p-3 mt-4 text-center">

            <p className="text-[10px] text-gray-500">
              Total Amount
            </p>

            <p className="text-xl font-bold text-orange-500 mt-0.5">
              Rs. {totalAmount}
            </p>

          </div>

          {/* ESEWA */}

          <div className="mt-4">

            <p className="text-xs font-semibold text-gray-700 mb-2">
              Online Payment
            </p>

            <form
              action={paymentService.gatewayUrl}
              method="POST"
            >
              {Object.entries(payload).map(
                ([key, value]) => (
                  <input
                    key={key}
                    type="hidden"
                    name={key}
                    value={value}
                  />
                )
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-xs font-semibold transition"
              >
                <FaWallet size={13} />
                Pay with eSewa
              </button>
            </form>

          </div>

          {/* OR */}

          <div className="flex items-center gap-3 my-3">

            <div className="h-px bg-gray-200 flex-1" />

            <span className="text-[10px] text-gray-400">
              OR
            </span>

            <div className="h-px bg-gray-200 flex-1" />

          </div>

          {/* CASH ON DELIVERY */}

          <div>

            <p className="text-xs font-semibold text-gray-700 mb-2">
              Other Payment
            </p>

            <button
              onClick={handleCashOnDelivery}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-xs font-semibold transition"
            >
              <FaMoneyBillWave size={13} />
              Cash on Delivery
            </button>

          </div>

          {/* ORDER ID */}

          <p className="text-[9px] text-center text-gray-400 mt-4 break-all">
            Order ID: {orderId}
          </p>

        </div>
      </div>
    </div>
  );
};

export default Payment;