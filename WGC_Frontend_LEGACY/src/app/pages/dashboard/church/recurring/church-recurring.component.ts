import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChurchService } from '../../../../services/church.service';
import { NotificationService } from '../../../../services/notification.service';
import { LucideAngularModule, RefreshCcw, TrendingUp, Calendar, Search, Filter, ArrowRight, Wallet, CheckCircle2, Clock, Play, Pause, XCircle, MoreVertical } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-church-recurring',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent, CurrencyPipe, DatePipe, DecimalPipe],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Recurring Stewardship</h2>
          <p class="text-sm text-wgc-navy-400 font-medium">Manage sustainable, ongoing funding for your church missions and operations.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center px-6 py-2.5 bg-wgc-gold-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-wgc-gold-600 transition-all shadow-lg active:scale-95">
            <lucide-icon [img]="RefreshCcw" class="w-4 h-4 mr-2"></lucide-icon>
            Establish Plan Link
          </button>
        </div>
      </div>

      <!-- MRR & Projections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm">
           <div class="flex items-center justify-between mb-8">
              <div>
                 <h3 class="text-lg font-black text-wgc-navy-950 tracking-tight mb-1">Institutional Stability Projection</h3>
                 <p class="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-2 italic">Scheduled commitment volume for current fiscal month</p>
              </div>
              <lucide-icon [img]="TrendingUp" class="w-5 h-5 text-wgc-gold-600 shadow-sm"></lucide-icon>
           </div>
           
           <div class="h-48 flex items-center justify-center bg-wgc-off/50 border-2 border-dashed border-wgc-navy-100/50 rounded-3xl group">
             <div class="text-center">
                <span class="text-4xl font-black text-wgc-navy-200 tracking-tighter block mb-2 cursor-default">$\{{ getProjectedTotal() | number:'1.2-2' }}</span>
                <span class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em]">Expected Monthly Settlement</span>
             </div>
           </div>
        </div>

        <!-- The Projected Card - Must be Gold -->
        <div class="bg-wgc-gold-500 border border-wgc-gold-600 rounded-[2.5rem] p-8 shadow-lg shadow-wgc-gold-500/20 relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
           
           <div class="relative z-10 flex flex-col h-full">
              <span class="text-[9px] font-black text-wgc-navy-950 uppercase tracking-[0.2em] mb-4 block opacity-60">Revenue Assurance</span>
              <h3 class="text-xl font-black text-wgc-navy-950 tracking-tight mb-2 leading-none uppercase">Projected Stability</h3>
              <p class="text-xs text-wgc-navy-900 font-medium leading-relaxed mb-6 italic opacity-80">Predictable foundation for long-term mission and operations strategy.</p>
              
              <div class="py-4 border-t border-wgc-navy-950/10 space-y-4 mt-auto">
                 <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-wgc-navy-800">Active Schedules</span>
                    <span class="text-lg font-black text-wgc-navy-950 tracking-tight">\{{ recurringPlans().length }}</span>
                 </div>
                 <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-wgc-navy-800">MRR projection</span>
                    <span class="text-2xl font-black text-wgc-navy-950 tracking-tighter">$\{{ getProjectedTotal() | number:'1.2-2' }}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Stewardship Schedules Table -->
      <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div *ngIf="recurringPlans().length > 0; else emptyState" class="overflow-x-auto">
           <table class="w-full text-left">
             <thead>
               <tr class="border-b border-wgc-navy-50 bg-wgc-off/50">
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none">Status</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none">Member Relation</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none text-right">Cadence</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none text-right">Commitment</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none text-center">Renewal</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none text-right">Manage</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-wgc-navy-50">
               <tr *ngFor="let plan of recurringPlans()" class="group hover:bg-wgc-off transition-all">
                 <td class="px-8 py-6">
                    <span [ngClass]="{
                      'bg-wgc-gold-50 text-wgc-gold-700 border-wgc-gold-100': plan.status === 'active' || plan.status === 'paused',
                      'bg-red-50 text-red-700 border-red-100': plan.status === 'canceled'
                    }" class="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border">
                      \{{ plan.status }}
                    </span>
                 </td>
                 <td class="px-8 py-6">
                    <div class="font-black text-wgc-navy-950 uppercase leading-none mb-1">\{{ plan.donor.name }}</div>
                    <div class="text-[9px] font-bold text-wgc-navy-300 font-mono tracking-tighter">\{{ plan.donor.email }}</div>
                 </td>
                 <td class="px-8 py-6 text-right">
                    <span class="text-[10px] font-black text-wgc-navy-600 uppercase tracking-widest leading-none">\{{ plan.interval }}</span>
                 </td>
                 <td class="px-8 py-6 text-right tabular-nums">
                    <span class="text-sm font-black text-wgc-navy-950 tracking-tighter">$\{{ plan.amount | number:'1.2-2' }}</span>
                 </td>
                 <td class="px-8 py-6 text-center tabular-nums">
                    <div class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-tight">
                       \{{ plan.nextOccurence ? (plan.nextOccurence | date:'MMM dd') : 'End of Cycle' }}
                    </div>
                 </td>
                 <td class="px-8 py-6 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button *ngIf="plan.status === 'paused'" (click)="updateStatus(plan, 'active')" 
                        class="p-2 hover:bg-white border border-transparent hover:border-wgc-gold-100 rounded-xl text-wgc-gold-600 transition-all font-black uppercase text-[9px]">
                        <lucide-icon [img]="Play" class="w-4 h-4"></lucide-icon>
                      </button>
                      <button *ngIf="plan.status === 'active'" (click)="updateStatus(plan, 'paused')"
                        class="p-2 hover:bg-white border border-transparent hover:border-wgc-gold-100 rounded-xl text-wgc-gold-500 transition-all font-black uppercase text-[9px]">
                        <lucide-icon [img]="Pause" class="w-4 h-4"></lucide-icon>
                      </button>
                      <button *ngIf="plan.status !== 'canceled'" (click)="updateStatus(plan, 'canceled')"
                        class="p-2 hover:bg-white border border-transparent hover:border-red-100 rounded-xl text-red-400 transition-all font-black uppercase text-[9px]">
                        <lucide-icon [img]="XCircle" class="w-4 h-4"></lucide-icon>
                      </button>
                    </div>
                 </td>
               </tr>
             </tbody>
           </table>
        </div>
        <ng-template #emptyState>
          <div class="flex-1 flex flex-col items-center justify-center p-12">
            <app-empty-state 
              [icon]="RefreshCcw"
              title="No active schedules"
              description="Detailed givers schedules and upcoming renewal dates will appear here as schedules are established."
              actionLabel="Promote Recurring Giving">
            </app-empty-state>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class ChurchRecurringComponent implements OnInit, OnDestroy {
  private churchService = inject(ChurchService);
  private notify = inject(NotificationService);

  recurringPlans = signal<any[]>([]);
  private refreshSub?: Subscription;

  readonly RefreshCcw = RefreshCcw;
  readonly TrendingUp = TrendingUp;
  readonly Play = Play;
  readonly Pause = Pause;
  readonly XCircle = XCircle;

  ngOnInit() {
    this.loadPlans();
    this.refreshSub = this.churchService.refresh$.subscribe(() => this.loadPlans());
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadPlans() {
    this.churchService.getRecurring().subscribe({
      next: (data) => this.recurringPlans.set(data),
      error: (err) => this.notify.error('Unable to fetch institutional schedules.', 'Sync Error')
    });
  }

  getProjectedTotal() {
    return this.recurringPlans()
      .filter(p => p.status === 'active')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }

  updateStatus(plan: any, status: string) {
    const action = status === 'active' ? 'resume' : status === 'paused' ? 'pause' : 'cancel';
    if (confirm(`Institutional Alert: Are you sure you want to ${action} this stewardship profile for ${plan.donor.name}?`)) {
      this.churchService.updateRecurring(plan.id, { status }).subscribe({
        next: () => {
          this.notify.success(`Stewardship schedule ${status} successfully.`, 'System Update');
          this.loadPlans();
        },
        error: () => this.notify.error(`Failed to update schedule status.`, 'API Rejection')
      });
    }
  }
}
