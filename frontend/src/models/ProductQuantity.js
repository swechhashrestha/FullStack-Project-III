export class ProductQuantity {
  constructor(initialCount = 1) {
    this.minLimit = 1;
    this.maxLimit = 50;
    this.value = Math.min(this.maxLimit, Math.max(this.minLimit, initialCount));
  }

  increment(step = 1) {
    const newValue = Math.min(this.maxLimit, this.value + step);
    return new ProductQuantity(newValue);
  }

  decrement(step = 1) {
    const newValue = Math.max(this.minLimit, this.value - step);
    return new ProductQuantity(newValue);
  }

  setValue(newValue) {
    const parsed = parseInt(newValue, 10);
    if (isNaN(parsed) || parsed < this.minLimit) {
      return new ProductQuantity(this.minLimit);
    }
    if (parsed > this.maxLimit) {
      return new ProductQuantity(this.maxLimit);
    }
    return new ProductQuantity(parsed);
  }

  getValue() {
    return this.value;
  }

  isAtMaximum() {
    return this.value >= this.maxLimit;
  }

  isAtMinimum() {
    return this.value <= this.minLimit;
  }
}