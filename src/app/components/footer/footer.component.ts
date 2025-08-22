import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = 2025;
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

  isCustomer() { return (this.user?.role || '').toLowerCase() === 'customer'; }
  isAdmin() { return (this.user?.role || '').toLowerCase() === 'admin'; }
}
