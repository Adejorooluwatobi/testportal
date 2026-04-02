import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { AboutService } from '../../../services/about.service';
import { About } from '../../../models/about.model';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-about-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class AboutComponent implements OnInit {
  aboutForm: FormGroup;
  isEditMode = false;
  editingSection: string | null = null;
  isLoading = true;
  isSaving = false;
  uploadingPaths = new Set<string>(); // tracks per-field upload spinner
  about: About | null = null;

  constructor(
    private fb: FormBuilder,
    private aboutService: AboutService,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.aboutForm = this.fb.group({
      banner: this.fb.group({
        header: [''],
        title: [''],
        description: ['']
      }),
      ourMission: this.fb.group({
        header: [''],
        title: [''],
        description: [''],
        cards: this.fb.array([])
      }),
      ourVision: this.fb.group({
        icon: [''],
        title: [''],
        description: [''],
        progress: [0]
      }),
      team: this.fb.group({
        header: [''],
        title: [''],
        description: [''],
        card: this.fb.array([])
      }),
      ourJourney: this.fb.array([])
    });
  }

  get missionCards() { return this.aboutForm.get('ourMission.cards') as FormArray; }
  get teamCards() { return this.aboutForm.get('team.card') as FormArray; }
  get journeyItems() { return this.aboutForm.get('ourJourney') as FormArray; }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.aboutService.get().subscribe({
      next: (data) => {
        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          this.about = result;
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

  patchForm(data: About) {
    // Clear arrays first
    while (this.missionCards.length) this.missionCards.removeAt(0);
    while (this.teamCards.length) this.teamCards.removeAt(0);
    while (this.journeyItems.length) this.journeyItems.removeAt(0);

    // Patch basic fields
    this.aboutForm.patchValue({
      banner: {
        header: data.banner?.header || '',
        title: data.banner?.title || '',
        description: data.banner?.description || ''
      },
      ourMission: {
        header: data.ourMission?.header || '',
        title: data.ourMission?.title || '',
        description: data.ourMission?.description || ''
      },
      ourVision: {
        icon: data.ourVision?.icon || '',
        title: data.ourVision?.title || '',
        description: data.ourVision?.description || '',
        progress: data.ourVision?.progress || 0
      },
      team: {
        header: data.team?.header || '',
        title: data.team?.title || '',
        description: data.team?.description || ''
      }
    });

    // Add array items
    data.ourMission?.cards?.forEach(card => this.addMissionCard(card));
    data.team?.card?.forEach(member => this.addTeamCard(member));
    data.ourJourney?.forEach(item => this.addJourneyItem(item));
  }

  addMissionCard(data: any = null) {
    this.missionCards.push(this.fb.group({
      title: [data?.title || ''],
      description: [data?.description || ''],
      icon: [data?.icon || '']
    }));
  }

  removeMissionCard(index: number) { this.missionCards.removeAt(index); }

  addTeamCard(member: any = null) {
    const cardGroup = this.fb.group({
      name: [member?.name || ''],
      role: [member?.role || ''],
      image: [member?.image || ''],
      socials: this.fb.array([])
    });

    if (member?.socials) {
      member.socials.forEach((social: any) => this.addTeamSocialToGroup(cardGroup.get('socials') as FormArray, social));
    }

    this.teamCards.push(cardGroup);
  }

  removeTeamCard(index: number) { this.teamCards.removeAt(index); }

  getTeamSocials(memberIndex: number) {
    return this.teamCards.at(memberIndex).get('socials') as FormArray;
  }

  addTeamSocialToGroup(socialsArr: FormArray, data: any = null) {
    socialsArr.push(this.fb.group({
      link: [data?.link || ''],
      icon: [data?.icon || '']
    }));
  }

  addTeamSocial(memberIndex: number) {
    this.addTeamSocialToGroup(this.getTeamSocials(memberIndex));
  }

  removeTeamSocial(memberIndex: number, socialIndex: number) {
    this.getTeamSocials(memberIndex).removeAt(socialIndex);
  }

  addJourneyItem(data: any = null) {
    this.journeyItems.push(this.fb.group({
      year: [data?.year || ''],
      title: [data?.title || ''],
      description: [data?.description || '']
    }));
  }

  removeJourneyItem(index: number) { this.journeyItems.removeAt(index); }

  toggleEditSection(section: string | null) {
    this.editingSection = section;
    this.isEditMode = !!section;
    if (!section && this.about) {
      this.patchForm(this.about);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editingSection = null;
      if (this.about) {
        this.patchForm(this.about);
      }
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
          this.aboutForm.get(controlPath)?.setValue(url);
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
    if (this.aboutForm.valid) {
      // Optimistic: exit edit mode immediately, save silently in background
      const snapshot = this.aboutForm.value;
      this.about = { ...this.about, ...snapshot };
      this.isEditMode = false;
      this.editingSection = null;
      this.isSaving = true;
      this.cdr.detectChanges();

      this.aboutService.create(snapshot).subscribe({
        next: (data) => {
          this.about = data;
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
