import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { LucideAngularModule, AlertCircle, TrendingUp, Users, CreditCard, RefreshCcw, Landmark, FileCheck } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, LucideAngularModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Welcome Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-extrabold text-wgc-navy-900 tracking-tight">Overview Dashboard</h2>
          <p class="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Institutional monitoring of platform-wide stewardships.</p>
        </div>
        <button class="bg-wgc-white border border-wgc-navy-100/50 text-wgc-navy-900 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-wgc-navy-50 transition-all shadow-sm">
          System Analytics
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Processed Volume (30D)</p>
            <p class="text-3xl font-extrabold text-wgc-navy-900 mt-2 tracking-tight">{{ stats()?.totalVolume | currency }}</p>
          </div>
          <div class="flex items-center gap-2 text-wgc-green-600 text-[10px] font-bold mt-4 uppercase tracking-wider">
             <lucide-icon [img]="TrendingUp" class="w-3.5 h-3.5"></lucide-icon>
             +4.2% Growth
          </div>
        </div>
        <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Active Merchants</p>
            <p class="text-3xl font-extrabold text-wgc-navy-900 mt-2 tracking-tight">{{ stats()?.totalMerchants || 0 }}</p>
          </div>
          <p class="text-[10px] text-wgc-navy-400 font-bold mt-4 uppercase tracking-widest italic">Platform Nodes</p>
        </div>
        <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Sub-Engine Activity</p>
            <p class="text-3xl font-extrabold text-wgc-navy-900 mt-2 tracking-tight">{{ stats()?.activeRecurring || 0 }}</p>
          </div>
          <p class="text-[10px] text-wgc-navy-400 font-bold mt-4 uppercase tracking-widest italic">Recurring Plans</p>
        </div>
        <div class="bg-wgc-white p-6 rounded-2xl border border-wgc-navy-100 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Pending Payouts</p>
            <p class="text-3xl font-extrabold text-wgc-navy-900 mt-2 tracking-tight text-wgc-gold-600">{{ stats()?.pendingPayoutsTotal | currency }}</p>
          </div>
          <p class="text-[10px] text-wgc-navy-400 font-bold mt-4 uppercase tracking-widest italic text-yellow-600">Settling T+2</p>
        </div>
      </div>

      <!-- Attention Required -->
      <div *ngIf="stats()?.actionItems?.length" class="bg-red-50/30 border border-red-100 rounded-2xl p-6">
        <h3 class="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
          <lucide-icon [img]="AlertCircle" class="w-4 h-4"></lucide-icon> Operational Inconsistencies
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div *ngFor="let item of stats()?.actionItems" class="bg-white p-4 rounded-xl border border-red-100 flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors">
            <div>
              <p class="text-[9px] font-bold text-wgc-navy-400 uppercase tracking-widest">{{ item.label }}</p>
              <p class="text-xl font-black text-red-600">{{ item.count }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-wgc-white rounded-2xl border border-wgc-navy-100 shadow-sm overflow-hidden">
        <div class="px-8 py-5 border-b border-wgc-navy-50 bg-wgc-navy-50/20 flex items-center justify-between">
          <h3 class="text-[10px] font-black text-wgc-navy-900 uppercase tracking-[0.2em]">Live Transaction Ledger</h3>
          <span class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">{{ stats()?.recentPayments?.length || 0 }} Recent Events</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-wgc-navy-50/50 text-[10px] font-bold text-wgc-navy-400 uppercase tracking-[0.15em] border-b border-wgc-navy-50">
                <th class="px-8 py-4">Identity</th>
                <th class="px-8 py-4">Recipient</th>
                <th class="px-8 py-4 text-right">Settled Amt</th>
                <th class="px-8 py-4 text-center">Status</th>
                <th class="px-8 py-4 text-right">Execution Mark</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wgc-navy-50">
              <tr *ngFor="let payment of stats()?.recentPayments" class="hover:bg-wgc-navy-50/30 transition-colors group">
                <td class="px-8 py-5">
                  <div class="font-bold text-wgc-navy-900 text-xs">{{ payment.donor?.firstName }} {{ payment.donor?.lastName }}</div>
                  <div class="text-[9px] text-wgc-navy-400 font-mono tracking-tighter uppercase">{{ payment.donor?.email }}</div>
                </td>
                <td class="px-8 py-5 font-bold text-wgc-navy-400 text-xs uppercase tracking-tight">{{ payment.merchant?.legalName }}</td>
                <td class="px-8 py-5 font-bold text-wgc-navy-900 text-right tabular-nums">
                  {{ payment.amount | currency }}
                </td>
                <td class="px-8 py-5 text-center">
                  <span [ngClass]="{
                    'bg-green-100 text-green-700': payment.status === 'success',
                    'bg-yellow-100 text-yellow-700': payment.status === 'pending',
                    'bg-red-100 text-red-700': payment.status === 'failed'
                  }" class="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-8 py-5 text-right tabular-nums text-wgc-navy-400 font-bold text-xs uppercase">{{ payment.createdAt | date:'MMM d, h:mm a' }}</td>
              </tr>
              <tr *ngIf="!stats()?.recentPayments?.length">
                <td colspan="5" class="px-8 py-16 text-center">
                  <lucide-icon [img]="Landmark" class="w-8 h-8 text-wgc-navy-100 mx-auto mb-2"></lucide-icon>
                  <p class="text-[10px] font-bold text-wgc-navy-300 uppercase tracking-widest">Registry Empty</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})

export class DashboardHomeComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  stats = signal<any>(null);

  readonly AlertCircle = AlertCircle;
  readonly TrendingUp = TrendingUp;
  readonly Users = Users;
  readonly CreditCard = CreditCard;
  readonly RefreshCcw = RefreshCcw;
  readonly Landmark = Landmark;
  readonly FileCheck = FileCheck;

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error fetching stats:', err)
    });
  }
}
