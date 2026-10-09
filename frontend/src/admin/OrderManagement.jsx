import React, { useEffect, useState } from "react";
import axios from "axios";

export class OrderEntity {
  constructor(order = {}) {
    this.id = order._id || "";
    this.userName = order.user_id?.fullName || "Guest Account";
    this.products = order.products || [];
    this.paymentStatus = order.paymentStatus || "Pending";
  }

  getStatusBadgeStyle() {
    switch (this.paymentStatus.toLowerCase()) {
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-stone-100 text-stone-600";
    }
  }

  get formattedShortId() {
    return `#${this.id.slice(-6).toUpperCase()}`;
  }
}

export class OrderApiService {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchOrders() {
    const res = await axios.get(`${this.baseUrl}/api/orders/`, {
      withCredentials: true,
    });
    const rawOrders = res.data.orders || [];
    return rawOrders.map((raw) => new OrderEntity(raw));
  }
}

const orderService = new OrderApiService();

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .fetchOrders()
      .then((orderInstances) => setOrders(orderInstances))
      .catch((err) => console.error("Failed to fetch orders", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-amber-900 font-medium">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-950">Order Management</h1>
        <p className="text-stone-500 text-sm mt-1">
          Manage and track all customer orders
        </p>
      </div>

      <div className="bg-white rounded-xl shadow border border-stone-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-100 text-amber-950 text-sm uppercase">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Products</th>
              <th className="p-4">Payment Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-stone-100 hover:bg-stone-50/50 transition"
                >
                  <td className="p-4 text-sm font-mono text-stone-600">
                    {order.formattedShortId}
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-stone-800">
                      {order.userName}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {order.products.map((item, i) => (
                        <div
                          key={i}
                          className="text-sm text-stone-600 flex justify-between gap-4 max-w-xs"
                        >
                          <span className="truncate font-medium">
                            {item.product_id?.title || "Dish"}
                          </span>
                          <span className="text-stone-400 shrink-0 text-xs">
                            {item.quantity} items
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${order.getStatusBadgeStyle()}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-stone-400 font-medium">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;