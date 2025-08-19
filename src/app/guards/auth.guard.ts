import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getUser();

    if (!user) {
      // Not logged in, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Role not allowed, redirect to home
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
