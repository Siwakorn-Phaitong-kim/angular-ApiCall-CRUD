import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
import { User } from '../../model/user';
import Swal from 'sweetalert2';

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
  userId: string | null = null;

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
  private readonly DRAFT_PREFIX = 'แบบร่าง';

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
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกชื่อ',
      });
      return;
    }
    if (!this.user.lastName) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกนามสกุล',
      });
      return;
    }
    if (!this.user.email) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกอีเมล',
      });
      return;
    }
    if (!this.user.phone) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกเบอร์โทรศัพท์',
      });
      return;
    }

    const phoneRegex = /^0[1-9]{1}-[0-9]{8}$/;
    if (!phoneRegex.test(this.user.phone)) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วย 0)',
      });
      return;
    }
    if (!this.user.role) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกบทบาท',
      });
      return;
    }
    if (!this.user.age) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกอายุ',
      });
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();
    try {
      await this.apiService.createUsers(this.user);
      await Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        text: 'ข้อมูลของคุณถูกเพิ่มเรียบร้อยแล้ว',
        timer: 2000,
        showConfirmButton: false
      });
      this.clearDraft();
      this.router.navigate(['users']);
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้ในขณะนี้',
      });
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
