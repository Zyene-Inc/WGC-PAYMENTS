import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { LucideAngularModule, CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-angular';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      <div *ngFor="let n of service.notifications()" 
        class="bg-wgc-white border border-wgc-navy-100 rounded-2xl p-4 shadow-2xl flex items-start gap-4 pointer-events-auto animate-in slide-in-from-right-full duration-500 overflow-hidden relative">
        
        <!-- Progress Bar Indicator -->
        <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent animate-progress"
             [ngClass]="{
               'to-wgc-gold-500': n.type === 'success' || n.type === 'warning',
               'to-red-500': n.type === 'error',
               'to-wgc-navy-400': n.type === 'info'
             }"></div>

        <!-- Icon -->
        <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + getBgClass(n.type)">
          <lucide-icon [img]="getIcon(n.type)" [class]="'w-5 h-5 ' + getColorClass(n.type)"></lucide-icon>
        </div>

        <!-- Content -->
        <div class="flex-1 pr-4">
          <h4 class="text-xs font-black text-wgc-navy-950 uppercase tracking-widest mb-1">{{ n.title || n.type }}</h4>
          <p class="text-sm font-medium text-wgc-navy-400 leading-relaxed">{{ n.message }}</p>
        </div>

        <!-- Close -->
        <button (click)="service.remove(n.id)" class="p-1 hover:bg-wgc-off rounded-lg transition-all text-wgc-navy-200 hover:text-wgc-navy-950">
          <lucide-icon [img]="X" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
    .animate-progress {
      animation: progress 5s linear forwards;
    }
  `]
})
export class NotificationComponent {
  service = inject(NotificationService);

  readonly X = X;

  getIcon(type: string) {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  }

  getBgClass(type: string) {
    switch (type) {
      case 'success': return 'bg-wgc-gold-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-wgc-gold-50';
      default: return 'bg-wgc-navy-50';
    }
  }

  getColorClass(type: string) {
    switch (type) {
      case 'success': return 'text-wgc-gold-600';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-wgc-gold-600';
      default: return 'text-wgc-navy-500';
    }
  }
}
