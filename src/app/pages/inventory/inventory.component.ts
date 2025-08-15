import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  loading = false;
  errorMsg = '';

  // Modal control
  showAddForm = false;

  // New product form model
  newProduct = {
    title: '',
    category: '',
    brand: '',
    price: 0,
    stock: 0
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.inventoryService.getInventory().subscribe({
      next: (data: any) => {
        console.log('API Response:', data);
        // If API returns { products: [...] }, pick that
        if (data && Array.isArray(data.products)) {
          this.products = data.products;
        } else if (Array.isArray(data)) {
          this.products = data;
        } else {
          this.products = [];
        }
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load inventory.';
        this.loading = false;
      }
    });
  }

  // Add product form submit
  addProduct() {
    console.log('New Product:', this.newProduct);

    // Later: call this.inventoryService.addProduct(this.newProduct).subscribe(...)
    // For now, just push to array locally
    this.products.push({ ...this.newProduct });

    // Reset form & close modal
    this.resetForm();
    this.showAddForm = false;
  }

  resetForm() {
    this.newProduct = {
      title: '',
      category: '',
      brand: '',
      price: 0,
      stock: 0
    };
  }
}
