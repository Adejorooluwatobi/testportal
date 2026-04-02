import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonationTransactionService } from '../../../services/donation-transaction.service';
import { DonationTransaction } from '../../../models/donation-transaction.model';

@Component({
  selector: 'app-donation-record-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class DonationRecordList implements OnInit {
  records: DonationTransaction[] = [];
  isLoading = true;

  constructor(
    private recordService: DonationTransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchRecords();
  }

  fetchRecords() {
    this.isLoading = true;
    this.recordService.list().subscribe({
      next: (data: DonationTransaction[]) => {
        this.records = Array.isArray(data) ? data : [data];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRecord(id: string) {
    if (confirm('Are you sure you want to delete this donation record?')) {
      this.recordService.delete(id).subscribe(() => {
        this.records = this.records.filter(r => r._id !== id);
        this.cdr.detectChanges();
      });
    }
  }
}
