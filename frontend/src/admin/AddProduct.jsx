import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export class ProductModel {
  constructor(data = {}) {
    this.title = data.title || "";
    this.price = data.price || "";
    this.cuisine = data.cuisine || "American";
    this.description = data.description || "";
    this.image = data.image || null;
  }

  isValidPrice() {
    const numPrice = Number(this.price);
    return !isNaN(numPrice) && numPrice >= 1;
  }
  validate() {
    if (!this.title.trim()) throw new Error("Title is required.");
    if (!this.isValidPrice()) throw new Error("Price must be at least 1 NPR.");
    if (!this.description.trim()) throw new Error("Description is required.");
    if (!this.image) throw new Error("Please select a product image.");
  }
  toFormData() {
    this.validate();

    const formData = new FormData();
    formData.append("title", this.title);
    formData.append("price", this.price);
    formData.append("cuisine", this.cuisine);
    formData.append("description", this.description);
    formData.append("image", this.image);
    return formData;
  }

  static initial() {
    return new ProductModel();
  }
}

export class AddProductApiService {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async createProduct(productModelInstance) {
    const instance =
      productModelInstance instanceof ProductModel
        ? productModelInstance
        : new ProductModel(productModelInstance);

    const payload = instance.toFormData();

    const res = await axios.post(`${this.baseUrl}/api/products`, payload, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }
}

const productService = new AddProductApiService();

const AddProduct = () => {
  const navigate = useNavigate();

  const [productForm, setProductForm] = useState(() => ProductModel.initial());
  const [loading, setLoading] = useState(false);

  const cuisineOptions = [
    "American",
    "Italian",
    "Asian",
    "Indian",
    "Pakistani",
    "Mexican",
  ];

  const handleInputChange = (field, value) => {
    setProductForm((prev) => new ProductModel({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const modelInstance =
      productForm instanceof ProductModel
        ? productForm
        : new ProductModel(productForm);

    try {
      setLoading(true);
      const resData = await productService.createProduct(modelInstance);
      alert(resData.message || "Product created successfully!");
      setProductForm(ProductModel.initial());
      navigate("/admin/product-management");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert(
        error.message ||
          error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-2xl shadow border border-stone-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-950">
          Add New Product
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-stone-700">
            Product Title
          </label>
          <input
            type="text"
            value={productForm.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g. Double Cheese Burger"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-stone-700">
              Price (NPR)
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={productForm.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="e.g. 450"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-stone-700">
              Cuisine
            </label>
            <select
              value={productForm.cuisine}
              onChange={(e) => handleInputChange("cuisine", e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm font-medium cursor-pointer"
              required
            >
              {cuisineOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-stone-700">
            Description
          </label>
          <textarea
            value={productForm.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the taste, ingredients, or serving size..."
            rows="4"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-stone-700">
            Product Image
          </label>

          <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-800 transition bg-stone-50/50 relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange("image", e.target.files[0])}
              className="hidden"
              id="imageUpload"
            />

            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-stone-600 font-medium text-sm">
                Click to upload image or drag & drop
              </span>
              <span className="text-xs text-stone-400 mt-1">
                PNG, JPG, JPEG up to 5MB
              </span>
            </label>
          </div>

          {productForm.image && (
            <div className="mt-4 flex justify-center">
              <img
                src={URL.createObjectURL(productForm.image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-stone-200 shadow-sm"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-800 text-white py-2.5 rounded-lg hover:bg-amber-900 transition-colors font-medium text-sm shadow-sm uppercase tracking-wider disabled:opacity-50"
        >
          {loading ? "Creating Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;