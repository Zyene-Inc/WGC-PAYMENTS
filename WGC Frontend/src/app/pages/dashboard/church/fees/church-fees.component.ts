import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Percent, TrendingDown, Landmark, CreditCard, Activity, ArrowRight, Info, AlertCircle, TrendingUp, HelpCircle } from 'lucide-angular';
import { ChurchService } from '../../../../services/church.service';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-church-fees',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <lucide-icon [img]="PercentIcon" class="w-4 h-4 text-wgc-warning"></lucide-icon>
            <span class="text-[10px] font-black text-wgc-warning uppercase tracking-[0.2em]">Institutional Cost Center</span>
          </div>
          <h2 class="text-3xl font-black text-wgc-navy-950 tracking-tight">Fees & Costs</h2>
          <p class="text-sm text-wgc-navy-400 font-medium italic max-w-2xl">Total breakdown of payment processing and platform fees. We believe in 100% stewardship transparency.</p>
        </div>
      </div>

      <!-- High Level Fee Analytics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
           <div class="absolute -right-4 -top-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <lucide-icon [img]="ActivityIcon" class="w-32 h-32 text-wgc-navy-950"></lucide-icon>
           </div>
           <div class="relative z-10">
              <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest block mb-4">Total Fees Paid (LTD)</span>
              <h3 class="text-4xl font-black text-wgc-navy-950 tracking-tight mb-2 tracking-tighter">$0.00</h3>
              <p class="text-[10px] font-black text-wgc-navy-300 uppercase tracking-widest italic tracking-[0.1em]">Includes Processing + Platform</p>
           </div>
        </div>

        <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2rem] p-8 shadow-sm">
           <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest block mb-4">Effective Fee Rate</span>
           <div class="flex items-baseline gap-2">
              <h3 class="text-4xl font-black text-wgc-warning tracking-tight">0.00%</h3>
              <span class="text-[10px] font-black text-red-400 flex items-center gap-1 uppercase tracking-widest">
                 <lucide-icon [img]="TrendingUpIcon" class="w-3 h-3"></lucide-icon> 0.1%
              </span>
           </div>
           <p class="text-[10px] font-black text-wgc-navy-300 uppercase tracking-widest italic mt-4">Industry avg: 3.12%</p>
        </div>

        <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2rem] p-8 shadow-sm">
           <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest block mb-4">Fee Per Transaction</span>
           <h3 class="text-4xl font-black text-wgc-navy-950 tracking-tight mb-2">$0.00</h3>
           <p class="text-[10px] font-black text-wgc-navy-300 uppercase tracking-widest italic mt-4 tracking-wider">Historical average</p>
        </div>
      </div>

      <!-- Money Flow Comparison -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm">
            <div class="flex items-center justify-between mb-10">
               <h3 class="text-md font-black text-wgc-navy-950 uppercase tracking-widest leading-none">Fee Distribution</h3>
               <lucide-icon [img]="TrendingDownIcon" class="w-5 h-5 text-red-400"></lucide-icon>
            </div>
            <div class="space-y-6">
               <div *ngFor="let fee of feeBreakdown" class="space-y-2">
                  <div class="flex items-center justify-between">
                     <span class="text-[11px] font-black text-wgc-navy-950 uppercase tracking-widest">{{ fee.label }}</span>
                     <span class="text-[11px] font-black text-wgc-navy-950 tabular-nums">{{ fee.value }}</span>
                  </div>
                  <div class="h-2 w-full bg-wgc-navy-50 rounded-full overflow-hidden">
                     <div [class]="'h-full bg-wgc-gold-600 transition-all duration-1000 ' + fee.color" [style.width]="fee.percent"></div>
                  </div>
               </div>
            </div>
         </div>

         <!-- ACH Savings Insight Card -->
         <div class="bg-wgc-white rounded-[2.5rem] p-10 shadow-sm border border-wgc-navy-100 relative overflow-hidden">
            <div class="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <div class="flex items-center gap-3 mb-6">
                     <div class="p-3 rounded-2xl bg-wgc-gold-50 text-wgc-gold-600 border border-wgc-gold-100">
                        <lucide-icon [img]="LandmarkIcon" class="w-6 h-6"></lucide-icon>
                     </div>
                     <span class="text-[10px] font-black text-wgc-gold-600 uppercase tracking-[0.2em] leading-none mb-1">ACH Savings Opportunity</span>
                  </div>
                  <h3 class="text-2xl font-black text-wgc-navy-950 tracking-tight leading-tight mb-4">Reduce ministry costs by up to 88%.</h3>
                  <p class="text-sm text-wgc-navy-400 leading-relaxed max-w-sm mb-8 font-medium italic">Your ministry currently pays <span class="text-wgc-navy-950 font-bold">$0.00</span> in card fees for recurring gifts. Moving these to ACH could save <span class="text-wgc-gold-600 font-bold">$142.50 /mo</span>.</p>
               </div>
               <button class="w-full py-4 bg-wgc-gold-600 hover:bg-wgc-gold-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-wgc-gold-600/20 transition-all">
                  Start ACH Transition Campaign
               </button>
            </div>
         </div>
      </div>

      <!-- Detailed Fee History -->
      <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-center relative">
         <app-empty-state 
            [icon]="ActivityIcon"
            title="Waiting for fee trajectory"
            description="A detailed per-transaction fee log will populate here once your ministry processes its first clearing batch."
            actionLabel="View Pricing Guide">
         </app-empty-state>
      </div>
    </div>
  `
})
export class ChurchFeesComponent implements OnInit {
  private churchService = inject(ChurchService);

  readonly feeBreakdown = [
    { label: 'Card Processing Fees', value: '$0.00', percent: '10%', color: 'bg-wgc-warning' },
    { label: 'Platform Infrastructure', value: '$0.00', percent: '5%', color: 'bg-wgc-gold-600' },
    { label: 'ACH Savings Bank', value: '$0.00', percent: '5%', color: 'bg-wgc-gold-600' }
  ];

  readonly PercentIcon = Percent;
  readonly TrendingDownIcon = TrendingDown;
  readonly TrendingUpIcon = TrendingUp;
  readonly LandmarkIcon = Landmark;
  readonly ActivityIcon = Activity;
  readonly InfoIcon = Info;
  readonly HelpCircleIcon = HelpCircle;

  ngOnInit() {
    this.churchService.getReports().subscribe();
  }
}
