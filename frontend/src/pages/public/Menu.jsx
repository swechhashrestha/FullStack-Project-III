import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { menuService, MenuService } from "../../services/MenuService";
import { ProductModel } from "../../models/ProductModel";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [activeCuisine, setActiveCuisine] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      try {
        const rawCatalog = await menuService.getUnifiedCatalog();
        const domainProducts = rawCatalog.map((item) => new ProductModel(item));
        setProducts(domainProducts);
      } catch (error) {
        console.error("Catalog loading failure:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const cuisineCategories = [
    "All",
    "Italian",
    "Asian",
    "American",
    "Mexican",
    "Indian",
    "Pakistani",
  ];

  const filteredProducts = products.filter((product) => product.matchesCuisine(activeCuisine));
  const sortedProducts = MenuService.sortProducts(filteredProducts, sortOrder);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fcfbfa] text-[#4a1c02] font-semibold text-lg animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f8] py-12 px-4 sm:px-6 md:px-8 text-stone-800">
      <div className="mb-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-stone-200/80 pb-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
            Our Offerings
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#4a1c02] tracking-tight mt-1">
            Our crafted menu
          </h1>
          <p className="text-stone-500 text-sm mt-1.5 font-medium">
            Great food is just a click away, delivered hot and fresh to your doorstep.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-stone-200 shadow-xs self-start md:self-auto">
          <label htmlFor="priceSort" className="text-xs font-bold text-stone-600">
            Sort by:
          </label>
          <select
            id="priceSort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap gap-2.5 justify-center bg-stone-100 p-2 rounded-2xl border border-stone-200">
        {cuisineCategories.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setActiveCuisine(cuisine)}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 uppercase ${
              activeCuisine === cuisine
                ? "bg-[#692301] text-white shadow-sm"
                : "text-stone-600 hover:text-[#692301] hover:bg-stone-200/70"
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {sortedProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/menu/${product.id}`, { state: product })}
                className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(105,35,1,0.07)] cursor-pointer transition-all duration-300 flex flex-col group relative"
              >
                {product.isChefSpecial() && (
                  <span className="absolute top-3 left-3 z-10 bg-[#8c2f00] text-amber-50 font-bold text-[9px] px-2.5 py-1 rounded shadow tracking-wider uppercase">
                    Chef Special
                  </span>
                )}

                <div className="h-48 bg-stone-50 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#692301] text-white font-mono text-xs font-black px-2.5 py-1 rounded-lg shadow-sm border border-stone-200/40">
                    {product.getFormattedPrice()}
                  </div>
                  {product.cuisine && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[#692301] text-[10px] font-bold px-2 py-0.5 rounded-md border border-stone-200/40 uppercase tracking-wider">
                      {product.cuisine}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow text-left">
                  <h2 className="text-base font-bold text-stone-900 group-hover:text-[#8c2f00] transition-colors duration-200 line-clamp-1 mb-1">
                    {product.title}
                  </h2>

                  <div className="mt-auto pt-4">
                    <button className="w-full bg-stone-100 group-hover:bg-[#692301] border border-stone-200 group-hover:border-[#692301] text-stone-700 group-hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 flex justify-center items-center gap-1">
                      <span>View Details</span>
                      <BsArrowRightShort
                        size={18}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-stone-400 py-16 bg-white rounded-2xl border border-dashed border-stone-200 max-w-lg mx-auto font-medium text-sm">
            No items found under <span className="text-[#8c2f00] font-bold">"{activeCuisine}"</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;