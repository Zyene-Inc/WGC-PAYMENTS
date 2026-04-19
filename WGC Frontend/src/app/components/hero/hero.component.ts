import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  @Input() eyebrow?: string;
  @Input() headline!: string;
  @Input() subheadline!: string;
  
  @Input() primaryCtaText?: string;
  @Input() primaryCtaLink?: string;
  
  @Input() secondaryCtaText?: string;
  @Input() secondaryCtaLink?: string;
  
  @Input() bgStyle: 'default' | 'transparent' | 'gradient' = 'default';
  
  // Content projection is used for the right-side visual
}
