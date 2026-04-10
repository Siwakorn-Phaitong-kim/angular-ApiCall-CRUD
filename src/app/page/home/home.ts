import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  router = inject(Router);

  // Quick links for the minimalist dashboard
  features = [
    { title: 'User Management', description: 'View, edit, and delete system users.', path: 'users', icon: '👤' },
    { title: 'System Settings', description: 'Configure application preferences.', path: 'settings', icon: '⚙️' },
    { title: 'API Documentation', description: 'Explore API endpoints and models.', path: 'docs', icon: '📚' }
  ];

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
}
