import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="service.activeModal() as modal" 
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-wgc-navy-950/40 backdrop-blur-sm animate-in fade-in duration-300">
      
      <!-- Modal Container -->
      <div [class]="'bg-wgc-white w-full rounded-[2.5rem] shadow-2xl border border-wgc-navy-100 overflow-hidden animate-in zoom-in-95 duration-300 ' + (modal.maxWidth || 'max-w-xl')">
        
        <!-- Header -->
        <div class="px-8 py-6 border-b border-wgc-navy-50 flex items-center justify-between bg-wgc-off">
           <h3 class="text-xl font-black text-wgc-navy-950 tracking-tight leading-none">{{ modal.title }}</h3>
           <button (click)="service.close()" class="p-2 hover:bg-white rounded-xl transition-all text-wgc-navy-300 hover:text-red-500">
             <lucide-icon [img]="X" class="w-5 h-5"></lucide-icon>
           </button>
        </div>

        <!-- Body -->
        <div class="max-h-[80vh] overflow-y-auto">
          <ng-container *ngComponentOutlet="modal.component; inputs: { data: modal.data }"></ng-container>
        </div>

      </div>
      
      <!-- Backdrop click to close -->
      <div class="absolute inset-0 -z-10" (click)="service.close()"></div>
    </div>
  `
})
export class ModalComponent {
  service = inject(ModalService);
  readonly X = X;
}
