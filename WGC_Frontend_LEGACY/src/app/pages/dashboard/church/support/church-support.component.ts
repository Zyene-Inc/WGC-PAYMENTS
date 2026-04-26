import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, HelpCircle, MessageSquare, Book, LifeBuoy } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';
import { ChurchService } from '../../../../services/church.service';

@Component({
  selector: 'app-church-support',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Technical Stewardship Support</h2>
        <button class="flex items-center px-6 py-3 bg-wgc-gold-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-wgc-gold-600 transition-all shadow-lg active:scale-95">
          <lucide-icon [img]="MessageSquare" class="w-4 h-4 mr-2"></lucide-icon>
          Live Chat Support
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let option of supportOptions" class="bg-wgc-white border border-wgc-navy-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group cursor-pointer">
           <div class="w-12 h-12 rounded-2xl bg-wgc-gold-50 text-wgc-gold-600 flex items-center justify-center mb-6 group-hover:bg-wgc-gold-600 group-hover:text-white transition-all">
              <lucide-icon [img]="option.icon" class="w-6 h-6"></lucide-icon>
           </div>
           <h3 class="text-md font-black text-wgc-navy-950 tracking-tight mb-2 uppercase tracking-widest">{{ option.title }}</h3>
           <p class="text-xs text-wgc-navy-400 font-medium leading-relaxed">{{ option.description }}</p>
        </div>
      </div>

      <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] overflow-hidden shadow-sm min-h-[400px] flex items-center justify-center">
        <app-empty-state 
          [icon]="LifeBuoy"
          title="No active tickets"
          description="Your support request history is empty. If you need assistance with financial settlements or donor issues, we are here to help."
          actionLabel="Open New Support Ticket">
        </app-empty-state>
      </div>
    </div>
  `
})
export class ChurchSupportComponent implements OnInit {
  private churchService = inject(ChurchService);
  tickets = signal<any[]>([]);

  readonly supportOptions = [
    { title: 'Technical Docs', description: 'Deep dive into WGC payment integrations and hub features.', icon: Book },
    { title: 'Clearing Help', description: 'Assistance with bank settlements and payout schedules.', icon: MessageSquare },
    { title: 'Donor Stewardship', icon: HelpCircle, description: 'Best practices for managing your giver relationships.' }
  ];

  readonly MessageSquare = MessageSquare;
  readonly LifeBuoy = LifeBuoy;

  ngOnInit() {
    this.churchService.getSupport().subscribe({
      next: (data) => this.tickets.set(data),
      error: (err) => console.error(err)
    });
  }
}
