import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Shield, Eye, EyeOff, RotateCw, Globe, Webhook, Key, CheckCircle2, Copy, MoreHorizontal } from 'lucide-angular';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <!-- Page Header -->
      <div class="space-y-1">
        <h2 class="text-3xl font-black text-wgc-navy-950 tracking-tight">Institutional Configuration</h2>
        <p class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] font-mono opacity-80">Security Audit & API Orchestration</p>
      </div>

      <!-- API Credentials Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-2">
           <h3 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest">API Infrastructure</h3>
           <p class="text-xs text-wgc-navy-400 font-medium leading-relaxed italic">Manage the secure keys used to authenticate your application with the WGC payment rails.</p>
        </div>
        
        <div class="lg:col-span-2 space-y-6">
           <!-- Production Key -->
           <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm group">
              <div class="flex items-center justify-between mb-6">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-wgc-gold-50 border border-wgc-gold-100 flex items-center justify-center text-wgc-gold-600">
                       <lucide-icon [img]="Key" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div>
                       <span class="text-[9px] font-black text-wgc-gold-600 uppercase tracking-widest block mb-0.5">Live Environment</span>
                       <h4 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest">Secret API Key</h4>
                    </div>
                 </div>
                 <button (click)="rotateKey('prod')" class="p-2 hover:bg-wgc-off rounded-xl transition-all text-wgc-navy-300 hover:text-wgc-gold-600" title="Rotate Key">
                    <lucide-icon [img]="RotateCw" class="w-4 h-4"></lucide-icon>
                 </button>
              </div>

              <div class="relative group/key">
                 <input [type]="showProdKey() ? 'text' : 'password'" readonly [value]="prodKey"
                   class="w-full bg-wgc-off border-2 border-transparent border-dashed group-hover:border-wgc-navy-100 py-4 px-6 rounded-2xl font-mono text-xs font-bold text-wgc-navy-900 focus:outline-none transition-all">
                 <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button (click)="showProdKey.set(!showProdKey())" class="p-2 text-wgc-navy-300 hover:text-wgc-navy-900 transition-all">
                       <lucide-icon [img]="showProdKey() ? EyeOff : Eye" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="copyKey(prodKey)" class="p-2 text-wgc-navy-300 hover:text-wgc-gold-600 transition-all">
                       <lucide-icon [img]="Copy" class="w-4 h-4"></lucide-icon>
                    </button>
                 </div>
              </div>
           </div>

           <!-- Sandbox Key -->
           <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm group">
              <div class="flex items-center justify-between mb-6">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-wgc-gold-50 border border-wgc-gold-100 flex items-center justify-center text-wgc-gold-600 text-xs font-black">
                       SB
                    </div>
                    <div>
                       <span class="text-[9px] font-black text-wgc-gold-600 uppercase tracking-widest block mb-0.5">Development Environment</span>
                       <h4 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest">Test API Key</h4>
                    </div>
                 </div>
                 <button (click)="rotateKey('sandbox')" class="p-2 hover:bg-wgc-off rounded-xl transition-all text-wgc-navy-300 hover:text-wgc-gold-600" title="Rotate Key">
                    <lucide-icon [img]="RotateCw" class="w-4 h-4"></lucide-icon>
                 </button>
              </div>

              <div class="relative group/key">
                 <input [type]="showSandboxKey() ? 'text' : 'password'" readonly [value]="sandboxKey"
                   class="w-full bg-wgc-off border-2 border-transparent border-dashed group-hover:border-wgc-navy-100 py-4 px-6 rounded-2xl font-mono text-xs font-bold text-wgc-navy-900 focus:outline-none transition-all">
                 <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button (click)="showSandboxKey.set(!showSandboxKey())" class="p-2 text-wgc-navy-300 hover:text-wgc-navy-900 transition-all">
                       <lucide-icon [img]="showSandboxKey() ? EyeOff : Eye" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="copyKey(sandboxKey)" class="p-2 text-wgc-navy-300 hover:text-wgc-gold-600 transition-all">
                       <lucide-icon [img]="Copy" class="w-4 h-4"></lucide-icon>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div class="h-px bg-wgc-navy-50"></div>

      <!-- Webhooks Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-2">
           <h3 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest">Real-time Echo (Webhooks)</h3>
           <p class="text-xs text-wgc-navy-400 font-medium leading-relaxed italic">Synchronize your systems with institutional events like successful donations, payout settlements, and member updates.</p>
        </div>
        
        <div class="lg:col-span-2">
           <div class="bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm">
              <div class="flex items-center justify-between mb-8">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-wgc-navy-50 border border-wgc-navy-100 flex items-center justify-center text-wgc-navy-900 shadow-sm">
                       <lucide-icon [img]="Webhook" class="w-5 h-5"></lucide-icon>
                    </div>
                    <h4 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest">Endpoint Orchestration</h4>
                 </div>
                 <button class="px-4 py-2 bg-wgc-navy-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-wgc-navy-900 transition-all shadow-lg active:scale-95">
                    Add Endpoint
                 </button>
              </div>

              <div class="space-y-4">
                 <div class="p-6 bg-wgc-off rounded-3xl border border-wgc-navy-50 flex items-center justify-between group">
                    <div class="flex items-center gap-4">
                       <div class="px-3 py-1 bg-wgc-gold-50 text-wgc-gold-700 text-[9px] font-black uppercase rounded-lg border border-wgc-gold-100 shadow-sm">Active</div>
                       <div>
                          <p class="text-[11px] font-black text-wgc-navy-950 font-mono">https://api.yourdomain.com/wgc-webhook</p>
                          <p class="text-[9px] font-bold text-wgc-navy-400 uppercase tracking-widest mt-1">Listening for: all_events</p>
                       </div>
                    </div>
                    <lucide-icon [img]="MoreHorizontal" class="w-4 h-4 text-wgc-navy-200 group-hover:text-wgc-navy-950 transition-colors cursor-pointer"></lucide-icon>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardSettingsComponent implements OnInit {
  private notify = inject(NotificationService);

  prodKey = 'wgc_live_72x9k2m10v83n5p9q2r1t7y4z6';
  sandboxKey = 'wgc_test_3a8b4c9d2e1f0g9h8i7j6k5l4';

  showProdKey = signal(false);
  showSandboxKey = signal(false);

  readonly Key = Key;
  readonly Globe = Globe;
  readonly Webhook = Webhook;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly RotateCw = RotateCw;
  readonly Copy = Copy;
  readonly MoreHorizontal = MoreHorizontal;

  ngOnInit() {}

  copyKey(key: string) {
    navigator.clipboard.writeText(key);
    this.notify.success('Credential copied to institutional clipboard.', 'Security Trace');
  }

  rotateKey(env: 'prod' | 'sandbox') {
    if (confirm(`Institutional Alert: Are you sure you want to rotate the ${env} API Key? This will immediately invalidate existing integrations.`)) {
      this.notify.success(`Initiating rotation protocol for ${env} environment.`, 'System Update');
      // Logic would go here to call backend
    }
  }
}
