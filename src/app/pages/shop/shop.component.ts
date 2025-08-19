import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  imports: [CommonModule]
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';

  constructor(
    private inventoryService: InventoryService,
    private cartService: CartService  // ✅ Inject CartService
  ) {}

  ngOnInit(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
      },
      error: (err) => console.error(err)
    });
  }

  extractCategories() {
    const cats = this.products.map(p => p.category);
    this.categories = Array.from(new Set(cats)); // unique categories
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
  }

  addToCart(product: any) {
    this.cartService.addToCart(product); 
    alert(`${product.title} added to cart!`);
  }
}
