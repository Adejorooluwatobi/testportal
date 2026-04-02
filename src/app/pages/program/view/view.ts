import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ProgramService } from '../../../services/program.service';
import { Program } from '../../../models/program.model';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../services/upload.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-program-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class ProgramComponent implements OnInit {
  programForm: FormGroup;
  isEditMode = false;
  editingSection: string | null = null;
  isLoading = true;
  isSaving = false;
  uploadingPaths = new Set<string>();
  programData: Program | null = null;

  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.programForm = this.fb.group({
      banner: this.fb.group({
        header: [''],
        title: [''],
        description: ['']
      }),
      card: this.fb.array([])
    });
  }

  get programCards() { return this.programForm.get('card') as FormArray; }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.programService.get().subscribe({
      next: (data) => {
        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          this.programData = result;
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

  patchForm(data: Program) {
    while (this.programCards.length) this.programCards.removeAt(0);
    this.programForm.patchValue({
      banner: {
        header: data.banner?.header || '',
        title: data.banner?.title || '',
        description: data.banner?.description || ''
      }
    });
    data.card?.forEach(c => this.addCard(c));
  }

  getCardImages(index: number) {
    return this.programCards.at(index).get('images') as FormArray;
  }

  addCard(data: any = null) {
    const cardGroup = this.fb.group({
      header: [data?.header || ''],
      title: [data?.title || ''],
      description: [data?.description || ''],
      progress: [data?.progress || 0],
      reaching: [data?.reaching || ''],
      icon: [data?.icon || ''],
      images: this.fb.array([]), // Multiple images support
      buttonText: [data?.buttonText || ''],
      buttonLink: [data?.buttonLink || '']
    });

    // Handle legacy 'image' field and new 'images' array
    const imagesArr = cardGroup.get('images') as FormArray;
    if (data?.images && Array.isArray(data.images)) {
      data.images.forEach((url: string) => imagesArr.push(this.fb.control(url)));
    } else if (data?.image) {
      imagesArr.push(this.fb.control(data.image));
    }

    this.programCards.push(cardGroup);
  }

  removeCardImage(cardIndex: number, imgIndex: number) {
    this.getCardImages(cardIndex).removeAt(imgIndex);
  }

  removeCard(index: number) { this.programCards.removeAt(index); }

  toggleEditSection(section: string | null) {
    this.editingSection = section;
    this.isEditMode = !!section;
    if (!section && this.programData) {
      this.patchForm(this.programData);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editingSection = null;
      if (this.programData) this.patchForm(this.programData);
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
          this.programForm.get(controlPath)?.setValue(url);
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

  onGalleryFileSelected(event: any, cardIndex: number) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const galleryKey = `gallery_prog_${cardIndex}`;
      this.uploadingPaths.add(galleryKey);
      this.cdr.detectChanges();
      this.uploadService.uploadMultipleFiles(files).subscribe({
        next: (urls: string[]) => {
          const imagesArr = this.getCardImages(cardIndex);
          urls.forEach(url => imagesArr.push(this.fb.control(url)));
          this.uploadingPaths.delete(galleryKey);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.uploadingPaths.delete(galleryKey);
          this.cdr.detectChanges();
          alert('One or more uploads failed: ' + err.message);
        }
      });
    }
  }

  onSubmit() {
    if (this.programForm.valid) {
      const snapshot = this.programForm.value;
      this.programData = { ...this.programData, ...snapshot };
      this.isEditMode = false;
      this.editingSection = null;
      this.isSaving = true;
      this.cdr.detectChanges();

      this.programService.create(snapshot).subscribe({
        next: (data) => {
          this.programData = data;
          this.isSaving = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.cdr.detectChanges();
          alert('Save failed — changes may not have been persisted: ' + err.message);
        }
      });
    }
  }
}
