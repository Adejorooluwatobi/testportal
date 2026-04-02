import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultationService } from '../../../services/consultation.service';
import { Consultation } from '../../../models/consultation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultation-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class View implements OnInit {
  consultation: Consultation | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchConsultation(id);
    } else {
      this.router.navigate(['/consultation/list']);
    }
  }

  fetchConsultation(id: string) {
    this.isLoading = true;
    this.consultationService.get(id).subscribe({
      next: (data) => {
        this.consultation = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/consultation/list']);
      }
    });
  }

  deleteConsultation() {
    const id = this.consultation?.id || this.consultation?._id;
    if (id && confirm('Delete this consultation request?')) {
      this.consultationService.delete(id).subscribe(() => {
        this.router.navigate(['/consultation/list']);
      });
    }
  }
}
