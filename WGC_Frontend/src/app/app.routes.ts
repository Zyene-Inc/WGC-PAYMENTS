import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'software-partners',
    loadComponent: () => import('./pages/software-partners/software-partners.component').then(c => c.SoftwarePartnersComponent)
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./pages/how-it-works/how-it-works.component').then(c => c.HowItWorksComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing.component').then(c => c.PricingComponent)
  },
  {
    path: 'demo/donation',
    loadComponent: () => import('./pages/demo-donation/demo-donation.component').then(c => c.DemoDonationComponent)
  },
  {
    path: 'demo/church-dashboard',
    loadComponent: () => import('./pages/demo-dashboard/demo-dashboard.component').then(c => c.DemoDashboardComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(c => c.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(c => c.ContactComponent)
  },
  {
    path: 'legal/terms',
    loadComponent: () => import('./pages/legal-terms/legal-terms.component').then(c => c.LegalTermsComponent)
  },
  {
    path: 'legal/privacy',
    loadComponent: () => import('./pages/legal-privacy/legal-privacy.component').then(c => c.LegalPrivacyComponent)
  },
  {
    path: 'legal/compliance',
    loadComponent: () => import('./pages/legal-compliance/legal-compliance.component').then(c => c.LegalComplianceComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'logout',
    loadComponent: () => import('./pages/logout/logout.component').then(c => c.LogoutComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/layout/dashboard-layout.component').then(c => c.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/home/dashboard-home.component').then(c => c.DashboardHomeComponent)
      },
      {
        path: 'merchants',
        loadComponent: () => import('./pages/dashboard/merchants/merchants.component').then(c => c.MerchantsComponent)
      },
      {
        path: 'merchants/:id',
        loadComponent: () => import('./pages/dashboard/merchants/merchant-detail.component').then(c => c.MerchantDetailComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/dashboard/payments/payments.component').then(c => c.PaymentsComponent)
      },
      {
        path: 'recurring',
        loadComponent: () => import('./pages/dashboard/recurring/recurring-payments.component').then(c => c.RecurringPaymentsComponent)
      },
      {
        path: 'payouts',
        loadComponent: () => import('./pages/dashboard/payouts/payouts.component').then(c => c.PayoutsComponent)
      },
      {
        path: 'migration',
        loadComponent: () => import('./pages/dashboard/migration/migration-center.component').then(c => c.MigrationCenterComponent)
      },
      {
        path: 'migration/upload',
        loadComponent: () => import('./pages/dashboard/migration/migration-upload.component').then(c => c.MigrationUploadComponent)
      },
      {
        path: 'migration/jobs/:id',
        loadComponent: () => import('./pages/dashboard/migration/migration-job-detail.component').then(c => c.MigrationJobDetailComponent)
      },
      {
        path: 'billing',
        loadComponent: () => import('./pages/dashboard/billing/billing-balance.component').then(c => c.BillingBalanceComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/dashboard/settings/dashboard-settings.component').then(c => c.DashboardSettingsComponent)
      }
    ]
  },
  {
    path: 'dashboard/church',
    loadComponent: () => import('./pages/dashboard/church/layout/church-layout.component').then(c => c.ChurchLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/church/overview/church-overview.component').then(c => c.ChurchOverviewComponent)
      },
      {
        path: 'donations',
        loadComponent: () => import('./pages/dashboard/church/donations/church-donations.component').then(c => c.ChurchDonationsComponent)
      },
      {
        path: 'donors',
        loadComponent: () => import('./pages/dashboard/church/donors/church-donors.component').then(c => c.ChurchDonorsComponent)
      },
      {
        path: 'donors/:id',
        loadComponent: () => import('./pages/dashboard/church/donors/church-donor-detail.component').then(c => c.ChurchDonorDetailComponent)
      },
      {
        path: 'recurring',
        loadComponent: () => import('./pages/dashboard/church/recurring/church-recurring.component').then(c => c.ChurchRecurringComponent)
      },
      {
        path: 'payouts',
        loadComponent: () => import('./pages/dashboard/church/payouts/church-payouts.component').then(c => c.ChurchPayoutsComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./pages/dashboard/church/transactions/church-transactions.component').then(c => c.ChurchTransactionsComponent)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('./pages/dashboard/church/campaigns/church-campaigns.component').then(c => c.ChurchCampaignsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/dashboard/church/reports/church-reports.component').then(c => c.ChurchReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/dashboard/church/settings/church-settings.component').then(c => c.ChurchSettingsComponent)
      },
      {
        path: 'fees',
        loadComponent: () => import('./pages/dashboard/church/fees/church-fees.component').then(c => c.ChurchFeesComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/dashboard/church/support/church-support.component').then(c => c.ChurchSupportComponent)
      }
    ]
  },
  {
    path: 'give/:churchSlug',
    loadComponent: () => import('./pages/checkout/donor-checkout.component').then(c => c.DonorCheckoutComponent)
  },
  {
    path: 'developers',
    loadComponent: () => import('./pages/developers/developers.component').then(c => c.DevelopersComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
