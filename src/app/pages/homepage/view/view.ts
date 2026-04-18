import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HomePageService } from '../../../services/homepage.service';
import { HomePage } from '../../../models/homepage.model';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../services/upload.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-homepage-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class HomePageComponent implements OnInit {
  homeForm: FormGroup;
  isEditMode = false;
  editingSection: string | null = null;
  isLoading = true;
  isSaving = false;
  uploadingPaths = new Set<string>();
  homeData: HomePage | null = null;

  constructor(
    private fb: FormBuilder,
    private homeService: HomePageService,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.homeForm = this.fb.group({
      banner: this.fb.group({
        header: [''],
        title: [''],
        description: [''],
        imageUrl: [''],
        buttons: this.fb.array([]),
        bannerSummary: this.fb.array([])
      }),
      whatWeDo: this.fb.group({
        header: [''],
        title: [''],
        description: ['']
      }),
      testimonials: this.fb.group({
        header: [''],
        title: [''],
        description: [''],
        items: this.fb.array([])
      }),
      quote: this.fb.group({
        header: [''],
        text: [''],
        author: [''],
        cards: this.fb.array([])
      }),
      donate: this.fb.group({
        header: [''],
        title: [''],
        description: [''],
        buttons: this.fb.array([])
      }),
      partners: this.fb.array([])
    });
  }

  // Getters for arrays
  get bannerButtons() { return this.homeForm.get('banner.buttons') as FormArray; }
  get bannerSummary() { return this.homeForm.get('banner.bannerSummary') as FormArray; }
  get testimonialItems() { return this.homeForm.get('testimonials.items') as FormArray; }
  get quoteCards() { return this.homeForm.get('quote.cards') as FormArray; }
  get donateButtons() { return this.homeForm.get('donate.buttons') as FormArray; }
  get partners() { return this.homeForm.get('partners') as FormArray; }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.homeService.get().subscribe({
      next: (data) => {
        const result = Array.isArray(data) ? data[0] : data;
        if (result) {
          this.homeData = result;
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

  patchForm(data: HomePage) {
    this.clearAllArrays();
    
    this.homeForm.patchValue({
      banner: { header: data.banner?.header, title: data.banner?.title, description: data.banner?.description, imageUrl: data.banner?.imageUrl },
      whatWeDo: { header: data.whatWeDo?.header, title: data.whatWeDo?.title, description: data.whatWeDo?.description },
      testimonials: { header: data.testimonials?.header, title: data.testimonials?.title, description: data.testimonials?.description },
      quote: { header: data.quote?.header, text: data.quote?.text, author: data.quote?.author },
      donate: { header: data.donate?.header, title: data.donate?.title, description: data.donate?.description }
    });

    data.banner?.buttons?.forEach(b => this.addButton(this.bannerButtons, b));
    data.banner?.bannerSummary?.forEach(s => this.addSummary(s));
    data.testimonials?.items?.forEach(t => this.addTestimonial(t));
    data.quote?.cards?.forEach(c => this.addQuoteCard(c));
    data.donate?.buttons?.forEach(b => this.addButton(this.donateButtons, b));
    data.partners?.forEach(p => this.addPartner(p));
  }

  clearAllArrays() {
    [this.bannerButtons, this.bannerSummary, this.testimonialItems, this.quoteCards, this.donateButtons, this.partners]
      .forEach(arr => { while (arr.length) arr.removeAt(0); });
  }

  // Helpers for adding items
  addButton(arr: FormArray, data: any = null) {
    arr.push(this.fb.group({ label: [data?.label || ''], link: [data?.link || ''], type: [data?.type || 'primary'] }));
  }

  addSummary(data: any = null) {
    this.bannerSummary.push(this.fb.group({ count: [data?.count || ''], label: [data?.label || ''] }));
  }

  addTestimonial(data: any = null) {
    this.testimonialItems.push(this.fb.group({ text: [data?.text || ''], author: [data?.author || ''], role: [data?.role || ''], image: [data?.image || ''] }));
  }

  addQuoteCard(data: any = null) {
    this.quoteCards.push(this.fb.group({ title: [data?.title || ''], value: [data?.value || ''], icon: [data?.icon || ''] }));
  }

  addPartner(data: any = null) {
    this.partners.push(this.fb.group({ name: [data?.name || ''], logo: [data?.logo || ''] }));
  }

  toggleEditSection(section: string | null) {
    this.editingSection = section;
    this.isEditMode = !!section;
    if (!section && this.homeData) {
      this.patchForm(this.homeData);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editingSection = null;
      if (this.homeData) this.patchForm(this.homeData);
    }
  }
  isUploading(path: string) { return this.uploadingPaths.has(path); }

  onFileSelected(event: any, controlPath: string) {
    const file = event.target.files[0];
    if (file) {
      this.uploadingPaths.add(controlPath);
      this.cdr.detectChanges();
      this.uploadService.uploadFile(file).subscribe({
        next: (url) => {
          this.homeForm.get(controlPath)?.setValue(url);
          this.uploadingPaths.delete(controlPath);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.uploadingPaths.delete(controlPath);
          this.cdr.detectChanges();
          alert('Upload failed: ' + err.message);
        }
      });
    }
  }

  onSubmit() {
    if (this.homeForm.valid) {
      const snapshot = this.homeForm.value;
      this.homeData = { ...this.homeData, ...snapshot };
      this.isEditMode = false;
      this.editingSection = null;
      this.isSaving = true;
      this.cdr.detectChanges();

      this.homeService.create(snapshot).subscribe({
        next: (data) => {
          this.homeData = data;
          this.isSaving = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.cdr.detectChanges();
          alert('Save failed — changes may not have been persisted: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
