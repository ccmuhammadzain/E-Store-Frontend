import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [CommonModule, FormsModule],
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  currentProduct: any = {};
  showForm = false;
  isEdit = false;
  user: any = null;
  // cart managed by shared service now

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser(); // ✅ Get logged-in user
    this.getProducts();

    // Nothing to load; service keeps state
  }

  // ✅ Load all products
  getProducts(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  // ✅ Open Add form (Admin only)
  openAddForm(): void {
    if (this.user?.role !== 'Admin') return;

    this.currentProduct = {
      id: 0,
      title: '',
      category: '',
      brand: '',
      price: 0,
      stock: 0,
      productImage: '',
    };
    this.isEdit = false;
    this.showForm = true;
  }

  // ✅ Open Edit form (Admin only)
  openEditForm(product: any): void {
    if (this.user?.role !== 'Admin') return;

    this.currentProduct = { ...product };
    this.isEdit = true;
    this.showForm = true;
  }

  // ✅ Save (POST/PUT) Admin only
  saveProduct(): void {
    if (this.user?.role !== 'Admin') return;

    if (this.isEdit) {
      this.inventoryService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.getProducts();
          this.showForm = false;
        },
        error: (err) => console.error('Error updating product:', err),
      });
    } else {
      this.inventoryService.addProduct(this.currentProduct).subscribe({
        next: () => {
          this.getProducts();
          this.showForm = false;
        },
        error: (err) => console.error('Error saving product:', err),
      });
    }
  }

  // ✅ Delete Admin only
  deleteProduct(id: number): void {
    if (this.user?.role !== 'Admin') return;

    this.inventoryService.deleteProduct(id).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.error('Error deleting product:', err),
    });
  }

  // ✅ Add to cart for Customer
  addToCart(product: any): void {
    if (this.user?.role !== 'Customer') return;
    this.cartService.addToCart(product);
    alert(`${product.title} added to cart!`);
  }
}
