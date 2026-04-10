import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from '../../service/api';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  router = inject(Router);
  apiService = inject(Api);
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  totalUsers: number = 0;
  adminCount: number = 0;
  recentUsers: User[] = [];
  loading: boolean = true;

  // Quick links for the minimalist dashboard
  features = [
    { title: 'User Management', description: 'View, edit, and delete system users.', path: 'users', icon: '👤' },
    { title: 'System Settings', description: 'Configure application preferences.', path: 'settings', icon: '⚙️' },
    { title: 'API Documentation', description: 'Explore API endpoints and models.', path: 'docs', icon: '📚' }
  ];

  ngOnInit(): void {
    this.getDashboardData();
  }

  async getDashboardData() {
    this.loading = true;
    try {
      const response = await this.apiService.getAllUsers();
      const allUsers = Array.isArray(response) ? response : (response?.users || []);

      this.totalUsers = allUsers.length;
      this.adminCount = allUsers.filter(u => u.role?.toLowerCase() === 'admin').length;
      this.recentUsers = [...allUsers].reverse().slice(0, 4); // Get last 4 added users

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async gotoPage(path: string) {
    if (path === 'users') {
      this.router.navigate([path]);
    } else {
      await Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: `Feature "${path}" is coming soon!`,
        timer: 2000,
        showConfirmButton: true
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
