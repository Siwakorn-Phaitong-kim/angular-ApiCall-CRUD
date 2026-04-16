import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'mock_auth_user';

  private mockUsers = [
    { username: 'admin', password: '123' },
    { username: 'user', password: 'password' }
  ];

  login(username: string, password: string): boolean {
    const user = this.mockUsers.find(u => u.username === username.trim() && u.password === password.trim());
    if (user) {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify({ username: user.username }));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) !== null;
  }

  getUser() {
    const user = localStorage.getItem(this.AUTH_KEY);
    return user ? JSON.parse(user) : null;
  }
}
