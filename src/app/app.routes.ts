import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { BillsComponent } from './pages/bills/bills.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { authGuard } from './guards/auth.guard';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // Inventory: Admin & SuperAdmin (and Seller if backend treats Seller as admin) can access
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Seller', 'SuperAdmin'] },
  },

  // Customers: Admin & SuperAdmin
  {
    path: 'customers',
    component: CustomerComponent,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Seller', 'SuperAdmin'] },
  },

  // Shop: only Customer can access
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [authGuard],
    data: { roles: ['Customer'] },
  },

  // Bills: only Customer (SuperAdmin/Admin excluded unless requirement changes)
  {
    path: 'bills',
    component: BillsComponent,
    canActivate: [authGuard],
    data: { roles: ['Customer'] },
  },

  // Admin Panel: SuperAdmin only (lazy placeholder component)
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [authGuard],
    data: { roles: ['SuperAdmin'] },
  },

  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent,
    canActivate: [authGuard],
    data: { roles: ['Customer'] },
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
    data: { roles: ['Customer'] },
  },

  // Auth pages
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then((m) => m.SignupComponent),
  },

  // Fallback
  { path: '**', redirectTo: 'home' },
];
