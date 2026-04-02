import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VolunteerAppFormService } from '../../../services/volunteer-app-form.service';
import { VolunteerAppForm } from '../../../models/volunteer-app-form.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-volunteer-app-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  applications: VolunteerAppForm[] = [];
  isLoading = true;

  constructor(
    private appService: VolunteerAppFormService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchApplications();
  }

  fetchApplications() {
    this.isLoading = true;
    this.appService.get().subscribe({
      next: (data: VolunteerAppForm[]) => {
        this.applications = Array.isArray(data) ? data : [data];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteApplication(id: string) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.appService.delete(id).subscribe(() => {
        this.applications = this.applications.filter(a => (a.id || a._id) !== id);
      });
    }
  }
}
