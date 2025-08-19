import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7188/api/Auth'; 

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
    localStorage.setItem('user', JSON.stringify(user));
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
  }
}
