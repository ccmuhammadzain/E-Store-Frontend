import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
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
    // Attempt to ensure username property exists (backend might return different casing or omit)
    if (!user?.username) {
      const token = this.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          user.username = payload['unique_name'] || payload['name'] || payload['sub'] || user.id || 'User';
        } catch {}
      }
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
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
