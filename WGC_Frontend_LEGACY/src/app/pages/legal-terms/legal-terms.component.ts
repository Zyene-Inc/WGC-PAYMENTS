import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FileCheck, Shield, Scale } from 'lucide-angular';

@Component({
  selector: 'app-legal-terms',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './legal-terms.component.html',
  styleUrl: './legal-terms.component.css'
})
export class LegalTermsComponent {
  readonly FileCheck = FileCheck;
  readonly Shield = Shield;
  readonly Scale = Scale;
}
