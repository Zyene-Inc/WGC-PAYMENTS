import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-wgc-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="flex flex-col items-center justify-center mb-10 w-full">
          <a routerLink="/" class="block cursor-pointer group">
            <!-- Institutional WGC Logo (SVG) -->
            <div class="h-24 w-auto transform transition-all duration-500 group-hover:scale-105">
              <img src="/wgc-logo.svg" alt="Waypoint Gateway Collective" class="h-full w-auto object-contain">
            </div>
          </a>
        </div>
        <h2 class="text-3xl font-extrabold text-wgc-navy-900 tracking-tight">Create your account</h2>
        <p class="mt-3 text-sm text-wgc-navy-400 font-medium">
          Or
          <a routerLink="/login" class="text-wgc-gold-600 hover:text-wgc-gold-500 font-bold transition-colors">sign in to existing account</a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div class="bg-wgc-white py-8 px-6 shadow-xl border border-wgc-gray-100 rounded-xl sm:px-10">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-xs font-bold text-wgc-navy-400 uppercase tracking-widest mb-2">Email address</label>
              <div class="mt-1">
                <input id="email" type="email" formControlName="email" autocomplete="email" required
                  placeholder="name&#64;church.org"
                  class="appearance-none block w-full px-4 py-3 border border-wgc-navy-100 rounded-xl shadow-sm placeholder-wgc-navy-200 focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 sm:text-sm bg-wgc-off/50">
              </div>
              <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors" class="mt-1 text-xs text-red-600">
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email address.</span>
                <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required.</span>
              </div>
            </div>

            <div>
              <label for="password" class="block text-xs font-bold text-wgc-navy-400 uppercase tracking-widest mb-2">Password</label>
              <div class="mt-1">
                <input id="password" type="password" formControlName="password" autocomplete="new-password" required
                  placeholder="••••••••"
                  class="appearance-none block w-full px-4 py-3 border border-wgc-navy-100 rounded-xl shadow-sm placeholder-wgc-navy-200 focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 sm:text-sm bg-wgc-off/50">
              </div>
              <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors" class="mt-1 text-xs text-red-600">
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters.</span>
              </div>
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-wgc-gray-700">I am a...</label>
              <div class="mt-1">
                <select id="role" formControlName="role" 
                  class="block w-full px-3 py-2 border border-wgc-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wgc-blue-500 focus:border-wgc-blue-500 sm:text-sm">
                  <option value="partner_admin">Software Partner</option>
                  <option value="church_admin">Church Administrator</option>
                </select>
              </div>
            </div>

            <div class="flex items-center">
              <input id="terms" name="terms" type="checkbox" required
                class="h-4 w-4 text-wgc-blue-600 focus:ring-wgc-blue-500 border-wgc-gray-300 rounded">
              <label for="terms" class="ml-2 block text-sm text-wgc-gray-900">
                I agree to the <a href="#" class="text-wgc-blue-600">Terms</a> and <a href="#" class="text-wgc-blue-600">Privacy Policy</a>
              </label>
            </div>

            <div *ngIf="errorMessage()" class="p-3 rounded-md bg-red-50 text-sm text-red-600 border border-red-100">
              {{ errorMessage() }}
            </div>

            <div>
              <button type="submit" [disabled]="registerForm.invalid || isLoading()"
                class="w-full flex justify-center py-3 px-4 metallic-gold rounded-xl shadow-lg text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                <span *ngIf="!isLoading()">Create account</span>
                <span *ngIf="isLoading()" class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4 text-wgc-navy-900" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  readonly ArrowLeft = ArrowLeft;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['partner_admin', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to create account. Please try again.');
        }
      });
    }
  }
}
