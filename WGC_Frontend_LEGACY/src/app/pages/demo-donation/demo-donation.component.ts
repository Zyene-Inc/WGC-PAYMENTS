import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Church, CheckCircle, HelpCircle, Loader2, AlertCircle, ShieldCheck } from 'lucide-angular';
import { DonationService } from '../../services/donation.service';

@Component({
  selector: 'app-demo-donation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './demo-donation.component.html',
  styleUrl: './demo-donation.component.css'
})
export class DemoDonationComponent {
  private donationService = inject(DonationService);

  readonly ChurchIcon = Church;
  readonly CheckCircle = CheckCircle;
  readonly HelpCircle = HelpCircle;
  readonly LoaderIcon = Loader2;
  readonly ErrorIcon = AlertCircle;
  readonly ShieldCheck = ShieldCheck;

  isSubmitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  
  funds = ['General Giving', 'Missions', 'Global Relief Fund'];
  selectedFund = signal(this.funds[0]);
  
  presetAmounts = [25, 50, 100, 250];
  selectedPreset = signal<number | null>(100);
  customAmount = signal<number | null>(null);

  donorName = '';
  donorEmail = '';

  coverFee = signal(false);
  isRecurring = signal(false);

  paymentMethod = signal<'card' | 'ach'>('card');

  // Card placeholders
  cardNumber = '';
  expiry = '';
  cvc = '';

  // ACH placeholders
  routingNumber = '';
  accountNumber = '';

  selectFund(fund: string) {
    this.selectedFund.set(fund);
  }

  selectPreset(amount: number) {
    this.selectedPreset.set(amount);
    this.customAmount.set(null);
  }

  onCustomAmountChange(val: string) {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      this.customAmount.set(num);
      this.selectedPreset.set(null);
    } else {
      this.customAmount.set(null);
    }
  }

  baseAmount = computed(() => {
    return this.selectedPreset() || this.customAmount() || 0;
  });

  totalAmount = computed(() => {
    const base = this.baseAmount();
    if (this.coverFee() && base > 0) {
      if (this.paymentMethod() === 'card') {
        return base + (base * 0.023) + 0.25;
      } else {
        return base + 0.25; // WGC Flat Rate ACH fee 
      }
    }
    return base;
  });

  submitDonation(event: Event) {
    event.preventDefault();
    if (this.baseAmount() > 0 && this.donorName && this.donorEmail) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.donationService.processDonation({
        donorName: this.donorName,
        donorEmail: this.donorEmail,
        cardNumber: this.cardNumber,
        expiry: this.expiry,
        cvc: this.cvc,
        amount: this.totalAmount(),
        fund: this.selectedFund(),
        coverFee: this.coverFee(),
        isRecurring: this.isRecurring()
      }).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.isSubmitted.set(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Transaction failed. Please try again with valid demo data.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }
}
