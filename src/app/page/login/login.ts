import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = false;

  async onSubmit() {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter both username and password!',
      });
      return;
    }

    this.loading = true;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (this.authService.login(this.username, this.password)) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
      });

      this.router.navigate(['']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: 'Invalid username or password.',
      });
    }
    
    this.loading = false;
  }
}
