import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Admin } from '../../../models/admin.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  admins: Admin[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.isLoading = true;
    this.adminService.get().subscribe({
      next: (data: any) => {
        this.admins = Array.isArray(data) ? data : (data ? [data] : []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteAdmin(id: string) {
    if (confirm('Are you sure you want to delete this admin account? This action cannot be undone.')) {
      this.adminService.delete(id).subscribe(() => {
        this.admins = this.admins.filter(a => a._id !== id);
        this.cdr.detectChanges();
      });
    }
  }
}
