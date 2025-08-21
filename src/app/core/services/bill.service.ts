import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ---------- CREATE DTOs (what we send) ----------
export interface BillItemCreateDto {
  productId: number;
  quantity: number;
}

export interface BillCreateDto {
  billItems: BillItemCreateDto[];
}

// ---------- READ DTOs (what we receive) ----------
export type BillStatus = 'Pending' | 'Paid' | 'Canceled';

export interface BillItemDto {
  id: number;
  productId: number;
  quantity: number;
  price: number; // unit price provided by backend
  product?: {
    id: number;
    title?: string;
    price?: number;
  };
}

export interface BillDto {
  id: number;
  userId: number;
  totalAmount: number;
  status: BillStatus;
  paidAt?: string;
  paymentReference?: string;
  customerName?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
  phone?: string;
  createdAt?: string;
  billItems: BillItemDto[];
  user?: { id: number; username?: string };
}

export interface BillPaymentDto {
  customerName: string;
  addressLine1: string;
  city: string;
  country: string;
  phone: string;
  paymentReference?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = `${environment.apiBaseUrl}/api/Bills`;

  constructor(private http: HttpClient) {}

  // GET all bills
  getBills(): Observable<BillDto[]> {
    return this.http.get<BillDto[]>(this.apiUrl);
  }

  // GET bill by ID
  getBill(id: number): Observable<BillDto> {
    return this.http.get<BillDto>(`${this.apiUrl}/${id}`);
  }

  // POST new bill
  createBill(bill: BillCreateDto): Observable<BillDto> {
    return this.http.post<BillDto>(this.apiUrl, bill);
  }

  payBill(id: number): Observable<BillDto> {
    throw new Error('Deprecated: use payBillWithDetails');
  }

  payBillWithDetails(id: number, payload: BillPaymentDto): Observable<BillDto> {
    return this.http.post<BillDto>(`${this.apiUrl}/${id}/pay`, payload);
  }

  deleteBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
