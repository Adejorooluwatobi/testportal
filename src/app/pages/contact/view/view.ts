import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../../models/contact.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  editingSection: string | null = null;
  isLoading = true;
  contact: Contact | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      header: [''],
      title: [''],
      description: [''],
      contactInformation: this.fb.group({
        ourOffice: this.fb.array([]),
        phoneNumbers: this.fb.array([]),
        emailAddress: this.fb.array([])
      })
    });
  }

  get officeItems() { return this.contactForm.get('contactInformation.ourOffice') as FormArray; }
  get phoneItems() { return this.contactForm.get('contactInformation.phoneNumbers') as FormArray; }
  get emailItems() { return this.contactForm.get('contactInformation.emailAddress') as FormArray; }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.contactService.get().subscribe({
      next: (data) => {
        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          this.contact = result;
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

  patchForm(data: Contact) {
    while (this.officeItems.length) this.officeItems.removeAt(0);
    while (this.phoneItems.length) this.phoneItems.removeAt(0);
    while (this.emailItems.length) this.emailItems.removeAt(0);

    this.contactForm.patchValue({
      header: data.header || '',
      title: data.title || '',
      description: data.description || ''
    });

    data.contactInformation?.ourOffice?.forEach(item => this.addOfficeItem(item));
    data.contactInformation?.phoneNumbers?.forEach(item => this.addPhoneItem(item));
    data.contactInformation?.emailAddress?.forEach(item => this.addEmailItem(item));
  }

  addOfficeItem(val: string = '') { this.officeItems.push(this.fb.control(val)); }
  removeOfficeItem(index: number) { this.officeItems.removeAt(index); }

  addPhoneItem(val: string = '') { this.phoneItems.push(this.fb.control(val)); }
  removePhoneItem(index: number) { this.phoneItems.removeAt(index); }

  addEmailItem(val: string = '') { this.emailItems.push(this.fb.control(val)); }
  removeEmailItem(index: number) { this.emailItems.removeAt(index); }

  toggleEditSection(section: string | null) {
    this.editingSection = section;
    this.isEditMode = !!section;
    if (!section && this.contact) {
      this.patchForm(this.contact);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editingSection = null;
      if (this.contact) {
        this.patchForm(this.contact);
      }
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.contactService.create(this.contactForm.value).subscribe({
        next: (data) => {
          this.contact = data;
          this.isEditMode = false;
          this.editingSection = null;
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Contact page updated successfully!');
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Error updating Contact page: ' + err.message);
        }
      });
    }
  }
}
