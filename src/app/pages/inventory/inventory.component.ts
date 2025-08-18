import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [CommonModule, FormsModule]
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  currentProduct: any = {};
  showForm = false;
  isEdit = false;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  // ✅ Load all products
  getProducts(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  // ✅ Open Add form
  openAddForm(): void {
    this.currentProduct = {
      id: 0,
      title: '',
      category: '',
      brand: '',
      price: 0,
      stock: 0,
      productImage: ''   // ✅ Added image field
    };
    this.isEdit = false;
    this.showForm = true;
  }

  // ✅ Open Edit form
  openEditForm(product: any): void {
    this.currentProduct = { ...product };
    this.isEdit = true;
    this.showForm = true;
  }

  // ✅ Save (POST/PUT)
  saveProduct(): void {
    if (this.isEdit) {
      this.inventoryService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.getProducts();
          this.showForm = false;
        },
        error: (err) => console.error('Error updating product:', err)
      });
    } else {
      this.inventoryService.addProduct(this.currentProduct).subscribe({
        next: () => {
          this.getProducts();
          this.showForm = false;
        },
        error: (err) => console.error('Error saving product:', err)
      });
    }
  }

  // ✅ Delete
  deleteProduct(id: number): void {
    this.inventoryService.deleteProduct(id).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.error('Error deleting product:', err)
    });
  }
}
