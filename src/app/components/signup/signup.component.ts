import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  user = { username: '', passwordHash: '', role: 'Customer' };
  message = '';

  constructor(private authService: AuthService) {}

  onSignup() {
    this.authService.signup(this.user).subscribe({
      next: (res) => this.message = res,
      error: (err) => this.message = err.error
    });
  }
}
