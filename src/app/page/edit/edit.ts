import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
import { User } from '../../model/user';

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
  private readonly DRAFT_PREFIX = 'edit_user_draft_';

  userId: string | null = null;
  loading: boolean = true;
  saving: boolean = false;
  user: User | null = null;


  async ngOnInit() {
    await this.loadFormData();
    this.loadDraft();
  }

  get draftKey(): string {
    return `${this.DRAFT_PREFIX}${this.userId}`;
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

    // Validation using the user object directly
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

    this.saving = true;
    this.cdr.detectChanges();

    try {
      await this.apiService.editUser(this.userId, this.user);
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
