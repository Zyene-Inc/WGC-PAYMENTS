import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule, LayoutDashboard, Users, CreditCard, LogOut, Menu, X, RefreshCcw, Landmark, ArrowUpDown, Settings } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-wgc-off overflow-hidden font-sans">
      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col w-72 bg-wgc-white border-r border-wgc-navy-100 shadow-sm z-20">
        <div class="flex-1 px-6 py-8 space-y-1 overflow-y-auto">
          <div class="flex items-center gap-3 px-4 mb-10">
            <div class="w-8 h-8 rounded-lg bg-wgc-gold-600 flex items-center justify-center shadow-lg shadow-wgc-gold-600/20">
              <span class="text-white font-black text-lg">W</span>
            </div>
            <div>
              <p class="text-[9px] font-black text-wgc-gold-600 uppercase tracking-widest leading-none mb-1">Way Point</p>
              <p class="text-xs font-black text-wgc-navy-950 tracking-tight leading-none uppercase">COLLECTIVE</p>
            </div>
          </div>

          <nav class="space-y-1">
            <a routerLink="/" class="flex items-center px-4 py-3 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-900 transition-all border border-transparent uppercase tracking-[0.2em] mb-4 group">
              <lucide-icon [img]="Menu" class="w-4 h-4 mr-3 opacity-50"></lucide-icon>
              Back to Home
            </a>
            
            <div class="h-px bg-wgc-navy-50 mb-6 mx-4"></div>

            <a routerLink="/dashboard" routerLinkActive="bg-wgc-navy-50 text-wgc-navy-950 shadow-sm border-wgc-navy-100/50" [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-950 transition-all border border-transparent uppercase tracking-[0.2em]">
              <lucide-icon [img]="LayoutDashboard" class="w-4 h-4 mr-3"></lucide-icon>
              Dashboard
            </a>
            <a routerLink="/dashboard/merchants" routerLinkActive="bg-wgc-navy-50 text-wgc-navy-950 shadow-sm border-wgc-navy-100/50"
              class="flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-950 transition-all border border-transparent uppercase tracking-[0.2em]">
              <lucide-icon [img]="Users" class="w-4 h-4 mr-3"></lucide-icon>
              Merchants
            </a>
            
            <div class="pt-6 pb-2 px-4">
               <p class="text-[9px] font-black text-wgc-navy-200 uppercase tracking-[0.3em]">Institutional</p>
            </div>

            <a routerLink="/dashboard/payments" routerLinkActive="bg-wgc-navy-50 text-wgc-navy-950 shadow-sm border-wgc-navy-100/50"
              class="flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-950 transition-all border border-transparent uppercase tracking-[0.2em]">
              <lucide-icon [img]="CreditCard" class="w-4 h-4 mr-3"></lucide-icon>
              Payments
            </a>
            <a routerLink="/dashboard/recurring" routerLinkActive="bg-wgc-navy-50 text-wgc-navy-950 shadow-sm border-wgc-navy-100/50"
              class="flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-950 transition-all border border-transparent uppercase tracking-[0.2em]">
              <lucide-icon [img]="RefreshCcw" class="w-4 h-4 mr-3"></lucide-icon>
              Recurring
            </a>
            <a routerLink="/dashboard/payouts" routerLinkActive="bg-wgc-navy-50 text-wgc-navy-950 shadow-sm border-wgc-navy-100/50"
              class="flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-950 transition-all border border-transparent uppercase tracking-[0.2em]">
              <lucide-icon [img]="Landmark" class="w-4 h-4 mr-3"></lucide-icon>
              Payouts
            </a>

            <div class="pt-6 pb-2 px-4">
               <p class="text-[9px] font-black text-wgc-navy-200 uppercase tracking-[0.3em]">System</p>
            </div>

            <a routerLink="/dashboard/migration" routerLinkActive="bg-wgc-navy-50 text-wgc-navy-950 shadow-sm border-wgc-navy-100/50"
              class="flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-950 transition-all border border-transparent uppercase tracking-[0.2em]">
              <lucide-icon [img]="ArrowUpDown" class="w-4 h-4 mr-3"></lucide-icon>
              Migration
            </a>
            <a routerLink="/dashboard/settings" routerLinkActive="bg-wgc-navy-50 text-wgc-navy-950 shadow-sm border-wgc-navy-100/50"
              class="flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-950 transition-all border border-transparent uppercase tracking-[0.2em]">
              <lucide-icon [img]="Settings" class="w-4 h-4 mr-3"></lucide-icon>
              Settings
            </a>
          </nav>
        </div>

        <div class="p-6 border-t border-wgc-navy-50">
          <button (click)="onLogout()" 
            class="flex items-center w-full px-4 py-3 text-[10px] font-black rounded-xl text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.2em] border border-transparent">
            <lucide-icon [img]="LogOut" class="w-4 h-4 mr-3"></lucide-icon>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Header -->
        <header class="h-20 bg-wgc-white border-b border-wgc-navy-100/50 flex items-center justify-between px-10 z-10 transition-all">
          <div class="flex items-center gap-6">
            <button class="md:hidden p-2 text-wgc-navy-400">
              <lucide-icon [img]="Menu" class="w-6 h-6"></lucide-icon>
            </button>
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-wgc-gold-600 uppercase tracking-[0.35em] mb-0.5">Platform Console</span>
              <h1 class="text-lg font-black text-wgc-navy-950 tracking-tight leading-none uppercase">
                {{ getPageTitle() }}
              </h1>
            </div>
          </div>
          
          <div class="flex items-center gap-6">
            <div class="text-right hidden sm:block">
              <p class="text-xs font-black text-wgc-navy-950 tracking-tight">{{ (authService.currentUser$ | async)?.email }}</p>
              <p class="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-[0.2em] mt-0.5">{{ (authService.currentUser$ | async)?.role?.replace('_', ' ') }}</p>
            </div>
            <div class="w-11 h-11 rounded-xl bg-wgc-off border border-wgc-navy-100 flex items-center justify-center shadow-sm font-black text-wgc-navy-950 transition-transform active:scale-95">
              {{ (authService.currentUser$ | async)?.email?.charAt(0)?.toUpperCase() }}
            </div>
          </div>
        </header>

        <!-- Page Outlet -->
        <main class="flex-1 overflow-y-auto p-10 bg-wgc-off/30 relative">
          <div class="relative z-10 max-w-[1600px] mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly CreditCard = CreditCard;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly RefreshCcw = RefreshCcw;
  readonly Landmark = Landmark;
  readonly ArrowUpDown = ArrowUpDown;
  readonly Settings = Settings;

  getPageTitle(): string {
    const url = this.router.url;
    if (url === '/dashboard') return 'Dashboard Overview';
    if (url === '/dashboard/merchants') return 'Merchants Directory';
    if (url.startsWith('/dashboard/merchants/')) return 'Merchant Details';
    if (url === '/dashboard/payments') return 'Transaction History';
    if (url === '/dashboard/recurring') return 'Recurring Payments';
    if (url === '/dashboard/payouts') return 'Payout Management';
    if (url === '/dashboard/migration') return 'Migration Center';
    if (url === '/dashboard/migration/upload') return 'New Import';
    if (url.startsWith('/dashboard/migration/jobs/')) return 'Import Details';
    if (url === '/dashboard/settings') return 'Institutional Configuration';
    return 'WGC Platform';
  }

  onLogout() {
    this.authService.logout();
  }
}
