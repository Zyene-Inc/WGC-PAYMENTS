import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal.service';
import { ChurchService } from '../../../../services/church.service';
import { NotificationService } from '../../../../services/notification.service';
import { LucideAngularModule, Flag, AlignLeft, DollarSign, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="p-8">
      <form [formGroup]="campaignForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Name Field -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Initiative Name</label>
          <div class="relative group">
            <lucide-icon [img]="Flag" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <input type="text" formControlName="name" placeholder="e.g. 2024 Building Expansion"
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none">
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Mission Narrative</label>
          <div class="relative group">
            <lucide-icon [img]="AlignLeft" class="absolute left-4 top-4 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <textarea formControlName="description" placeholder="Describe the impact and vision for this campaign..." rows="4"
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none resize-none"></textarea>
          </div>
        </div>

        <!-- Goal Amount -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Institutional Goal (Target)</label>
          <div class="relative group">
            <lucide-icon [img]="DollarSign" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <input type="number" formControlName="goalAmount" placeholder="0.00 (Optional)"
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none">
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4 pt-4">
          <button type="button" (click)="modalService.close()" 
            class="flex-1 py-4 bg-wgc-off hover:bg-wgc-navy-50 text-wgc-navy-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all">
            Cancel
          </button>
          <button type="submit" [disabled]="campaignForm.invalid || isSubmitting"
            class="flex-[2] py-4 bg-wgc-gold-600 hover:bg-wgc-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-wgc-gold-600/20 flex items-center justify-center gap-2">
            <lucide-icon *ngIf="isSubmitting" [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-icon>
            Launch Initiative
          </button>
        </div>
      </form>
    </div>
  `
})
export class CampaignFormComponent {
  private fb = inject(FormBuilder);
  modalService = inject(ModalService);
  private churchService = inject(ChurchService);
  private notify = inject(NotificationService);

  isSubmitting = false;

  campaignForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    goalAmount: ['']
  });

  readonly Flag = Flag;
  readonly AlignLeft = AlignLeft;
  readonly DollarSign = DollarSign;
  readonly Loader2 = Loader2;

  onSubmit() {
    if (this.campaignForm.invalid) return;

    this.isSubmitting = true;
    this.churchService.createCampaign(this.campaignForm.value).subscribe({
      next: () => {
        this.notify.success('New mission initiative established.', 'Campaign Registered');
        this.churchService.refresh$.next();
        this.modalService.close();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error('Failed to establish initiative. Check network logs.', 'System Error');
        console.error(err);
      }
    });
  }
}
