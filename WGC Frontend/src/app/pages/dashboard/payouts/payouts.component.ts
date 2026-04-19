import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { LucideAngularModule, Landmark, Download, ArrowRight, Clock } from 'lucide-angular';

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, LucideAngularModule],
  template: `
    <div class="space-y-6 pb-12">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-extrabold text-wgc-navy-900 tracking-tight">Payouts</h2>
          <p class="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Disbursement and Settlement Registry</p>
        </div>
        <button class="bg-wgc-white border border-wgc-navy-100/50 text-wgc-navy-900 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-wgc-navy-50 transition-all shadow-sm flex items-center gap-2">
          <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
          Download Registry
        </button>
      </div>

      <!-- Payout Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm">
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Provisioned for Transfer</p>
          <p class="text-3xl font-extrabold text-wgc-navy-900 mt-2 tracking-tight">$12,450.00</p>
          <div class="flex items-center gap-1.5 text-wgc-green-600 text-[10px] font-bold mt-3 uppercase tracking-wider">
             <lucide-icon [img]="Clock" class="w-3.5 h-3.5"></lucide-icon>
             Next Batch: Tomorrow
          </div>
        </div>
        <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm">
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Clearing Reserve</p>
          <p class="text-3xl font-extrabold text-wgc-navy-900 mt-2 tracking-tight">$4,120.50</p>
          <p class="text-[10px] text-wgc-gold-600 font-bold mt-3 uppercase tracking-widest">Pending Settlement</p>
        </div>
        <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm">
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Global Payouts (MTD)</p>
          <p class="text-3xl font-extrabold text-wgc-navy-900 mt-2 tracking-tight">$84,000.00</p>
          <p class="text-[10px] text-wgc-navy-400 font-bold mt-3 uppercase tracking-widest italic">128 transfers completed</p>
        </div>
      </div>

      <div class="bg-wgc-white rounded-2xl border border-wgc-navy-100 shadow-sm overflow-hidden">
        <div class="px-8 py-5 border-b border-wgc-navy-50 bg-wgc-navy-50/20">
          <h3 class="text-[10px] font-black text-wgc-navy-900 uppercase tracking-[0.2em]">Platform Transfers</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-wgc-navy-50/50 text-[10px] font-bold text-wgc-navy-400 uppercase tracking-[0.15em] border-b border-wgc-navy-50">
                <th class="px-8 py-4">Transfer / Identity</th>
                <th class="px-8 py-4">Recipient</th>
                <th class="px-8 py-4 text-right">Settled Amt</th>
                <th class="px-8 py-4 text-center">Status</th>
                <th class="px-8 py-4 text-right">Clearance Window</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wgc-navy-50">
              <tr *ngFor="let payout of payouts()" class="hover:bg-wgc-navy-50/30 transition-colors group">
                <td class="px-8 py-5">
                  <div class="font-bold text-wgc-navy-900 text-xs">#PY_{{ payout.id.substring(0,8) }}</div>
                  <div class="text-[9px] text-wgc-navy-400 font-mono tracking-tighter uppercase mt-0.5">{{ payout.id.substring(8,16) }}</div>
                </td>
                <td class="px-8 py-5 font-bold text-wgc-navy-400 text-xs uppercase tracking-tight">{{ payout.merchant?.legalName }}</td>
                <td class="px-8 py-5 font-bold text-wgc-navy-900 text-right tabular-nums">
                  {{ payout.amount | currency }}
                </td>
                <td class="px-8 py-5 text-center">
                  <span [ngClass]="{
                    'bg-green-100 text-green-700 border-green-200': payout.status === 'paid',
                    'bg-yellow-100 text-yellow-700 border-yellow-200': payout.status === 'pending',
                    'bg-red-100 text-red-700 border-red-200': payout.status === 'failed'
                  }" class="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm">
                    {{ payout.status }}
                  </span>
                </td>
                <td class="px-8 py-5 text-right tabular-nums text-wgc-navy-400 font-bold text-xs uppercase">
                  <div class="flex items-center justify-end gap-2" *ngIf="payout.arrivalDate">
                    {{ payout.arrivalDate | date:'MMM d, yyyy' }}
                    <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5 text-wgc-gold-600"></lucide-icon>
                  </div>
                  <span *ngIf="!payout.arrivalDate" class="text-wgc-navy-300">Processing...</span>
                </td>
              </tr>
              <tr *ngIf="!payouts()?.length">
                <td colspan="5" class="px-8 py-16 text-center text-wgc-navy-300">
                   <p class="text-[10px] font-bold uppercase tracking-widest">No payout records found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PayoutsComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  payouts = signal<any[]>([]);

  readonly Landmark = Landmark;
  readonly Download = Download;
  readonly ArrowRight = ArrowRight;
  readonly Clock = Clock;

  ngOnInit() {
    this.dashboardService.getPayouts().subscribe({
      next: (data) => this.payouts.set(data),
      error: (err) => console.error('Error fetching payouts:', err)
    });
  }
}
