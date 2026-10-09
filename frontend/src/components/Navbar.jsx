import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { CartContext } from "../context/CartProvider";
import { UtensilsCrossed, LogOut } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const { user, isAuth, setUser, setIsAuth } = useContext(AuthContext);
  const { state, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const baseStyle = "px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 uppercase";
  const activeStyle = "bg-[#692301] text-amber-50 shadow-sm";
  const inactiveStyle = "text-stone-600 hover:text-[#692301] hover:bg-stone-100";

  const handleLogout = async () => {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/users/logout`,
        {},
        { withCredentials: true },
      );

      setUser(null);
      setIsAuth(false);
      dispatch({ type: "clear_cart" });
      navigate("/");
      alert(res.data.message);
    } catch (error) {
      console.log("Failed to logout user", error);
    }
  };

  return (
    <nav className="bg-mauve-200 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/60 shadow-[0_2px_10px_rgba(105,35,1,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-20">
          
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="bg-[#692301] p-2 rounded-xl text-amber-50 transition-transform group-hover:rotate-12 duration-300">
              <UtensilsCrossed size={18} />
            </div>
            <span className="text-xl font-black text-[#4a1c02] tracking-tight">
              Yummy<span className="text-[#8c2f00]">Station</span>
            </span>
          </NavLink>

          <div className="flex items-center space-x-1.5">
            <NavLink
              to="/"
              className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/menu"
              className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
            >
              Menu
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle} flex items-center gap-2`}
            >
              Cart
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
            >
              Contact
            </NavLink>

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
              >
                Admin
              </NavLink>
            )}

            <div className="w-px h-5 bg-stone-400/80 mx-2" />

            {user && isAuth ? (
              <button
                className="bg-stone-900 hover:bg-[#692301] text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-all duration-200 active:scale-95"
                onClick={handleLogout}
              >
                <span>Logout</span>
                <LogOut size={13} />
              </button>
            ) : (
              <div className="flex items-center space-x-1.5">
                <NavLink
                  to="/login"
                  className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-[#541c01] hover:bg-[#3d1401] text-amber-50 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition shadow-xs"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;