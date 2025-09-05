import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'users';
  private currentUserKey = 'currentUser';

  constructor() {}

  getAllUsers(): User[] {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  saveAllUsers(users: User[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  register(name: string, email: string, password: string): boolean {
    const users = this.getAllUsers();

    if (users.find(u => u.email === email)) {
      return false; // email already exists
    }

    users.push({ name, email, password });
    this.saveAllUsers(users);
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
