import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Wallet, Gift, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-billing-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './billing-balance.component.html'
})
export class BillingBalanceComponent {
  presetAmounts = [50, 100, 250, 500];
  selectedAmount = signal(50);
  
  promoCode = '';
  promoError = signal(false);
  
  autoRecharge = true;
  selectedRechargeType = signal('standard');

  readonly Wallet = Wallet;
  readonly Gift = Gift;
  readonly RefreshCw = RefreshCw;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle2 = CheckCircle2;

  applyPromo() {
    if (!this.promoCode || this.promoCode.length < 4) {
      this.promoError.set(true);
      setTimeout(() => this.promoError.set(false), 3000);
    } else {
      this.promoError.set(false);
      // Logic for successful promo
    }
  }
}
