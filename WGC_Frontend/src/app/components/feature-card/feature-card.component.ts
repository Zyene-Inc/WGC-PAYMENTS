import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.css'
})
export class FeatureCardComponent {
  @Input() icon: any;
  @Input() title!: string;
  @Input() description!: string;
}
