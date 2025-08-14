import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { BillsComponent } from './pages/bills/bills.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'customers', component: CustomerComponent },
    { path: 'bills', component: BillsComponent },
    { path: '**', redirectTo: 'home' }
];
