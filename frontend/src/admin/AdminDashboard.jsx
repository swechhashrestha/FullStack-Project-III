import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaUtensils, FaUsers, FaClipboardList, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

export class NavigationController {
  constructor(currentPath) {
    this.currentPath = currentPath;
  }

  isRouteActive(targetPath) {
    if (targetPath === "user-management") {
      return this.currentPath.includes("user-management") || this.currentPath === "/admin";
    }
    if (targetPath === "product-management") {
      return this.currentPath.includes("product-management") || this.currentPath.includes("product");
    }
    return this.currentPath.includes(targetPath);
  }

  getNavClass(targetPath) {
    const active = this.isRouteActive(targetPath);
    const base = "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition duration-200";
    return active
      ? `${base} bg-amber-800 text-white shadow-md shadow-amber-950/60`
      : `${base} text-amber-200/60 hover:bg-amber-900/40 hover:text-white`;
  }
}

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navController = new NavigationController(location.pathname);

  return (
    <div className="min-h-screen bg-stone-100/60 flex flex-col md:flex-row font-sans antialiased">
      <aside className="w-full md:w-64 bg-amber-950 text-white flex flex-col shadow-xl shrink-0">
        <div className="p-6 border-b border-amber-900/40 flex items-center gap-3 bg-amber-950">
          <div className="bg-amber-900/60 p-2 rounded-lg text-amber-300">
            <FaShieldAlt size={18} />
          </div>
          <div>
            <div
              className="flex justify-start items-center w-42 py-4 hover:cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="font-extrabold text-lg tracking-wide block text-stone-100">
                YummyStation
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          <Link
            to="/admin/user-management"
            className={navController.getNavClass("user-management")}
          >
            <FaUsers size={16} /> Manage Users
          </Link>

          <Link
            to="/admin/product-management"
            className={navController.getNavClass("product-management")}
          >
            <FaUtensils size={16} /> Manage Products
          </Link>

          <Link
            to="/admin/order-management"
            className={navController.getNavClass("order-management")}
          >
            <FaClipboardList size={16} /> Manage Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-amber-900/40 bg-amber-950/50">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-amber-900 text-xs font-bold text-amber-300/80 hover:bg-amber-900 hover:text-white transition duration-150"
          >
            <FaSignOutAlt size={12} /> Exit Panel
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6 min-h-[80vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;