import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-700">
      <div class="w-20 h-20 rounded-2xl bg-wgc-off border border-wgc-navy-100 flex items-center justify-center mb-6 shadow-sm">
        <lucide-icon [img]="icon" class="w-10 h-10 text-wgc-navy-200"></lucide-icon>
      </div>
      <h3 class="text-xl font-black text-wgc-navy-950 tracking-tight mb-2">{{ title }}</h3>
      <p class="text-sm text-wgc-navy-400 max-w-sm mx-auto mb-8 font-medium leading-relaxed">
        {{ description }}
      </p>
      <button *ngIf="actionLabel" 
        class="inline-flex items-center px-6 py-3 rounded-xl bg-wgc-emerald-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-wgc-emerald-600 transition-all active:scale-95 shadow-lg shadow-wgc-emerald-500/20">
        {{ actionLabel }}
      </button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: any;
  @Input() title: string = 'No records found';
  @Input() description: string = 'There are no items to display at this moment. Connect your data to get started.';
  @Input() actionLabel?: string;
}
