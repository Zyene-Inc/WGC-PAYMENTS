import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChurchService } from '../../../../services/church.service';
import { ModalService } from '../../../../services/modal.service';
import { NotificationService } from '../../../../services/notification.service';
import { LucideAngularModule, Users, Search, Filter, Mail, UserPlus, Star, Zap, RefreshCcw, MoreVertical, Edit2, Trash2 } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';
import { DonorFormComponent } from './donor-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-church-donors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent, DatePipe],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Donor Directory</h2>
          <p class="text-sm text-wgc-navy-400 font-medium">Manage your congregation's stewardship and relationship history.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center px-4 py-2 bg-wgc-white border border-wgc-navy-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-wgc-navy-950 hover:bg-wgc-gray-50 transition-all shadow-sm">
            <lucide-icon [img]="Mail" class="w-4 h-4 mr-2"></lucide-icon>
            Export contacts
          </button>
          <button (click)="openAddDonor()" 
            class="flex items-center px-6 py-2.5 bg-wgc-gold-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-wgc-gold-600 transition-all shadow-lg shadow-wgc-gold-600/20 active:scale-95">
            <lucide-icon [img]="UserPlus" class="w-4 h-4 mr-2"></lucide-icon>
            Add Donor
          </button>
        </div>
      </div>

      <!-- Segmentation Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let segment of segments" class="relative group">
          <div class="bg-wgc-white border border-wgc-navy-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-b-2" [class.border-b-wgc-gold-600]="segment.active">
             <div class="flex items-center gap-3">
                <div [class]="'w-9 h-9 rounded-xl flex items-center justify-center ' + segment.bg">
                   <lucide-icon [img]="segment.icon" [class]="'w-4 h-4 ' + segment.color"></lucide-icon>
                </div>
                <div class="flex flex-col">
                   <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest">{{ segment.label }}</span>
                   <span class="text-lg font-black text-wgc-navy-950 tracking-tight">{{ segment.label === 'All Donors' ? donors().length : '0' }}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <lucide-icon [img]="Search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300"></lucide-icon>
          <input type="text" placeholder="Search by name or email..." 
            (input)="onSearch($event)"
            class="w-full pl-11 pr-4 py-2 bg-wgc-white border border-wgc-navy-100 text-[11px] font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-wgc-gold-600/10 focus:border-wgc-gold-600 transition-all shadow-sm">
        </div>
      </div>

      <!-- Table Area -->
      <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div *ngIf="filteredDonors().length > 0; else emptyState" class="overflow-x-auto">
           <table class="w-full text-left border-collapse">
             <thead>
               <tr class="border-b border-wgc-navy-50 bg-wgc-off/50">
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em]">Donor Identity</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em]">Engagement Balance</th>
                 <th class="px-8 py-5 text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em]">Affiliated Since</th>
                 <th class="px-8 py-5 text-right text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em]">Actions</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-wgc-navy-50">
               <tr *ngFor="let donor of filteredDonors()" class="group hover:bg-wgc-off transition-all">
                 <td class="px-8 py-6">
                   <div class="flex items-center gap-4">
                     <div class="w-10 h-10 rounded-full bg-wgc-navy-50 flex items-center justify-center text-wgc-navy-950 font-black text-xs">
                       {{ donor.name.substring(0,2).toUpperCase() }}
                     </div>
                     <div>
                       <div class="font-black text-wgc-navy-950 leading-none mb-1 cursor-pointer hover:text-wgc-gold-600 transition-colors">{{ donor.name }}</div>
                       <div class="text-[10px] font-bold text-wgc-navy-300 font-mono tracking-tighter">{{ donor.email }}</div>
                     </div>
                   </div>
                 </td>
                 <td class="px-8 py-6">
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-wgc-navy-950 tracking-tight">$\{{ donor.totalGiving | number:'1.2-2' }}</span>
                      <span class="text-[9px] font-bold text-wgc-navy-400 uppercase tracking-widest">Across \{{ donor.donationCount }} contributions</span>
                    </div>
                 </td>
                 <td class="px-8 py-6 text-xs font-bold text-wgc-navy-400 uppercase tracking-widest tabular-nums">
                    \{{ donor.createdAt | date:'MMM dd, yyyy' }}
                 </td>
                 <td class="px-8 py-6 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button (click)="openEditDonor(donor)" class="p-2 hover:bg-wgc-white border border-transparent hover:border-wgc-navy-100 rounded-xl text-wgc-navy-400 hover:text-wgc-gold-600 transition-all">
                         <lucide-icon [img]="Edit2" class="w-4 h-4"></lucide-icon>
                      </button>
                      <button (click)="onDeleteDonor(donor)" class="p-2 hover:bg-white border border-transparent hover:border-red-100 rounded-xl text-wgc-navy-400 hover:text-red-500 transition-all">
                         <lucide-icon [img]="Trash2" class="w-4 h-4"></lucide-icon>
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
              [icon]="Users"
              title="No donors found"
              description="Your donor database is currently empty. Start by importing your existing congregation list or waiting for your first donation."
              actionLabel="Bulk Import Donors">
            </app-empty-state>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class ChurchDonorsComponent implements OnInit, OnDestroy {
  private churchService = inject(ChurchService);
  private modalService = inject(ModalService);
  private notify = inject(NotificationService);

  donors = signal<any[]>([]);
  filteredDonors = signal<any[]>([]);
  private refreshSub?: Subscription;

  readonly segments = [
    { label: 'All Donors', icon: Users, bg: 'bg-wgc-navy-50', color: 'text-wgc-navy-400', active: true },
    { label: 'Recurring', icon: RefreshCcw, bg: 'bg-wgc-gold-50', color: 'text-wgc-gold-600' },
    { label: 'Major Givers', icon: Star, bg: 'bg-wgc-gold-50', color: 'text-wgc-gold-600' },
    { label: 'First-time', icon: Zap, bg: 'bg-wgc-navy-50', color: 'text-wgc-navy-400' }
  ];

  readonly Users = Users;
  readonly Mail = Mail;
  readonly UserPlus = UserPlus;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.loadDonors();
    this.refreshSub = this.churchService.refresh$.subscribe(() => this.loadDonors());
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadDonors() {
    this.churchService.getDonors().subscribe({
      next: (data) => {
        this.donors.set(data);
        this.filteredDonors.set(data);
      },
      error: (err) => {
        this.notify.error('Unable to fetch institutional records.', 'Database Error');
      }
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.filteredDonors.set(
      this.donors().filter(d => 
        d.name.toLowerCase().includes(term) || 
        d.email.toLowerCase().includes(term)
      )
    );
  }

  openAddDonor() {
    this.modalService.open({
      title: 'Establish Donor Profile',
      component: DonorFormComponent
    });
  }

  openEditDonor(donor: any) {
    this.modalService.open({
      title: 'Update Donor Profile',
      component: DonorFormComponent,
      data: donor
    });
  }

  onDeleteDonor(donor: any) {
    if (confirm(`Are you sure you want to permanently delete the profile for ${donor.name}? This action cannot be undone.`)) {
      this.churchService.deleteDonor(donor.id).subscribe({
        next: () => {
          this.notify.success('Donor profile removed from database.', 'Deletion Successful');
          this.loadDonors();
        },
        error: () => this.notify.error('Failed to remove record. Please try again.', 'Process Error')
      });
    }
  }
}
