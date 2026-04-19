import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BarChart3, TrendingUp, PieChart, Download, ArrowRight, Percent, Activity } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';
import { ChurchService } from '../../../../services/church.service';

@Component({
  selector: 'app-church-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Analytical Stewardship</h2>
          <p class="text-sm text-wgc-navy-400 font-medium tracking-tight italic text-[11px] font-bold">Analyzing ministry revenue, mission growth, and fee efficiency.</p>
        </div>
      </div>

      <!-- COST ANALYTICS SUMMARY -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div *ngFor="let stat of costStats" class="bg-wgc-white border border-wgc-navy-100 rounded-3xl p-6 shadow-sm">
            <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest block mb-1">{{ stat.label }}</span>
            <h4 [class]="'text-xl font-black tracking-tight ' + stat.color">{{ stat.value }}</h4>
            <div *ngIf="stat.trend" class="flex items-center gap-1 mt-2">
               <lucide-icon [img]="TrendingUpIcon" class="w-2.5 h-2.5 text-red-400"></lucide-icon>
               <span class="text-[9px] font-bold text-red-500 uppercase tracking-widest">{{ stat.trend }}</span>
            </div>
         </div>
      </div>

      <!-- Main Analytics Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm">
           <div class="flex items-center justify-between mb-10">
              <h3 class="text-md font-black text-wgc-navy-950 uppercase tracking-widest leading-none">Gross vs Net Revenue</h3>
              <lucide-icon [img]="TrendingUpIcon" class="w-5 h-5 text-wgc-gold-600"></lucide-icon>
           </div>
           <div class="h-[300px] flex items-center justify-center bg-wgc-off border-2 border-dashed border-wgc-navy-100 rounded-3xl group relative overflow-hidden">
             <app-empty-state 
               [icon]="BarChartIcon"
               title="Revenue Comparison Pending"
               description="Trend analysis comparing gross volume to net settlements will populate here."
               class="scale-90">
             </app-empty-state>
          </div>
        </div>

        <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm">
           <div class="flex items-center justify-between mb-10">
              <h3 class="text-md font-black text-wgc-navy-950 uppercase tracking-widest leading-none">Fee Ratio Analysis</h3>
              <lucide-icon [img]="PercentIcon" class="w-5 h-5 text-wgc-warning"></lucide-icon>
           </div>
           <div class="h-[300px] flex items-center justify-center bg-wgc-off border-2 border-dashed border-wgc-navy-100 rounded-3xl group">
             <app-empty-state 
               [icon]="PieChartIcon"
               title="Fee Ratio Pending"
               description="Comparison of Card fees (high) vs ACH fees (low) will populate here for board review."
               class="scale-90">
             </app-empty-state>
          </div>
        </div>
      </div>

      <!-- Quick Export Reports -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let report of standardReports" class="bg-wgc-white border border-wgc-navy-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer border-l-4" [class.border-l-wgc-gold-600]="report.type === 'financial'">
           <div class="flex items-center justify-between">
              <div class="space-y-1">
                 <h4 class="text-sm font-black text-wgc-navy-950 tracking-tight">{{ report.name }}</h4>
                 <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">{{ report.description }}</p>
              </div>
              <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4 text-wgc-navy-300 group-hover:translate-x-1 transition-all"></lucide-icon>
           </div>
        </div>
      </div>
    </div>
  `
})
export class ChurchReportsComponent implements OnInit {
  private churchService = inject(ChurchService);
  reportData = signal<any>(null);

  readonly costStats = [
    { label: 'Net Payout Trends', value: '$0.00', color: 'text-wgc-gold-600' },
    { label: 'Fee Ratio', value: '0.00%', color: 'text-wgc-warning', trend: '0.1%' },
    { label: 'Avg Fee / Gift', value: '$0.00', color: 'text-wgc-navy-950' },
    { label: 'Monthly Savings', value: '$0.00', color: 'text-wgc-gold-500' }
  ];

  readonly standardReports = [
    { name: 'Financial Transparency', description: 'Monthly Gross vs Net', type: 'financial' },
    { name: 'Cost Analytics', description: 'Fee Breakdown Ledger', type: 'financial' },
    { name: 'Annual Tax Summary', description: 'Donor Statements', type: 'social' }
  ];

  readonly BarChartIcon = BarChart3;
  readonly TrendingUpIcon = TrendingUp;
  readonly PieChartIcon = PieChart;
  readonly ArrowRightIcon = ArrowRight;
  readonly PercentIcon = Percent;
  readonly ActivityIcon = Activity;

  ngOnInit() {
    this.churchService.getReports().subscribe({
      next: (data) => this.reportData.set(data),
      error: (err) => console.error(err)
    });
  }
}
