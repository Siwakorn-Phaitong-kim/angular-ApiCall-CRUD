import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../service/api';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private router = inject(Router);
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.getDataAll();
  }

  async getDataAll(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.apiService.getAllUsers();
      this.users = Array.isArray(response) ? response : (response?.users || []);
      console.log('API Data:', this.users);
    } catch (error) {
      console.error(error);
      this.error = 'Error fetching data';
      this.users = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteUser(id: string | number | undefined): Promise<void> {
    if (id === undefined) return;
    const confirmed = confirm('You Confirm to Delete This User?')
    if (confirmed) {
      try {
        await this.apiService.deleteUser(id);
        console.log(`delete user ID( ${id} ) success`);
        this.getDataAll();
      } catch (error) {
        console.error(error);
        this.error = 'Error deleting data';
      }
    }
  }

  editUser(id: string | number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['edit', id]);
    }
  }

  createUser() {
    this.router.navigate(['create']);
  }

  back() {
    this.router.navigate(['']);
  }
}