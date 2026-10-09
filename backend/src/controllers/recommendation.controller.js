const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

class ContentScorer {
  constructor(targetItem) {
    this.targetItem = targetItem;
  }

  calculateScore(candidateItem) {
    let score = 0;

    if (
      candidateItem.cuisine === this.targetItem.cuisine ||
      candidateItem.category === this.targetItem.category
    ) {
      score += 5;
    }

    if (candidateItem.tags && this.targetItem.tags) {
      const matchingTags = candidateItem.tags.filter((tag) =>
        this.targetItem.tags.includes(tag)
      );
      score += matchingTags.length * 2;
    }

    return score;
  }

  filterAndRank(catalogItems, limit = 3) {
    return catalogItems
      .map((item) => ({
        item,
        score: this.calculateScore(item),
      }))
      .filter((candidate) => candidate.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((candidate) => candidate.item);
  }
}


class DistanceCalculator {
  constructor(targetProduct) {
    this.targetProduct = targetProduct;
  }

  computePriceDistance(candidateProduct) {
    return Math.abs((candidateProduct.price || 0) - (this.targetProduct.price || 0));
  }

  findNearestNeighbors(allProducts, k = 4) {
    return allProducts
      .map((product) => ({
        product,
        score: this.computePriceDistance(product),
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, k)
      .map((entry) => entry.product);
  }
}


class RecommendationController {
  async getContentRecommendations(req, res) {
    try {
      const { productId } = req.params;

      const currentItem = await Product.findById(productId);
      if (!currentItem) {
        return res.status(404).json({ message: "Target item profile not found." });
      }

      const catalogItems = await Product.find({ _id: { $ne: productId } });

      const scorer = new ContentScorer(currentItem);
      const topMatches = scorer.filterAndRank(catalogItems, 3);

      return res.status(200).json(topMatches);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getKnnRecommendations(req, res) {
    try {
      const { productId } = req.query;

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          message: "Invalid or missing Product ID structure required for analytical rendering.",
        });
      }

      const targetProduct = await Product.findById(productId);
      if (!targetProduct) {
        return res.status(404).json({ message: "Target baseline item not found in data cluster." });
      }

      const allProducts = await Product.find({ _id: { $ne: productId } });
      if (!allProducts || allProducts.length === 0) {
        return res.status(200).json([]);
      }

      const calculator = new DistanceCalculator(targetProduct);
      const calculatedRecommendations = calculator.findNearestNeighbors(allProducts, 4);

      return res.status(200).json(calculatedRecommendations);
    } catch (error) {
      console.error("Error in KNN execution pipeline:", error);
      return res.status(500).json({
        message: "Internal tracking calculation error.",
        error: error.message,
      });
    }
  }
}

const recommendationController = new RecommendationController();

module.exports = {
  getContentRecommendations: (req, res) => recommendationController.getContentRecommendations(req, res),
  getKnnRecommendations: (req, res) => recommendationController.getKnnRecommendations(req, res),
};