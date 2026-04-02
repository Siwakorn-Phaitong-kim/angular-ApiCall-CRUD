import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private apiService = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Promise<any> {
    const api = `${this.apiService}/users`
    return (this.http.get(api)).toPromise()
  }

  getOneUsers(id: any): Promise<any> {
    const api = `${this.apiService}/users/${id}`
    return (this.http.get(api)).toPromise()
  }

  createUsers(data: any): Promise<any> {
    const api = `${this.apiService}/users`
    return this.http.post(api, data).toPromise()
  }

  deleteUser(id: any): Promise<any> {
    const api = `${this.apiService}/users/${id}`
    return this.http.delete(api).toPromise()
  }

  editUser(id: any, data: any): Promise<any> {
    const api = `${this.apiService}/users/${id}`
    return this.http.put(api, data).toPromise()
  }
}
