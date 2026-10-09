import axios from "axios";
import { ProductModel } from "../models/ProductModel";

export class ProductRepositoryService {
  static async fetchProductById(id) {
    if (String(id).startsWith("dummy-")) {
      const rawId = id.split("-")[1];
      const res = await fetch(`https://dummyjson.com/recipes/${rawId}`);
      if (!res.ok) throw new Error("API Offline");
      const recipe = await res.json();

      return new ProductModel({
        _id: `dummy-${recipe.id}`,
        title: recipe.name,
        price: recipe.reviewCount * 2 || 350,
        description: `A delicious variant of ${recipe.cuisine} cuisine featuring ingredients like ${recipe.ingredients?.slice(0, 3).join(", ")}.`,
        image: recipe.image,
        cuisine: recipe.cuisine,
        tags: recipe.tags || [],
        isAdminAdded: false,
      });
    }

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`
    );
    return new ProductModel(res.data.product || res.data);
  }
}

export class RecommendationEngine {
  static async getRecommendations(product) {
    if (product.isDummyProduct()) {
      return RecommendationEngine.getDummyRecommendations(product);
    }
    return RecommendationEngine.getBackendRecommendations(product.id);
  }

  static async getDummyRecommendations(currentProduct) {
    const res = await fetch("https://dummyjson.com/recipes?limit=30");
    if (!res.ok) return { contentRecs: [], knnRecs: [] };

    const data = await res.json();
    const catalog = data.recipes
      .map(
        (recipe) =>
          new ProductModel({
            _id: `dummy-${recipe.id}`,
            title: recipe.name,
            price: recipe.reviewCount * 2 || 350,
            description: `A delicious variant of ${recipe.cuisine} cuisine.`,
            image: recipe.image,
            cuisine: recipe.cuisine,
            tags: recipe.tags || [],
            isAdminAdded: false,
          })
      )
      .filter((item) => String(item.id) !== String(currentProduct.id));

    const contentRecs = catalog
      .map((item) => ({ item, score: item.computeSimilarityScore(currentProduct) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((entry) => entry.item);

    const knnRecs = catalog
      .map((item) => ({ item, distance: item.computePriceDistance(currentProduct) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .map((entry) => entry.item);

    return { contentRecs, knnRecs };
  }

  static async getBackendRecommendations(productId) {
    const [contentRes, knnRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/recommendations/content/${productId}`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/recommendations/collaborative/knn?productId=${productId}`)
    ]);

    return {
      contentRecs: (contentRes.data || []).map((data) => new ProductModel(data)),
      knnRecs: (knnRes.data || []).map((data) => new ProductModel(data)),
    };
  }
}