import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Code, Webhook, Zap, Shield, Database, Layout, Menu, X } from 'lucide-angular';
import { ScrollFadeDirective } from '../../directives/scroll-fade.directive';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    LucideAngularModule,
    ScrollFadeDirective,
    CtaSectionComponent
  ],
  templateUrl: './developers.component.html'
})
export class DevelopersComponent {
  readonly Code = Code;
  readonly Webhook = Webhook;
  readonly Zap = Zap;
  readonly Shield = Shield;
  readonly Database = Database;
  readonly Layout = Layout;

  activeSection = 'introduction';

  sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'merchants', label: 'Merchant Onboarding' },
    { id: 'payments', label: 'Payments & Charges' },
    { id: 'recurring', label: 'Recurring Engine' },
    { id: 'webhooks', label: 'Webhooks' }
  ];

  scrollTo(id: string) {
    this.activeSection = id;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
