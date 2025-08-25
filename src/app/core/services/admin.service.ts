import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin, map, catchError, of, throwError } from 'rxjs';

export interface AdminUserDto {
  id: number;
  username: string;
  role: string;
  email?: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface SellerOrderMetricDto {
  sellerId: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  canceledOrders: number;
  totalRevenue: number; // sum of paid amounts
  pendingRevenue: number; // sum of pending amounts
  lastPaidAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  // Backend endpoints (to be implemented server-side)
  getAdmins(): Observable<AdminUserDto[]> {
    return this.http.get<AdminUserDto[]>(`${this.base}/api/Users/admins`);
  }
  getSellerMetrics(): Observable<SellerOrderMetricDto[]> {
    return this.http.get<SellerOrderMetricDto[]>(`${this.base}/api/Admins/metrics`);
  }

  // Combined convenience stream (remove once component explicitly calls each as needed)
  getAdminsWithMetrics(): Observable<(AdminUserDto & { metrics?: SellerOrderMetricDto })[]> {
    return forkJoin([this.getAdmins(), this.getSellerMetrics()]).pipe(
      map(([admins, metrics]) =>
        admins.map(a => ({
          ...a,
          metrics: metrics.find(m => m.sellerId === a.id)
        }))
      )
    );
  }

  /**
   * Safe variant that tolerates 404 (endpoint not implemented yet) and returns flags.
   */
  getAdminsWithMetricsSafe(): Observable<{
    items: (AdminUserDto & { metrics?: SellerOrderMetricDto })[];
    admins404: boolean;
    metrics404: boolean;
  }> {
    const admins$ = this.http.get<AdminUserDto[]>(`${this.base}/api/Users/admins`).pipe(
      map(data => ({ data, notFound: false })),
      catchError(err => {
        if (err.status === 404) return of({ data: [] as AdminUserDto[], notFound: true });
        return throwError(() => err);
      })
    );
    const metrics$ = this.http.get<SellerOrderMetricDto[]>(`${this.base}/api/Admins/metrics`).pipe(
      map(data => ({ data, notFound: false })),
      catchError(err => {
        if (err.status === 404) return of({ data: [] as SellerOrderMetricDto[], notFound: true });
        return throwError(() => err);
      })
    );
    return forkJoin([admins$, metrics$]).pipe(
      map(([adminsWrap, metricsWrap]) => ({
        admins404: adminsWrap.notFound,
        metrics404: metricsWrap.notFound,
        items: adminsWrap.data.map(a => ({
          ...a,
          metrics: metricsWrap.data.find(m => m.sellerId === a.id)
        }))
      }))
    );
  }
}
