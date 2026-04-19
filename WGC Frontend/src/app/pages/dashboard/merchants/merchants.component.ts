import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { ModalService } from '../../../services/modal.service';
import { NotificationService } from '../../../services/notification.service';
import { LucideAngularModule, Search, Plus, Filter, MoreHorizontal, Building2, ChevronRight, Activity } from 'lucide-angular';
import { EmptyStateComponent } from '../../../components/ui/empty-state/empty-state.component';
import { MerchantFormComponent } from './merchant-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 class="text-3xl font-black text-wgc-navy-950 tracking-tight leading-none mb-1 uppercase">Institutional Network</h2>
          <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] font-mono opacity-80">Registry of Mission-Aligned Partners</p>
        </div>
        <button (click)="openAddMerchant()"
          class="bg-wgc-gold-600 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-wgc-gold-500/20 flex items-center gap-2 active:scale-95 group">
          <lucide-icon [img]="Plus" class="w-4 h-4 group-hover:rotate-90 transition-transform"></lucide-icon>
          Register Merchant
        </button>
      </div>

      <!-- Discovery & Orchestration -->
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 group">
          <lucide-icon [img]="Search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300 group-focus-within:text-wgc-gold-600 transition-colors"></lucide-icon>
          <input type="text" placeholder="Institutional search by MID, entity name, or primary admin..." 
            (input)="onSearch($event)"
            class="pl-12 pr-4 py-4 w-full text-[11px] font-black uppercase tracking-widest border border-wgc-navy-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-wgc-gold-500/5 focus:border-wgc-gold-500/40 bg-wgc-white shadow-sm placeholder:text-wgc-navy-200 transition-all font-mono">
        </div>
      </div>

      <!-- Network Ledger Table -->
      <div class="bg-wgc-white rounded-[2.5rem] border border-wgc-navy-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div class="px-8 py-6 border-b border-wgc-navy-50 bg-wgc-off flex items-center justify-between">
          <div class="flex items-center gap-3">
             <div class="w-2 h-2 rounded-full bg-wgc-gold-500 animate-pulse"></div>
             <h3 class="text-[10px] font-black text-wgc-navy-950 uppercase tracking-[0.2em]">Institutional Registry</h3>
          </div>
          <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest italic opacity-70">Showing \{{ filteredMerchants().length }} Node(s)</span>
        </div>
        
        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-wgc-off/50 text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] border-b border-wgc-navy-50">
                <th class="px-8 py-5">Church Identity</th>
                <th class="px-8 py-5 text-center">Lifecycle Phase</th>
                <th class="px-8 py-5 text-center">Rail Efficiency</th>
                <th class="px-8 py-5 text-right">Established</th>
                <th class="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wgc-navy-50">
              <tr *ngFor="let m of filteredMerchants()" class="hover:bg-wgc-off transition-all group">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-2xl bg-wgc-navy-50 flex items-center justify-center text-wgc-gold-600 shadow-sm border border-wgc-navy-100 group-hover:bg-white transition-all">
                       <lucide-icon [img]="Building2" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div>
                      <div class="font-black text-wgc-navy-950 text-base tracking-tight leading-none mb-1.5 cursor-pointer hover:text-wgc-gold-600 transition-colors uppercase" [routerLink]="['/dashboard/merchants', m.id]">\{{ m.name }}</div>
                      <div class="text-[9px] text-wgc-navy-300 font-mono tracking-tighter uppercase opacity-80">Ref: TRX-\{{ m.id.substring(0,8) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6 text-center">
                  <span [ngClass]="{
                    'bg-wgc-gold-50 text-wgc-gold-700 border-wgc-gold-100': m.onboardingStatus === 'live',
                    'bg-wgc-navy-50 text-wgc-navy-700 border-wgc-navy-100': m.onboardingStatus === 'pending',
                    'bg-red-50 text-red-700 border-red-100': m.onboardingStatus === 'failed'
                  }" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm font-mono">
                    \{{ m.onboardingStatus }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center">
                   <div class="flex items-center justify-center gap-1.5">
                     <div class="w-1.5 h-1.5 rounded-full" [ngClass]="m.onboardingStatus === 'live' ? 'bg-wgc-gold-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-wgc-navy-200'"></div>
                     <span class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest font-mono">\{{ m.onboardingStatus === 'live' ? '100% HEALTH' : 'SYNCING' }}</span>
                   </div>
                </td>
                <td class="px-8 py-6 text-right tabular-nums text-wgc-navy-400 font-black text-[10px] uppercase tracking-tighter">
                  \{{ m.createdAt | date:'MMM dd, yyyy' }}
                </td>
                <td class="px-8 py-6 text-right">
                   <button [routerLink]="['/dashboard/merchants', m.id]" class="p-2.5 hover:bg-white border border-transparent hover:border-wgc-navy-100 rounded-xl text-wgc-navy-300 hover:text-wgc-navy-900 transition-all shadow-none hover:shadow-sm">
                      <lucide-icon [img]="ChevronRight" class="w-4 h-4"></lucide-icon>
                   </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State Container -->
          <div *ngIf="!filteredMerchants().length" class="flex flex-col items-center justify-center py-32 text-center bg-white flex-1">
             <app-empty-state 
               [icon]="Building2"
               title="Registry Empty"
               description="No institutional entities detected in current registry. Launch the onboarding protocol to associate a mission partner."
               actionLabel="Register Partner Node">
             </app-empty-state>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MerchantsComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private modalService = inject(ModalService);
  private notify = inject(NotificationService);

  merchants = signal<any[]>([]);
  filteredMerchants = signal<any[]>([]);
  private refreshSub?: Subscription;

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly Building2 = Building2;
  readonly ChevronRight = ChevronRight;
  readonly Activity = Activity;

  ngOnInit() {
    this.loadMerchants();
    this.refreshSub = this.dashboardService.refresh$.subscribe(() => this.loadMerchants());
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadMerchants() {
    this.dashboardService.getMerchants().subscribe({
      next: (data) => {
        this.merchants.set(data);
        this.filteredMerchants.set(data);
      },
      error: (err) => {
        this.notify.error('Unable to synchronize institutional registry.', 'System Error');
        console.error('Error fetching merchants:', err);
      }
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredMerchants.set(
      this.merchants().filter(m => 
        m.name?.toLowerCase().includes(term) || 
        m.email?.toLowerCase().includes(term) ||
        m.id?.toLowerCase().includes(term)
      )
    );
  }

  openAddMerchant() {
    this.modalService.open({
      title: 'Institutional Onboarding Protocol',
      component: MerchantFormComponent
    });
  }
}
