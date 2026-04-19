import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChurchService } from '../../../../services/church.service';
import { LucideAngularModule, ChevronLeft, Mail, Calendar, CreditCard, RefreshCcw, Landmark, History, Search } from 'lucide-angular';

@Component({
  selector: 'app-church-donor-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-8 max-w-6xl mx-auto animate-in slide-in-from-bottom duration-500">
      <!-- Back Link -->
      <a routerLink="/dashboard/church/donors" class="inline-flex items-center text-[10px] font-bold text-wgc-navy-400 hover:text-wgc-gold-600 transition-colors gap-1.5 uppercase tracking-[0.15em]">
        <lucide-icon [img]="ChevronLeft" class="w-4 h-4"></lucide-icon>
        Back to Directory
      </a>

      <!-- Donor Header Card -->
      <div class="bg-wgc-white rounded-3xl border border-wgc-navy-100/30 shadow-sm p-8 flex flex-wrap gap-8 items-start ring-1 ring-wgc-navy-50/50">
        <div class="w-24 h-24 rounded-2xl bg-wgc-gold-600 border border-white/20 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
          {{ donor()?.name?.charAt(0) }}
        </div>
        <div class="flex-1 space-y-4">
          <div>
            <h2 class="text-3xl font-bold font-extrabold text-wgc-navy-900 tracking-tight">{{ donor()?.name }}</h2>
            <div class="flex flex-wrap gap-4 mt-2">
              <div class="flex items-center gap-1.5 text-sm font-bold text-wgc-navy-400">
                <lucide-icon [img]="Mail" class="w-4 h-4 text-wgc-gold-500"></lucide-icon>
                {{ donor()?.email }}
              </div>
              <div class="flex items-center gap-1.5 text-[11px] font-bold text-wgc-navy-400 uppercase tracking-widest">
                <lucide-icon [img]="Calendar" class="w-4 h-4"></lucide-icon>
                Donor since {{ donor()?.createdAt | date:'MMMM yyyy' }}
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <button class="metallic-gold text-wgc-navy-900 font-bold px-5 py-2.5 rounded-xl text-[10px] hover:shadow-lg transition-all shadow-md uppercase tracking-[0.15em]">Edit Details</button>
            <button class="bg-wgc-white border border-wgc-navy-100 text-wgc-navy-400 font-bold px-5 py-2.5 rounded-xl text-[10px] hover:bg-wgc-navy-50 shadow-sm uppercase tracking-[0.15em] transition-all">Email Receipt</button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div class="bg-wgc-gold-600 text-white p-5 rounded-2xl border border-white/10 shadow-lg">
            <p class="text-[9px] font-bold text-white/70 uppercase tracking-[0.2em] mb-1">Lifetime Giving</p>
            <p class="text-2xl font-extrabold tabular-nums">{{ donor()?.totalGiving | currency }}</p>
          </div>
          <div class="bg-wgc-navy-50 p-5 rounded-2xl border border-wgc-navy-100">
            <p class="text-[9px] font-bold text-wgc-navy-400 uppercase tracking-[0.2em] mb-1">Gift Count</p>
            <p class="text-2xl font-extrabold text-wgc-navy-900 tabular-nums">{{ donor()?.donationCount }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Giving History -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-wgc-white rounded-2xl border border-wgc-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div class="px-8 py-6 border-b border-wgc-gray-100 flex items-center justify-between">
              <h3 class="font-extrabold text-wgc-navy-900 flex items-center gap-2">
                <lucide-icon [img]="History" class="w-5 h-5 text-wgc-gold-600"></lucide-icon>
                Giving History
              </h3>
              <div class="relative">
                <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-wgc-navy-400"></lucide-icon>
                <input type="text" placeholder="Filter history..." class="pl-8 pr-3 py-1.5 text-[10px] font-bold border border-wgc-navy-100 rounded-full focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 uppercase tracking-widest bg-wgc-off/30 transition-all font-medium">
              </div>
            </div>
            <div class="flex-1 overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-wgc-navy-50/50 text-[10px] font-bold text-wgc-navy-400 uppercase tracking-[0.15em] border-b border-wgc-navy-50">
                  <tr>
                    <th class="px-8 py-3">Fund</th>
                    <th class="px-8 py-3">Method</th>
                    <th class="px-8 py-3 text-right">Amount</th>
                    <th class="px-8 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-wgc-gray-50">
                  <tr *ngFor="let p of donations()" class="hover:bg-indigo-50/10 transition-colors">
                    <td class="px-8 py-4">
                      <div class="font-bold text-wgc-navy-400 text-[11px] uppercase tracking-tight">{{ p.fund }}</div>
                      <div *ngIf="p.isRecurring" class="text-[9px] text-wgc-gold-600 font-bold uppercase flex items-center gap-1 mt-0.5 tracking-widest">
                        <lucide-icon [img]="RefreshCcw" class="w-2.5 h-2.5"></lucide-icon> Recurring Gift
                      </div>
                    </td>
                    <td class="px-8 py-4">
                      <div class="flex items-center gap-2 text-[11px] font-bold text-wgc-gray-500 uppercase">
                        <lucide-icon [img]="p.method === 'CARD' ? CreditCard : Landmark" class="w-3.5 h-3.5"></lucide-icon>
                        {{ p.method }}
                      </div>
                    </td>
                    <td class="px-8 py-4 text-right font-black text-wgc-gray-900 tabular-nums">
                      {{ p.amount | currency }}
                    </td>
                    <td class="px-8 py-4 text-right font-bold text-wgc-navy-400 tabular-nums">
                      {{ p.createdAt | date:'MMM d, y' }}
                    </td>
                  </tr>
                  <tr *ngIf="!donations()?.length">
                    <td colspan="4" class="px-8 py-12 text-center text-wgc-navy-400">No donations recorded.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Active Recurring Plans -->
          <div class="bg-wgc-white rounded-2xl border border-wgc-gray-100 shadow-sm p-6 ring-1 ring-wgc-gray-50/50">
            <h3 class="font-bold text-wgc-navy-400 text-[10px] mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
              <lucide-icon [img]="RefreshCcw" class="w-4 h-4 text-wgc-gold-500"></lucide-icon>
              Recurring Plans
            </h3>
            <div class="space-y-3">
              <div *ngFor="let plan of recurringPlans()" class="p-4 rounded-xl border border-wgc-navy-100 bg-wgc-navy-50/20">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-lg font-extrabold text-wgc-navy-900 tabular-nums">{{ plan.amount | currency }}</span>
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-wgc-gold-50 text-wgc-gold-600 border border-wgc-gold-100">
                    {{ plan.interval }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-[10px] font-bold text-wgc-gray-500">
                  <span>Next: {{ plan.nextBillingDate | date:'MMM d' }}</span>
                  <span class="text-green-600">Active</span>
                </div>
              </div>
              <p *ngIf="!recurringPlans()?.length" class="text-xs text-wgc-navy-400 italic">No active subscriptions.</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-wgc-white rounded-3xl shadow-xl p-8 text-wgc-navy-900 relative overflow-hidden border border-wgc-navy-100">
            <div class="relative z-10">
              <h3 class="font-bold text-[10px] uppercase tracking-[0.2em] text-wgc-gold-500 mb-4">Donor Insights</h3>
              <p class="text-xs text-wgc-navy-600 leading-relaxed mb-6 font-medium">
                This donor primarily gives via CARD and focuses on the General fund. They have been active for 
                <span class="text-wgc-gold-400 font-bold">14 months</span>.
              </p>
              <button class="w-full py-3 metallic-gold text-wgc-navy-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:scale-[1.02] transition-all">
                View Engagement Report
              </button>
            </div>
            <!-- Decorative circle -->
            <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-wgc-gold-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ChurchDonorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private churchService = inject(ChurchService);

  donor = signal<any>(null);
  donations = signal<any[]>([]);
  recurringPlans = signal<any[]>([]);

  readonly ChevronLeft = ChevronLeft;
  readonly Mail = Mail;
  readonly Calendar = Calendar;
  readonly CreditCard = CreditCard;
  readonly RefreshCcw = RefreshCcw;
  readonly Landmark = Landmark;
  readonly History = History;
  readonly Search = Search;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.churchService.getDonorDetail(id).subscribe({
        next: (data) => {
          this.donor.set(data.donor);
          this.donations.set(data.donations);
          this.recurringPlans.set(data.recurring);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
