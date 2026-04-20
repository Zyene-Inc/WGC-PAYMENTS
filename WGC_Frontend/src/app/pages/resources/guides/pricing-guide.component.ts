import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ChevronLeft, CheckCircle2, DollarSign, Zap, Globe, Package, Landmark, BarChart, Settings, Users, Headphones } from 'lucide-angular';
import { Title, Meta } from '@angular/platform-browser';
import { ResourceCtaComponent } from '../../../components/resources/resource-cta.component';

@Component({
  selector: 'app-pricing-guide',
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
             <span class="text-[9px] font-black text-wgc-navy-400 uppercase tracking-widest">Pricing Transparency</span>
          </div>
        </div>
      </nav>

      <!-- Article Hero -->
      <header class="pt-16 pb-12 bg-wgc-white border-b border-wgc-navy-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 text-wgc-gold-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
            <div class="w-8 h-px bg-wgc-gold-500"></div>
            Financial Stewardship
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-wgc-navy-950 tracking-tighter mb-8 tracking-tight uppercase leading-[0.95]">
            Church Payment Processing <span class="text-wgc-gold-500">Pricing Guide</span>
          </h1>
          <p class="text-lg md:text-xl text-wgc-navy-600 font-medium leading-relaxed italic border-l-4 border-wgc-gold-500 pl-6 border-opacity-30">
            A strong payment offering should be transparent, simple to explain, and supported by features like recurring donations, payout visibility, and reporting.
          </p>
        </div>
      </header>

      <!-- Main Content -->
      <article class="py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="prose prose-lg max-w-none text-wgc-navy-950 font-medium leading-relaxed space-y-16">
            
            <section>
              <div class="flex items-center gap-4 mb-10">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">WGC pricing structure</h2>
              </div>
              
              <!-- Premium Pricing Block -->
              <div class="bg-wgc-navy-950 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-premium mb-12">
                <div class="absolute top-0 right-0 w-96 h-96 bg-wgc-gold-500/10 blur-[150px] rounded-full"></div>
                <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-wgc-gold-500 text-wgc-navy-950 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Institutional Standard</div>
                    <h3 class="text-3xl font-black mb-6 uppercase tracking-tight leading-tight">Simplified<br>Orchestration</h3>
                    <ul class="space-y-4 list-none p-0">
                      <li *ngFor="let item of pricingItems" class="flex items-center gap-4">
                        <lucide-icon [img]="CheckCircle2" class="w-5 h-5 text-wgc-gold-500"></lucide-icon>
                        <span class="text-sm font-bold text-wgc-navy-200 uppercase tracking-widest">{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-sm">
                    <div class="text-6xl font-black text-wgc-gold-500 tracking-tighter mb-2">2.3%</div>
                    <div class="text-lg font-black uppercase tracking-[0.3em] text-white/60 mb-6">+ $0.25</div>
                    <div class="h-px bg-white/10 mb-8 mx-auto w-1/2"></div>
                    <div class="text-xl font-black text-white">$10<span class="text-xs text-white/40 font-bold ml-2">/ MO PER ORG</span></div>
                  </div>
                </div>
              </div>
              <p class="text-center text-wgc-navy-400 italic">This structure is designed to stay simple and transparent, reducing administrative friction for organizations.</p>
            </section>

            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">Card processing fees and monthly subscription</h2>
              </div>
              <p>The card processing rate is 2.3% + $0.25 per transaction as the maximum card rate. The monthly software subscription of $10 per organization ensures that the platform infrastructure remains mission-ready, providing the security and scale required by modern nonprofits.</p>
            </section>

            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">ACH support and recurring donations</h2>
              </div>
              <p>ACH / bank transfer support is available to provide a cost-effective alternative for larger gifts. Furthermore, recurring donation support helps organizations automate weekly, monthly, or custom schedules, creating more predictable donation flows.</p>
            </section>

            <section>
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                <h2 class="text-2xl font-black uppercase tracking-tight m-0">Payout visibility and reporting tools</h2>
              </div>
              <p>Organizations can track payment activity, payout status, recurring transactions, and complete donation history from the dashboard. This visibility is crucial for institutional financial audit and stewardship.</p>
            </section>

            <!-- Feature Checklist -->
            <section class="bg-wgc-off rounded-[3rem] p-12 border border-wgc-navy-100">
               <div class="text-center mb-12">
                  <h2 class="text-2xl font-black uppercase tracking-tight m-0 mb-4 transition-all">Included in the WGC experience</h2>
                  <div class="w-16 h-1 bg-wgc-gold-500 mx-auto rounded-full"></div>
               </div>
               <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div *ngFor="let check of inclusionList" class="flex items-center gap-4 p-4 hover:bg-white hover:shadow-sm rounded-2xl transition-all group">
                     <div class="w-8 h-8 rounded-lg bg-wgc-gold-100 flex items-center justify-center text-wgc-gold-600 group-hover:bg-wgc-gold-500 group-hover:text-wgc-navy-950 transition-colors">
                        <lucide-icon [img]="check.icon" class="w-4 h-4"></lucide-icon>
                     </div>
                     <span class="text-[10px] font-black uppercase tracking-widest text-wgc-navy-900">{{ check.text }}</span>
                  </div>
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
export class PricingGuideComponent implements OnInit {
  readonly ChevronLeft = ChevronLeft;

  pricingItems = [
    'Dashboard Access',
    'Payout Visibility',
    'Recurring Payouts',
    'Historical Ledger',
    'Branded Checkout',
    'PCI Compliance'
  ];

  inclusionList = [
    { text: 'Payment Dashboard', icon: BarChart },
    { text: 'Transaction Tracking', icon: Zap },
    { text: 'Recurring Management', icon: RefreshCw },
    { text: 'Payout Visibility', icon: Landmark },
    { text: 'Branded Checkout', icon: Globe },
    { text: 'Branded Onboarding', icon: Users },
    { text: 'Embedded Forms', icon: Settings },
    { text: 'Reporting Tools', icon: FileText },
    { text: 'Direct Bank Payouts', icon: Landmark }
  ];

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Church Payment Processing Pricing Guide | WGC Payments');
    this.meta.updateTag({ name: 'description', content: 'Understand church payment processing pricing, including card transactions, ACH support, monthly subscription costs, recurring donations, and more.' });
  }
}

// Re-using icon imports
import { RefreshCw, FileText } from 'lucide-angular';
