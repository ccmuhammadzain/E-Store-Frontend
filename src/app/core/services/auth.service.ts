import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7188/api/Auth';
  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ----------------------
  // AUTH API CALLS
  // ----------------------
  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user, { responseType: 'text' });
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  // ----------------------
  // STORAGE HANDLERS
  // ----------------------
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUser(user: any) {
    // Normalize username if missing or numeric-only (id accidentally displayed)
    const normalizeUsername = (u: any) => {
      const current = u?.username || u?.userName || u?.UserName;
      const isValid = (v: any) =>
        typeof v === 'string' && v.trim().length > 0 && !/^\d+$/.test(v.trim());
      if (isValid(current)) {
        u.username = current.trim();
        return;
      }
      const token = this.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const candidates: any[] = [
            payload['preferred_username'],
            payload['unique_name'],
            payload['username'],
            payload['user_name'],
            payload['given_name'],
            payload['name'],
            payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            u?.name,
            u?.email,
          ];
          const found = candidates.find(isValid);
          if (found) {
            u.username = (found as string).trim();
            return;
          }
        } catch {}
      }
      // Final fallback without using numeric id
      u.username = 'User';
    };
    normalizeUsername(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser() {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      // Ensure normalized (e.g., after old storage format)
      if (!parsed.username || /^\d+$/.test(parsed.username)) {
        this.saveUser(parsed); // will normalize & re-store
        return JSON.parse(localStorage.getItem('user') || 'null');
      }
      return parsed;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // ----------------------
  // ROLE HELPERS
  // ----------------------
  private roleEquals(role: string, target: string) {
    return role.toLowerCase() === target.toLowerCase();
  }

  isSuperAdmin(): boolean {
    const r = (this.getRole() || '').toLowerCase();
    return r === 'superadmin';
  }

  isAdmin(): boolean {
    // Treat Seller as Admin if backend used Seller previously; include SuperAdmin override
    const r = (this.getRole() || '').toLowerCase();
    return r === 'admin' || r === 'seller' || r === 'superadmin';
  }

  isSeller(): boolean {
    const r = (this.getRole() || '').toLowerCase();
    return r === 'seller';
  }

  isCustomer(): boolean {
    const r = (this.getRole() || '').toLowerCase();
    return r === 'customer';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
