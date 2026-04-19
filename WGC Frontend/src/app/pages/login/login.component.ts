import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-wgc-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a routerLink="/" class="inline-flex items-center mb-10 cursor-pointer group">
          <!-- New Primary WGC Logo Asset -->
          <div class="h-14 w-auto transform transition-all duration-300">
            <img src="/wgc-brand-final.png" alt="WGC Payments" class="h-full w-auto object-contain">
          </div>
        </a>
        <a routerLink="/" class="inline-flex items-center mb-6 text-xs font-bold text-wgc-navy-400 hover:text-wgc-navy-900 transition-all uppercase tracking-widest group">
          <lucide-icon [img]="ArrowLeft" class="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform"></lucide-icon>
          Back to Home
        </a>
        <h2 class="text-3xl font-extrabold text-wgc-navy-900 tracking-tight">Sign in to your account</h2>
        <p class="mt-3 text-sm text-wgc-navy-400 font-medium">
          Or
          <a routerLink="/register" class="text-wgc-gold-600 hover:text-wgc-gold-500 font-bold transition-colors">create a new account</a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div class="bg-wgc-white py-8 px-6 shadow-xl border border-wgc-gray-100 rounded-xl sm:px-10">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-xs font-bold text-wgc-navy-400 uppercase tracking-widest mb-2">Email address</label>
              <div class="mt-1">
                <input id="email" type="email" formControlName="email" autocomplete="email" required
                  placeholder="name&#64;church.org"
                  class="appearance-none block w-full px-4 py-3 border border-wgc-navy-100 rounded-xl shadow-sm placeholder-wgc-navy-200 focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 sm:text-sm bg-wgc-off/50">
              </div>
              <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']" class="mt-1 text-xs text-red-600">
                Please enter a valid email address.
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-wgc-gray-700">Password</label>
              <div class="mt-1">
                <input id="password" type="password" formControlName="password" autocomplete="current-password" required
                  class="appearance-none block w-full px-3 py-2 border border-wgc-gray-300 rounded-md shadow-sm placeholder-wgc-gray-400 focus:outline-none focus:ring-wgc-blue-500 focus:border-wgc-blue-500 sm:text-sm">
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox"
                  class="h-4 w-4 text-wgc-blue-600 focus:ring-wgc-blue-500 border-wgc-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-wgc-gray-900">Remember me</label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-wgc-blue-600 hover:text-wgc-blue-500">Forgot your password?</a>
              </div>
            </div>

            <div *ngIf="errorMessage()" class="p-3 rounded-md bg-red-50 text-sm text-red-600 border border-red-100">
              {{ errorMessage() }}
            </div>

            <div>
              <button type="submit" [disabled]="loginForm.invalid || isLoading()"
                class="w-full flex justify-center py-3 px-4 metallic-gold rounded-xl shadow-lg text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                <span *ngIf="!isLoading()">Sign in</span>
                <span *ngIf="isLoading()" class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4 text-wgc-navy-900" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  readonly ArrowLeft = ArrowLeft;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.user.role === 'church_admin') {
            this.router.navigate(['/dashboard/church']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Invalid email or password');
        }
      });
    }
  }
}
