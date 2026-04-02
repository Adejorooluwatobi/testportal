import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { VolunteerService } from '../../../services/volunteer.service';
import { Volunteer } from '../../../models/volunteer.model';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-volunteer-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class VolunteerComponent implements OnInit {
  volunteerForm: FormGroup;
  isEditMode = false;
  editingSection: string | null = null;
  isLoading = true;
  volunteerData: Volunteer | null = null;

  constructor(
    private fb: FormBuilder,
    private volunteerService: VolunteerService,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.volunteerForm = this.fb.group({
      banner: this.fb.group({
        header: [''],
        title: [''],
        description: ['']
      }),
      header: [''],
      title: [''],
      card: this.fb.array([])
    });
  }

  get volunteerCards() { return this.volunteerForm.get('card') as FormArray; }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.volunteerService.get().subscribe({
      next: (data) => {
        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          this.volunteerData = result;
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

  patchForm(data: Volunteer) {
    while (this.volunteerCards.length) this.volunteerCards.removeAt(0);
    this.volunteerForm.patchValue({
      banner: {
        header: data.banner?.header || '',
        title: data.banner?.title || '',
        description: data.banner?.description || ''
      },
      header: data.header || '',
      title: data.title || ''
    });
    data.card?.forEach(c => this.addCard(c));
  }

  addCard(data: any = null) {
    this.volunteerCards.push(this.fb.group({
      title: [data?.title || ''],
      description: [data?.description || ''],
      icon: [data?.icon || '']
    }));
  }

  removeCard(index: number) { this.volunteerCards.removeAt(index); }

  toggleEditSection(section: string | null) {
    this.editingSection = section;
    this.isEditMode = !!section;
    if (!section && this.volunteerData) {
      this.patchForm(this.volunteerData);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editingSection = null;
      if (this.volunteerData) this.patchForm(this.volunteerData);
    }
  }

  onFileSelected(event: any, controlPath: string) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.uploadService.uploadFile(file).subscribe({
        next: (url) => {
          this.volunteerForm.get(controlPath)?.setValue(url);
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
    if (this.volunteerForm.valid) {
      this.isLoading = true;
      this.volunteerService.create(this.volunteerForm.value).subscribe({
        next: (data) => {
          this.volunteerData = data;
          this.isEditMode = false;
          this.editingSection = null;
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Volunteer page updated successfully!');
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
