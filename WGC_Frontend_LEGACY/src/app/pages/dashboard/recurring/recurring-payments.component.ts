import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { LucideAngularModule, Search, Filter, RefreshCcw, Pause, Play, Download, CreditCard, Calendar, Users, TrendingUp } from 'lucide-angular';
import { EmptyStateComponent } from '../../../components/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-recurring-payments',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h2 class="text-3xl font-black text-wgc-navy-950 tracking-tight leading-none mb-1 uppercase">Sustained Gifting</h2>
          <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] font-mono opacity-80 italic">Global Institutional Subscription Registry</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="exportRegistry()" 
            class="flex items-center px-6 py-3 bg-wgc-white border border-wgc-navy-100/50 text-wgc-navy-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-wgc-navy-50 transition-all shadow-sm active:scale-95 group">
            <lucide-icon [img]="Download" class="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform"></lucide-icon>
            Export Ledger
          </button>
        </div>
      </div>

      <!-- Performance Intelligence Strip -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-wgc-white p-8 rounded-[2rem] border border-wgc-navy-100 shadow-sm relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-24 h-24 bg-wgc-gold-600/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000"></div>
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-wgc-gold-50 flex items-center justify-center text-wgc-gold-600 border border-wgc-gold-100 shadow-sm">
                 <lucide-icon [img]="TrendingUp" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                 <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] mb-1">Projected MRR</p>
                 <p class="text-2xl font-black text-wgc-navy-950 tracking-tighter">$\{{ (mrr() | number:'1.0-2') }}</p>
              </div>
           </div>
        </div>
        <div class="bg-wgc-white p-8 rounded-[2rem] border border-wgc-navy-100 shadow-sm relative overflow-hidden group">
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-wgc-navy-50 flex items-center justify-center text-wgc-navy-600 border border-wgc-navy-100 shadow-sm">
                 <lucide-icon [img]="Users" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                 <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] mb-1">Active Givers</p>
                 <p class="text-2xl font-black text-wgc-navy-950 tracking-tighter">\{{ activeCount() }}</p>
              </div>
           </div>
        </div>
        <div class="bg-wgc-white p-8 rounded-[2rem] border border-wgc-navy-100 shadow-sm relative overflow-hidden group">
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-wgc-navy-50 flex items-center justify-center text-wgc-navy-600 border border-wgc-navy-100 shadow-sm">
                 <lucide-icon [img]="Calendar" class="w-6 h-6"></lucide-icon>
              </div>
              <div>
                 <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] mb-1">Next Settlement</p>
                 <p class="text-2xl font-black text-wgc-navy-950 tracking-tighter">\{{ nextSettlement() | date:'MMM dd' }}</p>
              </div>
           </div>
        </div>
      </div>

      <!-- Sustained Gifts Registry -->
      <div class="bg-wgc-white rounded-[2.5rem] border border-wgc-navy-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <!-- Unified Orchestration Bar -->
        <div class="px-10 py-6 border-b border-wgc-navy-50 bg-wgc-off flex flex-col md:flex-row gap-6 items-center">
          <div class="relative flex-1 group w-full">
            <lucide-icon [img]="Search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
            <input type="text" placeholder="Institutional search by giver name, entity, or status..." 
              (input)="onSearch($event)"
              class="pl-12 pr-4 py-3.5 w-full text-[11px] font-black uppercase tracking-widest border border-wgc-navy-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-wgc-gold-600/5 focus:border-wgc-gold-600/40 bg-white placeholder:text-wgc-navy-200 transition-all font-mono">
          </div>
        </div>

        <div *ngIf="filteredRecurring().length > 0; else emptyState" class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-wgc-off/50 text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] border-b border-wgc-navy-50 font-mono">
                <th class="px-4 md:px-10 py-5">Subscribing Partner</th>
                <th class="px-10 py-5 hidden xl:table-cell">Institutional Link</th>
                <th class="px-4 md:px-10 py-5 text-right">Commitment</th>
                <th class="px-10 py-5 hidden sm:table-cell">Cycle</th>
                <th class="px-4 md:px-10 py-5 text-center">Protocol State</th>
                <th class="px-10 py-5 text-right hidden md:table-cell">Settlement Date</th>
                <th class="px-4 md:px-10 py-5 text-center">Audit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wgc-navy-50">
              <tr *ngFor="let rec of filteredRecurring()" class="hover:bg-wgc-off transition-all group">
                <td class="px-4 md:px-10 py-6 md:py-8">
                  <div class="flex items-center gap-3 md:gap-4">
                     <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-wgc-navy-50 flex items-center justify-center text-wgc-gold-600 shadow-sm border border-wgc-navy-100 group-hover:bg-white transition-all">
                        <lucide-icon [img]="CreditCard" class="w-4 h-4 md:w-5 md:h-5"></lucide-icon>
                     </div>
                     <div>
                       <div class="font-black text-wgc-navy-950 text-xs md:text-sm tracking-tight leading-none mb-1.5 uppercase transition-colors group-hover:text-wgc-gold-600 cursor-pointer uppercase truncate max-w-[120px] md:max-w-none">\{{ rec.donor?.name || 'Anonymous Giver' }}</div>
                       <div class="text-[8px] md:text-[9px] text-wgc-navy-300 font-bold uppercase tracking-[0.2em] font-mono truncate max-w-[120px] md:max-w-none">\{{ rec.donor?.email }}</div>
                     </div>
                  </div>
                </td>
                <td class="px-10 py-8 hidden xl:table-cell">
                  <span class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest italic opacity-70">\{{ rec.merchant?.name || 'Core Hub' }}</span>
                </td>
                <td class="px-4 md:px-10 py-6 md:py-8 font-black text-wgc-navy-950 text-base md:text-lg text-right tabular-nums tracking-tighter">
                  $\{{ rec.amount | number:'1.2-2' }}
                </td>
                <td class="px-10 py-8 hidden sm:table-cell">
                   <span class="px-3 py-1 bg-wgc-navy-50 text-wgc-navy-600 border border-wgc-navy-100 rounded-lg text-[9px] font-black uppercase tracking-widest font-mono">\{{ rec.interval }}</span>
                </td>
                <td class="px-4 md:px-10 py-6 md:py-8 text-center">
                  <span [ngClass]="{
                    'bg-wgc-gold-50 text-wgc-gold-700 border-wgc-gold-100': rec.status === 'active',
                    'bg-wgc-navy-50 text-wgc-navy-700 border-wgc-navy-100': rec.status === 'paused',
                    'bg-red-50 text-red-700 border-red-100': rec.status === 'cancelled'
                  }" class="px-2.5 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border shadow-sm">
                    \{{ rec.status }}
                  </span>
                </td>
                <td class="px-10 py-8 text-right tabular-nums text-wgc-navy-400 font-black text-[10px] uppercase tracking-tighter opacity-70 hidden md:table-cell">
                  \{{ rec.nextBillingDate | date:'MMM dd, yyyy' || 'SYNC_ERROR' }}
                </td>
                <td class="px-4 md:px-10 py-6 md:py-8 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button *ngIf="rec.status === 'active'" (click)="toggleState(rec, 'paused')" title="Pause Engine" class="p-2 md:p-2.5 text-wgc-navy-300 hover:text-wgc-gold-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-wgc-navy-100 shadow-none hover:shadow-sm">
                      <lucide-icon [img]="Pause" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button *ngIf="rec.status === 'paused'" (click)="toggleState(rec, 'active')" title="Resume Engine" class="p-2 md:p-2.5 text-wgc-navy-300 hover:text-wgc-gold-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-wgc-navy-100 shadow-none hover:shadow-sm">
                      <lucide-icon [img]="Play" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <div class="flex-1 flex flex-col items-center justify-center p-24 text-center">
             <app-empty-state 
               [icon]="RefreshCcw"
               title="Subscription Registry Empty"
               description="No sustained gifting protocols are currently active across the institutional network."
               actionLabel="Initiate Gifting Flow">
             </app-empty-state>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class RecurringPaymentsComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  recurring = signal<any[]>([]);
  filteredRecurring = signal<any[]>([]);

  readonly Search = Search;
  readonly Filter = Filter;
  readonly RefreshCcw = RefreshCcw;
  readonly Pause = Pause;
  readonly Play = Play;
  readonly Download = Download;
  readonly CreditCard = CreditCard;
  readonly Calendar = Calendar;
  readonly Users = Users;
  readonly TrendingUp = TrendingUp;

  ngOnInit() {
    this.loadRecurring();
  }

  loadRecurring() {
    this.dashboardService.getRecurringDonations().subscribe({
      next: (data) => {
        this.recurring.set(data);
        this.filteredRecurring.set(data);
      },
      error: (err) => console.error('Error fetching recurring donations:', err)
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredRecurring.set(
      this.recurring().filter(r => 
        r.donor?.name?.toLowerCase().includes(term) || 
        r.donor?.email?.toLowerCase().includes(term) ||
        r.merchant?.name?.toLowerCase().includes(term) ||
        r.status?.toLowerCase().includes(term)
      )
    );
  }

  toggleState(rec: any, newState: string) {
    // This would be a functional update call in a real app
    console.log(`Updating recurring intent ${rec.id} to ${newState}`);
    // For now, optimistic update UI
    const updated = this.recurring().map(r => r.id === rec.id ? { ...r, status: newState } : r);
    this.recurring.set(updated);
    this.filteredRecurring.set(updated);
  }

  exportRegistry() {
    console.log('Exporting sustaintable giting registry...');
  }

  mrr() {
    return this.recurring()
      .filter(r => r.status === 'active')
      .reduce((acc, r) => acc + (r.amount || 0), 0);
  }

  activeCount() {
    return this.recurring().filter(r => r.status === 'active').length;
  }

  nextSettlement() {
    const dates = this.recurring()
      .filter(r => r.status === 'active' && r.nextBillingDate)
      .map(r => new Date(r.nextBillingDate).getTime());
    if (dates.length === 0) return new Date();
    return new Date(Math.min(...dates));
  }
}
