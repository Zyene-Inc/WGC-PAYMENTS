import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationComponent } from './components/ui/notification/notification.component';
import { ModalComponent } from './components/ui/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent, ModalComponent],
  template: `
    <app-notification></app-notification>
    <app-modal></app-modal>
    <app-header *ngIf="showShell()"></app-header>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="showShell()"></app-footer>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  router = inject(Router);

  showShell(): boolean {
    const url = this.router.url;
    return !url.startsWith('/dashboard') && !url.startsWith('/login') && !url.startsWith('/register');
  }
}

