import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAllUsers(): Promise<User[] | { users: User[] }> {
    return firstValueFrom(this.http.get<User[] | { users: User[] }>(this.apiUrl));
  }

  getOneUser(id: string | number): Promise<User> {
    const api = `${this.apiUrl}/${id}`;
    return firstValueFrom(this.http.get<User>(api));
  }

  createUsers(data: User): Promise<User> {
    return firstValueFrom(this.http.post<User>(this.apiUrl, data));
  }

  deleteUser(id: string | number): Promise<any> {
    const api = `${this.apiUrl}/${id}`;
    return firstValueFrom(this.http.delete(api));
  }

  editUser(id: string | number, data: User): Promise<User> {
    const api = `${this.apiUrl}/${id}`;
    return firstValueFrom(this.http.put<User>(api, data));
  }
}
