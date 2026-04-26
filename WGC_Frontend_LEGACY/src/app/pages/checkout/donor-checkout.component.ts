import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../services/checkout.service';
import { LucideAngularModule, CreditCard, Landmark, RefreshCcw, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-donor-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-wgc-gray-50 py-12 px-6">
      <div class="max-w-xl mx-auto">
        <!-- Success State -->
        <div *ngIf="success()" class="bg-wgc-white rounded-3xl p-16 shadow-xl border border-wgc-navy-100 text-center animate-in zoom-in duration-500">
          <div class="h-16 w-auto mx-auto mb-10">
             <img src="/wgc-brand-final.png" alt="WGC Payments" class="h-full w-auto mx-auto object-contain">
          </div>

          <p class="text-[10px] font-bold text-wgc-gold-600 uppercase tracking-[0.4em] mb-4">Transaction Confirmed</p>
          <h2 class="text-3xl font-extrabold text-wgc-navy-900 mb-8 tracking-tight">Thank you for your gift.</h2>
          
          <p class="text-wgc-navy-400 mb-10 leading-relaxed font-medium text-sm">
            Your gift of <span class="text-wgc-navy-900 font-bold">{{ amount() | currency }}</span> has been successfully processed for 
            <span class="text-wgc-navy-900 font-bold">{{ church()?.name }}</span>.
          </p>
          <div class="space-y-4 max-w-sm mx-auto">
             <button class="w-full py-4 bg-wgc-white text-wgc-navy-900 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-wgc-navy-50 transition-all text-[11px]">
               Download Receipt
             </button>
             <button (click)="success.set(false)" class="w-full py-4 bg-wgc-white border border-wgc-navy-100 text-wgc-navy-400 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-wgc-navy-50 transition-all text-[11px]">
               Return to Giving
             </button>
          </div>
        </div>

        <!-- Checkout Form -->
        <div *ngIf="!success()" class="bg-wgc-white rounded-3xl shadow-xl border border-wgc-navy-100/30 overflow-hidden">
          <div class="bg-wgc-white p-12 text-wgc-navy-900 text-center">
            <div class="h-14 w-auto mx-auto mb-8">
              <img src="/wgc-brand-final.png" alt="WGC Payments" class="h-full w-auto mx-auto object-contain">
            </div>
            <h1 class="text-2xl font-extrabold tracking-tight text-wgc-navy-900">{{ church()?.name || 'Loading Church...' }}</h1>
            <p class="text-wgc-gold-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-2">{{ campaign() }}</p>
          </div>

          <div class="p-10 space-y-10">
            <div class="space-y-4">
              <label class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest pl-1">Amount</label>
              <div class="grid grid-cols-4 gap-3">
                <button *ngFor="let p of presets" 
                  (click)="amount.set(p)"
                  [ngClass]="amount() === p ? 'bg-wgc-white text-wgc-navy-900 border-wgc-navy-900 shadow-lg' : 'bg-wgc-gray-50 text-wgc-navy-600 border-wgc-navy-100 hover:bg-wgc-gray-100'"
                  class="py-4 rounded-xl border font-bold transition-all text-base">
                  {{ p | currency:'USD':'symbol':'1.0' }}
                </button>
              </div>
              <div class="relative mt-4">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-wgc-navy-400 font-bold text-xl">$</span>
                <input type="number" [(ngModel)]="customAmount" (input)="onCustomAmountChange()" 
                  class="w-full pl-14 pr-6 py-4 bg-wgc-gray-50 border border-wgc-navy-100 rounded-xl focus:outline-none focus:border-wgc-navy-900 font-bold text-lg transition-all"
                  placeholder="Other Amount">
              </div>
            </div>

            <div class="flex items-center justify-between p-6 bg-wgc-gray-50 rounded-2xl border border-wgc-navy-100 mb-4">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-wgc-gold-500/10 text-wgc-gold-600 rounded-xl">
                  <lucide-icon [img]="ShieldCheck" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <p class="text-[11px] font-bold text-wgc-navy-900 uppercase tracking-widest leading-none">Cover processing fees</p>
                  <p class="text-[9px] text-wgc-navy-400 font-medium mt-1 uppercase tracking-wider">Ensure 100% of your gift reaches the mission</p>
                </div>
              </div>
              <button (click)="coverFees.set(!coverFees())" 
                 class="w-14 h-7 rounded-full transition-all flex items-center px-1 border border-wgc-navy-100"
                 [ngClass]="coverFees() ? 'bg-wgc-gold-500' : 'bg-wgc-navy-100'">
                 <div class="w-5 h-5 bg-wgc-white rounded-full transition-transform" [ngClass]="coverFees() ? 'translate-x-7' : 'translate-x-0'"></div>
              </button>
            </div>

            <div class="flex items-center justify-between p-6 bg-wgc-gray-50 rounded-2xl border border-wgc-navy-100">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-wgc-gold-500/10 text-wgc-gold-600 rounded-xl">
                  <lucide-icon [img]="RefreshCcw" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <p class="text-[11px] font-bold text-wgc-navy-900 uppercase tracking-widest leading-none">Start monthly partnership</p>
                </div>
              </div>
              <button (click)="isRecurring.set(!isRecurring())" 
                 class="w-14 h-7 rounded-full transition-all flex items-center px-1 border border-wgc-navy-100"
                 [ngClass]="isRecurring() ? 'bg-wgc-gold-500' : 'bg-wgc-navy-100'">
                 <div class="w-5 h-5 bg-wgc-white rounded-full transition-transform" [ngClass]="isRecurring() ? 'translate-x-7' : 'translate-x-0'"></div>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest pl-1">Full Name</label>
                <input type="text" [(ngModel)]="donorName" class="w-full px-5 py-4 bg-wgc-gray-50 border border-wgc-navy-100 rounded-xl focus:outline-none focus:border-wgc-navy-900 font-bold text-sm">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest pl-1">Email Address</label>
                <input type="email" [(ngModel)]="donorEmail" class="w-full px-5 py-4 bg-wgc-gray-50 border border-wgc-navy-100 rounded-xl focus:outline-none focus:border-wgc-navy-900 font-bold text-sm">
              </div>
            </div>

            <button (click)="onDonate()" [disabled]="processing() || !amount() || !donorEmail()"
              class="w-full py-6 bg-wgc-white text-wgc-navy-900 rounded-2xl font-bold text-lg uppercase tracking-[0.2em] hover:bg-wgc-navy-50 transition-all disabled:opacity-50 flex items-center justify-center gap-4">
              <span *ngIf="!processing()">Complete Gift of {{ totalCharge() | currency }}</span>
              <lucide-icon *ngIf="processing()" [img]="Loader2" class="w-6 h-6 animate-spin"></lucide-icon>
            </button>

            <div class="flex items-center justify-center gap-2 text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest pt-2">
              <lucide-icon [img]="ShieldCheck" class="w-4 h-4 text-green-500"></lucide-icon>
              Secure, bank-grade encryption by WGC
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DonorCheckoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private checkoutService = inject(CheckoutService);

  church = signal<any>(null);
  campaign = signal('General Fund');
  
  presets = [25, 50, 100, 250];
  amount = signal(100);
  customAmount: number | null = null;
  
  isRecurring = signal(false);
  donorName = signal('');
  donorEmail = signal('');
  paymentMethod = signal<'CARD' | 'ACH'>('CARD');
  coverFees = signal(true);
  
  processing = signal(false);
  success = signal(false);

  readonly CreditCard = CreditCard;
  readonly Landmark = Landmark;
  readonly RefreshCcw = RefreshCcw;
  readonly ShieldCheck = ShieldCheck;
  readonly CheckCircle2 = CheckCircle2;
  readonly Loader2 = Loader2;

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('churchSlug');
    if (slug) {
      this.checkoutService.getChurchInfo(slug).subscribe({
        next: (data) => this.church.set(data),
        error: (err) => console.error(err)
      });
    }
  }

  onCustomAmountChange() {
    if (this.customAmount && this.customAmount > 0) {
      this.amount.set(this.customAmount);
    }
  }

  estimatedFee() {
    const base = this.amount();
    if (this.paymentMethod() === 'ACH') {
      return base * 0.0075;
    }
    return (base * 0.029) + 0.30;
  }

  totalCharge() {
    return this.coverFees() ? this.amount() + this.estimatedFee() : this.amount();
  }

  onDonate() {
    const slug = this.church()?.slug;
    if (!slug) return;

    this.processing.set(true);
    const payload = {
      amount: this.amount(),
      donorName: this.donorName(),
      donorEmail: this.donorEmail(),
      method: this.paymentMethod(),
      fund: this.campaign(),
      isRecurring: this.isRecurring(),
      coverFees: this.coverFees()
    };

    setTimeout(() => { // Demo delay
      this.checkoutService.processDonation(slug, payload).subscribe({
        next: () => {
          this.processing.set(false);
          this.success.set(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error(err);
          this.processing.set(false);
        }
      });
    }, 1500);
  }
}
