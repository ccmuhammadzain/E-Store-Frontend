import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user = { username: '', passwordHash: '' };
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.authService.login(this.user).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.authService.saveUser(res); // ✅ Save user info (including role)

        // ✅ Navigate based on role
        if (res.role === 'Admin') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => (this.message = err.error),
    });
  }
}
