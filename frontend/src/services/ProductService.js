import axios from "axios";

export class ProductFormData {
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
    return new ProductFormData({
      title: "",
      price: "",
      cuisine: "American",
      description: "",
      image: null,
    });
  }
}

export class ProductApiService {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async createProduct(productDataInstance) {
    const payload = productDataInstance.toFormData();

    const response = await axios.post(
      `${this.baseUrl}/api/products/`,
      payload,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
}