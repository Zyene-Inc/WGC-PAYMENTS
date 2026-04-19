import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MigrationService } from '../../../services/migration.service';
import { LucideAngularModule, ChevronLeft, CheckCircle2, XCircle, AlertTriangle, FileCheck, Clock } from 'lucide-angular';

@Component({
  selector: 'app-migration-job-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <a routerLink="/dashboard/migration" class="p-2 hover:bg-wgc-gray-100 rounded-lg transition-colors text-wgc-gray-500">
          <lucide-icon [img]="ChevronLeft" class="w-5 h-5"></lucide-icon>
        </a>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-wgc-gray-900">{{ job()?.fileName }}</h2>
          <p class="text-sm text-wgc-gray-500 flex items-center gap-2">
            <span class="font-mono">{{ job()?.id?.substring(0, 8) }}</span>
            ·
            <span class="uppercase text-[10px] font-bold px-2 py-0.5 bg-wgc-gray-100 rounded">{{ job()?.type }}</span>
            ·
            <span>{{ job()?.createdAt | date:'MMM d, yyyy h:mm a' }}</span>
          </p>
        </div>
        <span [ngClass]="{
          'bg-green-100 text-green-700': job()?.status === 'completed',
          'bg-yellow-100 text-yellow-700': job()?.status === 'previewing',
          'bg-blue-100 text-blue-700': job()?.status === 'importing',
          'bg-red-100 text-red-700': job()?.status === 'failed',
          'bg-wgc-gray-100 text-wgc-gray-500': job()?.status === 'pending'
        }" class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
          {{ job()?.status }}
        </span>
      </div>

      <!-- Completion Report -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-wgc-white p-5 rounded-xl border border-wgc-gray-100 shadow-sm text-center">
          <p class="text-2xl font-black text-wgc-gray-900">{{ job()?.totalRows }}</p>
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Total Rows</p>
        </div>
        <div class="bg-green-50 p-5 rounded-xl border border-green-200 shadow-sm text-center">
          <p class="text-2xl font-black text-green-700">{{ job()?.importedRows }}</p>
          <p class="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">Imported</p>
        </div>
        <div class="bg-wgc-white p-5 rounded-xl border border-wgc-gray-100 shadow-sm text-center">
          <p class="text-2xl font-black text-wgc-blue-700">{{ job()?.validRows }}</p>
          <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Valid</p>
        </div>
        <div class="bg-red-50 p-5 rounded-xl border border-red-200 shadow-sm text-center">
          <p class="text-2xl font-black text-red-700">{{ job()?.errorRows }}</p>
          <p class="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">Errors</p>
        </div>
        <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm text-center">
          <p class="text-2xl font-black text-yellow-700">{{ job()?.skippedRows }}</p>
          <p class="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mt-1">Skipped</p>
        </div>
      </div>

      <!-- Warnings -->
      <div *ngIf="warningRows()?.length" class="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-3 text-yellow-800 font-bold text-sm">
          <lucide-icon [img]="AlertTriangle" class="w-5 h-5"></lucide-icon>
          Plans Requiring Donor Reauthorization ({{ warningRows()?.length }})
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div *ngFor="let row of warningRows()?.slice(0, 9)" class="bg-white p-3 rounded-lg border border-yellow-100 text-xs">
            <p class="font-bold text-wgc-gray-900">Row {{ row.rowIndex + 1 }}</p>
            <p class="text-yellow-700 mt-1">{{ row.validationError }}</p>
          </div>
        </div>
      </div>

      <!-- Row Details Table -->
      <div class="bg-wgc-white rounded-xl border border-wgc-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-wgc-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-wgc-gray-900">Row Details</h3>
          <div class="flex gap-2 text-xs">
            <button (click)="filterStatus.set('')" class="px-2 py-1 rounded" [ngClass]="!filterStatus() ? 'bg-wgc-blue-100 text-wgc-blue-700 font-bold' : 'text-wgc-gray-500'">All</button>
            <button (click)="filterStatus.set('imported')" class="px-2 py-1 rounded" [ngClass]="filterStatus() === 'imported' ? 'bg-green-100 text-green-700 font-bold' : 'text-wgc-gray-500'">Imported</button>
            <button (click)="filterStatus.set('invalid')" class="px-2 py-1 rounded" [ngClass]="filterStatus() === 'invalid' ? 'bg-red-100 text-red-700 font-bold' : 'text-wgc-gray-500'">Errors</button>
          </div>
        </div>
        <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-wgc-gray-50 text-wgc-gray-500 uppercase tracking-widest sticky top-0">
              <tr>
                <th class="px-4 py-3 font-bold">Row</th>
                <th class="px-4 py-3 font-bold">Data</th>
                <th class="px-4 py-3 font-bold text-center">Status</th>
                <th class="px-4 py-3 font-bold">Notes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-wgc-gray-100">
              <tr *ngFor="let row of filteredRows()" class="hover:bg-wgc-gray-50/50">
                <td class="px-4 py-3 font-mono text-wgc-navy-400 tabular-nums">{{ row.rowIndex + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1.5">
                    <span *ngFor="let key of getDataKeys(row.data)" class="inline-flex items-center gap-1 bg-wgc-gray-50 px-2 py-0.5 rounded">
                      <span class="text-wgc-navy-400">{{ key }}:</span>
                      <span class="text-wgc-gray-800 font-medium">{{ row.data[key] }}</span>
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <lucide-icon [img]="row.status === 'imported' ? CheckCircle2 : (row.status === 'invalid' ? XCircle : Clock)"
                    class="w-4 h-4 mx-auto"
                    [ngClass]="{
                      'text-green-500': row.status === 'imported',
                      'text-red-500': row.status === 'invalid',
                      'text-wgc-navy-400': row.status === 'pending' || row.status === 'valid'
                    }"></lucide-icon>
                </td>
                <td class="px-4 py-3 text-wgc-gray-500">
                  <span *ngIf="row.validationError" class="text-red-600">{{ row.validationError }}</span>
                  <span *ngIf="!row.validationError">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class MigrationJobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private migrationService = inject(MigrationService);

  job = signal<any>(null);
  filterStatus = signal('');

  readonly ChevronLeft = ChevronLeft;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly FileCheck = FileCheck;
  readonly Clock = Clock;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.migrationService.getJobDetail(id).subscribe({
        next: (data) => this.job.set(data),
        error: (err) => console.error(err)
      });
    }
  }

  warningRows() {
    return this.job()?.rows?.filter((r: any) => r.status === 'imported' && r.validationError) || [];
  }

  filteredRows() {
    const rows = this.job()?.rows || [];
    if (!this.filterStatus()) return rows;
    return rows.filter((r: any) => r.status === this.filterStatus());
  }

  getDataKeys(data: any): string[] {
    return data ? Object.keys(data) : [];
  }
}
