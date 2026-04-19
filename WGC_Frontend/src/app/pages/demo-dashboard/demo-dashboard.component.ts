import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, DollarSign, Users, PiggyBank, Briefcase, ChevronRight, UploadCloud, ArrowRight, Loader2 } from 'lucide-angular';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

@Component({
  selector: 'app-demo-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './demo-dashboard.component.html',
  styleUrl: './demo-dashboard.component.css'
})
export class DemoDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  readonly DollarSign = DollarSign;
  readonly Users = Users;
  readonly PiggyBank = PiggyBank;
  readonly Briefcase = Briefcase;
  readonly ChevronRight = ChevronRight;
  readonly UploadCloud = UploadCloud;
  readonly ArrowRight = ArrowRight;
  readonly LoaderIcon = Loader2;

  stats = signal<DashboardStats['data'] | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading.set(true);
    this.dashboardService.getStats().subscribe({
      next: (response) => {
        this.stats.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load live data.');
        this.isLoading.set(false);
      }
    });
  }
}
