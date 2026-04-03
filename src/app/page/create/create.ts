import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
export class Create implements OnInit {
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

  private readonly DRAFT_KEY = 'create_user_draft';

  ngOnInit() {
    this.loadDraft();
  }

  loadDraft() {
    const draft = localStorage.getItem(this.DRAFT_KEY);
    if (draft) {
      // const confirmRestore = confirm('พบข้อมูลร่างเดิมที่คุณเคยกรอกไว้ ต้องการดึงข้อมูลกลับมาหรือไม่?');
      // if (confirmRestore) {
      this.user = JSON.parse(draft);
      // } else {
      //   this.clearDraft();
      // }
    }
  }

  saveDraft() {
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(this.user));
  }

  clearDraft() {
    localStorage.removeItem(this.DRAFT_KEY);
  }

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
      this.clearDraft();
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
    // const confirmCancel = confirm('ข้อมูลที่คุณกรอกจะหายไป ต้องการยกเลิกใช่หรือไม่?');
    // if (confirmCancel) {
    //   this.clearDraft();
    this.router.navigate(['users']);
    // }
  }
}
