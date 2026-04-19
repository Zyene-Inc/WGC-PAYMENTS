import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChurchService } from '../../../../services/church.service';
import { LucideAngularModule, Settings, Building2, Landmark, Brush, FileText, Users, Bell, Shield, Globe, ExternalLink, Save } from 'lucide-angular';

@Component({
  selector: 'app-church-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-wgc-navy-950 tracking-tight">Organization Settings</h2>
          <p class="text-sm text-wgc-navy-400 font-medium">Manage your stewardship hub, branding, and clearing house configurations.</p>
        </div>
        <button class="flex items-center px-6 py-3 bg-wgc-gold-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-wgc-gold-600 transition-all shadow-lg shadow-wgc-gold-600/20 active:scale-95">
          <lucide-icon [img]="Save" class="w-4 h-4 mr-2"></lucide-icon>
          Save All Changes
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Sidebar Navigation -->
        <div class="space-y-1 lg:sticky lg:top-8 h-fit">
          <button *ngFor="let tab of tabs" 
            [class.bg-wgc-navy-50]="tab.active" 
            [class.text-wgc-navy-950]="tab.active"
            [class.text-wgc-navy-400]="!tab.active"
            class="flex items-center w-full px-4 py-3 text-[11px] font-black rounded-xl hover:bg-wgc-navy-100/50 transition-all uppercase tracking-[0.2em] text-left">
            <lucide-icon [img]="tab.icon" class="w-4 h-4 mr-3"></lucide-icon>
            {{ tab.label }}
          </button>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-3 space-y-12">
          <!-- Profile Section -->
          <section class="space-y-6">
            <div class="flex items-center gap-2 border-b border-wgc-navy-50 pb-4">
              <lucide-icon [img]="Building2" class="w-5 h-5 text-wgc-navy-950"></lucide-icon>
              <h3 class="text-md font-black text-wgc-navy-950 tracking-tight uppercase tracking-widest leading-none">Church Profile</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest">Legal Name</label>
                <input type="text" placeholder="e.g. Grace Community Church" 
                  class="w-full px-4 py-3 bg-wgc-white border border-wgc-navy-100 rounded-xl text-[11px] font-black focus:outline-none focus:ring-2 focus:ring-wgc-gold-600/10 focus:border-wgc-gold-600 transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest">Public Slug</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-wgc-navy-300">wgc.com/give/</span>
                  <input type="text" placeholder="slug" 
                    class="w-full pl-[5.5rem] pr-4 py-3 bg-wgc-white border border-wgc-navy-100 rounded-xl text-[11px] font-black focus:outline-none focus:ring-2 focus:ring-wgc-gold-600/10 transition-all">
                </div>
              </div>
            </div>
          </section>

          <!-- Banking Section -->
          <section class="space-y-6 bg-wgc-white border border-wgc-navy-100 rounded-[2.5rem] p-8 shadow-sm">
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                   <lucide-icon [img]="Landmark" class="w-5 h-5 text-wgc-gold-600"></lucide-icon>
                   <h3 class="text-md font-black text-wgc-navy-950 tracking-tight uppercase tracking-widest leading-none">Settlement Bank</h3>
                </div>
                <span class="px-3 py-1 bg-wgc-navy-50 text-wgc-navy-400 border border-wgc-navy-100 rounded-full text-[9px] font-black uppercase tracking-widest">Not Verified</span>
             </div>
             <p class="text-sm text-wgc-navy-400 font-medium max-w-xl">Configure the bank account where cleared stewardship funds will be deposited. All accounts require KYC/AML verification.</p>
             <button class="px-6 py-3 border-2 border-dashed border-wgc-navy-100 text-wgc-navy-400 hover:border-wgc-gold-600 hover:text-wgc-gold-600 rounded-2xl w-full text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                Add Settlement Account
             </button>
          </section>

          <!-- Receipt Settings -->
          <section class="space-y-6">
            <div class="flex items-center gap-2 border-b border-wgc-navy-50 pb-4">
              <lucide-icon [img]="FileText" class="w-5 h-5 text-wgc-navy-950"></lucide-icon>
              <h3 class="text-md font-black text-wgc-navy-950 tracking-tight uppercase tracking-widest leading-none">Stewardship Receipts</h3>
            </div>
            <div class="space-y-6">
              <div class="flex items-center justify-between p-6 bg-wgc-white border border-wgc-navy-100 rounded-2xl shadow-sm">
                 <div>
                    <h4 class="text-[11px] font-black text-wgc-navy-950 uppercase tracking-widest mb-1">Instant Email Receipts</h4>
                    <p class="text-xs text-wgc-navy-400 font-medium">Donors receive a branded PDF receipt immediately after giving.</p>
                 </div>
                 <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-wgc-navy-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wgc-gold-600 shadow-inner"></div>
                 </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `
})
export class ChurchSettingsComponent implements OnInit {
  private churchService = inject(ChurchService);

  readonly tabs = [
    { label: 'Church Profile', icon: Building2, active: true },
    { label: 'Bank Account', icon: Landmark },
    { label: 'Dashboard Branding', icon: Brush },
    { label: 'Receipts & Tax', icon: FileText },
    { label: 'Team & Roles', icon: Users },
    { label: 'Integrations', icon: Globe },
    { label: 'Security', icon: Shield },
  ];

  readonly Save = Save;
  readonly Building2 = Building2;
  readonly Landmark = Landmark;
  readonly Brush = Brush;
  readonly FileText = FileText;
  readonly Users = Users;
  readonly Globe = Globe;
  readonly Shield = Shield;

  ngOnInit() {
    this.churchService.getSettings().subscribe();
  }
}
