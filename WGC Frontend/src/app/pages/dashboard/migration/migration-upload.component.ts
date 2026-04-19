import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MigrationService } from '../../../services/migration.service';
import { LucideAngularModule, Upload, ChevronLeft, ChevronRight, FileUp, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-migration-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Back Link -->
      <a routerLink="/dashboard/migration" class="inline-flex items-center text-sm text-wgc-gray-500 hover:text-wgc-blue-600 transition-colors gap-1">
        <lucide-icon [img]="ChevronLeft" class="w-4 h-4"></lucide-icon>
        Back to Migration Center
      </a>

      <!-- Stepper -->
      <div class="bg-wgc-white rounded-xl border border-wgc-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-8">
          <div *ngFor="let step of steps; let i = index" class="flex items-center gap-2" [ngClass]="i < steps.length - 1 ? 'flex-1' : ''">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                [ngClass]="currentStep() >= i ? 'bg-wgc-blue-600 text-wgc-navy-900 border-wgc-blue-600' : 'bg-wgc-white text-wgc-navy-400 border-wgc-gray-200'">
                {{ i + 1 }}
              </div>
              <span class="text-xs font-bold uppercase tracking-wider hidden sm:inline"
                [ngClass]="currentStep() >= i ? 'text-wgc-blue-600' : 'text-wgc-navy-400'">{{ step }}</span>
            </div>
            <div *ngIf="i < steps.length - 1" class="flex-1 h-0.5 mx-3"
              [ngClass]="currentStep() > i ? 'bg-wgc-blue-600' : 'bg-wgc-gray-200'"></div>
          </div>
        </div>

        <!-- Step 1: Upload -->
        <div *ngIf="currentStep() === 0" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-wgc-gray-700 mb-2">Import Type</label>
            <select (change)="importType.set($any($event.target).value)"
              class="w-full border border-wgc-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-wgc-blue-500 focus:outline-none">
              <option value="churches">Churches</option>
              <option value="donors">Donors</option>
              <option value="transactions">Historical Transactions</option>
              <option value="recurring">Recurring Plans</option>
            </select>
          </div>

          <div class="border-2 border-dashed border-wgc-gray-200 rounded-xl p-12 text-center hover:border-wgc-blue-400 cursor-pointer transition-colors"
            (click)="fileInput.click()" 
            (dragover)="$event.preventDefault()" 
            (drop)="onFileDrop($event)">
            <lucide-icon [img]="FileUp" class="w-12 h-12 text-wgc-gray-300 mx-auto mb-4"></lucide-icon>
            <p class="text-sm font-bold text-wgc-gray-700">Drop your CSV file here or <span class="text-wgc-blue-600">browse</span></p>
            <p class="text-xs text-wgc-navy-400 mt-1">Supports .csv files up to 10MB</p>
            <input #fileInput type="file" accept=".csv" (change)="onFileSelected($event)" class="hidden">
          </div>

          <div *ngIf="fileName()" class="bg-wgc-blue-50 border border-wgc-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <lucide-icon [img]="CheckCircle2" class="w-5 h-5 text-wgc-blue-600"></lucide-icon>
              <div>
                <p class="text-sm font-bold text-wgc-gray-900">{{ fileName() }}</p>
                <p class="text-xs text-wgc-gray-500">{{ parsedRows().length }} rows detected</p>
              </div>
            </div>
          </div>

          <button *ngIf="parsedRows().length" (click)="submitUpload()"
            class="w-full bg-wgc-blue-600 text-wgc-navy-900 py-3 rounded-lg font-bold hover:bg-wgc-blue-700 transition-all flex items-center justify-center gap-2">
            Continue to Column Mapping
            <lucide-icon [img]="ChevronRight" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

        <!-- Step 2: Map Columns -->
        <div *ngIf="currentStep() === 1" class="space-y-6">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <lucide-icon [img]="AlertTriangle" class="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"></lucide-icon>
            <div>
              <p class="text-sm font-bold text-yellow-800">Verify Column Mapping</p>
              <p class="text-xs text-yellow-700">We've detected these columns. Map them to the required fields below.</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div *ngFor="let col of detectedColumns()" class="flex items-center gap-4 bg-wgc-gray-50 p-3 rounded-lg">
              <span class="text-sm font-mono font-bold text-wgc-gray-600 w-48 truncate">{{ col }}</span>
              <lucide-icon [img]="ChevronRight" class="w-4 h-4 text-wgc-navy-400"></lucide-icon>
              <select class="flex-1 border border-wgc-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-wgc-blue-500 focus:outline-none"
                (change)="setMapping(col, $any($event.target).value)">
                <option value="">-- Skip this column --</option>
                <option *ngFor="let f of requiredFields()" [value]="f">{{ f }}</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3">
            <button (click)="currentStep.set(0)" class="flex-1 py-3 border border-wgc-gray-200 rounded-lg font-bold text-wgc-gray-700 hover:bg-wgc-gray-50">Back</button>
            <button (click)="runValidation()" 
              class="flex-1 bg-wgc-blue-600 text-wgc-navy-900 py-3 rounded-lg font-bold hover:bg-wgc-blue-700 flex items-center justify-center gap-2"
              [disabled]="loading()">
              <span *ngIf="!loading()">Validate & Preview</span>
              <span *ngIf="loading()" class="flex items-center gap-2">
                <lucide-icon [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-icon> Validating...
              </span>
            </button>
          </div>
        </div>

        <!-- Step 3: Preview -->
        <div *ngIf="currentStep() === 2" class="space-y-6">
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p class="text-2xl font-black text-green-700">{{ validationResult()?.validRows }}</p>
              <p class="text-[10px] uppercase font-bold text-green-500 tracking-widest">Valid Rows</p>
            </div>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p class="text-2xl font-black text-red-700">{{ validationResult()?.errorRows }}</p>
              <p class="text-[10px] uppercase font-bold text-red-500 tracking-widest">Errors</p>
            </div>
            <div class="bg-wgc-gray-50 border border-wgc-gray-200 rounded-lg p-4 text-center">
              <p class="text-2xl font-black text-wgc-gray-900">{{ validationResult()?.totalRows }}</p>
              <p class="text-[10px] uppercase font-bold text-wgc-navy-400 tracking-widest">Total</p>
            </div>
          </div>

          <!-- Error List -->
          <div *ngIf="validationResult()?.errors?.length" class="bg-red-50 border border-red-200 rounded-lg p-4 max-h-48 overflow-y-auto">
            <p class="text-xs font-bold text-red-800 mb-2">Validation Errors:</p>
            <div *ngFor="let err of validationResult()?.errors" class="text-xs text-red-700 py-1 border-b border-red-100 last:border-0 flex items-start gap-2">
              <lucide-icon [img]="XCircle" class="w-3 h-3 mt-0.5 shrink-0"></lucide-icon>
              <span>Row {{ err.row }}: Missing fields — <strong>{{ err.fields?.join(', ') }}</strong></span>
            </div>
          </div>

          <!-- Preview Table -->
          <div class="overflow-x-auto rounded-lg border border-wgc-gray-200">
            <table class="w-full text-xs text-left">
              <thead class="bg-wgc-gray-50 text-wgc-gray-500 uppercase tracking-widest">
                <tr>
                  <th class="px-4 py-3 font-bold">#</th>
                  <th *ngFor="let col of detectedColumns()" class="px-4 py-3 font-bold">{{ col }}</th>
                  <th class="px-4 py-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-wgc-gray-100">
                <tr *ngFor="let row of previewRows()?.slice(0, 20)" class="hover:bg-wgc-gray-50/50">
                  <td class="px-4 py-2.5 font-mono text-wgc-navy-400">{{ row.rowIndex + 1 }}</td>
                  <td *ngFor="let col of detectedColumns()" class="px-4 py-2.5 text-wgc-gray-700">{{ row.data[col] || '—' }}</td>
                  <td class="px-4 py-2.5 text-center">
                    <lucide-icon [img]="row.status === 'valid' ? CheckCircle2 : XCircle" 
                      class="w-4 h-4 mx-auto" [ngClass]="row.status === 'valid' ? 'text-green-500' : 'text-red-500'"></lucide-icon>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex gap-3">
            <button (click)="currentStep.set(1)" class="flex-1 py-3 border border-wgc-gray-200 rounded-lg font-bold text-wgc-gray-700 hover:bg-wgc-gray-50">Back</button>
            <button (click)="confirmImport()" 
              class="flex-1 bg-green-600 text-wgc-navy-900 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2"
              [disabled]="loading() || !validationResult()?.validRows">
              <span *ngIf="!loading()">Confirm Import ({{ validationResult()?.validRows }} rows)</span>
              <span *ngIf="loading()" class="flex items-center gap-2">
                <lucide-icon [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-icon> Importing...
              </span>
            </button>
          </div>
        </div>

        <!-- Step 4: Complete -->
        <div *ngIf="currentStep() === 3" class="text-center py-10">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <lucide-icon [img]="CheckCircle2" class="w-8 h-8 text-green-600"></lucide-icon>
          </div>
          <h3 class="text-xl font-black text-wgc-gray-900">Import Complete</h3>
          <p class="text-sm text-wgc-gray-500 mt-2 mb-6">
            Successfully imported <strong>{{ importResult()?.importedRows }}</strong> rows.
            <span *ngIf="importResult()?.skippedRows"> {{ importResult()?.skippedRows }} were skipped.</span>
          </p>
          <div class="flex gap-3 max-w-sm mx-auto">
            <a routerLink="/dashboard/migration" class="flex-1 py-3 border border-wgc-gray-200 rounded-lg font-bold text-wgc-gray-700 hover:bg-wgc-gray-50 text-center text-sm">
              View All Jobs
            </a>
            <a [routerLink]="['/dashboard/migration/jobs', jobId()]" class="flex-1 py-3 bg-wgc-blue-600 text-wgc-navy-900 rounded-lg font-bold hover:bg-wgc-blue-700 text-center text-sm">
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MigrationUploadComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private migrationService = inject(MigrationService);

  steps = ['Upload', 'Map Columns', 'Preview', 'Complete'];
  currentStep = signal(0);
  importType = signal('churches');
  fileName = signal('');
  parsedRows = signal<any[]>([]);
  detectedColumns = signal<string[]>([]);
  columnMapping = signal<Record<string, string>>({});
  jobId = signal('');
  validationResult = signal<any>(null);
  previewRows = signal<any[]>([]);
  importResult = signal<any>(null);
  loading = signal(false);

  readonly Upload = Upload;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly FileUp = FileUp;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertTriangle = AlertTriangle;
  readonly XCircle = XCircle;
  readonly Loader2 = Loader2;

  requiredFields = signal<string[]>([]);

  private readonly REQUIRED: Record<string, string[]> = {
    churches:     ['name', 'email'],
    donors:       ['name', 'email', 'church_name'],
    transactions: ['donor_email', 'church_name', 'amount', 'date', 'method'],
    recurring:    ['donor_email', 'church_name', 'amount', 'frequency', 'status'],
  };

  ngOnInit() {
    const type = this.route.snapshot.queryParamMap.get('type');
    if (type && this.REQUIRED[type]) {
      this.importType.set(type);
    }
    this.requiredFields.set(this.REQUIRED[this.importType()] || []);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.parseCSV(file);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) this.parseCSV(file);
  }

  parseCSV(file: File) {
    this.fileName.set(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      this.detectedColumns.set(headers);
      this.requiredFields.set(this.REQUIRED[this.importType()] || []);

      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = values[i] || '');
        return obj;
      });

      this.parsedRows.set(rows);
    };
    reader.readAsText(file);
  }

  submitUpload() {
    this.loading.set(true);
    this.migrationService.createJob(this.importType(), this.fileName(), this.parsedRows()).subscribe({
      next: (job) => {
        this.jobId.set(job.id);
        this.currentStep.set(1);
        this.loading.set(false);
      },
      error: (err) => { console.error(err); this.loading.set(false); }
    });
  }

  setMapping(source: string, target: string) {
    this.columnMapping.update(m => ({ ...m, [source]: target }));
  }

  runValidation() {
    this.loading.set(true);
    // Save mapping first, then validate
    this.migrationService.updateMapping(this.jobId(), this.columnMapping()).subscribe({
      next: () => {
        this.migrationService.validateJob(this.jobId()).subscribe({
          next: (result) => {
            this.validationResult.set(result);
            // Fetch preview rows
            this.migrationService.getPreview(this.jobId()).subscribe({
              next: (preview) => {
                this.previewRows.set(preview.rows);
                this.currentStep.set(2);
                this.loading.set(false);
              }
            });
          },
          error: (err) => { console.error(err); this.loading.set(false); }
        });
      }
    });
  }

  confirmImport() {
    this.loading.set(true);
    this.migrationService.confirmImport(this.jobId()).subscribe({
      next: (result) => {
        this.importResult.set(result);
        this.currentStep.set(3);
        this.loading.set(false);
      },
      error: (err) => { console.error(err); this.loading.set(false); }
    });
  }
}
