import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  searchTerm: string = '';

  constructor(
    private inventoryService: InventoryService,
  private cartService: CartService,  // ✅ Inject CartService
  private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
        // pick up initial query param
        const qp = this.route.snapshot.queryParamMap.get('q');
        if (qp) {
          this.searchTerm = qp;
        }
        this.applyFilters();
        // subscribe to query param changes (if user searches again)
        this.route.queryParamMap.subscribe(map => {
          const term = map.get('q') || '';
            if (term !== this.searchTerm) {
              this.searchTerm = term;
              this.applyFilters();
            }
        });
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
    this.applyFilters();
  }

  onSearchTermChange() {
    this.applyFilters();
  }

  clearSearch() {
    if (this.searchTerm) {
      this.searchTerm = '';
      this.applyFilters();
    }
  }

  private applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = this.products.filter(p => {
      const matchesCategory = this.selectedCategory === 'All' || p.category === this.selectedCategory;
      if (!matchesCategory) return false;
      if (!term) return true;
      const haystack = `${p.title || ''} ${p.category || ''} ${p.brand || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.toast.success(`${product.title} added to cart`);
  }
}
