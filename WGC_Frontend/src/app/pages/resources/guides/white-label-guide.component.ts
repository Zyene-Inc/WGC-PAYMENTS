import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ChevronLeft, CheckCircle2, ShieldCheck, Box, UserPlus, CreditCard, BarChart4, Cpu } from 'lucide-angular';
import { Title, Meta } from '@angular/platform-browser';
import { ResourceCtaComponent } from '../../../../components/resources/resource-cta.component';

@Component({
  selector: 'app-white-label-guide',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ResourceCtaComponent],
  template: `
    <div class="min-h-screen bg-white selection:bg-wgc-gold-100 selection:text-wgc-navy-950">
      
      <!-- Top Navigation -->
      <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-wgc-navy-50 py-4 lg:py-6">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a routerLink="/resources" class="group flex items-center gap-2 text-[10px] font-black text-wgc-navy-400 hover:text-wgc-navy-950 uppercase tracking-[0.2em] transition-all">
            <lucide-icon [img]="ChevronLeft" class="w-3 h-3 group-hover:-translate-x-1 transition-transform"></lucide-icon>
            Back to Resources
          </a>
          <div class="hidden md:flex items-center gap-2">
             <div class="w-1.5 h-1.5 rounded-full bg-wgc-gold-500"></div>
             <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest">Protocol Documentation</span>
          </div>
        </div>
      </nav>

      <!-- Article Hero -->
      <header class="pt-16 pb-12 bg-wgc-white border-b border-wgc-navy-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 text-wgc-gold-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
            <div class="w-8 h-px bg-wgc-gold-500"></div>
            Software Vertical Guide
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-wgc-navy-950 tracking-tighter mb-8 tracking-tight uppercase leading-[0.95]">
            How to White-Label Payments for <span class="text-wgc-gold-500">Nonprofit Software</span>
          </h1>
          <p class="text-lg md:text-xl text-wgc-navy-600 font-medium leading-relaxed italic border-l-4 border-wgc-gold-500 pl-6 border-opacity-30">
            For nonprofit and church software platforms, payments should feel native to the product. White-label payment processing makes it possible to offer branded onboarding, embedded donation forms, and payout visibility without a disconnected experience.
          </p>
        </div>
      </header>

      <!-- Main Content -->
      <article class="py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="prose prose-lg max-w-none text-wgc-navy-950 font-medium leading-relaxed space-y-16">
            
            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">What white-label payment processing means</h2>
              </div>
              <p>White-label payment processing allows a software platform to present the entire payment experience under its own brand. This isn't just a logo change; it is a full orchestration of the financial lifecycle:</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <div *ngFor="let item of meanings" class="flex items-center gap-3 p-4 bg-wgc-off rounded-2xl border border-wgc-navy-50">
                  <lucide-icon [img]="CheckCircle2" class="w-4 h-4 text-wgc-gold-500"></lucide-icon>
                  <span class="text-[10px] font-black text-wgc-navy-900 uppercase tracking-widest">{{ item }}</span>
                </div>
              </div>
            </section>

            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">Why nonprofit and church software platforms need embedded payments</h2>
              </div>
              <p>The core advantage of white-labeling is **brand continuity**. Churches and nonprofits value trust above all else. When a donor is redirected to a generic third-party site, trust is diluted. Embedded payments provide:</p>
              <ul class="list-none p-0 space-y-4">
                 <li *ngFor="let benefit of benefits" class="flex items-start gap-3">
                   <div class="w-5 h-5 rounded bg-wgc-gold-500 text-wgc-navy-950 flex items-center justify-center mt-1 flex-shrink-0">
                     <lucide-icon [img]="CheckCircle2" class="w-3 h-3"></lucide-icon>
                   </div>
                   <span class="font-bold text-wgc-navy-900 italic">{{ benefit }}</span>
                 </li>
              </ul>
            </section>

            <!-- Feature Blocks -->
            <section>
              <div class="flex items-center gap-4 mb-12">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">Institutional Pillars</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div *ngFor="let block of featureBlocks" class="p-8 bg-wgc-off rounded-[2.5rem] border border-wgc-navy-100 group hover:shadow-xl transition-all">
                  <div class="w-10 h-10 rounded-xl bg-wgc-navy-950 flex items-center justify-center text-wgc-gold-500 mb-6 group-hover:scale-110 transition-transform">
                    <lucide-icon [img]="block.icon" class="w-5 h-5"></lucide-icon>
                  </div>
                  <h4 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest mb-3">{{ block.title }}</h4>
                  <p class="text-xs text-wgc-navy-500 leading-relaxed font-medium">{{ block.text }}</p>
                </div>
              </div>
            </section>

            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">The core infrastructure behind white-label payments</h2>
              </div>
              <p>Strong white-label systems typically require a robust merchant onboarding flow, secure transaction processing, recurring billing support, and compliance-ready workflows. WGC manages this complexity through a unified API architecture.</p>
            </section>

            <section class="bg-wgc-navy-950 p-12 rounded-[3.5rem] text-white relative overflow-hidden">
               <div class="absolute -right-20 -top-20 w-80 h-80 bg-wgc-gold-500/10 blur-[100px] rounded-full"></div>
               <div class="relative z-10">
                 <div class="flex items-center gap-4 mb-8">
                   <lucide-icon [img]="Cpu" class="w-8 h-8 text-wgc-gold-500"></lucide-icon>
                   <h2 class="text-2xl font-black uppercase tracking-tight m-0">How WGC powers branded experiences</h2>
                 </div>
                 <p class="text-wgc-navy-300 mb-8 font-medium">WGC is built for embedded, branded payment experiences. We support card payments, ACH, recurring donation tools, and dashboard reporting—all designed specifically for church and nonprofit software use cases.</p>
                 <div class="flex flex-wrap gap-3">
                    <span *ngFor="let tag of wgcFeatures" class="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-wgc-gold-500 border border-white/10">{{ tag }}</span>
                 </div>
               </div>
            </section>

            <!-- Internal Linking -->
            <section class="pt-16 border-t border-wgc-navy-50">
               <h4 class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] mb-8">Related Resources</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a routerLink="/resources/church-payment-processing-guide-2026" class="p-6 bg-wgc-off border border-wgc-navy-100 rounded-3xl hover:border-wgc-gold-300 transition-all group">
                     <p class="text-xs font-black text-wgc-navy-950 uppercase tracking-widest mb-2 group-hover:text-wgc-gold-600 transition-colors">Core Processing Guide</p>
                     <p class="text-[10px] text-wgc-navy-400 leading-relaxed">Learn the fundamentals of card processing and ACH for 2026.</p>
                  </a>
                  <a routerLink="/resources/church-payment-processing-pricing-guide" class="p-6 bg-wgc-off border border-wgc-navy-100 rounded-3xl hover:border-wgc-gold-300 transition-all group">
                     <p class="text-xs font-black text-wgc-navy-950 uppercase tracking-widest mb-2 group-hover:text-wgc-gold-600 transition-colors">Pricing & Transparency</p>
                     <p class="text-[10px] text-wgc-navy-400 leading-relaxed">Full breakdown of the WGC fee structure and subscription model.</p>
                  </a>
               </div>
            </section>

          </div>
        </div>
      </article>

      <!-- CTA Section -->
      <app-resource-cta></app-resource-cta>
    </div>
  `
})
export class WhiteLabelGuideComponent implements OnInit {
  readonly ChevronLeft = ChevronLeft;
  readonly CheckCircle2 = CheckCircle2;
  readonly Cpu = Cpu;
  readonly UserPlus = UserPlus;
  readonly Box = Box;
  readonly CreditCard = CreditCard;
  readonly BarChart4 = BarChart4;

