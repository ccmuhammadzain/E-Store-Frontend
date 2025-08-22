import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  cartChanged = new Subject<void>(); // 🔔 notify on cart updates

  constructor() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        this.cart = JSON.parse(stored);
      } catch {
        this.cart = [];
      }
    }
  }

  private persist() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCart() {
    return this.cart;
  }

  addToCart(product: any) {
    const existing = this.cart.find((p) => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.persist();
    this.cartChanged.next();
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter((p) => p.id !== productId);
    this.persist();
    this.cartChanged.next();
  }

  clearCart() {
    this.cart = [];
    this.persist();
    this.cartChanged.next();
  }

  getTotalItems() {
    return this.cart.reduce((sum, p) => sum + p.quantity, 0);
  }

  getTotalPrice() {
    return this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }
}
