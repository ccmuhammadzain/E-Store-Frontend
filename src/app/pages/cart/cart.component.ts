import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cart = this.cartService.getCart();
  }

  increaseQty(product: any) {
    product.quantity++;
  }

  decreaseQty(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
    } else {
      this.removeFromCart(product.id);
    }
  }

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }

  getTotalItems() {
    return this.cartService.getTotalItems();
  }

  getTotalPrice() {
    return this.cartService.getTotalPrice();
  }

  checkout() {
    alert('Proceeding to checkout...');
    // later redirect to Bills page
  }
}

