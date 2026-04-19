import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { LucideAngularModule, Palette, Repeat, Landmark, UserPlus, FileSpreadsheet, Webhook, ChevronDown, ChevronUp, ArrowRight } from 'lucide-angular';

import { ScrollFadeDirective } from '../../directives/scroll-fade.directive';

@Component({
  selector: 'app-software-partners',
  standalone: true,
  imports: [CommonModule, RouterLink, FeatureCardComponent, CtaSectionComponent, LucideAngularModule, ScrollFadeDirective],
  templateUrl: './software-partners.component.html',
  styleUrl: './software-partners.component.css'
})
export class SoftwarePartnersComponent implements OnInit {
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly ArrowRight = ArrowRight;
  
  constructor(@Inject(DOCUMENT) private document: Document) {}

  faqs = [
    { q: "How does WGC compare to Stripe for nonprofits?", a: "WGC was built specifically for the church and nonprofit software ecosystem. While Stripe focuses on broad e-commerce, we offer flat-rate ACH natively, a transferable donor vault, and robust church-first integration features not found in generic platforms." },
    { q: "Can I white-label church payment processing?", a: "Yes. WGC is built embed-first. Software platforms can launch payments fully embedded within their ChMS using our pre-built modules or our strictly typed REST API, ensuring the church only ever sees your brand." },
    { q: "What are WGC's fees for 501(c)(3) organizations?", a: "We believe generously should flow freely. WGC offers transparent, flat-rate pricing well below industry standards, including a 0.5% flat-rate ACH capped at $5." },
    { q: "How fast are payouts to churches?", a: "Donations are processed efficiently and payouts are typically routed for next-business-day settlement directly to the church’s depository account." },
    { q: "Is WGC PCI compliant?", a: "Absolutely. WGC operates at PCI-DSS Level 1. Credit card data is rigorously vaulted and never directly touches your software application server, eliminating your PCI liability." },
    { q: "How do I migrate from Tithe.ly or Pushpay?", a: "Our dedicated engineering team guides the data migration processes to safely transition vaulted payment methods over to your new platform securely." }
  ];

  openFaq: string | null = null;
  toggleFaq(question: string) {
    this.openFaq = this.openFaq === question ? null : question;
  }

  ngOnInit() {
    this.injectFaqSchema();
  }

  private injectFaqSchema() {
    const existingScript = this.document.head.querySelector('#faq-schema');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": this.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };

    const script = this.document.createElement('script');
    script.id = 'faq-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  features = [
    { icon: Palette, title: 'White-label payments', description: 'Fully embed payments into your platform. Your brand, your experience, our infrastructure.' },
    { icon: Repeat, title: 'Recurring giving system', description: 'A robust engine specifically designed for church pledges, tithes, and automated schedules.' },
    { icon: Landmark, title: 'ACH optimization', description: 'Flat-rate ACH processing passed at cost to ensure maximum funds reach the ministry.' },
    { icon: UserPlus, title: 'Merchant onboarding', description: 'Automated, white-labeled KYC and underwriting tailored for 501(c)(3) organizations.' },
    { icon: FileSpreadsheet, title: 'Payout & reporting system', description: 'Next-day settlements natively synced to your CRM for seamless reconciliation.' },
    { icon: Webhook, title: 'Webhooks and APIs', description: 'Developer-first SDK with strict typings, robust sandboxing, and real-time event streaming.' }
  ];

  codeSnippet = `// Process a donation through WGC
const donation = await wgc.donations.create({
  merchantId: 'mch_firstbaptist',
  amount: 10000,  // $100.00
  fund: 'general',
  paymentToken: token,
  donor: { email: 'donor@example.com' }
});`;
}
