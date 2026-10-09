import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/`,
        { withCredentials: true }
      );
      setProducts(res.data.products || []);
    } catch (error) {
      console.log("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        withCredentials: true,
      });
      getProducts();
      alert(res.data?.message || "Product deleted successfully");
    } catch (error) {
      console.log("Failed to delete product", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 font-medium text-amber-900">Loading products...</p>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-amber-950">Product Management</h1>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto border border-stone-200">
        <table className="w-full text-left">
          <thead className="bg-stone-100 text-amber-950 text-sm uppercase">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-stone-100 hover:bg-stone-50/50 transition"
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded border border-stone-200"
                    />
                  </td>

                  <td className="p-4 font-medium text-stone-800">
                    {product.title}
                  </td>

                  <td className="p-4 text-amber-800 font-semibold">
                    Rs. {product.price}
                  </td>

                  <td className="p-4 text-stone-600">
                    {product.description?.slice(0, 60)}...
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() =>
                          navigate("/admin/edit-product", {
                            state: product._id,
                          })
                        }
                        className="text-amber-700 hover:text-amber-900 font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-stone-400 font-medium"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;