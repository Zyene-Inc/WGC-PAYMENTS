import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShieldCheck, Landmark, Lock, FileCheck } from 'lucide-angular';

@Component({
  selector: 'app-legal-compliance',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './legal-compliance.component.html'
})
export class LegalComplianceComponent {
  readonly ShieldCheck = ShieldCheck;
  readonly Landmark = Landmark;
  readonly Lock = Lock;
  readonly FileCheck = FileCheck;
}
