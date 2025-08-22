// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  // Use environment base; prefer https port 7188 consistent with other services
  private apiUrl = `${environment.apiBaseUrl}/api/Products`;

  constructor(private http: HttpClient) {}

  // ✅ Get all products
  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ Add new product
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  // ✅ Update product
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  // ✅ Delete product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
