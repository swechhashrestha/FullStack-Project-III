import React from "react";
import { NavLink } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1f0b00] text-stone-400 py-10 border-t border-[#541c01]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-y-6 text-center">
        
        <div className="flex items-center gap-2">
          <div className="bg-[#692301] p-1.5 rounded-lg text-amber-50">
            <UtensilsCrossed size={16} />
          </div>
          <span className="text-lg font-black text-white tracking-tight">
            Yummy<span className="text-amber-600">Station</span>
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium">
          <NavLink to="/" className="hover:text-white transition-colors">Home</NavLink>
          <NavLink to="/menu" className="hover:text-white transition-colors">Menu</NavLink>
          <NavLink to="/cart" className="hover:text-white transition-colors">Cart</NavLink>
        </div>

        <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-800/60 w-full max-w-md">
          © {currentYear} YummyStation. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;