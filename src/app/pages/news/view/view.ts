import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../models/news.model';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-news-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class NewsComponent implements OnInit {
  newsForm: FormGroup;
  isEditMode = false;
  editingSection: string | null = null;
  isLoading = true;
  newsData: News | null = null;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.newsForm = this.fb.group({
      header: [''],
      title: [''],
      description: [''],
      cards: this.fb.array([])
    });
  }

  get newsCards() { return this.newsForm.get('cards') as FormArray; }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.newsService.get().subscribe({
      next: (data) => {
        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          this.newsData = result;
          this.patchForm(result);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  patchForm(data: News) {
    while (this.newsCards.length) this.newsCards.removeAt(0);
    this.newsForm.patchValue({
      header: data.header || '',
      title: data.title || '',
      description: data.description || ''
    });
    data.cards?.forEach(card => this.addCard(card));
  }

  addCard(data: any = null) {
    this.newsCards.push(this.fb.group({
      header: [data?.header || ''],
      date: [data?.date || ''],
      title: [data?.title || ''],
      description: [data?.description || ''],
      icon: [data?.icon || '']
    }));
  }

  removeCard(index: number) { this.newsCards.removeAt(index); }

  toggleEditSection(section: string | null) {
    this.editingSection = section;
    this.isEditMode = !!section;
    if (!section && this.newsData) {
      this.patchForm(this.newsData);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editingSection = null;
      if (this.newsData) this.patchForm(this.newsData);
    }
  }

  onFileSelected(event: any, controlPath: string) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.uploadService.uploadFile(file).subscribe({
        next: (url) => {
          this.newsForm.get(controlPath)?.setValue(url);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Upload failed: ' + err.message);
        }
      });
    }
  }

  onSubmit() {
    if (this.newsForm.valid) {
      this.isLoading = true;
      this.newsService.create(this.newsForm.value).subscribe({
        next: (data) => {
          this.newsData = data;
          this.isEditMode = false;
          this.editingSection = null;
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('News page updated successfully!');
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Error: ' + err.message);
        }
      });
    }
  }
}
