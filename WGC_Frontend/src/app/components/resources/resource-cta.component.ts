import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-resource-cta',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <section class="py-24 bg-white border-t border-wgc-navy-50">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-black text-wgc-navy-950 mb-6 tracking-tight uppercase">
          Launch branded payments <span class="text-wgc-gold-500">with WGC</span>
        </h2>
        <p class="text-lg text-wgc-navy-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Give churches and nonprofit organizations a seamless payment experience under your own brand.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a routerLink="/register" 
            class="w-full sm:w-auto bg-wgc-gold-500 text-wgc-navy-950 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-wgc-gold-500/20 hover:bg-black hover:text-white hover:scale-105 active:scale-95 transition-all">
            Get Started
          </a>
          <a routerLink="/contact" 
            class="w-full sm:w-auto px-10 py-4 border-2 border-wgc-navy-100 rounded-2xl text-[11px] font-black text-wgc-navy-950 uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
            Contact Sales
            <lucide-icon [img]="ArrowRight" class="w-4 h-4"></lucide-icon>
          </a>
        </div>
      </div>
    </section>
  `
})
export class ResourceCtaComponent {
  readonly ArrowRight = ArrowRight;
}
