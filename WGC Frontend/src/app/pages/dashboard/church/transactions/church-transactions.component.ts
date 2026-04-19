import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Activity, RefreshCw } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../components/ui/empty-state/empty-state.component';
import { ChurchService } from '../../../../services/church.service';

@Component({
  selector: 'app-church-transactions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Transaction Operations</h2>
        <button (click)="loadTransactions()" class="flex items-center px-4 py-2 bg-wgc-white border border-wgc-navy-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-wgc-navy-950 hover:bg-wgc-gray-50 transition-all shadow-sm">
          <lucide-icon [img]="RefreshCw" class="w-4 h-4 mr-2"></lucide-icon>
          Refresh Ledger
        </button>
      </div>

      <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div *ngIf="transactions().length > 0; else emptyState">
           <!-- History Table -->
        </div>
        <ng-template #emptyState>
          <app-empty-state 
            [icon]="Activity"
            title="No transactions recorded"
            description="Your clearing house ledger is currently empty. Transactions will appear here once your first donation is processed via the WGC payment rails."
            actionLabel="View Integration Guide">
          </app-empty-state>
        </ng-template>
      </div>
    </div>
  `
})
export class ChurchTransactionsComponent implements OnInit {
  private churchService = inject(ChurchService);
  transactions = signal<any[]>([]);

  readonly Activity = Activity;
  readonly RefreshCw = RefreshCw;

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.churchService.getTransactions().subscribe({
      next: (data) => this.transactions.set(data),
      error: (err) => console.error(err)
    });
  }
}
