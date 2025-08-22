import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToastContainerComponent } from '../toast-container/toast-container.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToastContainerComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  cartItemCount = 0;
  currentUser: any;
  searchTerm: string = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 🔑 subscribe to cart changes
    this.cartService.cartChanged.subscribe(() => {
      this.cartItemCount = this.cartService.getTotalItems();
      this.cdr.markForCheck();
    });

    // initialize count
    this.cartItemCount = this.cartService.getTotalItems();
    // subscribe to user changes
    this.authService.user$.subscribe(u => {
      this.currentUser = u;
      this.cdr.markForCheck();
    });
  }

  get user() { return this.currentUser; }
  get isLoggedIn(): boolean { return !!this.currentUser; }

  isAdmin(): boolean { return (this.currentUser?.role || '').toLowerCase() === 'admin'; }
  isCustomer(): boolean { return (this.currentUser?.role || '').toLowerCase() === 'customer'; }

  onSearch(evt: Event) {
    evt.preventDefault();
    const term = this.searchTerm.trim();
    // Navigate to shop with query param (or clear if empty)
    if (term) {
      this.router.navigate(['/shop'], { queryParams: { q: term } });
    } else {
      this.router.navigate(['/shop']);
    }
    // close mobile menu after search
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
