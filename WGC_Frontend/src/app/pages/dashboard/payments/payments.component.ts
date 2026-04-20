import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { LucideAngularModule, Search, Filter, Download, CreditCard, Landmark, RefreshCcw } from 'lucide-angular';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, LucideAngularModule],
  template: `
    <div class="space-y-6 pb-12">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-extrabold text-wgc-navy-900 tracking-tight">System Payments</h2>
          <p class="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Stewardship Ledger Registry</p>
        </div>
        <button class="bg-wgc-white border border-wgc-navy-100/50 text-wgc-navy-900 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-wgc-navy-50 transition-all shadow-sm flex items-center gap-2">
          <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
          Export Ledger
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div class="relative flex-1 min-w-[300px]">
          <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300"></lucide-icon>
          <input type="text" placeholder="Search transactions..." 
            class="pl-10 pr-4 py-3 w-full text-sm border border-wgc-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-wgc-navy-50 bg-wgc-off placeholder:text-wgc-navy-200">
        </div>
        <div class="flex items-center gap-3">
          <select (change)="onFilterChange('type', $any($event.target).value)" 
            class="text-[10px] font-bold uppercase tracking-widest border border-wgc-navy-100 rounded-xl px-4 py-3 bg-white focus:outline-none text-wgc-navy-600 shadow-sm">
            <option value="">All Rails</option>
            <option value="CARD">Card</option>
            <option value="ACH">ACH</option>
          </select>
          <select (change)="onFilterChange('status', $any($event.target).value)"
            class="text-[10px] font-bold uppercase tracking-widest border border-wgc-navy-100 rounded-xl px-4 py-3 bg-white focus:outline-none text-wgc-navy-600 shadow-sm">
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div class="bg-wgc-white rounded-2xl border border-wgc-navy-100 shadow-sm overflow-hidden">
        <div class="px-8 py-5 border-b border-wgc-navy-50 bg-wgc-navy-50/20">
          <h3 class="text-[10px] font-black text-wgc-navy-900 uppercase tracking-[0.2em]">Transaction Flow</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-wgc-navy-50/50 text-[10px] font-bold text-wgc-navy-400 uppercase tracking-[0.15em] border-b border-wgc-navy-50">
                <th class="px-4 md:px-8 py-4">Identity</th>
                <th class="px-8 py-4 hidden lg:table-cell">Merchant</th>
                <th class="px-4 md:px-8 py-4 text-center">Rail</th>
                <th class="px-4 md:px-8 py-4 text-right">Amount</th>
                <th class="px-4 md:px-8 py-4 text-center">Status</th>
                <th class="px-8 py-4 text-right hidden sm:table-cell">Executed At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wgc-navy-50">
              <tr *ngFor="let payment of payments()" class="hover:bg-wgc-navy-50/30 transition-colors group">
                <td class="px-4 md:px-8 py-5">
                  <div class="font-bold text-wgc-navy-900 text-[11px] md:text-xs truncate max-w-[100px] md:max-w-none">{{ payment.donor?.name || 'Authorized Donor' }}</div>
                  <div class="text-[9px] md:text-[10px] text-wgc-navy-400 font-mono tracking-tighter uppercase mt-0.5">#{{ payment.id.substring(0,8) }}</div>
                </td>
                <td class="px-8 py-5 text-wgc-navy-400 font-bold text-xs uppercase tracking-tight hidden lg:table-cell">{{ payment.merchant?.legalName }}</td>
                <td class="px-4 md:px-8 py-5 text-center">
                   <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-wgc-off rounded text-[8px] md:text-[9px] font-bold text-wgc-navy-400 border border-wgc-navy-50">
                     <lucide-icon [img]="payment.method === 'CARD' ? CreditCard : Landmark" class="w-3 h-3 text-wgc-navy-300"></lucide-icon>
                     <span class="hidden md:inline">{{ payment.method }}</span>
                   </div>
                </td>
                <td class="px-4 md:px-8 py-5 font-bold text-wgc-navy-900 text-right tabular-nums text-[11px] md:text-sm">
                  {{ payment.amount | currency }}
                </td>
                <td class="px-4 md:px-8 py-5 text-center">
                  <span [ngClass]="{
                    'bg-green-100 text-green-700 border-green-200': payment.status === 'success',
                    'bg-yellow-100 text-yellow-700 border-yellow-200': payment.status === 'pending',
                    'bg-red-100 text-red-700 border-red-200': payment.status === 'failed'
                  }" class="px-2 md:px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest border shadow-sm">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-8 py-5 text-right tabular-nums text-wgc-navy-400 font-bold text-[10px] md:text-xs uppercase hidden sm:table-cell">{{ payment.createdAt | date:'MMM d, h:mm a' }}</td>
              </tr>
              <tr *ngIf="!payments()?.length">
                <td colspan="6" class="px-4 md:px-8 py-16 text-center text-wgc-navy-300">
                   <p class="text-[10px] font-bold uppercase tracking-widest">No transaction records found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PaymentsComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  payments = signal<any[]>([]);
  filters = signal<any>({});

  readonly Search = Search;
  readonly Filter = Filter;
  readonly Download = Download;
  readonly CreditCard = CreditCard;
  readonly Landmark = Landmark;
  readonly RefreshCcw = RefreshCcw;

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.dashboardService.getPayments(this.filters()).subscribe({
      next: (data) => this.payments.set(data),
      error: (err) => console.error('Error fetching payments:', err)
    });
  }

  onFilterChange(key: string, value: any) {
    this.filters.update(f => ({ ...f, [key]: value }));
    this.loadPayments();
  }
}
