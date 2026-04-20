import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ChevronLeft, CheckCircle2, ShieldCheck, CreditCard, Landmark, Layout, BarChart, TrendingUp } from 'lucide-angular';
import { Title, Meta } from '@angular/platform-browser';
import { ResourceCtaComponent } from '../../../components/resources/resource-cta.component';

@Component({
  selector: 'app-church-payment-guide',
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
             <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
             <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest">WGC Research Center</span>
          </div>
        </div>
      </nav>

      <!-- Article Hero -->
      <header class="pt-16 pb-12 bg-wgc-white border-b border-wgc-navy-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 text-wgc-gold-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
            <div class="w-8 h-px bg-wgc-gold-500"></div>
            Featured Guide
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-wgc-navy-950 tracking-tighter mb-8 tracking-tight uppercase leading-[1.05]">
            Church Payment Processing <span class="text-wgc-gold-500">Guide for 2026</span>
          </h1>
          <p class="text-lg md:text-xl text-wgc-navy-600 font-medium leading-relaxed italic border-l-4 border-wgc-gold-500 pl-6 border-opacity-30">
            Churches need more than a way to accept donations online. A modern payment setup should support card payments, ACH transfers, recurring giving, branded donation experiences, payout visibility, and simple reporting.
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
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">What churches should look for in a payment processing solution</h2>
              </div>
              <p>In 2026, the right payment system is about reducing friction, increasing trust, and helping organizations manage giving more effectively. Churches should evaluate these core pillars:</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div *ngFor="let item of pillars" class="flex items-center gap-3 p-4 bg-wgc-off rounded-2xl border border-wgc-navy-50">
                  <lucide-icon [img]="CheckCircle2" class="w-4 h-4 text-wgc-gold-500"></lucide-icon>
                  <span class="text-xs font-black text-wgc-navy-900 uppercase tracking-widest">{{ item }}</span>
                </div>
              </div>
            </section>

            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">Card payments, ACH transfers, and recurring giving</h2>
              </div>
              <div class="space-y-6">
                <div class="p-8 bg-white border border-wgc-navy-100 rounded-[2rem] shadow-sm flex items-start gap-6 group hover:border-wgc-gold-300 transition-all">
                  <div class="w-12 h-12 rounded-2xl bg-wgc-gold-50 border border-wgc-gold-100 flex items-center justify-center text-wgc-gold-600 group-hover:bg-wgc-gold-500 group-hover:text-wgc-navy-950 transition-colors">
                    <lucide-icon [img]="CreditCard" class="w-6 h-6"></lucide-icon>
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest mb-2">Card Performance</h3>
                    <p class="text-sm text-wgc-navy-500">Card payments remain essential for immediate convenience and high adoption rates among new donors.</p>
                  </div>
                </div>
                <div class="p-8 bg-white border border-wgc-navy-100 rounded-[2rem] shadow-sm flex items-start gap-6 group hover:border-wgc-gold-300 transition-all">
                   <div class="w-12 h-12 rounded-2xl bg-wgc-gold-50 border border-wgc-gold-100 flex items-center justify-center text-wgc-gold-600 group-hover:bg-wgc-gold-500 group-hover:text-wgc-navy-950 transition-colors">
                     <lucide-icon [img]="Landmark" class="w-6 h-6"></lucide-icon>
                   </div>
                   <div>
                     <h3 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest mb-2">ACH Transfer Protocol</h3>
                     <p class="text-sm text-wgc-navy-500">ACH transfers provide a lower-cost alternative for significant recurring gifts, preserving more for mission-aligned work.</p>
                   </div>
                 </div>
                 <div class="p-8 bg-white border border-wgc-navy-100 rounded-[2rem] shadow-sm flex items-start gap-6 group hover:border-wgc-gold-300 transition-all">
                    <div class="w-12 h-12 rounded-2xl bg-wgc-gold-50 border border-wgc-gold-100 flex items-center justify-center text-wgc-gold-600 group-hover:bg-wgc-gold-500 group-hover:text-wgc-navy-950 transition-colors">
                      <lucide-icon [img]="TrendingUp" class="w-6 h-6"></lucide-icon>
                    </div>
                    <div>
                      <h3 class="text-sm font-black text-wgc-navy-950 uppercase tracking-widest mb-2">Predictable Stewardship</h3>
                      <p class="text-sm text-wgc-navy-500">Recurring giving creates predictable donation flows and reduces the administrative burden of manual follow-up.</p>
                    </div>
                  </div>
              </div>
            </section>

            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">Why branded checkout and embedded giving matter</h2>
              </div>
              <p>A consistent branded giving experience builds trust. When a donor never leaves your ecosystem to complete a transaction, donor abandonment rates drop significantly. Embedded payment forms reduce technical friction and keep the payment journey focused on the organization's mission.</p>
            </section>

            <section>
               <div class="flex items-center gap-4 mb-8">
                 <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                 <h2 class="text-2xl font-black uppercase tracking-tight m-0">Reporting, payouts, and financial visibility</h2>
               </div>
               <p>Churches need real-time visibility into completed transactions, pending payouts, recurring donations, and historical trends. Reporting should be natively integrated into the dashboard, providing clear audit trails without requiring complex external exports.</p>
             </section>

             <section class="bg-wgc-off p-10 rounded-[2.5rem] border border-wgc-navy-100">
               <div class="flex items-center gap-4 mb-8">
                 <div class="w-10 h-10 rounded-xl bg-wgc-navy-950 flex items-center justify-center text-wgc-gold-500">
                   <lucide-icon [img]="ShieldCheck" class="w-5 h-5"></lucide-icon>
                 </div>
                 <h2 class="text-2xl font-black uppercase tracking-tight m-0">Choosing a setup for long-term growth</h2>
               </div>
               <p class="mb-0">The best setup supports donor confidence today and institutional scale tomorrow. WGC is designed to power the branded payment experiences and recurring billing visibility required by modern church software environments.</p>
             </section>

             <!-- Internal Linking -->
             <section class="pt-16 border-t border-wgc-navy-50">
                <h4 class="text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.3em] mb-8">Related Resources</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <a routerLink="/resources/white-label-payment-processing-nonprofit-church-software" class="p-6 bg-white border border-wgc-navy-100 rounded-3xl hover:border-wgc-gold-300 transition-all group">
                      <p class="text-xs font-black text-wgc-navy-950 uppercase tracking-widest mb-2 group-hover:text-wgc-gold-600 transition-colors">White-Label Payment Vertical</p>
                      <p class="text-[10px] text-wgc-navy-400 leading-relaxed">Explore branded payment architectures for nonprofit software platforms.</p>
                   </a>
                   <a routerLink="/resources/church-payment-processing-pricing-guide" class="p-6 bg-white border border-wgc-navy-100 rounded-3xl hover:border-wgc-gold-300 transition-all group">
                      <p class="text-xs font-black text-wgc-navy-950 uppercase tracking-widest mb-2 group-hover:text-wgc-gold-600 transition-colors">Pricing & Stewardship Guide</p>
                      <p class="text-[10px] text-wgc-navy-400 leading-relaxed">Understand the WGC pricing structure, card rates, and subscription model.</p>
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
export class ChurchPaymentGuideComponent implements OnInit {
  readonly ChevronLeft = ChevronLeft;
  readonly CheckCircle2 = CheckCircle2;
  readonly CreditCard = CreditCard;
  readonly Landmark = Landmark;
  readonly TrendingUp = TrendingUp;
  readonly ShieldCheck = ShieldCheck;

  pillars = [
    'Card payment support',
    'ACH / bank transfer support',
    'Recurring donation options',
    'Donation form experience',
    'Branded checkout',
    'Payout visibility',
    'Reporting & transaction history',
    'Ease of setup'
  ];

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Church Payment Processing Guide for 2026 | WGC Payments');
    this.meta.updateTag({ name: 'description', content: 'Learn how church payment processing works in 2026, including card fees, ACH transfers, recurring giving, branded checkout, reporting, and setup considerations.' });
  }
}
