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
  user: string | null = null;   
  constructor(private authService: AuthService, private router: Router) {
    
    const savedUser = this.authService.getUser();
    if (savedUser) {
      this.user = savedUser.name || savedUser.email || 'User';
    }
  }

  
  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  
  logout() {
    this.authService.logout();
    this.user = null;
    this.router.navigate(['/login']);
  }
}
