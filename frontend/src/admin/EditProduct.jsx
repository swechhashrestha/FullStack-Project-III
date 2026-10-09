import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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

  toFormData() {
    if (!this.isValidPrice()) {
      throw new Error("Price must be at least 1 NPR.");
    }

    const formData = new FormData();
    formData.append("title", this.title);
    formData.append("price", this.price);
    formData.append("cuisine", this.cuisine);
    formData.append("description", this.description);
    if (this.image) {
      formData.append("image", this.image);
    }
    return formData;
  }

  static initial() {
    return new ProductModel();
  }
}

export class ProductApiService {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchProduct(id) {
    const res = await axios.get(`${this.baseUrl}/api/products/${id}`, {
      withCredentials: true,
    });
    return res.data.product;
  }

  async updateProduct(id, productModelInstance) {
    const instance = productModelInstance instanceof ProductModel
      ? productModelInstance
      : new ProductModel(productModelInstance);

    const payload = instance.toFormData();
    const res = await axios.patch(
      `${this.baseUrl}/api/products/${id}`,
      payload,
      { withCredentials: true }
    );
    return res.data;
  }
}

const productService = new ProductApiService();

const EditProduct = () => {
  const location = useLocation();
  const id = location?.state;
  const navigate = useNavigate();

  const [formModel, setFormModel] = useState(() => ProductModel.initial());

  const cuisineOptions = [
    "American",
    "Italian",
    "Asian",
    "Indian",
    "Pakistani",
    "Mexican",
  ];

  const handleInputChange = (field, value) => {
    setFormModel((prev) => new ProductModel({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!id) {
      navigate("/admin/product-management");
      return;
    }

    productService
      .fetchProduct(id)
      .then((data) => {
        setFormModel(
          new ProductModel({
            title: data.title,
            price: data.price,
            cuisine: data.cuisine || "American",
            description: data.description,
          })
        );
      })
      .catch((err) => console.error("Failed to fetch product", err));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const modelInstance = formModel instanceof ProductModel
        ? formModel
        : new ProductModel(formModel);

      if (!modelInstance.isValidPrice()) {
        alert("Please enter a valid price (minimum 1 NPR)");
        return;
      }

      const resData = await productService.updateProduct(id, modelInstance);
      alert(resData.message || "Product saved successfully");
      navigate("/admin/product-management");
    } catch (error) {
      console.error("Failed:", error.message || error.response?.data);
      alert(error.message || error.response?.data?.message || "Failed to submit product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-2xl shadow border border-stone-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-950">
          Edit Product
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-stone-700">
            Product Title
          </label>
          <input
            type="text"
            value={formModel.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
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
              value={formModel.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-stone-700">
              Cuisine
            </label>
            <select
              value={formModel.cuisine}
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
            value={formModel.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
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
                Click to replace image or drag & drop
              </span>
              <span className="text-xs text-stone-400 mt-1">
                PNG, JPG, JPEG up to 5MB
              </span>
            </label>
          </div>

          {formModel.image && (
            <div className="mt-4 flex justify-center">
              <img
                src={
                  typeof formModel.image === "string"
                    ? formModel.image
                    : URL.createObjectURL(formModel.image)
                }
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-stone-200 shadow-sm"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-amber-800 text-white py-2.5 rounded-lg hover:bg-amber-900 transition-colors font-medium text-sm shadow-sm uppercase tracking-wider"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;