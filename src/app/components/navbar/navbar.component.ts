import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  cartItemCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔑 subscribe to cart changes
    this.cartService.cartChanged.subscribe(() => {
      this.cartItemCount = this.cartService.getTotalItems();
    });

    // initialize count
    this.cartItemCount = this.cartService.getTotalItems();
  }

  get user() {
    return this.authService.getUser();
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
