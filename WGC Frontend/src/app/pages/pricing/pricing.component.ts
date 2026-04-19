import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { LucideAngularModule, CheckCircle2, Calculator, ArrowRight, DollarSign, Building2, TrendingDown } from 'lucide-angular';
import { ScrollFadeDirective } from '../../directives/scroll-fade.directive';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule, CtaSectionComponent, LucideAngularModule, ScrollFadeDirective],
  templateUrl: './pricing.component.html',
})
export class PricingComponent {
  readonly CheckCircle2 = CheckCircle2;
  readonly Calculator = Calculator;
  readonly ArrowRight = ArrowRight;
  readonly DollarSign = DollarSign;
  readonly Building2 = Building2;
  readonly TrendingDown = TrendingDown;
  
  included = [
    'Donation processing',
    'Recurring giving pipelines',
    'Low-cost ACH processing',
    'Automated bank payouts',
    'Real-time transaction reporting',
    'Partner-ready platform infrastructure'
  ];

  // Calculator State Signals
  monthlyVolume = signal<number>(50000);
  avgDonation = signal<number>(150);
  currentRatePct = signal<number>(2.9);
  currentRateFixed = signal<number>(0.30);
  currentMonthlyFee = signal<number>(49);
  achPercentage = signal<number>(15);

  // WGC Constants
  wgcRatePct = 2.3;
  wgcRateFixed = 0.25;
  wgcAchFixed = 0.25; 
  wgcMonthlyFee = 10;

  // Computations
  totalTransactions = computed(() => Math.max(1, Math.round(this.monthlyVolume() / Math.max(1, this.avgDonation()))));
  achTransactions = computed(() => Math.round(this.totalTransactions() * (this.achPercentage() / 100)));
  cardTransactions = computed(() => this.totalTransactions() - this.achTransactions());

  achVolume = computed(() => this.achTransactions() * this.avgDonation());
  cardVolume = computed(() => this.cardTransactions() * this.avgDonation());

  currentCost = computed(() => {
    // Simple blend of standard competitor rates across entire volume
    const volumeCost = this.monthlyVolume() * (this.currentRatePct() / 100);
    const fixedTxCost = this.totalTransactions() * this.currentRateFixed();
    return volumeCost + fixedTxCost + this.currentMonthlyFee();
  });

  wgcCost = computed(() => {
    const cardCost = (this.cardVolume() * (this.wgcRatePct / 100)) + (this.cardTransactions() * this.wgcRateFixed);
    const achCost = this.achTransactions() * this.wgcAchFixed;
    return cardCost + achCost + this.wgcMonthlyFee;
  });

  monthlySavings = computed(() => Math.max(0, this.currentCost() - this.wgcCost()));
  annualSavings = computed(() => this.monthlySavings() * 12);
}
