import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal.service';
import { ChurchService } from '../../../../services/church.service';
import { NotificationService } from '../../../../services/notification.service';
import { LucideAngularModule, DollarSign, User, Tag, CreditCard, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="p-8">
      <form [formGroup]="donationForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Donor Selection -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Select Donor</label>
          <div class="relative group">
            <lucide-icon [img]="User" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <select formControlName="donorId" 
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 focus:outline-none transition-all outline-none appearance-none">
              <option value="" disabled>Select a donor from your registry</option>
              <option *ngFor="let donor of donors" [value]="donor.id">{{ donor.name }} ({{ donor.email }})</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Amount Field -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Contribution Amount</label>
            <div class="relative group">
              <lucide-icon [img]="DollarSign" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
              <input type="number" formControlName="amount" placeholder="0.00"
                class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 focus:outline-none transition-all outline-none">
            </div>
          </div>

          <!-- Method Field -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Payment Channel</label>
            <div class="relative group">
              <lucide-icon [img]="CreditCard" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
              <select formControlName="method" 
                class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 focus:outline-none transition-all outline-none appearance-none">
                <option value="CARD">Credit/Debit Card</option>
                <option value="ACH">ACH Transfer</option>
                <option value="CASH">Cash Contribution</option>
                <option value="CHECK">Check Payment</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Campaign/Fund Selection -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] ml-1">Designated Fund</label>
          <div class="relative group">
            <lucide-icon [img]="Tag" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <select formControlName="campaignId" 
              class="w-full pl-12 pr-4 py-4 bg-wgc-off border-2 border-transparent focus:border-wgc-gold-600/20 focus:bg-white rounded-2xl text-sm font-bold text-wgc-navy-950 focus:outline-none transition-all outline-none appearance-none">
              <option value="">General Fund</option>
              <option *ngFor="let campaign of campaigns" [value]="campaign.id">{{ campaign.name }}</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4 pt-4">
          <button type="button" (click)="modalService.close()" 
            class="flex-1 py-4 bg-wgc-off hover:bg-wgc-navy-50 text-wgc-navy-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all">
            Cancel
          </button>
          <button type="submit" [disabled]="donationForm.invalid || isSubmitting"
            class="flex-[2] py-4 bg-wgc-gold-600 hover:bg-wgc-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-wgc-gold-600/20 flex items-center justify-center gap-2">
            <lucide-icon *ngIf="isSubmitting" [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-icon>
            Record Contribution
          </button>
        </div>
      </form>
    </div>
  `
})
export class DonationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  modalService = inject(ModalService);
  private churchService = inject(ChurchService);
  private notify = inject(NotificationService);

  isSubmitting = false;
  donors: any[] = [];
  campaigns: any[] = [];

  donationForm = this.fb.group({
    donorId: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    method: ['CARD', [Validators.required]],
    campaignId: ['']
  });

  readonly User = User;
  readonly DollarSign = DollarSign;
  readonly CreditCard = CreditCard;
  readonly Tag = Tag;
  readonly Loader2 = Loader2;

  ngOnInit() {
    this.churchService.getDonors().subscribe(data => this.donors = data);
    this.churchService.getCampaigns().subscribe(data => this.campaigns = data);
  }

  onSubmit() {
    if (this.donationForm.invalid) return;

    this.isSubmitting = true;
    this.churchService.createDonation(this.donationForm.value).subscribe({
      next: () => {
        this.notify.success('Contribution recorded and audited.', 'Ledger Updated');
        this.churchService.refresh$.next();
        this.modalService.close();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notify.error('Failed to record contribution. Verify donor standing.', 'Ledger Error');
        console.error(err);
      }
    });
  }
}
