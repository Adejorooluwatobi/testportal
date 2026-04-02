import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConsultationService } from '../../../services/consultation.service';
import { Consultation } from '../../../models/consultation.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-consultation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  consultations: Consultation[] = [];
  isLoading = true;

  constructor(
    private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchConsultations();
  }

  fetchConsultations() {
    this.isLoading = true;
    this.consultationService.get().subscribe({
      next: (data: Consultation[]) => {
        this.consultations = Array.isArray(data) ? data : [data];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteConsultation(id: string) {
    if (confirm('Are you sure you want to delete this consultation request?')) {
      this.consultationService.delete(id).subscribe(() => {
        this.consultations = this.consultations.filter(c => (c.id || c._id) !== id);
        this.cdr.detectChanges();
      });
    }
  }
}
