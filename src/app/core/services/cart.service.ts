import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor() {}

  // Get current cart
  getCart() {
    return this.cart;
  }

  // Add product to cart
  addToCart(product: any) {
    const existing = this.cart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  // Remove product from cart
  removeFromCart(productId: number) {
    this.cart = this.cart.filter(p => p.id !== productId);
  }

  // Clear cart
  clearCart() {
    this.cart = [];
  }

  // Total items count
  getTotalItems() {
    return this.cart.reduce((sum, p) => sum + p.quantity, 0);
  }

  // Total price
  getTotalPrice() {
    return this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }
}
