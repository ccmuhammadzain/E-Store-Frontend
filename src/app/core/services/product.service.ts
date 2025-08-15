// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res.products || []) // Extract the products array
    );
  }
}
