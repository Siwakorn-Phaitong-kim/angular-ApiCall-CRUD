import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private apiService = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  async getAllUsers(): Promise<any> {
    return await firstValueFrom(this.http.get(this.apiService))
  }

  async getOneUsers(id: any): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiService}/${id}`))
  }

  async createUsers(data: any): Promise<void> {
    await firstValueFrom(this.http.post(`${this.apiService}`, data))
  }

  async deleteUser(id: any): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiService}/${id}`))
  }

  async editUser(id: any, data: any): Promise<void> {
    await firstValueFrom(this.http.put(`${this.apiService}/${id}`, data))
  }
}