  meanings = ['Onboarding', 'Checkout', 'Recurring Billing', 'Payouts', 'Reporting'];
  benefits = ['Better brand continuity', 'Smoother user experience', 'Stronger retention', 'Greater ownership of the journey'];

  featureBlocks = [
    {
      icon: UserPlus,
      title: 'Branded Onboarding',
      text: 'Onboard your merchants through a seamless flow that lives inside your application. No external redirects or disconnected paperwork.'
    },
    {
      icon: Box,
      title: 'Embedded Checkout',
      text: 'Keep the donation flow consistent with your platform UI. Our API supports highly customizable, secure checkout experiences.'
    },
    {
      icon: CreditCard,
      title: 'Recurring Donations',
      text: 'Automate weekly, monthly, or custom schedules. We handle the orchestration while you manage the donor relationship.'
    },
    {
      icon: BarChart4,
      title: 'Reporting & Visibility',
      text: 'Provide your users with real-time payout visibility and transaction history directly within your proprietary dashboard.'
    }
  ];

  wgcFeatures = ['Card Payments', 'ACH Support', 'Recurring Billing', 'Payout Visibility', 'Dashboard Reporting', 'Mission Aligned'];

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('How to White-Label Payments for Nonprofit Software | WGC');
    this.meta.updateTag({ name: 'description', content: 'Explore how white-label payment processing helps nonprofit and church software platforms offer branded onboarding, embedded checkout, and payouts.' });
  }
}
