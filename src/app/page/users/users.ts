import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../service/api';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private router = inject(Router);

  constructor(private cdr: ChangeDetectorRef) { }
  private apiService = inject(Api)
  users: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.getDataAll();
  }

  async getDataAll(): Promise<any> {
    this.loading = true;
    try {
      const respose = await this.apiService.getAllUsers();
      this.users = Array.isArray(respose) ? respose : (respose?.users || []);
      this.loading = false;
      console.log('API Data:', this.users);
    } catch (error) {
      console.log(error);
      this.error = 'Error fetching data';
      this.users = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteUser(id: any): Promise<void> {
    const condelete = confirm('You Confirm to Delete This User?')
    if (condelete) {
      await this.apiService.deleteUser(id)
      console.log(`delete userid ${id} success`)
      this.getDataAll()
    }
  }


  async editUser(id: any): Promise<void> {
    this.router.navigate(['edit', id]);
  }

  createUser() {
    this.router.navigate(['create'])
  }

  back() {
    this.router.navigate(['']);
  }
}