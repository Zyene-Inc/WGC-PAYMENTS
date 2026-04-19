import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { ChurchService } from '../../../../services/church.service';
import { ModalService } from '../../../../services/modal.service';
import { NotificationService } from '../../../../services/notification.service';
import { LucideAngularModule, Search, Filter, Download, Plus, Landmark, CreditCard, RefreshCcw, MoreHorizontal, Calendar, Tag, Info, X, ShieldCheck } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';
import { DonationFormComponent } from './donation-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-church-donations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent, DecimalPipe, DatePipe],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Financial Ledger</h2>
          <p class="text-sm text-wgc-navy-400 font-medium">Real-time audit trail of all contributions across card, ACH, and manual entries.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center px-4 py-2 bg-wgc-white border border-wgc-navy-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-wgc-navy-950 hover:bg-wgc-gray-50 transition-all shadow-sm">
            <lucide-icon [img]="Download" class="w-4 h-4 mr-2"></lucide-icon>
            Export CSV
          </button>
          <button (click)="openAddDonation()"
            class="flex items-center px-6 py-2.5 bg-wgc-gold-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-wgc-gold-600 transition-all shadow-lg shadow-wgc-gold-600/20 active:scale-95">
            <lucide-icon [img]="Plus" class="w-4 h-4 mr-2"></lucide-icon>
            Record Contribution
          </button>
        </div>
      </div>

      <!-- Quick Stats Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div *ngFor="let stat of getQuickStats()" class="bg-wgc-white border border-wgc-navy-100 rounded-2xl p-4 shadow-sm">
           <span class="block text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest mb-1">{{ stat.label }}</span>
           <span class="text-lg font-black text-wgc-navy-950 tracking-tight">{{ stat.value }}</span>
        </div>
      </div>

      <!-- Discovery & Tools -->
      <div class="bg-wgc-white border border-wgc-navy-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative max-w-sm w-full">
            <lucide-icon [img]="Search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300"></lucide-icon>
            <input type="text" placeholder="Search by donor or fund..." 
              (input)="onFilterChange('donorSearch', $any($event.target).value)"
              class="w-full pl-11 pr-4 py-2 bg-wgc-gray-50 border border-wgc-navy-100 text-[11px] font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-wgc-gold-600/10 focus:border-wgc-gold-600 transition-all shadow-sm">
          </div>
        </div>
      </div>

      <!-- Table Area -->
      <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2rem] shadow-sm overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div *ngIf="donations().length > 0; else emptyState" class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
               <tr class="border-b border-wgc-navy-50 bg-wgc-off/50">
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none">Trace Details</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none">Donor Identity</th>
                 <th class="px-4 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest text-right leading-none">Gross Gift</th>
                 <th class="px-4 py-5 text-[10px] font-black text-red-500 uppercase tracking-widest text-right leading-none">Processing</th>
                 <th class="px-4 py-5 text-[10px] font-black text-wgc-gold-600 uppercase tracking-widest text-right leading-none">Net Deposit</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest text-right leading-none">Date</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-wgc-navy-50">
               <tr *ngFor="let d of donations()" (click)="selectedDonation.set(d)" class="hover:bg-wgc-navy-50/30 transition-all cursor-pointer group">
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-wgc-navy-50 flex items-center justify-center text-wgc-navy-400 text-[10px] font-black shadow-sm">
                        <lucide-icon [img]="d.method === 'CARD' ? CreditCard : Landmark" class="w-4 h-4"></lucide-icon>
                      </div>
                      <div>
                        <div class="text-[10px] font-black text-wgc-navy-950 uppercase tracking-tighter">\{{ d.method }} RAIL</div>
                        <div class="text-[9px] font-bold text-wgc-navy-300 font-mono tracking-widest">\{{ d.fund }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <div class="font-black text-wgc-navy-950 leading-none mb-1">\{{ d.donor?.name || 'Anonymous' }}</div>
                    <div class="text-[10px] font-bold text-wgc-navy-300 font-mono">\{{ d.donor?.email }}</div>
                  </td>
                  <td class="px-4 py-6 text-right text-[11px] font-black text-wgc-navy-900 tabular-nums">$\{{ d.amount | number:'1.2-2' }}</td>
                  <td class="px-4 py-6 text-right text-[10px] font-bold text-red-400 tabular-nums shadow-none">-$\{{ (d.fee || 0) | number:'1.2-2' }}</td>
                  <td class="px-4 py-6 text-right text-[11px] font-black text-wgc-gold-600 tabular-nums shadow-none">$\{{ (d.net || 0) | number:'1.2-2' }}</td>
                  <td class="px-8 py-6 text-right text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest tabular-nums font-mono opacity-80">\{{ d.createdAt | date:'MMM d, y' }}</td>
               </tr>
             </tbody>
          </table>
        </div>
        <ng-template #emptyState>
          <div class="flex-1 flex flex-col items-center justify-center p-12">
            <app-empty-state 
              [icon]="CreditCard"
              title="No stewardship records"
              description="A detailed ledger of your ministry givers with full fee transparency will appear here as soon as gifts are received."
              actionLabel="Sync External Records">
            </app-empty-state>
          </div>
        </ng-template>
      </div>

      <!-- Detail Modal Overlay -->
      <div *ngIf="selectedDonation() as d" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-wgc-navy-950/40 backdrop-blur-sm animate-in fade-in duration-300">
         <div class="bg-wgc-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-wgc-navy-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div class="p-8 border-b border-wgc-navy-50 flex items-center justify-between bg-wgc-off">
               <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-wgc-navy-50 flex items-center justify-center text-wgc-gold-600 shadow-sm border border-wgc-navy-100">
                     <lucide-icon [img]="ShieldCheck" class="w-6 h-6"></lucide-icon>
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-wgc-navy-950 tracking-tight leading-none mb-1">Audit Trail Transparency</h3>
                    <p class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest tracking-[0.2em]">Ref: TRX-\{{ d.id.substring(0,8) }}</p>
                  </div>
               </div>
               <button (click)="selectedDonation.set(null)" class="p-2 hover:bg-white rounded-xl transition-all"><lucide-icon [img]="X" class="w-5 h-5 text-wgc-navy-400"></lucide-icon></button>
            </div>

            <div class="p-8 space-y-8 text-center sm:text-left">
               <div class="space-y-4">
                  <div class="flex items-center justify-between pb-4 border-b border-wgc-navy-50">
                    <span class="text-[11px] font-black text-wgc-navy-400 uppercase tracking-widest">Gross Donation</span>
                    <span class="text-lg font-black text-wgc-navy-950 tabular-nums">$\{{ d.amount | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest italic leading-none">Network Exchange Fee</span>
                    <span class="text-[11px] font-black text-red-500 tabular-nums">-$\{{ d.fee | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex items-center justify-between pt-4 mt-2 border-t-2 border-dashed border-wgc-navy-50 font-mono">
                    <span class="text-[11px] font-black text-wgc-gold-600 uppercase tracking-widest">Net Church Deposit</span>
                    <span class="text-xl font-black text-wgc-navy-950 tabular-nums leading-none">$\{{ d.net | number:'1.2-2' }}</span>
                  </div>
               </div>
            </div>

            <div class="p-8 bg-wgc-off border-t border-wgc-navy-50">
               <button (click)="selectedDonation.set(null)" class="w-full py-4 bg-wgc-gold-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-wgc-gold-600 transition-all">Acknowledge Ledger Status</button>
            </div>
         </div>
      </div>
    </div>
  `
})
export class ChurchDonationsComponent implements OnInit, OnDestroy {
  private churchService = inject(ChurchService);
  private modalService = inject(ModalService);
  private notify = inject(NotificationService);

  donations = signal<any[]>([]);
  filters = signal<any>({});
  selectedDonation = signal<any>(null);
  private refreshSub?: Subscription;

  readonly Download = Download;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly CreditCard = CreditCard;
  readonly Landmark = Landmark;
  readonly RefreshCcw = RefreshCcw;
  readonly X = X;
  readonly ShieldCheck = ShieldCheck;
  readonly Tag = Tag;

  ngOnInit() {
    this.loadDonations();
    this.refreshSub = this.churchService.refresh$.subscribe(() => this.loadDonations());
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadDonations() {
    this.churchService.getDonations(this.filters()).subscribe({
      next: (data) => this.donations.set(data),
      error: (err) => this.notify.error('Unable to fetch institutional financial ledger.', 'System Error')
    });
  }

  onFilterChange(key: string, value: any) {
    this.filters.update(f => ({ ...f, [key]: value }));
    this.loadDonations();
  }

  openAddDonation() {
    this.modalService.open({
      title: 'Audit External Contribution',
      component: DonationFormComponent
    });
  }

  getQuickStats() {
    const total = this.donations().reduce((sum, d) => sum + (d.amount || 0), 0);
    const net = this.donations().reduce((sum, d) => sum + (d.net || 0), 0);
    return [
      { label: 'Settled Today', value: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
      { label: 'Pending Rails', value: '$0.00' },
      { label: 'Manual Entries', value: this.donations().length.toString() },
      { label: 'Net Deposits', value: `$${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
    ];
  }
}
