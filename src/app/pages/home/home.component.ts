import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

  get primaryCta() {
    if (!this.user) return { link: '/login', label: 'Start Shopping' };
    if (this.user.role === 'Admin') return { link: '/inventory', label: 'Start Selling' };
    return { link: '/shop', label: 'Start Shopping' };
  }
}
