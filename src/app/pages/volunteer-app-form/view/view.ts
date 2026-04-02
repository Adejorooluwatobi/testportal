import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VolunteerAppFormService } from '../../../services/volunteer-app-form.service';
import { VolunteerAppForm } from '../../../models/volunteer-app-form.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volunteer-app-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class View implements OnInit {
  app: VolunteerAppForm | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: VolunteerAppFormService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchApplication(id);
    } else {
      this.router.navigate(['/volunteer-app-form/list']);
    }
  }

  fetchApplication(id: string) {
    this.isLoading = true;
    this.appService.get(id).subscribe({
      next: (data) => {
        this.app = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/volunteer-app-form/list']);
      }
    });
  }

  deleteApp() {
    const id = this.app?.id || this.app?._id;
    if (id && confirm('Delete this application?')) {
      this.appService.delete(id).subscribe(() => {
        this.router.navigate(['/volunteer-app-form/list']);
      });
    }
  }
}
