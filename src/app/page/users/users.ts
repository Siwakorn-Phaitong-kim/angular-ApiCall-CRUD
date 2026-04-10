import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../service/api';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user';
import Swal from 'sweetalert2';

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
    const result = await Swal.fire({
      title: 'Are you sure?',
      width: '600px',
      text: `You want to delete User ID: ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await this.apiService.deleteUser(id);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        Toast.fire({
          icon: 'success',
          title: `Deleted user ID: ${id} successfully`
        });

        this.getDataAll();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete user.', 'error');
        console.error(error);
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