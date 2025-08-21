import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { BillService, BillCreateDto } from '../../core/services/bill.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private billService: BillService,
    private authService: AuthService,
    private router: Router
  ) {}

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
    if (this.cart.length === 0) return;
    const user = this.authService.getUser();
    if (!user) {
      this.error = 'You must be logged in.';
      return;
    }

    // Consolidate duplicates & filter invalid quantities
    const consolidated: { productId: number; quantity: number }[] = [];
    const qtyMap = new Map<number, number>();
    for (const p of this.cart) {
      if (p.quantity <= 0) continue; // skip invalid
      qtyMap.set(p.id, (qtyMap.get(p.id) || 0) + p.quantity);
    }
    qtyMap.forEach((q, pid) => consolidated.push({ productId: pid, quantity: q }));

    if (consolidated.length === 0) {
      this.error = 'No valid items to checkout';
      return;
    }

    const payload: BillCreateDto = { billItems: consolidated };

  console.log('Checkout payload', payload);
    this.loading = true;
    this.error = null;
    this.billService.createBill(payload).subscribe({
      next: bill => {
        console.log('Bill created response', bill);
        this.cartService.clearCart();
        this.router.navigate(['/bills'], { state: { newBillId: bill.id, createdBill: bill } });
      },
      error: err => {
        console.error('Checkout error', err);
        const backendMsg = err?.error?.error;
        const code = err?.error?.code;
        if (err.status === 401) {
          this.error = backendMsg || 'Unauthorized. Please log in again.';
        } else if (err.status === 500) {
          this.error = backendMsg ? `Server error: ${backendMsg}` : 'Server error creating bill';
          if (code) this.error += ` (code: ${code})`;
          // Attempt to extract raw body if no structured error
          if (!backendMsg && err.error && err.error instanceof Blob) {
            const blob = err.error as Blob;
            blob.text().then(t => console.log('Raw 500 body:', t));
          }
        } else if (backendMsg) {
          this.error = backendMsg + (code ? ` (code: ${code})` : '');
        } else {
          this.error = 'Checkout failed';
        }
      },
      complete: () => this.loading = false
    });
  }
}

