import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, BookOpen, Clock, FileText } from 'lucide-angular';
import { Title, Meta } from '@angular/platform-browser';

import { ResourceCtaComponent } from '../../components/resources/resource-cta.component';

@Component({
  selector: 'app-resource-hub',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ResourceCtaComponent],
  template: `
    <div class="min-h-screen bg-wgc-off selection:bg-wgc-gold-100 selection:text-wgc-navy-950">
      <!-- Hub Hero -->
      <section class="pt-32 pb-20 bg-white border-b border-wgc-navy-50 overflow-hidden relative">
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg class="w-full h-full" fill="none">
            <pattern id="hub-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="black"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#hub-pattern)"/>
          </svg>
        </div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-wgc-gold-200 bg-wgc-gold-50 shadow-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-wgc-gold-600 animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-wgc-gold-600">Resources & Guides</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-black text-wgc-navy-950 tracking-tighter mb-8 uppercase leading-[0.95]">
            Church Payment<br>
            <span class="text-wgc-gold-500 italic">Resources & Guides</span>
          </h1>
          <p class="max-w-3xl mx-auto text-lg text-wgc-navy-600 font-medium leading-relaxed">
            Explore payment processing insights for churches, nonprofits, and software platforms, including pricing, recurring giving, embedded payments, ACH support, payouts, and reporting.
          </p>
        </div>
      </section>

      <!-- Resource Grid -->
      <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a *ngFor="let card of resources" 
               [routerLink]="card.route"
               class="group relative bg-white border border-wgc-navy-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-wgc-gold-300 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
              
              <div class="mb-8 w-12 h-12 rounded-2xl bg-wgc-gold-50 border border-wgc-gold-100 flex items-center justify-center text-wgc-gold-600 group-hover:bg-wgc-gold-500 group-hover:text-wgc-navy-950 transition-colors duration-500">
                <lucide-icon [img]="card.icon" class="w-6 h-6"></lucide-icon>
              </div>

              <div class="flex-grow">
                <h3 class="text-xl font-black text-wgc-navy-950 mb-4 tracking-tight leading-tight group-hover:text-wgc-gold-600 transition-colors">
                  {{ card.title }}
                </h3>
                <p class="text-[13px] text-wgc-navy-500 font-medium leading-relaxed">
                  {{ card.description }}
                </p>
              </div>

              <div class="mt-10 pt-6 border-t border-wgc-navy-50 flex items-center justify-between">
                <div class="flex items-center gap-2 text-[10px] font-black text-wgc-navy-400 uppercase tracking-widest">
                  <lucide-icon [img]="Clock" class="w-3 h-3"></lucide-icon>
                  {{ card.readTime }}
                </div>
                <div class="text-wgc-gold-600 group-hover:translate-x-2 transition-transform duration-500">
                  <lucide-icon [img]="ArrowRight" class="w-5 h-5"></lucide-icon>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <app-resource-cta></app-resource-cta>
    </div>
  `
})
export class ResourceHubComponent implements OnInit {
  readonly ArrowRight = ArrowRight;
  readonly Clock = Clock;

  resources = [
    {
      title: 'BEST PAYMENT PROCESSOR FOR CHURCHES IN 2026',
      description: 'Learn how church payment processing works, including fees, ACH transfers, recurring giving, branded checkout, reporting, and setup considerations.',
      route: '/resources/church-payment-processing-guide-2026',
      icon: BookOpen,
      readTime: '8 MIN READ'
    },
    {
      title: 'HOW TO WHITE-LABEL PAYMENTS FOR NONPROFIT SOFTWARE',
      description: 'See how nonprofit and church software platforms can offer embedded, branded payment experiences with onboarding, checkout, recurring donations, payouts, and reporting.',
      route: '/resources/white-label-payment-processing-nonprofit-church-software',
      icon: FileText,
      readTime: '12 MIN READ'
    },
    {
      title: 'STRIPE VS TITHE.LY VS WGC: FEE BREAKDOWN',
      description: 'Understand card fees, ACH support, monthly subscription pricing, recurring donation tools, payout visibility, and what is included in the WGC payments experience.',
      route: '/resources/church-payment-processing-pricing-guide',
      icon: Clock,
      readTime: '6 MIN READ'
    }
  ];

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Resource Hub | Payment Processing for Churches & Nonprofits | WGC');
    this.meta.updateTag({ name: 'description', content: 'Explore payment processing insights for churches, nonprofits, and software platforms. Guides on pricing, white-labeling, and recurring giving.' });
  }
}
