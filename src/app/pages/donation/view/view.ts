import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DonationService } from '../../../services/donation.service';
import { Donation } from '../../../models/donation.model';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-donation-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class DonationComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  editingSection: string | null = null;
  isLoading = false;
  data: Donation | null = null;

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      banner: this.fb.group({
        header: [''],
        title: [''],
        description: ['']
      }),
      choose: this.fb.group({
        suggestedAmounts: this.fb.array([]),
        programs: this.fb.array([])
      }),
      addition: this.fb.array([]),
      card: this.fb.array([]),
      details: this.fb.array([])
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  get suggestedAmounts() { return this.form.get('choose.suggestedAmounts') as FormArray; }
  get programs() { return this.form.get('choose.programs') as FormArray; }
  get addition() { return this.form.get('addition') as FormArray; }
  get card() { return this.form.get('card') as FormArray; }
  get details() { return this.form.get('details') as FormArray; }

  fetchData() {
    this.isLoading = true;
    this.donationService.get().subscribe({
      next: (res: any) => {
        this.data = Array.isArray(res) ? res[0] : res;
        if (this.data) {
          this.patchForm(this.data);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  patchForm(data: Donation) {
    // Clear arrays
    while (this.suggestedAmounts.length) this.suggestedAmounts.removeAt(0);
    while (this.programs.length) this.programs.removeAt(0);
    while (this.addition.length) this.addition.removeAt(0);
    while (this.card.length) this.card.removeAt(0);
    while (this.details.length) this.details.removeAt(0);

    // Patch Banner
    this.form.get('banner')?.patchValue({
      header: data.banner?.header || '',
      title: data.banner?.title || '',
      description: data.banner?.description || ''
    });

    // Patch Choose Arrays
    if (data.choose?.suggestedAmounts) {
      data.choose.suggestedAmounts.forEach(val => this.suggestedAmounts.push(this.fb.control(val)));
    }
    if (data.choose?.programs) {
      data.choose.programs.forEach(val => this.programs.push(this.fb.control(val)));
    }

    // Patch Addition
    if (data.addition) {
      data.addition.forEach(item => {
        this.addition.push(this.fb.group({
          header: [item.header || ''],
          description: [item.description || '']
        }));
      });
    }

    // Patch Cards
    if (data.card) {
      data.card.forEach(c => {
        const itemsArray = this.fb.array((c.items || []).map(i => this.fb.group({
          figure: [i.figure || ''],
          details: [i.details || '']
        })));
        this.card.push(this.fb.group({
          header: [c.header || ''],
          annualGoal: [c.annualGoal || 0],
          amountRaised: [c.amountRaised || 0],
          progress: [c.progress || 0],
          items: itemsArray
        }));
      });
    }

    // Patch Details
    if (data.details) {
      data.details.forEach(d => {
        this.details.push(this.fb.group({
          header: [d.header || ''],
          accountname: [d.accountname || ''],
          bank: [d.bank || ''],
          accountno: [d.accountno || ''],
          text: [d.text || '']
        }));
      });
    }
  }

  addAmount() { this.suggestedAmounts.push(this.fb.control(0)); }
  removeAmount(i: number) { this.suggestedAmounts.removeAt(i); }

  addProgram() { this.programs.push(this.fb.control('')); }
  removeProgram(i: number) { this.programs.removeAt(i); }

  addAddition() { 
    this.addition.push(this.fb.group({
      header: [''],
      description: ['']
    })); 
  }
  removeAddition(i: number) { this.addition.removeAt(i); }

  addCard() {
    this.card.push(this.fb.group({
      header: [''],
      annualGoal: [0],
      amountRaised: [0],
      progress: [0],
      items: this.fb.array([this.fb.group({ figure: [''], details: [''] })])
    }));
  }
  removeCard(i: number) { this.card.removeAt(i); }

  addCardItem(cardIndex: number) {
    (this.card.at(cardIndex).get('items') as FormArray).push(this.fb.group({ figure: [''], details: [''] }));
  }
  removeCardItem(cardIndex: number, itemIndex: number) {
    (this.card.at(cardIndex).get('items') as FormArray).removeAt(itemIndex);
  }

  onAmountChange(i: number) {
    const group = this.card.at(i);
    const goal = group.get('annualGoal')?.value || 0;
    const raised = group.get('amountRaised')?.value || 0;
    if (goal > 0) {
      const progress = Math.round((raised / goal) * 100);
      group.get('progress')?.patchValue(progress, { emitEvent: false });
    }
  }

  onProgressChange(i: number) {
    const group = this.card.at(i);
    const goal = group.get('annualGoal')?.value || 0;
    const progress = group.get('progress')?.value || 0;
    if (goal > 0) {
      const raised = Math.round((progress / 100) * goal);
      group.get('amountRaised')?.patchValue(raised, { emitEvent: false });
    }
  }

  addDetail() {
    this.details.push(this.fb.group({
      header: [''],
      accountname: [''],
      bank: [''],
      accountno: [''],
      text: ['']
    }));
  }
  removeDetail(i: number) { this.details.removeAt(i); }

  toggleEditSection(section: string | null) {
    this.editingSection = section;
    this.isEditMode = !!section;
    if (!section && this.data) {
      this.patchForm(this.data);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editingSection = null;
      if (this.data) this.patchForm(this.data);
    }
  }

  getCardItems(i: number): FormArray {
    return this.card.at(i).get('items') as FormArray;
  }

  onSubmit() {
    this.isLoading = true;
    this.donationService.create(this.form.value).subscribe({
      next: (res: any) => {
        this.data = Array.isArray(res) ? res[0] : res;
        this.patchForm(this.data!);
        this.isEditMode = false;
        this.editingSection = null;
        this.isLoading = false;
        this.cdr.detectChanges();
        alert('Donation page updated successfully!');
      },
      error: () => this.isLoading = false
    });
  }
}
