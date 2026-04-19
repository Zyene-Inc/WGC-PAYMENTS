import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail } from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  readonly Mail = Mail;
}
