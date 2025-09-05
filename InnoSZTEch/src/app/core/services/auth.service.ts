import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  name?: string;
  email: string;
  userdata?: any;
}

export interface LoginResponse {
  ok: boolean;
  user?: User;
  error?: string;
}

export interface RegisterResponse {
  ok: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.2.161:3000';
  private currentUserKey = 'currentUser';
  private isLoggedInKey = 'isLoggedIn';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, name?: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      email,
      password,
      name,
      userdata: {}        
    });
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.ok && response.user) {
            this.saveCurrentUser(response.user);
            localStorage.setItem(this.isLoggedInKey, 'true');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.isLoggedInKey);
  }

  saveCurrentUser(user: User): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.isLoggedInKey) === 'true';
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}