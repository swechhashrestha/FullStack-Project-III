import axios from "axios";
import { ProductModel } from "../models/ProductModel";

export class MenuService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl || import.meta.env.VITE_API_URL;
  }

  async fetchLocalProducts() {
    try {
      const response = await axios.get(`${this.apiUrl}/api/products/`);
      const extracted = response.data.products || response.data || [];
      return extracted.map(
        (item) => new ProductModel({ ...item, isAdminAdded: true })
      );
    } catch (err) {
      console.error("Error fetching local products:", err);
      return [];
    }
  }

  async fetchDummyRecipes(limit = 50) {
    try {
      const response = await fetch(
        `https://dummyjson.com/recipes?limit=${limit}`
      );
      if (!response.ok) return [];

      const data = await response.json();

      const mapCuisine = (rawCuisine, name) => {
        if (rawCuisine) return rawCuisine;
        const lowerName = name.toLowerCase();
        if (lowerName.includes("biryani") || lowerName.includes("karahi") || lowerName.includes("tikka")) return "Pakistani";
        if (lowerName.includes("curry") || lowerName.includes("paneer") || lowerName.includes("masala")) return "Indian";
        if (lowerName.includes("taco") || lowerName.includes("burrito")) return "Mexican";
        if (lowerName.includes("burger") || lowerName.includes("fries")) return "American";
        if (lowerName.includes("pasta") || lowerName.includes("pizza")) return "Italian";
        if (lowerName.includes("ramen") || lowerName.includes("noodle")) return "Asian";
        return "American";
      };

      return (data.recipes || []).map(
        (recipe) =>
          new ProductModel({
            _id: `dummy-${recipe.id}`,
            title: recipe.name,
            price: recipe.reviewCount * 2 || 350,
            description: `A delicious variant of ${recipe.cuisine || "house"} cuisine featuring ingredients like ${recipe.ingredients?.slice(0, 3).join(", ")}.`,
            image: recipe.image,
            cuisine: mapCuisine(recipe.cuisine, recipe.name),
            tags: recipe.tags || [],
            isAdminAdded: false,
            createdAt: new Date(0),
          })
      );
    } catch (err) {
      console.error("Failed to fetch dummy fallback profiles:", err);
      return [];
    }
  }

  async getUnifiedCatalog() {
    const [localItems, dummyItems] = await Promise.all([
      this.fetchLocalProducts(),
      this.fetchDummyRecipes(),
    ]);

    const combined = [...localItems, ...dummyItems];

    return combined.sort((a, b) => {
      if (a.isAdminAdded && !b.isAdminAdded) return -1;
      if (!a.isAdminAdded && b.isAdminAdded) return 1;
      return String(b.id).localeCompare(String(a.id));
    });
  }

  static sortProducts(products, sortOrder) {
    const catalogCopy = [...products];

    if (sortOrder === "lowToHigh") {
      return catalogCopy.sort((a, b) => a.price - b.price);
    }
    if (sortOrder === "highToLow") {
      return catalogCopy.sort((a, b) => b.price - a.price);
    }

    return catalogCopy;
  }
}

export const menuService = new MenuService();