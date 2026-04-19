import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { LucideAngularModule, TrendingUp, Users, RefreshCcw, Landmark, CreditCard, Activity, ExternalLink, Download, ArrowRight, AlertTriangle, Info, ArrowDownRight, Wallet } from 'lucide-angular';
import { AuthService } from '../../../../services/auth.service';
import { ChurchService } from '../../../../services/church.service';
import { SkeletonComponent } from '../../../../components/ui/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-church-overview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12 font-sans">
      <!-- 1. FINANCIAL SUMMARY STRIP: High Impact, Premium Text -->
      <div id="financial-summary-strip" class="bg-wgc-off rounded-[2.5rem] p-5 shadow-sm border border-wgc-navy-100/40 overflow-hidden relative group">
        <!-- Subtle Glow -->
        <div class="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-wgc-gold-500/5 blur-3xl pointer-events-none group-hover:bg-wgc-gold-500/10 transition-all duration-1000"></div>
        
        <div class="relative flex flex-wrap items-center justify-between gap-8 px-8 py-2">
           <div *ngFor="let item of summaryStrip" class="flex flex-col">
              <span class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.25em] mb-2 flex items-center gap-1.5 leading-none">
                {{ item.label }}
                <lucide-icon *ngIf="item.info" [img]="InfoIcon" class="w-2.5 h-2.5 text-wgc-navy-200"></lucide-icon>
              </span>
              <div class="flex items-baseline gap-2">
                <span [class]="'text-xl font-black tracking-tight leading-none ' + (item.highlight ? 'text-wgc-gold-600' : 'text-wgc-navy-900')">
                  {{ item.value }}
                </span>
                <span *ngIf="item.subValue" class="text-[9px] font-black text-wgc-navy-300 uppercase tracking-widest opacity-60">{{ item.subValue }}</span>
              </div>
           </div>

           <div class="h-10 w-px bg-wgc-navy-100/30 hidden xl:block"></div>

           <!-- Effective Fee % -->
           <div class="flex flex-col items-end">
              <span class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.25em] mb-2 leading-none">Performance Mark</span>
              <div class="flex items-center gap-2 bg-wgc-white px-4 py-2 rounded-xl border border-wgc-navy-100/50 shadow-sm">
                 <div class="w-1.5 h-1.5 rounded-full bg-wgc-gold-500 animate-pulse"></div>
                 <span class="text-xs font-black text-wgc-navy-900 tracking-tight uppercase">0.00% Net Fee</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Welcome Header: Matches Landing Hero Text Spacing -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wgc-gold-50 border border-wgc-gold-500/10">
            <div class="w-1 h-1 rounded-full bg-wgc-gold-500"></div>
            <span class="text-[9px] font-black text-wgc-gold-600 uppercase tracking-[0.3em]">Kingdom Infrastructure</span>
          </div>
          <h2 class="text-4xl font-black text-wgc-navy-900 tracking-tight leading-none">Hub Intelligence</h2>
          <p class="text-[11px] font-black text-wgc-navy-400 uppercase tracking-[0.15em] italic">Real-time stewardship monitoring & cost-efficiency modeling.</p>
        </div>
        <button class="flex items-center px-8 py-3.5 bg-wgc-white border border-wgc-navy-100 text-wgc-navy-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transform transition-all hover:bg-wgc-off hover:scale-[1.02] active:scale-95 shadow-sm">
          <lucide-icon [img]="DownloadIcon" class="w-4 h-4 mr-2.5"></lucide-icon> Export Ledger
        </button>
      </div>

      <!-- 2. MONEY FLOW VISUALIZATION -->
      <div id="money-flow-viz" class="bg-wgc-white border border-wgc-navy-100/60 rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
         <!-- Accent Bar -->
         <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-wgc-gold-500 via-wgc-gold-600 to-wgc-gold-500"></div>
         
         <div class="flex items-center justify-between mb-16 px-4">
            <div>
               <h3 class="text-2xl font-black text-wgc-navy-900 tracking-tight">Institutional Money Flow</h3>
               <footer class="flex items-center gap-3 mt-2">
                  <div class="w-6 h-px bg-wgc-gold-500/50"></div>
                  <span class="text-[10px] font-black text-wgc-gold-600 uppercase tracking-[0.3em]">Full Transparency Engine</span>
               </footer>
            </div>
            <div class="w-12 h-12 rounded-full border border-wgc-navy-100/50 flex items-center justify-center text-wgc-navy-300">
               <lucide-icon [img]="ActivityIcon" class="w-6 h-6"></lucide-icon>
            </div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            <div *ngFor="let step of moneyFlowSteps; let last = last" class="relative">
               <div class="bg-wgc-off border border-wgc-navy-100/40 rounded-3xl p-8 transition-all hover:shadow-xl hover:shadow-wgc-navy-900/5 hover:-translate-y-1 group">
                  <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] block mb-6 leading-none">{{ step.label }}</span>
                  <div class="flex items-center justify-between">
                     <span [class]="'text-xl font-black tracking-tighter ' + step.color">{{ step.value }}</span>
                     <lucide-icon [img]="step.icon" [class]="'w-5 h-5 ' + step.color"></lucide-icon>
                  </div>
               </div>
               <div *ngIf="!last" class="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block text-wgc-navy-100 z-20">
                  <lucide-icon [img]="ArrowRightIcon" class="w-5 h-5"></lucide-icon>
               </div>
            </div>
         </div>
      </div>

      <!-- 7. SMART INSIGHTS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div *ngFor="let insight of insights" class="bg-wgc-white border border-wgc-navy-100/60 rounded-[2rem] p-8 shadow-sm group hover:border-wgc-gold-500/30 transition-all">
           <div class="flex items-center gap-4 mb-6">
              <div [class]="'w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ' + (insight.type === 'savings' ? 'bg-wgc-gold-50 text-wgc-gold-600' : 'bg-wgc-gold-50 text-wgc-gold-500')">
                 <lucide-icon [img]="insight.icon" class="w-5 h-5"></lucide-icon>
              </div>
              <h4 class="text-[10px] font-black text-wgc-navy-900 uppercase tracking-[0.3em] leading-tight">{{ insight.title }}</h4>
           </div>
           <p class="text-xs font-medium text-wgc-navy-500 leading-relaxed italic">{{ insight.message }}</p>
        </div>
      </div>
    </div>
  `
})
export class ChurchOverviewComponent implements OnInit {
  authService = inject(AuthService);
  churchService = inject(ChurchService);

  readonly summaryStrip = [
    { label: 'Gross Volume', value: '$0.00', info: true },
    { label: 'Total Fees', value: '$0.00' },
    { label: 'Net Deposited', value: '$0.00', highlight: true },
    { label: 'Pending', value: '$0.00', subValue: 'Awaiting sync' },
    { label: 'Next Payout', value: '—' }
  ];

  readonly moneyFlowSteps = [
    { label: 'Gross Donations', value: '$0.00', icon: Wallet, color: 'text-wgc-navy-950' },
    { label: 'Processing (Card/ACH)', value: '-$0.00', icon: CreditCard, color: 'text-red-400' },
    { label: 'Platform Fee', value: '-$0.00', icon: Activity, color: 'text-red-400' },
    { label: 'Adjustments', value: '$0.00', icon: AlertTriangle, color: 'text-wgc-navy-400' },
    { label: 'Net Deposit', value: '$0.00', icon: Landmark, color: 'text-wgc-gold-600' }
  ];

  readonly insights = [
    { type: 'savings', title: 'ACH Opportunity', message: 'Switching to ACH for recurring donors could save your ministry $142.50 this month.', icon: Landmark },
    { type: 'alert', title: 'Fee Tracking', message: 'Your effective fee rate increased by 0.2% due to higher international card usage.', icon: TrendingUp },
    { type: 'savings', title: 'Optimizer', message: 'Highest cost method this week: Physical Card Entries. Encourage online giving.', icon: CreditCard }
  ];

  readonly LandmarkIcon = Landmark;
  readonly DownloadIcon = Download;
  readonly CreditCardIcon = CreditCard;
  readonly TrendingUpIcon = TrendingUp;
  readonly ActivityIcon = Activity;
  readonly WalletIcon = Wallet;
  readonly InfoIcon = Info;
  readonly ArrowRightIcon = ArrowRight;

  ngOnInit() {
    this.churchService.getSummary().subscribe();
  }
}
