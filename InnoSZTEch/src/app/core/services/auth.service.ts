import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://<api-server-ip>:3000/users';

  private storageKey = 'users';
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, name?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      password,
      name,
      userdata: {}        
    });
  }

  getAllUsers(): User[] {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  saveAllUsers(users: User[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  /*register(name: string, email: string, password: string): boolean {
    const users = this.getAllUsers();

    if (users.find(u => u.email === email)) {
      return false; // email already exists
    }

    users.push({ name, email, password });
    this.saveAllUsers(users);
    return true;
  }*/

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
