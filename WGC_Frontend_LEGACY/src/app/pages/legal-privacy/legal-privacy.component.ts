import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShieldCheck, Lock, Eye } from 'lucide-angular';

@Component({
  selector: 'app-legal-privacy',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './legal-privacy.component.html',
  styleUrl: './legal-privacy.component.css'
})
export class LegalPrivacyComponent {
  readonly ShieldCheck = ShieldCheck;
  readonly Lock = Lock;
  readonly Eye = Eye;
}
