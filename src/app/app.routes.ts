import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { BillsComponent } from './pages/bills/bills.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomerComponent, canActivate: [authGuard] },
  { path: 'bills', component: BillsComponent, canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent) },
  { path: '**', redirectTo: 'home' }
];
