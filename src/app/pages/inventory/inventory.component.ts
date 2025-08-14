import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})

export class InventoryComponent {

  httpClient = inject(HttpClient);
  loading = false;
  errorMsg = '';

  inventoryData: InventoryRequest = {
    productId: '',
    productName: '',
    stockAvailable: 0,
    reorderStock: 0
  };

  resetForm() {
    this.inventoryData = { productId: '', productName: '', stockAvailable: 0, reorderStock: 0 };
  }

  onSubmit() {
    this.errorMsg = '';
    const apiUrl = "https://localhost:7132/api/Inventory"; // consider moving to environment file

    // basic client-side validation
    if (!this.inventoryData.productId || !this.inventoryData.productName) {
      this.errorMsg = 'Product ID and Name are required.';
      return;
    }
    if (this.inventoryData.stockAvailable < 0 || this.inventoryData.reorderStock < 0) {
      this.errorMsg = 'Stock values must be non-negative.';
      return;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Zain-auth-token',
        'Content-Type': 'application/json'
      })
    };
    this.loading = true;
    this.httpClient
      .post(apiUrl, this.inventoryData, httpOptions)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (v: unknown) => {
          console.log('Inventory POST response:', v);
          alert('Saved successfully');
          this.resetForm();
        },
        error: (e: any) => {
          // Try to extract useful info
            const status = e?.status;
            const statusText = e?.statusText;
            const serverMsg = e?.error?.message || e?.message || '';
            this.errorMsg = `Save failed${status ? ' (' + status + (statusText ? ' ' + statusText : '') + ')' : ''}. ${serverMsg}`.trim();
            console.error('Inventory POST error detail:', e);
        }
      });





  }

}

interface InventoryRequest {
  productId: string;
  productName: string;
  stockAvailable: number;
  reorderStock: number;
}
