import { ProductModel } from "./ProductModel";

export class CartItem {
  constructor(product, quantity = 1) {
    this.product =
      product instanceof ProductModel
        ? product
        : new ProductModel(product);

    this.quantity = Math.max(1, Number(quantity) || 1);
  }

  increaseQuantity(amount = 1) {
    this.quantity += Number(amount) || 1;
  }

  decreaseQuantity(amount = 1) {
    this.quantity = Math.max(
      0,
      this.quantity - (Number(amount) || 1)
    );
  }

  getSubtotal() {
    return this.product.price * this.quantity;
  }

  isEmpty() {
    return this.quantity <= 0;
  }

  toJSON() {
    return {
      ...this.product,
      quantity: this.quantity,
    };
  }
}