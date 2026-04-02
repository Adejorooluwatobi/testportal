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
        description: [''],
        items: this.fb.array([])
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
  get whatWeDoItems() { return this.homeForm.get('whatWeDo.items') as FormArray; }
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
    data.whatWeDo?.items?.forEach(i => this.addWhatWeDoItem(i));
    data.testimonials?.items?.forEach(t => this.addTestimonial(t));
    data.quote?.cards?.forEach(c => this.addQuoteCard(c));
    data.donate?.buttons?.forEach(b => this.addButton(this.donateButtons, b));
    data.partners?.forEach(p => this.addPartner(p));
  }

  clearAllArrays() {
    [this.bannerButtons, this.bannerSummary, this.whatWeDoItems, this.testimonialItems, this.quoteCards, this.donateButtons, this.partners]
      .forEach(arr => { while (arr.length) arr.removeAt(0); });
  }

  // Helpers for adding items
  addButton(arr: FormArray, data: any = null) {
    arr.push(this.fb.group({ label: [data?.label || ''], link: [data?.link || ''], type: [data?.type || 'primary'] }));
  }

  addSummary(data: any = null) {
    this.bannerSummary.push(this.fb.group({ count: [data?.count || ''], label: [data?.label || ''] }));
  }

  getWhatWeDoImages(index: number) {
    return this.whatWeDoItems.at(index).get('images') as FormArray;
  }

  addWhatWeDoItem(data: any = null) {
    const itemGroup = this.fb.group({
      header: [data?.header || ''],
      title: [data?.title || ''],
      description: [data?.description || ''],
      icon: [data?.icon || ''],
      progress: [data?.progress || 0],
      reaching: [data?.reaching || ''],
      images: this.fb.array([]), // Multiple images support
      buttonText: [data?.buttonText || ''],
      buttonLink: [data?.buttonLink || '']
    });

    // Handle legacy 'image' field and new 'images' array
    const imagesArr = itemGroup.get('images') as FormArray;
    if (data?.images && Array.isArray(data.images)) {
      data.images.forEach((url: string) => imagesArr.push(this.fb.control(url)));
    } else if (data?.image) {
      imagesArr.push(this.fb.control(data.image));
    }

    this.whatWeDoItems.push(itemGroup);
  }

  removeWhatWeDoImage(itemIndex: number, imgIndex: number) {
    this.getWhatWeDoImages(itemIndex).removeAt(imgIndex);
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
  onFileSelected(event: any, controlPath: string) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.uploadService.uploadFile(file).subscribe({
        next: (url) => {
          this.homeForm.get(controlPath)?.setValue(url);
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

  onGalleryFileSelected(event: any, itemIndex: number) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.isLoading = true;
      this.uploadService.uploadMultipleFiles(files).subscribe({
        next: (urls: string[]) => {
          const imagesArr = this.getWhatWeDoImages(itemIndex);
          urls.forEach(url => imagesArr.push(this.fb.control(url)));
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('One or more uploads failed: ' + err.message);
        }
      });
    }
  }

  onSubmit() {
    if (this.homeForm.valid) {
      this.isLoading = true;
      this.homeService.create(this.homeForm.value).subscribe({
        next: (data) => {
          this.homeData = data;
          this.isEditMode = false;
          this.editingSection = null;
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Homepage updated successfully!');
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Error updating homepage: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
