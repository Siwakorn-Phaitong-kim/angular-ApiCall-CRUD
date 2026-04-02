import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  constructor(private cdr: ChangeDetectorRef) { }
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(Api);

  userId: any = null;
  loading: boolean = true;
  saving: boolean = false;

  user: any = null;

  async ngOnInit() {
    this.editUser();
  }

  async editUser() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      try {
        this.user = await this.apiService.getOneUsers(this.userId);
      } catch (e) {
        console.error(e);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล (อาจจะไม่มี ID นี้)');
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }


  async save() {
    const firstName = document.getElementById('firstName') as HTMLInputElement;
    if (firstName.value === '' || null || undefined) {
      alert('กรุณากรอกชื่อ');
      return;
    }
    const lastName = document.getElementById('lastName') as HTMLInputElement;
    if (lastName.value === '' || null || undefined) {
      alert('กรุณากรอกนามสกุล');
      return;
    }
    const email = document.getElementById('email') as HTMLInputElement;
    if (email.value === '' || null || undefined) {
      alert('กรุณากรอกอีเมล');
      return;
    }
    const phone = document.getElementById('phone') as HTMLInputElement;
    if (phone.value === '' || null || undefined) {
      alert('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    const role = document.getElementById('role') as HTMLInputElement;
    if (role.value === '' || null || undefined) {
      alert('กรุณากรอกบทบาท');
      return;
    }
    const age = document.getElementById('age') as HTMLInputElement;
    if (age.value === '' || null || undefined) {
      alert('กรุณากรอกอายุ');
      return;
    }
    if (!this.user || !this.userId) return;
    this.saving = true;
    this.cdr.detectChanges();
    try {
      await this.apiService.editUser(this.userId, this.user);
      this.router.navigate(['users']);
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      this.saving = false;
    }

  }

  cancel() {
    this.router.navigate(['users']);
  }
}
