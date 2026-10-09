import React from "react";
import { Search, MapPin, Sparkles } from "lucide-react";

export default function Hero({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  location = "Bhaktapur, Nepal",
}) {
  return (
    <header className="relative min-h-[540px] md:min-h-[580px] flex items-center text-white py-20 px-4 sm:px-12 lg:px-24 overflow-hidden bg-stone-900">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
          alt="Rustic Culinary Backdrop"
          className="w-full h-full object-cover object-center opacity-150 scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#210c02]/85 via-[#3b1503]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120600] via-transparent to-transparent opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 w-fit px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase mb-6 text-amber-200">
          <MapPin size={14} className="text-amber-500" />
          <span>
            Delivering to:{" "}
            <strong className="text-white ml-1 font-extrabold">
              {location}
            </strong>
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 max-w-3xl leading-[1.15] text-stone-50">
          Craving satisfied, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-700 relative">
            decided by intelligence.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-stone-300 font-medium max-w-xl mb-10 leading-relaxed">
          Discover handpicked local flavors tailored exactly to your current
          mood and past cravings using our smart system.
        </p>

        <form
          onSubmit={onSearchSubmit}
          className="flex flex-col sm:flex-row gap-2.5 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-[0_20px_50px_rgba(33,12,2,0.3)] max-w-2xl text-stone-800 border border-white/20"
        >
          <div className="flex items-center gap-3 px-3 py-2.5 flex-grow border-b sm:border-b-0 sm:border-r border-stone-200/80">
            <Search className="text-stone-400 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search food, cuisines, or recipes..."
              className="w-full focus:outline-none bg-transparent placeholder-stone-400 text-sm font-medium text-stone-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-[#692301] hover:bg-[#4a1c02] text-amber-50 font-bold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 text-xs uppercase tracking-wider shrink-0 group"
          >
            <Sparkles
              size={14}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>Find Food</span>
          </button>
        </form>
      </div>

      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#692301]/20 rounded-full blur-3xl pointer-events-none" />
    </header>
  );
}
