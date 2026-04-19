import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ChurchService } from '../../../../services/church.service';
import { ModalService } from '../../../../services/modal.service';
import { NotificationService } from '../../../../services/notification.service';
import { LucideAngularModule, Layers, Plus, Flag, Loader2 } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';
import { CampaignFormComponent } from './campaign-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-church-campaigns',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent, DecimalPipe],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Mission Initiatives</h2>
          <p class="text-sm text-wgc-navy-400 font-medium">Coordinate and track specific fundraising goals for ministry expansion.</p>
        </div>
        <button (click)="openAddCampaign()" 
          class="flex items-center px-6 py-2.5 bg-wgc-gold-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-wgc-gold-600 transition-all shadow-lg active:scale-95">
          <lucide-icon [img]="Plus" class="w-4 h-4 mr-2"></lucide-icon>
          New Initiative
        </button>
      </div>

      <!-- Active Campaigns Grid -->
      <div *ngIf="campaigns().length > 0; else emptyState" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let campaign of campaigns()" class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
           <div class="flex items-start justify-between mb-6">
              <div class="w-12 h-12 rounded-2xl bg-wgc-off border border-wgc-navy-100 flex items-center justify-center text-wgc-gold-600 shadow-sm group-hover:bg-wgc-gold-50 transition-colors">
                 <lucide-icon [img]="Flag" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="px-3 py-1 bg-wgc-navy-50 text-wgc-navy-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-wgc-navy-100 italic">Institutional Core</span>
           </div>

           <h3 class="text-xl font-black text-wgc-navy-950 tracking-tight mb-2 uppercase">\{{ campaign.name }}</h3>
           <p class="text-xs text-wgc-navy-400 font-medium leading-relaxed mb-8 flex-1 italic">\{{ campaign.description || 'Dedicated to the advancement of institutional mission goals.' }}</p>

           <!-- Goal Progress -->
           <div class="space-y-4 pt-6 border-t border-wgc-navy-50">
              <div class="flex items-end justify-between">
                 <div class="flex flex-col">
                    <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none mb-1">Impact Raised</span>
                    <span class="text-lg font-black text-wgc-navy-950 tracking-tighter">$\{{ (getRaisedAmount(campaign)) | number:'1.0-0' }}</span>
                 </div>
                 <div class="text-right">
                    <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none mb-1 block">Goal</span>
                    <span class="text-sm font-black text-wgc-navy-600 tracking-tight">$\{{ campaign.goalAmount | number:'1.0-0' }}</span>
                 </div>
              </div>

              <!-- Progress Bar -->
              <div class="relative w-full h-3 bg-wgc-off rounded-full overflow-hidden border border-wgc-navy-50">
                 <div [style.width.%]="getProgress(campaign)" 
                   class="absolute top-0 left-0 h-full bg-gradient-to-r from-wgc-gold-600 to-wgc-gold-500 transition-all duration-1000 ease-out"></div>
              </div>

              <div class="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-wgc-navy-400">
                 <span>\{{ getProgress(campaign) }}% Complete</span>
                 <span class="text-wgc-gold-600">\{{ campaign._count?.payments || 0 }} Contributions</span>
              </div>
           </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
           <app-empty-state 
             [icon]="Layers"
             title="No initiatives found"
             description="Establish specialized giving goals to coordinate congregation focus and track specific mission impacts."
             actionLabel="Launch New Campaign">
           </app-empty-state>
        </div>
      </ng-template>
    </div>
  `
})
export class ChurchCampaignsComponent implements OnInit, OnDestroy {
  private churchService = inject(ChurchService);
  private modalService = inject(ModalService);
  private notify = inject(NotificationService);

  campaigns = signal<any[]>([]);
  private refreshSub?: Subscription;

  readonly Layers = Layers;
  readonly Plus = Plus;
  readonly Flag = Flag;

  ngOnInit() {
    this.loadCampaigns();
    this.refreshSub = this.churchService.refresh$.subscribe(() => this.loadCampaigns());
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadCampaigns() {
    this.churchService.getCampaignsList().subscribe({
      next: (data: any[]) => this.campaigns.set(data),
      error: (err: any) => this.notify.error('Unable to fetch mission data.', 'Sync Error')
    });
  }

  getRaisedAmount(campaign: any) {
    return campaign.totalRaised || 0; 
  }

  getProgress(campaign: any) {
    if (!campaign.goalAmount) return 0;
    return Math.min(100, Math.round((this.getRaisedAmount(campaign) / campaign.goalAmount) * 100));
  }

  openAddCampaign() {
    this.modalService.open({
      title: 'Establish Mission Initiative',
      component: CampaignFormComponent
    });
  }
}
