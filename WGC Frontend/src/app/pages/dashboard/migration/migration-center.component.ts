import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MigrationService } from '../../../services/migration.service';
import { LucideAngularModule, Upload, FileCheck, AlertTriangle, Users, CreditCard, RefreshCcw, Church, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-angular';

@Component({
  selector: 'app-migration-center',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-8">
      <!-- Hero -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-wgc-gray-900">Migration Center</h2>
          <p class="text-sm text-wgc-gray-500">Import churches, donors, transactions, and recurring plans into the WGC platform.</p>
        </div>
        <a routerLink="/dashboard/migration/upload"
          class="bg-wgc-blue-600 text-wgc-navy-900 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-wgc-blue-700 transition-all flex items-center gap-2 shadow-sm">
          <lucide-icon [img]="Upload" class="w-4 h-4"></lucide-icon>
          New Import
        </a>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="bg-wgc-white p-5 rounded-xl border border-wgc-gray-100 shadow-sm text-center">
          <div class="mx-auto mb-2 p-2 bg-blue-50 rounded-lg text-blue-600 w-fit">
            <lucide-icon [img]="Church" class="w-5 h-5"></lucide-icon>
          </div>
          <p class="text-2xl font-black text-wgc-gray-900">{{ summary()?.importedChurches || 0 }}</p>
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Churches</p>
        </div>
        <div class="bg-wgc-white p-5 rounded-xl border border-wgc-gray-100 shadow-sm text-center">
          <div class="mx-auto mb-2 p-2 bg-purple-50 rounded-lg text-purple-600 w-fit">
            <lucide-icon [img]="Users" class="w-5 h-5"></lucide-icon>
          </div>
          <p class="text-2xl font-black text-wgc-gray-900">{{ summary()?.importedDonors || 0 }}</p>
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Donors</p>
        </div>
        <div class="bg-wgc-white p-5 rounded-xl border border-wgc-gray-100 shadow-sm text-center">
          <div class="mx-auto mb-2 p-2 bg-green-50 rounded-lg text-green-600 w-fit">
            <lucide-icon [img]="CreditCard" class="w-5 h-5"></lucide-icon>
          </div>
          <p class="text-2xl font-black text-wgc-gray-900">{{ summary()?.importedTransactions || 0 }}</p>
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Transactions</p>
        </div>
        <div class="bg-wgc-white p-5 rounded-xl border border-wgc-gray-100 shadow-sm text-center">
          <div class="mx-auto mb-2 p-2 bg-indigo-50 rounded-lg text-indigo-600 w-fit">
            <lucide-icon [img]="RefreshCcw" class="w-5 h-5"></lucide-icon>
          </div>
          <p class="text-2xl font-black text-wgc-gray-900">{{ summary()?.importedRecurring || 0 }}</p>
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Recurring</p>
        </div>
        <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm text-center">
          <div class="mx-auto mb-2 p-2 bg-yellow-100 rounded-lg text-yellow-600 w-fit">
            <lucide-icon [img]="AlertTriangle" class="w-5 h-5"></lucide-icon>
          </div>
          <p class="text-2xl font-black text-yellow-700">{{ summary()?.needsReauth || 0 }}</p>
          <p class="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mt-1">Needs Reauth</p>
        </div>
        <div class="bg-red-50 p-5 rounded-xl border border-red-200 shadow-sm text-center">
          <div class="mx-auto mb-2 p-2 bg-red-100 rounded-lg text-red-600 w-fit">
            <lucide-icon [img]="XCircle" class="w-5 h-5"></lucide-icon>
          </div>
          <p class="text-2xl font-black text-red-700">{{ summary()?.failedRows || 0 }}</p>
          <p class="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">Failed Rows</p>
        </div>
      </div>

      <!-- Import Types -->
      <div>
        <h3 class="text-sm font-bold text-wgc-navy-400 uppercase tracking-widest mb-4">Supported Import Types</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a *ngFor="let t of importTypes" [routerLink]="['/dashboard/migration/upload']" [queryParams]="{type: t.key}"
            class="bg-wgc-white p-5 rounded-xl border border-wgc-gray-100 shadow-sm hover:border-wgc-blue-300 hover:shadow-md transition-all group cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="p-2 rounded-lg" [ngClass]="t.bgClass">
                <lucide-icon [img]="t.icon" class="w-5 h-5" [ngClass]="t.iconClass"></lucide-icon>
              </div>
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 text-wgc-gray-300 group-hover:text-wgc-blue-500 transition-colors"></lucide-icon>
            </div>
            <h4 class="font-bold text-wgc-gray-900 mt-3">{{ t.label }}</h4>
            <p class="text-xs text-wgc-gray-500 mt-1">{{ t.description }}</p>
          </a>
        </div>
      </div>

      <!-- Import History -->
      <div class="bg-wgc-white rounded-xl border border-wgc-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-wgc-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-wgc-gray-900">Import History</h3>
          <span class="text-xs font-bold text-wgc-navy-400 uppercase">{{ jobs().length || 0 }} jobs</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-wgc-gray-50 text-wgc-gray-500 text-[11px] uppercase tracking-widest border-b border-wgc-gray-100">
                <th class="px-6 py-4 font-bold">Job / File</th>
                <th class="px-6 py-4 font-bold">Type</th>
                <th class="px-6 py-4 font-bold text-right">Rows</th>
                <th class="px-6 py-4 font-bold text-center">Status</th>
                <th class="px-6 py-4 font-bold text-right">Results</th>
                <th class="px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wgc-gray-100 text-sm">
              <tr *ngFor="let job of jobs()" class="hover:bg-wgc-gray-50 transition-colors cursor-pointer" [routerLink]="['/dashboard/migration/jobs', job.id]">
                <td class="px-6 py-4">
                  <div class="font-bold text-wgc-gray-900">{{ job.fileName }}</div>
                  <div class="text-[10px] font-mono text-wgc-navy-400">{{ job.id.substring(0,8) }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-wgc-gray-100 text-wgc-gray-700 text-[10px] font-bold rounded uppercase tracking-wider">{{ job.type }}</span>
                </td>
                <td class="px-6 py-4 text-right tabular-nums font-bold text-wgc-gray-900">{{ job.totalRows }}</td>
                <td class="px-6 py-4 text-center">
                  <span [ngClass]="{
                    'bg-green-100 text-green-700': job.status === 'completed',
                    'bg-yellow-100 text-yellow-700': job.status === 'previewing' || job.status === 'validating',
                    'bg-blue-100 text-blue-700': job.status === 'importing',
                    'bg-red-100 text-red-700': job.status === 'failed',
                    'bg-wgc-gray-100 text-wgc-gray-500': job.status === 'pending'
                  }" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {{ job.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-xs">
                    <span class="text-green-600 font-bold flex items-center gap-1" *ngIf="job.importedRows">
                      <lucide-icon [img]="CheckCircle2" class="w-3 h-3"></lucide-icon>{{ job.importedRows }}
                    </span>
                    <span class="text-red-500 font-bold flex items-center gap-1" *ngIf="job.errorRows">
                      <lucide-icon [img]="XCircle" class="w-3 h-3"></lucide-icon>{{ job.errorRows }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-wgc-gray-500 tabular-nums">{{ job.createdAt | date:'MMM d, h:mm a' }}</td>
              </tr>
              <tr *ngIf="!jobs()?.length">
                <td colspan="6" class="px-6 py-12 text-center text-wgc-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <lucide-icon [img]="FileCheck" class="w-8 h-8 text-wgc-gray-300"></lucide-icon>
                    <p class="font-medium">No imports yet</p>
                    <p class="text-xs">Start by clicking "New Import" above.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class MigrationCenterComponent implements OnInit {
  private migrationService = inject(MigrationService);

  summary = signal<any>(null);
  jobs = signal<any[]>([]);

  readonly Upload = Upload;
  readonly FileCheck = FileCheck;
  readonly AlertTriangle = AlertTriangle;
  readonly Users = Users;
  readonly CreditCard = CreditCard;
  readonly RefreshCcw = RefreshCcw;
  readonly Church = Church;
  readonly ArrowRight = ArrowRight;
  readonly Clock = Clock;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;

  importTypes = [
    { key: 'churches',     label: 'Churches',     description: 'Import church accounts and profiles.',          icon: Church,     bgClass: 'bg-blue-50',   iconClass: 'text-blue-600' },
    { key: 'donors',       label: 'Donors',       description: 'Import donor profiles with church mapping.',    icon: Users,      bgClass: 'bg-purple-50', iconClass: 'text-purple-600' },
    { key: 'transactions', label: 'Transactions', description: 'Import historical payment records.',            icon: CreditCard, bgClass: 'bg-green-50',  iconClass: 'text-green-600' },
    { key: 'recurring',    label: 'Recurring',    description: 'Import recurring giving plans and schedules.',  icon: RefreshCcw, bgClass: 'bg-indigo-50', iconClass: 'text-indigo-600' },
  ];

  ngOnInit() {
    this.migrationService.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error('Migration summary error:', err)
    });
    this.migrationService.listJobs().subscribe({
      next: (data) => this.jobs.set(data),
      error: (err) => console.error('Migration jobs error:', err)
    });
  }
}
