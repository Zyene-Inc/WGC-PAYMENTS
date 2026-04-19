export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
    },
    donate: '/payments/donate',
    dashboard: {
      summary: '/dashboard/summary',
      merchants: '/dashboard/merchants',
      merchantDetail: (id: string) => `/dashboard/merchants/${id}`,
      payments: '/dashboard/payments',
      recurring: '/dashboard/recurring',
      payouts: '/dashboard/payouts',
    },
    onboarding: '/onboarding/request',
    migrationCenter: {
      summary: '/migration-center/summary',
      jobs: '/migration-center/jobs',
      jobDetail: (id: string) => `/migration-center/jobs/${id}`,
      validate: (id: string) => `/migration-center/jobs/${id}/validate`,
      mapping: (id: string) => `/migration-center/jobs/${id}/mapping`,
      preview: (id: string) => `/migration-center/jobs/${id}/preview`,
      confirm: (id: string) => `/migration-center/jobs/${id}/confirm`,
    },
    church: {
      summary: '/church/summary',
      donations: '/church/donations',
      donors: '/church/donors',
      donorDetail: (id: string) => `/church/donors/${id}`,
      recurring: '/church/recurring',
      payouts: '/church/payouts',
      settings: '/church/settings',
      transactions: '/church/transactions',
      campaigns: '/church/campaigns',
      reports: '/church/reports',
      support: '/church/support',
    },
    checkout: {
      info: (slug: string) => `/checkout/${slug}`,
      donate: (slug: string) => `/checkout/${slug}/donate`,
    }
  }
};
