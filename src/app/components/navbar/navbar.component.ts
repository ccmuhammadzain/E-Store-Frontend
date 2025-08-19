import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

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
