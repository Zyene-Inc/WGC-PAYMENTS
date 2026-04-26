import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CodeXml, Heart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-angular';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { RouterLink } from '@angular/router';
import { ScrollFadeDirective } from '../../directives/scroll-fade.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FeatureCardComponent, CtaSectionComponent, RouterLink, ScrollFadeDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly CodeXml = CodeXml;
  readonly Heart = Heart;
  readonly ShieldCheck = ShieldCheck;
  readonly ArrowRight = ArrowRight;
  readonly CheckCircle2 = CheckCircle2;
  
  features = [
    {
      icon: CodeXml,
      title: 'Software-First Platform',
      description: 'We don\'t compete with your product. We power it. WGC is infrastructure — invisible to your users, powerful for your business.'
    },
    {
      icon: Heart,
      title: 'Faith-Aligned Stewardship',
      description: 'Every transaction moves resources toward ministry. Our platform is built with the understanding that this money funds the Kingdom.'
    },
    {
      icon: ShieldCheck,
      title: 'Transparent & Trustworthy',
      description: 'Honest pricing. Clear contracts. A transferable vault. Your merchants trust you — and we help you keep that trust.'
    }
  ];
}
