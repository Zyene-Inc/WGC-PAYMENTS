import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal.service';
import { ChurchService } from '../../../../services/church.service';
import { NotificationService } from '../../../../services/notification.service';
import { LucideAngularModule, User, Mail, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-donor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="p-8">
      <form [formGroup]="donorForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Name Field -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Legal Name</label>
          <div class="relative group">
            <lucide-icon [img]="User" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <input type="text" formControlName="name" placeholder="Full Legal Name"
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none">
          </div>
          <div *ngIf="donorForm.get('name')?.touched && donorForm.get('name')?.invalid" class="text-[10px] font-bold text-red-500 ml-1 mt-1">
             Name is required for institutional records.
          </div>
        </div>

        <!-- Email Field -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Communication Channel</label>
          <div class="relative group">
            <lucide-icon [img]="Mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <input type="email" formControlName="email" placeholder="email@example.com"
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none">
          </div>
          <div *ngIf="donorForm.get('email')?.touched && donorForm.get('email')?.invalid" class="text-[10px] font-bold text-red-500 ml-1 mt-1">
             A valid email address is required for automated receipting.
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4 pt-4">
          <button type="button" (click)="modalService.close()" 
            class="flex-1 py-4 bg-wgc-off hover:bg-wgc-navy-50 text-wgc-navy-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all">
            Cancel
          </button>
          <button type="submit" [disabled]="donorForm.invalid || isSubmitting"
            class="flex-[2] py-4 bg-wgc-gold-600 hover:bg-wgc-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-wgc-gold-600/20 flex items-center justify-center gap-2">
            <lucide-icon *ngIf="isSubmitting" [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-icon>
            {{ isEdit ? 'Update Donor' : 'Establish Donor Profile' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class DonorFormComponent {
  private fb = inject(FormBuilder);
  modalService = inject(ModalService);
  private churchService = inject(ChurchService);
  private notify = inject(NotificationService);

  isSubmitting = false;
  isEdit = false;
  donorId: string | null = null;

  donorForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  // Data input from ModalService
  set data(val: any) {
    if (val) {
      this.isEdit = true;
      this.donorId = val.id;
      this.donorForm.patchValue({
        name: val.name,
        email: val.email
      });
    }
  }

  readonly User = User;
  readonly Mail = Mail;
  readonly Loader2 = Loader2;

  onSubmit() {
    if (this.donorForm.invalid) return;

    this.isSubmitting = true;
    const obs = this.isEdit 
      ? this.churchService.updateDonor(this.donorId!, this.donorForm.value)
      : this.churchService.createDonor(this.donorForm.value);

    obs.subscribe({
      next: () => {
        this.notify.success(
          this.isEdit ? 'Donor profile updated successfully.' : 'New donor profile established.', 
          'Database Sync Complete'
        );
        this.churchService.refresh$.next();
        this.modalService.close();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error('Failed to save donor information. Please verify network connectivity.', 'Sync Failed');
        console.error(err);
      }
    });
  }
}
