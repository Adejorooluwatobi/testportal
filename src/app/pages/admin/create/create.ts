import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  adminForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['operator', Validators.required]
    });
  }

  onSubmit() {
    if (this.adminForm.valid) {
      this.isLoading = true;
      this.adminService.create(this.adminForm.value).subscribe({
        next: () => {
          alert('Admin created successfully!');
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
