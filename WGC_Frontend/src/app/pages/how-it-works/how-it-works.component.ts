import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { LucideAngularModule, Layers, Shield, Landmark, CreditCard, Banknote, RefreshCw, BarChart, ShieldAlert } from 'lucide-angular';
import { ScrollFadeDirective } from '../../directives/scroll-fade.directive';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, CtaSectionComponent, LucideAngularModule, ScrollFadeDirective],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
  readonly Layers = Layers;
  readonly Shield = Shield;
  readonly Landmark = Landmark;
  readonly CreditCard = CreditCard;

  paymentSteps = [
    { label: 'Donor initiates a gift', description: 'A donor taps "Give" inside your app. Your software calls the WGC API with the amount, fund, and donor payment method.' },
    { label: 'WGC authenticates the partner request', description: 'The request is validated against your Partner API key. Merchant routing and fee calculations happen in milliseconds.' },
    { label: 'Network processes the payment', description: 'WGC sends the tokenized transaction to the secure core. Card or ACH is authorized through the banking rail with full PCI compliance.' },
    { label: 'WGC fires your webhook', description: 'Your application receives a real-time event notification — payment.succeeded, payment.failed — so your UI updates instantly.' },
    { label: 'Funds settle to the church', description: 'Net proceeds move to the merchant\'s verified bank account. Settlement windows vary by rail — ACH: 1-2 days, Card: 2-3 days.' },
  ];
}

