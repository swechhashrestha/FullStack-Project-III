import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaReceipt,
  FaShoppingBag,
  FaArrowRight,
  FaMoneyBillWave,
} from "react-icons/fa";

export class CatalogRepository {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchLocalProducts() {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/products/`
      );

      return res.data.products || res.data || [];
    } catch (err) {
      console.log(
        "Error fetching local products catalog:",
        err
      );
      return [];
    }
  }

  async fetchDummyProducts() {
    try {
      const response = await fetch(
        "https://dummyjson.com/recipes?limit=50"
      );

      if (response.ok) {
        const data = await response.json();

        return data.recipes.map((recipe) => ({
          _id: `dummy-${recipe.id}`,
          title: recipe.name,
          price: recipe.reviewCount * 2 || 350,
        }));
      }
    } catch (err) {
      console.log(
        "Failed to fetch dummy products:",
        err
      );
    }

    return [];
  }

  async buildMasterCatalogMap() {
    const [localItems, dummyItems] =
      await Promise.all([
        this.fetchLocalProducts(),
        this.fetchDummyProducts(),
      ]);

    const catalogMap = {};

    [...localItems, ...dummyItems].forEach(
      (item) => {
        if (item._id) {
          catalogMap[String(item._id)] = item;
        }
      }
    );

    return catalogMap;
  }
}

export class OrderReceiptCalculator {
  constructor(order = null, catalog = {}) {
    this.order = order;
    this.catalog = catalog;
  }

  getProductDetails(productId) {
    return this.catalog[String(productId)] || {};
  }

  getItemTotal(productId, quantity) {
    const details =
      this.getProductDetails(productId);

    const price = Number(details.price || 0);

    return price * quantity;
  }

  calculateGrandTotal() {
    if (!this.order?.products) {
      return 0;
    }

    return this.order.products.reduce(
      (acc, item) =>
        acc +
        this.getItemTotal(
          item.product_id,
          item.quantity
        ),
      0
    );
  }
}

const catalogRepo = new CatalogRepository();

const Success = () => {
  const [order, setOrder] = useState(null);
  const [catalog, setCatalog] = useState({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const location = useLocation();

  const paymentMethod =
    location.state?.paymentMethod ||
    order?.paymentMethod ||
    "eSewa";

  const isCOD =
    paymentMethod === "Cash on Delivery";

  const fetchCatalogAndOrder = async () => {
    try {
      setLoading(true);

      const catalogMap =
        await catalogRepo.buildMasterCatalogMap();

      setCatalog(catalogMap);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setOrder(res.data.order);
    } catch (error) {
      console.log(
        "Failed to build receipt:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCatalogAndOrder();
    }
  }, [id]);

  const receiptCalc =
    new OrderReceiptCalculator(
      order,
      catalog
    );

  const grandTotal =
    receiptCalc.calculateGrandTotal();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-orange-500 mx-auto mb-2" />

          <p className="text-[11px] text-gray-600">
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-md p-5 text-center max-w-sm">

          <FaReceipt className="text-2xl text-gray-400 mx-auto mb-2" />

          <h2 className="text-base font-bold text-gray-800 mb-1">
            Order Not Found
          </h2>

          <p className="text-[11px] text-gray-500 mb-3">
            We could not find the order details.
          </p>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 transition text-[11px] font-semibold"
          >
            Continue Shopping
            <FaArrowRight size={9} />
          </Link>

        </div>
      </div>
    );
  }

  const pageTitle = isCOD
    ? "Order Confirmed"
    : "Payment Complete";

  const pageMessage = isCOD
    ? "Your order has been placed successfully."
    : "Your payment has been successfully processed.";

  const statusText = isCOD
    ? "CASH ON DELIVERY"
    : order?.paymentStatus || "PAID";

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-3">

      <div className="max-w-lg mx-auto">

        <div className="bg-white rounded-lg shadow-md overflow-hidden">

          <div className="text-center px-4 py-3">

            <div className="flex justify-center mb-1.5">
              {isCOD ? (
                <FaMoneyBillWave
                  className="text-4xl text-green-500"
                />
              ) : (
                <FaCheckCircle
                  className="text-4xl text-green-500"
                />
              )}
            </div>

            <h1 className="text-lg font-bold text-gray-800">
              {pageTitle}
            </h1>

            <p className="text-[11px] text-gray-500 mt-0.5">
              {pageMessage}
            </p>

          </div>

          <div className="border-t border-gray-200 px-4 py-2.5">

            <div className="grid grid-cols-2 gap-2">

              <div className="bg-gray-50 rounded-md p-2">

                <p className="text-[10px] text-gray-500 mb-0.5">
                  Payment Status
                </p>

                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-semibold ${
                    isCOD
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {statusText}
                </span>

              </div>

              <div className="bg-gray-50 rounded-md p-2">

                <p className="text-[10px] text-gray-500 mb-0.5">
                  Payment Method
                </p>

                <p className="text-[11px] font-semibold text-gray-800">
                  {paymentMethod}
                </p>

              </div>

            </div>

            <div className="mt-2 bg-gray-50 rounded-md p-2">

              <p className="text-[10px] text-gray-500 mb-0.5">
                Order Reference ID
              </p>

              <p className="font-mono text-[10px] text-gray-800 break-all">
                {order?._id || id}
              </p>

            </div>

          </div>

          {/* ORDERED ITEMS */}
          <div className="border-t border-gray-200 px-4 py-2.5">

            <div className="flex items-center gap-1.5 mb-2">

              <FaShoppingBag
                className="text-orange-500"
                size={11}
              />

              <h2 className="text-xs font-bold text-gray-800">
                Ordered Items
              </h2>

            </div>

            <div className="space-y-1.5">

              {order?.products?.map(
                (item, index) => {

                  const product =
                    receiptCalc.getProductDetails(
                      item.product_id
                    );

                  const itemTotal =
                    receiptCalc.getItemTotal(
                      item.product_id,
                      item.quantity
                    );

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-100 pb-1.5 last:border-0 last:pb-0"
                    >

                      <div>
                        <h3 className="text-[11px] font-semibold text-gray-800">
                          {product.title ||
                            product.name ||
                            "Food Item"}
                        </h3>

                        <p className="text-[9px] text-gray-500 mt-0.5">
                          Rs. {product.price || 0} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="text-[11px] font-semibold text-gray-800">
                        Rs. {itemTotal}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* TOTAL */}
          <div className="border-t border-gray-200 px-4 py-2.5">

            <div className="flex items-center justify-between">

              <span className="text-xs font-bold text-gray-800">
                {isCOD
                  ? "Total Amount"
                  : "Total Charged"}
              </span>

              <span className="text-base font-bold text-orange-500">
                Rs. {grandTotal}
              </span>

            </div>

            {isCOD && (
              <p className="text-[9px] text-gray-500 text-right mt-0.5">
                Please pay when your order is delivered.
              </p>
            )}

          </div>

          {/* BUTTON */}
          <div className="border-t border-gray-200 px-4 py-2.5 text-center">

            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 bg-orange-500 text-white px-5 py-2 rounded-md text-[11px] font-semibold hover:bg-orange-600 transition"
            >
              Continue Shopping
              <FaArrowRight size={9} />
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Success;