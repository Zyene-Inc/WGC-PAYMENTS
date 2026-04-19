import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChurchService } from '../../../../services/church.service';
import { LucideAngularModule, Landmark, Calendar, Clock, Landmark as BankIcon, Info, ShieldCheck, Wallet, ArrowRight } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-church-payouts',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Payout Management</h2>
          <p class="text-sm text-wgc-navy-400 font-medium italic">Full transparency on your bank settlements and fee deductions.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center px-4 py-2 bg-wgc-white border border-wgc-navy-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-wgc-navy-950 hover:bg-wgc-gray-50 transition-all shadow-sm">
            <lucide-icon [img]="CalendarIcon" class="w-4 h-4 mr-2"></lucide-icon> Schedule
          </button>
        </div>
      </div>

      <!-- Settlement Timeline -->
      <div class="bg-wgc-white rounded-[2.5rem] p-10 shadow-sm border border-wgc-navy-100 relative overflow-hidden">
         <div class="flex items-center justify-between mb-10">
            <div>
               <h3 class="text-xl font-black text-wgc-navy-950 tracking-tight leading-none mb-1">Settlement Journey</h3>
               <p class="text-[9px] font-black text-wgc-gold-600 uppercase tracking-widest italic tracking-[0.2em]">Institutional Clearing Tracker</p>
            </div>
            <div class="px-4 py-1.5 bg-wgc-off border border-wgc-navy-100 rounded-full text-[10px] font-black uppercase tracking-widest text-wgc-navy-400">T+2 Settlement</div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div *ngFor="let step of settlementSteps" class="bg-wgc-off border border-wgc-navy-100 rounded-2xl p-6 hover:border-wgc-gold-600/50 transition-all">
               <div class="w-10 h-10 rounded-xl bg-wgc-navy-50 border border-wgc-navy-100 flex items-center justify-center mb-4">
                  <lucide-icon [img]="step.icon" class="w-5 h-5 text-wgc-navy-400"></lucide-icon>
               </div>
               <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest block mb-2">{{ step.label }}</span>
               <div class="text-md font-black tracking-tight text-wgc-navy-950 mb-1">{{ step.status }}</div>
               <p class="text-[10px] font-bold text-wgc-navy-400 leading-relaxed">{{ step.desc }}</p>
            </div>
         </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="md:col-span-2 bg-wgc-white border border-wgc-navy-100 rounded-3xl p-8 shadow-sm">
           <span class="text-[10px] font-black text-wgc-gold-600 uppercase tracking-widest block mb-4">Available for payout</span>
           <h3 class="text-4xl font-black text-wgc-navy-950 tracking-tight">$0.00</h3>
        </div>
        <div class="md:col-span-2 bg-wgc-off border border-wgc-navy-100 rounded-3xl p-8 flex flex-col justify-center">
           <div class="flex items-center gap-3 mb-4">
              <lucide-icon [img]="InfoIcon" class="w-5 h-5 text-wgc-navy-300"></lucide-icon>
              <h4 class="text-[10px] font-black text-wgc-navy-950 uppercase tracking-widest uppercase">Transparency Insight</h4>
           </div>
           <p class="text-[11px] font-medium text-wgc-navy-400 leading-relaxed">Each payout represents the net settlement after Card Interchange, ACH, and WGC Platform fees.</p>
        </div>
      </div>

      <!-- Payout History -->
      <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-center">
        <div *ngIf="payouts().length > 0; else emptyState">
           <!-- History Table -->
        </div>
        <ng-template #emptyState>
          <app-empty-state 
            [icon]="LandmarkIcon"
            title="No settlement history"
            description="Detailed bank payout logs with audit-ready fee deductions will appear here once your account successfully completes its first clearing cycle."
            actionLabel="View Banking Settings">
          </app-empty-state>
        </ng-template>
      </div>
    </div>
  `
})
export class ChurchPayoutsComponent implements OnInit {
  private churchService = inject(ChurchService);
  payouts = signal<any[]>([]);

  readonly settlementSteps = [
    { label: 'Stage 1', status: 'Donation Recorded', desc: 'Securely received via WGC rails.', icon: ShieldCheck },
    { label: 'Stage 2', status: 'Clearing & Fees', desc: 'T+1: Fees settled.', icon: Wallet },
    { label: 'Stage 3', status: 'Bank Payout', desc: 'T+2: Funds deposited.', icon: BankIcon }
  ];

  readonly LandmarkIcon = Landmark;
  readonly CalendarIcon = Calendar;
  readonly BankIcon = BankIcon;
  readonly InfoIcon = Info;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly WalletIcon = Wallet;

  ngOnInit() {
    this.churchService.getPayouts().subscribe({
      next: (data) => this.payouts.set(data),
      error: (err) => console.error(err)
    });
  }
}
