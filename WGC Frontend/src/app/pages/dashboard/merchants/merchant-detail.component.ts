import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { NotificationService } from '../../../services/notification.service';
import { LucideAngularModule, ChevronLeft, ExternalLink, Mail, Phone, MapPin, CheckCircle2, Clock, Landmark, RefreshCcw, LayoutDashboard, ChevronRight, ShieldCheck, Ban, CheckCircle } from 'lucide-angular';
import { DemoDashboardComponent } from '../../demo-dashboard/demo-dashboard.component';

@Component({
  selector: 'app-merchant-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterModule, LucideAngularModule, DemoDashboardComponent],
  template: `
    <div class="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Header / Unified Navigation -->
      <div class="relative overflow-hidden rounded-[3rem] bg-wgc-white p-12 text-wgc-navy-950 border border-wgc-navy-100 shadow-sm">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2" style="background: radial-gradient(circle, #ca8a04 0%, transparent 70%);"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div class="flex items-center gap-8">
            <a routerLink="/dashboard/merchants" class="w-14 h-14 bg-wgc-off text-wgc-navy-300 rounded-2xl hover:bg-white hover:text-wgc-navy-950 transition-all border border-wgc-navy-100 flex items-center justify-center group">
              <lucide-icon [img]="ChevronLeft" class="w-6 h-6 group-hover:-translate-x-1 transition-transform"></lucide-icon>
            </a>
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wgc-gold-50 border border-wgc-gold-100 text-[10px] font-black uppercase tracking-[0.3em] text-wgc-gold-600 mb-4 font-mono">Institutional Node</div>
              <h2 class="text-4xl font-black tracking-tight leading-none text-wgc-navy-950 uppercase">\{{ merchant()?.name }}</h2>
              <div class="flex items-center gap-4 mt-4">
                <span class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  Network UID: <span class="text-wgc-navy-950 font-mono">TRX-\{{ merchant()?.id?.substring(0,8) }}</span>
                </span>
                <div class="w-1 h-1 rounded-full bg-wgc-navy-200"></div>
                <lucide-icon [img]="ExternalLink" class="w-4 h-4 text-wgc-navy-300 cursor-pointer hover:text-wgc-gold-600 transition-colors"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="flex gap-4">
            <ng-container *ngIf="merchant()?.onboardingStatus === 'pending'">
              <button (click)="updateStatus('failed')" class="flex items-center gap-2 px-6 py-4 bg-white border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm">
                <lucide-icon [img]="Ban" class="w-4 h-4"></lucide-icon>
                Reject Entry
              </button>
              <button (click)="updateStatus('live')" class="flex items-center gap-2 bg-wgc-gold-600 px-8 py-4 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-wgc-gold-600/20 hover:bg-wgc-gold-600 transition-all active:scale-95">
                <lucide-icon [img]="CheckCircle" class="w-4 h-4"></lucide-icon>
                Approve Protocol
              </button>
            </ng-container>
            
            <button *ngIf="merchant()?.onboardingStatus === 'live'" (click)="initSettlement()" class="bg-wgc-navy-950 px-10 py-4 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-wgc-navy-900 transition-all">
               Execution Detail
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2 space-y-12">
          
          <!-- Key Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div *ngFor="let metric of getMetrics()" class="bg-wgc-white p-10 rounded-[2.5rem] border border-wgc-navy-100 shadow-sm relative group overflow-hidden">
               <div class="absolute top-0 right-0 w-32 h-32 bg-wgc-gold-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
               <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] mb-4">\{{ metric.label }}</p>
               <p class="text-4xl font-black text-wgc-navy-950 tracking-tighter">\{{ metric.value }}</p>
               <div class="mt-6 flex items-center gap-2 text-[9px] font-black text-wgc-gold-600 bg-wgc-gold-50 px-3 py-1.5 rounded-xl w-fit border border-wgc-gold-100 uppercase tracking-widest font-mono">
                  \{{ metric.status }}
               </div>
            </div>
          </div>

          <!-- Network Ledger -->
          <div class="bg-wgc-white rounded-[3rem] border border-wgc-navy-100 shadow-sm overflow-hidden">
            <div class="px-10 py-10 border-b border-wgc-navy-50 flex items-center justify-between bg-wgc-off/50">
              <div>
                <h3 class="text-xl font-black text-wgc-navy-950 tracking-tight">Institutional Activity Ledger</h3>
                <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] mt-2">Real-time processing logs for this merchant node</p>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] bg-wgc-off/30 border-b border-wgc-navy-50">
                    <th class="px-10 py-6">Benefactor</th>
                    <th class="px-10 py-6">Amount</th>
                    <th class="px-10 py-6">Mechanism</th>
                    <th class="px-10 py-6 text-right">Executed</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-wgc-navy-50">
                  <tr *ngFor="let p of merchant()?.payments" class="hover:bg-wgc-off transition-all group">
                    <td class="px-10 py-8">
                       <div class="font-black text-wgc-navy-950 group-hover:text-wgc-gold-600 transition-colors text-base tracking-tight leading-none mb-1">\{{ p.donor?.name || 'Anonymous Giver' }}</div>
                       <div class="text-[10px] text-wgc-navy-300 font-bold uppercase tracking-widest font-mono">\{{ p.donor?.email }}</div>
                    </td>
                    <td class="px-10 py-8 font-black text-wgc-navy-950 text-xl tabular-nums tracking-tighter">$\{{ p.amount | number:'1.2-2' }}</td>
                    <td class="px-10 py-8">
                      <span class="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm bg-white text-wgc-navy-600 border-wgc-navy-100">
                        \{{ p.method || 'Card Rail' }}
                      </span>
                    </td>
                    <td class="px-10 py-8 text-right text-wgc-navy-400 font-black tabular-nums text-xs uppercase tracking-tight opacity-70">
                      \{{ p.createdAt | date:'MMM dd, HH:mm' }}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div *ngIf="!merchant()?.payments?.length" class="py-24 text-center">
                 <lucide-icon [img]="Clock" class="w-10 h-10 text-wgc-navy-100 mx-auto mb-4"></lucide-icon>
                 <p class="text-[10px] font-black text-wgc-navy-200 uppercase tracking-[0.4em]">Stewardship Ledger Empty</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-12">
          
          <!-- Lifecycle State -->
          <div class="bg-wgc-white p-12 rounded-[3.5rem] border border-wgc-navy-100 shadow-sm relative overflow-hidden group">
            <h3 class="text-[10px] font-black text-wgc-gold-600 uppercase tracking-[0.4em] mb-10">Orchestration Protocol</h3>
            <div class="space-y-8">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-black text-wgc-navy-400 uppercase tracking-[0.25em]">Registry State</span>
                <span [ngClass]="{
                  'bg-wgc-gold-50 text-wgc-gold-700 border-wgc-gold-100': merchant()?.onboardingStatus === 'live' || merchant()?.onboardingStatus === 'pending',
                  'bg-red-50 text-red-700 border-red-100': merchant()?.onboardingStatus === 'failed'
                }" class="px-4 py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest">
                  \{{ merchant()?.onboardingStatus?.toUpperCase() || 'SYNCHRONIZING' }}
                </span>
              </div>
              <div class="h-px bg-wgc-navy-50"></div>
              <div class="space-y-6">
                <div class="flex items-center justify-between group/status">
                  <span class="text-[11px] font-black text-wgc-navy-400 uppercase tracking-widest flex items-center gap-4">
                    <div class="w-2 h-2 rounded-full" [ngClass]="merchant()?.onboardingStatus === 'live' ? 'bg-wgc-gold-600 shadow-sm' : 'bg-wgc-navy-100'"></div>
                    ACH Network Rail
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-widest" [ngClass]="merchant()?.onboardingStatus === 'live' ? 'text-wgc-gold-600' : 'text-wgc-navy-200'">\{{ merchant()?.onboardingStatus === 'live' ? 'Live' : 'Locked' }}</span>
                </div>
                <div class="flex items-center justify-between group/status">
                  <span class="text-[11px] font-black text-wgc-navy-400 uppercase tracking-widest flex items-center gap-4">
                    <div class="w-2 h-2 rounded-full" [ngClass]="merchant()?.onboardingStatus === 'live' ? 'bg-wgc-gold-600 shadow-sm' : 'bg-wgc-navy-100'"></div>
                    Recurring Engine
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-widest" [ngClass]="merchant()?.onboardingStatus === 'live' ? 'text-wgc-gold-600' : 'text-wgc-navy-200'">\{{ merchant()?.onboardingStatus === 'live' ? 'Live' : 'Locked' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Network Profile -->
          <div class="bg-wgc-white p-12 rounded-[3.5rem] border border-wgc-navy-100 shadow-sm space-y-10">
            <h3 class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.4em]">Core Node Profile</h3>
            <div class="space-y-8">
              <div class="flex items-start gap-6">
                <div class="w-14 h-14 bg-wgc-off rounded-2xl flex items-center justify-center text-wgc-gold-600 border border-wgc-navy-100 shadow-sm">
                   <lucide-icon [img]="Mail" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                   <p class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-[0.25em] mb-1">Secure Channel</p>
                   <p class="text-sm font-black text-wgc-navy-950 tracking-tight">\{{ merchant()?.email }}</p>
                </div>
              </div>
              <div class="flex items-start gap-6">
                <div class="w-14 h-14 bg-wgc-off rounded-2xl flex items-center justify-center text-wgc-gold-600 border border-wgc-navy-100 shadow-sm">
                   <lucide-icon [img]="MapPin" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                   <p class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-[0.25em] mb-1">Institution Origin</p>
                   <p class="text-sm font-black text-wgc-navy-950 tracking-tight leading-relaxed italic">Ministry Headquarters<br>United Seattle, WA 98101</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- White-Label Simulation -->
      <div class="mt-12 bg-wgc-off/50 border border-wgc-navy-100 rounded-[4rem] overflow-hidden shadow-sm relative group">
        <div class="p-12 border-b border-wgc-navy-50 bg-white flex items-center justify-between">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-wgc-gold-50 rounded-[1.5rem] flex items-center justify-center text-wgc-gold-600 shadow-sm border border-wgc-gold-100">
                <lucide-icon [img]="LayoutDashboard" class="w-8 h-8"></lucide-icon>
              </div>
              <div>
                <h3 class="text-2xl font-black text-wgc-navy-950 tracking-tight leading-none">White-Label Product Mirror</h3>
                <p class="text-[11px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] mt-3">Church-specific dashboard simulation (Production MU)</p>
              </div>
            </div>
            <span class="px-6 py-3 bg-wgc-gold-50 border border-wgc-gold-100 rounded-2xl text-[10px] font-black text-wgc-gold-600 uppercase tracking-[0.3em] shadow-sm font-mono animate-pulse">
                Live Data Simulation
            </span>
        </div>
        <div class="bg-wgc-off p-6 relative">
           <div class="h-[800px] overflow-y-auto rounded-[3.5rem] bg-white shadow-2xl border border-wgc-navy-100 mx-auto">
             <app-demo-dashboard></app-demo-dashboard>
           </div>
        </div>
      </div>
    </div>
  `
})
export class MerchantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dashboardService = inject(DashboardService);
  private notify = inject(NotificationService);
  
  merchant = signal<any>(null);

  readonly ChevronLeft = ChevronLeft;
  readonly ExternalLink = ExternalLink;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Clock = Clock;
  readonly Landmark = Landmark;
  readonly RefreshCcw = RefreshCcw;
  readonly LayoutDashboard = LayoutDashboard;
  readonly ShieldCheck = ShieldCheck;
  readonly Ban = Ban;
  readonly CheckCircle = CheckCircle;

  ngOnInit() {
    this.loadMerchant();
  }

  loadMerchant() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dashboardService.getMerchantDetail(id).subscribe({
        next: (data) => this.merchant.set(data),
        error: (err) => this.notify.error('Unable to synchronize institutional node detail.', 'Sync Error')
      });
    }
  }

  updateStatus(status: string) {
    const id = this.merchant()?.id;
    if (!id) return;

    this.dashboardService.updateMerchantStatus(id, status).subscribe({
      next: () => {
        this.notify.success(`Institutional state updated to ${status.toUpperCase()}.`, 'Lifecycle Update');
        this.loadMerchant();
      },
      error: () => this.notify.error('Failed to update institutional state.', 'API Rejection')
    });
  }

  initSettlement() {
    this.notify.success('Initiating high-frequency settlement protocol audit.', 'Execution Started');
  }

  getMetrics() {
    const m = this.merchant();
    return [
      { label: 'Gross Throughput', value: m?.totalVolume ? `$${m.totalVolume.toLocaleString()}` : '$0.00', status: 'Settled Capacity' },
      { label: 'Platform Traffic', value: (m?._count?.payments || 0).toString(), status: 'Audit Cycles' },
      { label: 'Network Assets', value: (m?._count?.recurring || 0).toString(), status: 'Sustainable Flow' }
    ];
  }
}
