export class ProductModel {
  constructor(data = {}) {
    this.id = data._id || data.id || "";
    this.title = data.title || data.name || "Untitled";
    this.price = Number(data.price || 0);
    this.description = data.description || "";
    this.image = data.image || "";
    this.cuisine = data.cuisine || "";
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.isAdminAdded = Boolean(data.isAdminAdded);
  }

  isDummyProduct() {
    return String(this.id).startsWith("dummy-");
  }

  getRawId() {
    return this.isDummyProduct() ? this.id.replace("dummy-", "") : this.id;
  }

  getFormattedPrice() {
    return `Rs. ${this.price}`;
  }

  isChefSpecial() {
    return this.isAdminAdded;
  }

  matchesCuisine(targetCuisine) {
    if (!targetCuisine || targetCuisine === "All") return true;
    const target = targetCuisine.toLowerCase();
    const cuisineMatch = this.cuisine.toLowerCase() === target;
    const titleMatch = this.title.toLowerCase().includes(target);
    return cuisineMatch || titleMatch;
  }

  computeSimilarityScore(targetProduct) {
    let score = 0;
    if (this.cuisine === targetProduct.cuisine) score += 5;

    const matchingTags = this.tags.filter((tag) =>
      targetProduct.tags.includes(tag)
    );
    score += matchingTags.length * 2;
    return score;
  }

  computePriceDistance(targetProduct) {
    return Math.abs(this.price - targetProduct.price);
  }
}