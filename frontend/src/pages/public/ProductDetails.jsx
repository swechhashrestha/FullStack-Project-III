import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartProvider";
import { ProductQuantity } from "../../models/ProductQuantity";
import { ProductModel } from "../../models/ProductModel";
import { ProductRepositoryService, RecommendationEngine } from "../../services/ProductRepositoryService";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);

  const [product, setProduct] = useState(
    location.state ? new ProductModel(location.state) : null
  );
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(new ProductQuantity(1));
  const [knnRecs, setKnnRecs] = useState([]);
  const [contentRecs, setContentRecs] = useState([]);

  useEffect(() => {
    if (product && product.id === id) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const domainProduct = await ProductRepositoryService.fetchProductById(id);
        setProduct(domainProduct);
      } catch (err) {
        console.error("Error reading item:", err);
        setError("Failed to locate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const generateRecommendations = async () => {
      try {
        const { contentRecs, knnRecs } = await RecommendationEngine.getRecommendations(product);
        setContentRecs(contentRecs);
        setKnnRecs(knnRecs);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    generateRecommendations();
  }, [product]);

  const handleQuantityIncrement = () => setQuantity((prev) => prev.increment(1));
  const handleQuantityDecrement = () => setQuantity((prev) => prev.decrement(1));
  const handleInputChange = (e) => setQuantity((prev) => prev.setValue(e.target.value));

  const handleAddMultipleToTray = () => {
    if (!product) return;
    const selectedQty = quantity.getValue();

    dispatch({
      type: "add",
      payload: { ...product, quantity: selectedQty },
    });

    alert(`Added ${selectedQty} x "${product.title}" to your tray!`);
  };

  const handleRecommendationClick = (targetItem) => {
    setProduct(targetItem);
    setQuantity(new ProductQuantity(1));
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/menu/${targetItem.id}`, { state: targetItem });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50 text-amber-900 font-medium">
        Loading details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-stone-500">{error || "Product profile empty."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 text-stone-800 flex flex-col items-center justify-start gap-10">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-stone-100 relative min-h-[300px] md:min-h-[450px]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover absolute inset-0"
          />
          <button
            onClick={() => navigate("/menu")}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white text-stone-800 text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition"
          >
            ← Back
          </button>
        </div>

        <div className="p-6 md:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {product.isChefSpecial() && (
              <span className="inline-block bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-1 rounded-md uppercase">
                Chef Special
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              {product.title}
            </h1>
            <p className="text-xl md:text-2xl font-mono font-black text-amber-900">
              {product.getFormattedPrice()}
            </p>
            <div className="w-12 h-0.5 bg-stone-200 rounded-full" />
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                Description
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
                  Quantity
                </span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
                <button
                  onClick={handleQuantityDecrement}
                  disabled={quantity.isAtMinimum()}
                  className="text-stone-400 font-bold px-1 disabled:opacity-30 disabled:cursor-not-allowed hover:text-stone-700 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity.getValue()}
                  onChange={handleInputChange}
                  className="font-mono text-sm font-bold w-12 text-center bg-transparent border-none focus:outline-none"
                />
                <button
                  onClick={handleQuantityIncrement}
                  disabled={quantity.isAtMaximum()}
                  className="text-stone-400 font-bold px-1 disabled:opacity-30 disabled:cursor-not-allowed hover:text-stone-700 transition"
                >
                  +
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddMultipleToTray}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 text-xs rounded-xl uppercase tracking-wider transition"
              >
                Add To Cart
              </button>
              <button
                onClick={() => {
                  handleAddMultipleToTray();
                  navigate("/cart");
                }}
                className="w-full bg-stone-900 hover:bg-stone-950 text-white font-bold py-3 text-xs rounded-xl uppercase tracking-wider transition"
              >
                Instant Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full space-y-8">
        {contentRecs.length > 0 && (
          <div className="border-t border-stone-200 pt-6">
            <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              Similar Cuisines
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {contentRecs.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => handleRecommendationClick(rec)}
                  className="bg-white border border-stone-200 rounded-2xl p-3 cursor-pointer hover:shadow-md transition group"
                >
                  <div className="h-24 bg-stone-100 rounded-xl overflow-hidden mb-2">
                    <img
                      src={rec.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      alt={rec.title}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800 group-hover:text-indigo-900 transition truncate">
                    {rec.title}
                  </h4>
                  <p className="text-xs font-mono font-bold text-amber-900 mt-0.5">
                    {rec.getFormattedPrice()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {knnRecs.length > 0 && (
          <div className="border-t border-stone-200 pt-6">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-widest mb-4">
              Frequently Looked At Together (Similar Prices)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {knnRecs.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => handleRecommendationClick(rec)}
                  className="bg-white border border-stone-200 rounded-2xl p-3 cursor-pointer hover:shadow-md transition group"
                >
                  <div className="h-24 bg-stone-100 rounded-xl overflow-hidden mb-2">
                    <img
                      src={rec.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      alt={rec.title}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800 group-hover:text-amber-800 transition truncate">
                    {rec.title}
                  </h4>
                  <p className="text-xs font-mono font-bold text-amber-900 mt-0.5">
                    {rec.getFormattedPrice()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;