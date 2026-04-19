import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LogOut, Home, Key } from 'lucide-angular';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="relative min-h-screen flex items-center justify-center bg-wgc-off overflow-hidden">
      <!-- Background grid pattern (Subtle, light) -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg class="w-full h-full" fill="none">
          <pattern id="logout-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0f172a" stroke-width="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#logout-grid)"/>
        </svg>
      </div>

      <!-- Gold radial glow (soft, light) -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl opacity-[0.07]"
           style="background: radial-gradient(circle, #eab308 0%, transparent 70%);"></div>

      <!-- Content Card -->
      <div class="relative z-10 w-full max-w-lg px-6 text-center animate-in fade-in zoom-in duration-700">
        <div class="w-20 h-20 bg-wgc-gold-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-wgc-gold-500/20 transform rotate-45 group">
           <lucide-icon [img]="LogOut" class="w-10 h-10 text-wgc-navy-900 -rotate-45"></lucide-icon>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-wgc-navy-900 tracking-tight leading-tight mb-6">
          Signed Out <span class="text-wgc-gold-600">Successfully</span>
        </h1>
        
        <p class="text-lg text-wgc-navy-400 font-medium mb-12 max-w-md mx-auto leading-relaxed">
          Your WGC Church Hub session has ended. Your data remains protected by our institutional-grade security protocols.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a routerLink="/" class="metallic-gold w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-sm font-black rounded-full shadow-xl transform transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-wgc-navy-900">
            <lucide-icon [img]="Home" class="w-4 h-4 mr-2"></lucide-icon>
            Home
          </a>
          <a routerLink="/login" class="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-sm font-bold rounded-full transition-all uppercase tracking-widest border border-wgc-navy-100 text-wgc-navy-500 hover:bg-white hover:text-wgc-navy-900 hover:border-wgc-gold-500/50">
            <lucide-icon [img]="Key" class="w-4 h-4 mr-2"></lucide-icon>
            Login
          </a>
        </div>

        <!-- Mission Anchor -->
        <div class="mt-20 flex flex-col items-center gap-4 opacity-30">
           <div class="w-px h-12 bg-gradient-to-b from-transparent to-wgc-gold-500"></div>
           <p class="text-[10px] font-black uppercase tracking-[0.4em] text-wgc-navy-400">Way Point Gateway Collective</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metallic-gold {
      background: linear-gradient(135deg, #fde047 0%, #eab308 50%, #ca8a04 100%);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
  `]
})
export class LogoutComponent {
  readonly LogOut = LogOut;
  readonly Home = Home;
  readonly Key = Key;
}
