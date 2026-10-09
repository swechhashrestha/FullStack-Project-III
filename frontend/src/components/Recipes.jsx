import React, { useEffect, useState } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import axios from "axios";
import ReactSlick from "react-slick";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = ReactSlick.default || ReactSlick;

export class RecipeModel {
  constructor(data = {}) {
    this._id = data._id || `dummy-${data.id || ""}`;
    this.title = data.title || data.name || "";
    this.price = data.price || (data.reviewCount ? data.reviewCount * 2 : 350);
    this.cuisine = data.cuisine || "General";
    this.image = data.image || "";
    this.tags = data.tags || [];
    this.isAdminAdded = data.isAdminAdded || false;
    this.description =
      data.description ||
      `A delicious variant of ${this.cuisine} cuisine featuring ingredients like ${
        data.ingredients?.slice(0, 3).join(", ") || "fresh elements"
      }.`;
  }

  matchesSearch(query) {
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      this.title.toLowerCase().includes(q) ||
      this.description.toLowerCase().includes(q)
    );
  }

  matchesCuisine(cuisine) {
    if (cuisine === "All") return true;
    return this.cuisine === cuisine;
  }
}

export class RecipeApiService {
  constructor(baseUrl = "https://dummyjson.com") {
    this.baseUrl = baseUrl;
  }

  async fetchRecipes(limit = 30) {
    const res = await axios.get(`${this.baseUrl}/recipes?limit=${limit}`);
    const rawList = res.data?.recipes || [];
    return rawList.map((item) => new RecipeModel(item));
  }
}

const recipeService = new RecipeApiService();

const Recipes = ({ searchQuery = "" }) => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filterItem, setFilterItem] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [activeCuisine, setActiveCuisine] = useState("All");

  const getRecipes = async () => {
    try {
      const unifiedRecipes = await recipeService.fetchRecipes(30);
      setRecipes(unifiedRecipes);
      setFilterItem(unifiedRecipes);
    } catch (error) {
      console.error("Failed loading carousel recipes data:", error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const matches = recipes.filter((item) => item.matchesSearch(searchQuery));
      setSearchResults(matches);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, recipes]);

  const filterProduct = (cuisine) => {
    setActiveCuisine(cuisine);
    const filtered = recipes.filter((item) => item.matchesCuisine(cuisine));
    setFilterItem(filtered);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-[#fcfbfa] flex flex-col items-center py-16 px-4 md:px-8 gap-y-12">
      {searchQuery.trim() !== "" && (
        <div className="w-full max-w-7xl bg-stone-50 border border-stone-200/60 p-6 sm:p-8 rounded-3xl shadow-sm text-left mb-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="mb-6">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              Search Results
            </span>
            <h2 className="text-2xl font-black text-[#4a1c02] mt-1">
              Showing items for{" "}
              <span className="text-[#8c2f00]">"{searchQuery}"</span>
            </h2>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((recipe) => (
                <div
                  key={`search-${recipe._id}`}
                  onClick={() =>
                    navigate(`/menu/${recipe._id}`, { state: recipe })
                  }
                  className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(105,35,1,0.08)] border border-stone-200/60 overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col"
                >
                  <div className="overflow-hidden bg-stone-100 h-44 relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 text-[#692301] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {recipe.cuisine}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#8c2f00] transition-colors line-clamp-1 mb-3">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 mt-auto">
                      <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                        Price
                      </span>
                      <span className="text-[#692301] font-mono font-black text-sm">
                        Rs. {recipe.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400 font-medium text-sm bg-white rounded-2xl border border-dashed border-stone-200">
              No direct culinary matches found for your query. Try another
              recipe string!
            </div>
          )}

          <hr className="mt-10 border-stone-200" />
        </div>
      )}

      <div className="text-center space-y-3 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#4a1c02] tracking-tight">
          Our{" "}
          <span className="text-[#8c2f00] relative inline-block">
            Most Popular
            <span className="absolute bottom-1 left-0 w-full h-[4px] bg-amber-200 -z-10 rounded"></span>
          </span>{" "}
          Recipes
        </h1>
        <p className="text-stone-500 text-sm md:text-base font-medium">
          Browse through varieties of handcrafted recipes built with rich,
          rustic ingredients.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5 justify-center bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        {["All", "American", "Italian", "Asian"].map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => filterProduct(cuisine)}
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

      <div className="w-full max-w-7xl px-2 md:px-12 homepage-recipe-slider">
        {recipes.length === 0 ? (
          <div className="text-center text-stone-400 text-sm font-medium py-16 bg-white rounded-2xl border border-dashed border-stone-200 max-w-md mx-auto">
            Loading...
          </div>
        ) : (
          <Slider {...settings}>
            {filterItem.map((recipe) => (
              <div key={recipe._id} className="p-3">
                <div
                  onClick={() =>
                    navigate(`/menu/${recipe._id}`, { state: recipe })
                  }
                  className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(105,35,1,0.08)] border border-stone-200/60 overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col h-full"
                >
                  <div className="overflow-hidden bg-stone-100 h-52 relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#692301] text-[10px] font-bold px-2 py-0.5 rounded-md border border-stone-200/40 uppercase tracking-wider">
                      {recipe.cuisine}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow text-left">
                    <h2 className="text-xl font-bold text-stone-900 group-hover:text-[#8c2f00] transition-colors duration-200 mb-1 line-clamp-1">
                      {recipe.title}
                    </h2>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
                      <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider">
                        Price
                      </span>
                      <span className="text-[#692301] font-mono font-black text-base">
                        Rs. {recipe.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      <div className="pt-4">
        <button
          onClick={() => navigate("/menu")}
          className="bg-[#541c01] hover:bg-[#3d1401] text-amber-50 font-bold px-7 py-3.5 flex justify-center items-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm tracking-wide group"
        >
          Explore Food Menu
          <BsArrowRightShort
            size={22}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </section>
  );
};

export default Recipes;