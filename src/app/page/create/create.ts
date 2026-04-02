import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
import { User } from '../../model/user';

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  private router = inject(Router);
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  saving: boolean = false;

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: 0,
    role: 'user',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
  };

  async save() {
    if (!this.user.firstName) {
      alert('กรุณากรอกชื่อ');
      return;
    }
    if (!this.user.lastName) {
      alert('กรุณากรอกนามสกุล');
      return;
    }
    if (!this.user.email) {
      alert('กรุณากรอกอีเมล');
      return;
    }
    if (!this.user.phone) {
      alert('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    if (!this.user.role) {
      alert('กรุณากรอกบทบาท');
      return;
    }
    if (!this.user.age) {
      alert('กรุณากรอกอายุ');
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();
    try {
      await this.apiService.createUsers(this.user);
      alert('บันทึกข้อมูลสำเร็จ');
      this.router.navigate(['users']);
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  cancel() {
    this.router.navigate(['users']);
  }
}
