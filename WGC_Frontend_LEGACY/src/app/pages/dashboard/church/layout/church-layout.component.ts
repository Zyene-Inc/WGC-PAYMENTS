import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ChurchService } from '../../../../services/church.service';
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  RefreshCcw, 
  Landmark, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  Search, 
  Bell, 
  ChevronDown,
  Layers,
  HelpCircle,
  FileText,
  Activity,
  User,
  Percent
} from 'lucide-angular';

@Component({
  selector: 'app-church-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-wgc-white overflow-hidden font-sans">
      <!-- Sidebar -->
      <aside 
        [class.w-72]="!isCollapsed()" 
        [class.w-20]="isCollapsed()"
        class="hidden md:flex flex-col bg-wgc-off border-r border-wgc-navy-100/40 z-30 transition-all duration-300">
        
        <!-- Brand Header: Aligned with Landing Page Header -->
        <div class="flex items-center gap-3 px-6 py-8 h-20 border-b border-wgc-navy-50 overflow-hidden whitespace-nowrap">
          <div class="min-w-[32px] w-8 h-8 rounded-lg bg-wgc-gold-500 flex items-center justify-center shadow-lg shadow-wgc-gold-500/20 transform rotate-12">
            <span class="text-wgc-navy-900 font-black text-lg leading-none -rotate-12">W</span>
          </div>
          <div *ngIf="!isCollapsed()" class="flex flex-col animate-in slide-in-from-left duration-300">
             <span class="text-[9px] font-black text-wgc-gold-600 uppercase tracking-[0.4em] leading-none mb-1">Way Point</span>
             <span class="text-[10px] font-black text-wgc-navy-900 tracking-tight leading-none uppercase">Collective Dashboard</span>
          </div>
        </div>
        
        <!-- Navigation: Aligned with Landing Page Action Labels -->
        <nav class="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto scrollbar-hide">
          <ng-container *ngFor="let item of navItems">
            <a [routerLink]="item.path" 
               routerLinkActive="bg-wgc-white text-wgc-gold-600 shadow-sm border-wgc-gold-500/20" 
               [routerLinkActiveOptions]="{exact: item.exact || false}"
               [title]="item.label"
               class="group flex items-center px-4 py-3 text-[10px] font-black rounded-xl text-wgc-navy-400 hover:bg-white hover:text-wgc-navy-900 transition-all border border-transparent uppercase tracking-[0.25em] overflow-hidden whitespace-nowrap">
              <lucide-icon [img]="item.icon" [class]="isCollapsed() ? 'w-5 h-5 mx-auto' : 'w-4 h-4 mr-3'"></lucide-icon>
              <span *ngIf="!isCollapsed()" class="animate-in fade-in duration-300">{{ item.label }}</span>
            </a>
          </ng-container>
        </nav>
 
        <!-- Footer / Collapse Toggle -->
        <div class="p-4 border-t border-wgc-navy-50">
          <div class="flex flex-col gap-2">
            <button (click)="isCollapsed.set(!isCollapsed())" 
              class="flex items-center justify-center p-3 rounded-xl hover:bg-white text-wgc-navy-400 transition-all">
               <lucide-icon [img]="Menu" class="w-4 h-4"></lucide-icon>
            </button>
            <button (click)="onLogout()" title="Sign Out"
              class="flex items-center justify-center p-3 rounded-xl hover:bg-red-50 text-red-400 transition-all border border-transparent hover:border-red-100">
               <lucide-icon [img]="LogOut" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>
      </aside>
 
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden bg-wgc-white">
        <!-- Top Navbar -->
        <header class="h-20 bg-wgc-white border-b border-wgc-navy-100/20 flex items-center justify-between px-8 z-20">
          <!-- Mobile Menu -->
          <button class="md:hidden p-2 text-wgc-navy-400">
            <lucide-icon [img]="Menu" class="w-6 h-6"></lucide-icon>
          </button>
          
          <div class="flex-1 max-w-xl hidden sm:block">
            <div class="relative">
              <lucide-icon [img]="Search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300"></lucide-icon>
              <input type="text" placeholder="Institutional Search Engine..." 
                class="w-full pl-11 pr-4 py-2.5 bg-wgc-off border border-wgc-navy-100/40 text-[11px] font-bold uppercase tracking-widest rounded-xl focus:outline-none focus:border-wgc-gold-500/50 transition-all placeholder:text-wgc-navy-200">
            </div>
          </div>
          
          <!-- Actions & Account -->
          <div class="flex items-center gap-4">
            <!-- Impact Badge -->
            <div class="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-wgc-gold-50 border border-wgc-gold-500/20">
              <div class="w-1.5 h-1.5 rounded-full bg-wgc-gold-500 animate-pulse"></div>
              <span class="text-[9px] font-black uppercase tracking-[0.2em] text-wgc-gold-600">Enterprise Mode</span>
            </div>

            <div class="h-6 w-px bg-wgc-navy-50"></div>

            <!-- Profile Menu -->
            <div class="flex items-center gap-3 pl-2">
              <div class="w-10 h-10 rounded-xl bg-wgc-off flex items-center justify-center shadow-sm font-black text-wgc-navy-900 text-xs border border-wgc-navy-100 transition-all hover:scale-105">
                {{ (authService.currentUser$ | async)?.email?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="hidden xl:flex flex-col">
                <span class="text-[11px] font-black text-wgc-navy-900 tracking-tight leading-none uppercase">
                  {{ (authService.currentUser$ | async)?.email?.split('@')?.[0] || 'Member' }}
                </span>
                <div class="flex items-center gap-1.5 mt-1">
                   <div class="w-1.5 h-1.5 rounded-full bg-wgc-gold-600 animate-pulse"></div>
                   <p class="text-[8px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none">Security: Live</p>
                </div>
              </div>
              <lucide-icon [img]="ChevronDown" class="w-3 h-3 text-wgc-navy-300"></lucide-icon>
            </div>
          </div>
        </header>
 
        <!-- Page Outlet -->
        <main class="flex-1 overflow-y-auto bg-wgc-off scroll-smooth">
          <div class="p-8 lg:p-12 max-w-[1600px] mx-auto min-h-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ChurchLayoutComponent implements OnInit {
  authService = inject(AuthService);
  churchService = inject(ChurchService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isCollapsed = signal(false);
  config = this.churchService.config;

  readonly navItems = [
    { label: 'Overview', path: '/dashboard/church', icon: LayoutDashboard, exact: true },
    { label: 'Donations', path: '/dashboard/church/donations', icon: CreditCard },
    { label: 'Recurring', path: '/dashboard/church/recurring', icon: RefreshCcw },
    { label: 'Fees & Costs', path: '/dashboard/church/fees', icon: Percent },
    { label: 'Donors', path: '/dashboard/church/donors', icon: Users },
    { label: 'Campaigns', path: '/dashboard/church/campaigns', icon: Layers },
    { label: 'Payouts', path: '/dashboard/church/payouts', icon: Landmark },
    { label: 'Reports', path: '/dashboard/church/reports', icon: BarChart3 },
    { label: 'Settings', path: '/dashboard/church/settings', icon: Settings },
  ];

  readonly Menu = Menu;
  readonly Search = Search;
  readonly Bell = Bell;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;

  ngOnInit() {
    this.churchService.getSettings().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
