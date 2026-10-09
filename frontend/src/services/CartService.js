import { CartItem } from "../models/CartItem";
import { ProductModel } from "../models/ProductModel";

export class CartService {
  constructor(items = []) {
    this.items = items.map((item) => {
      const product = item.product || item;

      const quantity =
        item.quantity || 1;

      return new CartItem(
        product instanceof ProductModel
          ? product
          : new ProductModel(product),
        quantity
      );
    });
  }

  addItem(product, quantity = 1) {
    const productId = product.id;

    const existingItem = this.items.find(
      (item) => item.product.id === productId
    );

    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      this.items.push(
        new CartItem(product, quantity)
      );
    }

    return this;
  }

  decreaseItem(productId) {
    const item = this.items.find(
      (item) => item.product.id === productId
    );

    if (!item) return this;

    item.decreaseQuantity();

    if (item.isEmpty()) {
      this.removeItem(productId);
    }

    return this;
  }

  removeItem(productId) {
    this.items = this.items.filter(
      (item) => item.product.id !== productId
    );

    return this;
  }

  clearCart() {
    this.items = [];
    return this;
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.getSubtotal(),
      0
    );
  }

  getItems() {
    return this.items.map((item) => item.toJSON());
  }

  isEmpty() {
    return this.items.length === 0;
  }
}