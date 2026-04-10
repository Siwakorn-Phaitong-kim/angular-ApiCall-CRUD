import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
import { User } from '../../model/user';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);
  private readonly DRAFT_PREFIX = 'แก้ไข users';

  userId: string | null = null;
  loading: boolean = true;
  saving: boolean = false;
  user: User | null = null;


  async ngOnInit() {
    await this.loadFormData();
    this.loadDraft();
  }

  get draftKey(): string {
    return `${this.DRAFT_PREFIX} ID : ${this.userId}`;
  }

  saveDraft() {
    if (this.user && this.userId) {
      localStorage.setItem(this.draftKey, JSON.stringify(this.user));
    }
  }

  loadDraft() {
    const draft = localStorage.getItem(this.draftKey);
    if (draft) {
      this.user = JSON.parse(draft);
    }
  }

  clearDraft() {
    localStorage.removeItem(this.draftKey);
  }

  async loadFormData() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      try {
        this.user = await this.apiService.getOneUser(this.userId);
      } catch (e) {
        console.error(e);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล (อาจจะไม่มี ID นี้)');
        this.router.navigate(['users']);
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
    if (!this.user || !this.userId) return;

    // 1. Validation ด้วย SweetAlert2 (เลือกใช้ Toast หรือ Modal ก็ได้)
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();

    try {
      await this.apiService.editUser(this.userId, this.user);

      await Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        text: 'ข้อมูลของคุณถูกอัปเดตเรียบร้อยแล้ว',
        timer: 2000,
        showConfirmButton: false
      });

      this.router.navigate(['users']);
      this.clearDraft();
    } catch (e) {
      console.error(e);

      Swal.fire({
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
    this.router.navigate(['users']);
  }
}
