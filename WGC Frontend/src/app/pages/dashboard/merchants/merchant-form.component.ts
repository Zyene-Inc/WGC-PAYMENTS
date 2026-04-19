import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { DashboardService } from '../../../services/dashboard.service';
import { NotificationService } from '../../../services/notification.service';
import { LucideAngularModule, Building2, Mail, Globe, Loader2, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-merchant-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="p-8">
      <form [formGroup]="merchantForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Church Name -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Legal Entity Name</label>
          <div class="relative group">
            <lucide-icon [img]="Building2" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <input type="text" formControlName="name" placeholder="Official Church Name"
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none">
          </div>
        </div>

        <!-- Admin Email -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Administrative Contact</label>
          <div class="relative group">
            <lucide-icon [img]="Mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <input type="email" formControlName="email" placeholder="admin@church.org"
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none">
          </div>
        </div>

        <!-- Custom Slug -->
        <div class="space-y-2">
           <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Institutional URL Slug</label>
           <div class="relative group">
             <lucide-icon [img]="Globe" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
             <input type="text" formControlName="slug" placeholder="e.g. grace-community"
               class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 placeholder:text-wgc-navy-200 focus:outline-none transition-all outline-none font-mono">
             <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-wgc-navy-200 uppercase tracking-widest">
               .wgc.app
             </div>
           </div>
           <p class="text-[9px] font-bold text-wgc-navy-300 ml-1 italic">The public address for this church's secure donation portal.</p>
        </div>

        <!-- Compliance Note -->
        <div class="p-4 bg-wgc-gold-50 border border-wgc-gold-100 rounded-2xl flex items-start gap-3">
           <lucide-icon [img]="ShieldCheck" class="w-4 h-4 text-wgc-gold-600 shrink-0 mt-0.5"></lucide-icon>
           <p class="text-[10px] font-bold text-wgc-gold-800 leading-relaxed italic">
             By establishing this merchant profile, you confirm the entity has been vetted for compliance with global payment standards. An onboarding link will be dispatched to the administrative contact.
           </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4 pt-4">
          <button type="button" (click)="modalService.close()" 
            class="flex-1 py-4 bg-wgc-off hover:bg-wgc-navy-50 text-wgc-navy-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all">
            Cancel
          </button>
          <button type="submit" [disabled]="merchantForm.invalid || isSubmitting"
            class="flex-[2] py-4 bg-wgc-gold-600 hover:bg-wgc-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-wgc-gold-600/20 flex items-center justify-center gap-2">
            <lucide-icon *ngIf="isSubmitting" [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-icon>
            Register Merchant
          </button>
        </div>
      </form>
    </div>
  `
})
export class MerchantFormComponent {
  private fb = inject(FormBuilder);
  modalService = inject(ModalService);
  private dashboardService = inject(DashboardService);
  private notify = inject(NotificationService);

  isSubmitting = false;

  merchantForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    slug: ['', [Validators.pattern(/^[a-z0-9-]+$/)]]
  });

  readonly Building2 = Building2;
  readonly Mail = Mail;
  readonly Globe = Globe;
  readonly ShieldCheck = ShieldCheck;
  readonly Loader2 = Loader2;

  onSubmit() {
    if (this.merchantForm.invalid) return;

    this.isSubmitting = true;
    
    // partnerId should come from the logged in user eventually
    // for now we use a placeholder or handle it in service/backend
    const data = {
      ...this.merchantForm.value,
      partnerId: 'default' // Placeholder for now
    };

    this.dashboardService.createMerchant(data).subscribe({
      next: () => {
        this.notify.success('Merchant profile established. Onboarding initiated.', 'Entity Registered');
        this.dashboardService.refresh$.next();
        this.modalService.close();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error('Failed to register merchant. Verify slug uniqueness.', 'System Error');
        console.error(err);
      }
    });
  }
}
