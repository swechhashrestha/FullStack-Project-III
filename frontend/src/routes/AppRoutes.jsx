import React, { useContext } from "react";
import Login from "../pages/auth/Login";
import Home from "../pages/public/Home";
import PublicLayout from "../layout/PublicLayout";
import Register from "../pages/auth/Register";
import Menu from "../pages/public/Menu";
import Contact from "../pages/public/Contact";
import About from "../pages/public/About";
import ProductDetails from "../pages/public/ProductDetails";
import Protected from "../components/Protected";
import Cart from "../pages/cart/Cart";
import Payment from "../pages/payment/Payment";
import Success from "../pages/payment/Success";
import NotFound from "../pages/public/NotFound";
import { Route, Routes } from "react-router-dom";
import OrderManagement from "../admin/OrderManagement";
import ProductManagement from "../admin/ProductManagement";
import UserManagement from "../admin/UserManagement";
import AdminDashboard from "../admin/AdminDashboard";
import AddUser from "../admin/AddUser";
import EditUser from "../admin/EditUser";
import AddProduct from "../admin/AddProduct";
import EditProduct from "../admin/EditProduct";
import { AuthContext } from "../context/AuthProvider";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="menu" element={<Menu />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="menu/:id" element={<ProductDetails />} />

          <Route
            path="cart"
            element={
              <Protected>
                <Cart />
              </Protected>
            }
          />

          {/* Absolute /payment can now resolve accurately under this layout tree */}
          <Route
            path="payment"
            element={
              <Protected>
                <Payment />
              </Protected>
            }
          />
          <Route path="success/:id" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {user?.role === "admin" && (
          <Route path="admin" element={<AdminDashboard />}>
            <Route index element={<UserManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="edit-user" element={<EditUser />} />

            <Route path="product-management" element={<ProductManagement />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="edit-product" element={<EditProduct />} />

            <Route path="order-management" element={<OrderManagement />} />
          </Route>
        )}
      </Routes>
    </div>
  );
};

export default AppRoutes;
