import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  adminForm: FormGroup;
  isLoading = true;
  adminId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['operator', Validators.required]
    });
  }

  ngOnInit() {
    this.adminId = this.route.snapshot.paramMap.get('id');
    if (this.adminId) {
      this.fetchAdmin();
    } else {
      this.router.navigate(['/admin/list']);
    }
  }

  fetchAdmin() {
    this.isLoading = true;
    this.adminService.get(this.adminId!).subscribe({
      next: (data) => {
        this.adminForm.patchValue({
          username: data.username,
          email: data.email,
          role: data.role
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/list']);
      }
    });
  }

  onSubmit() {
    if (this.adminForm.valid && this.adminId) {
      this.isLoading = true;
      this.adminService.update(this.adminForm.value, this.adminId).subscribe({
        next: () => {
          alert('Admin updated successfully!');
          this.router.navigate(['/admin/list']);
        },
        error: (err) => {
          this.isLoading = false;
          alert('Error: ' + err.message);
        }
      });
    }
  }
}
