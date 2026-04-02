import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DonationTransactionService } from '../../../services/donation-transaction.service';
import { DonationTransaction } from '../../../models/donation-transaction.model';

@Component({
  selector: 'app-donation-record-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class DonationRecordView implements OnInit {
  record: DonationTransaction | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordService: DonationTransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchRecord(id);
    }
  }

  fetchRecord(id: string) {
    this.isLoading = true;
    this.recordService.get(id).subscribe({
      next: (data: DonationTransaction) => {
        this.record = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRecord() {
    if (this.record?._id && confirm('Are you sure you want to delete this donation record?')) {
      this.recordService.delete(this.record._id).subscribe(() => {
        this.router.navigate(['/donation-records']);
      });
    }
  }
}
