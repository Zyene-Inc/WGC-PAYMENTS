/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'wgc-blue-50': 'var(--wgc-blue-50)',
        'wgc-blue-100': 'var(--wgc-blue-100)',
        'wgc-blue-200': 'var(--wgc-blue-200)',
        'wgc-blue-400': 'var(--wgc-blue-400)',
        'wgc-blue-500': 'var(--wgc-blue-500)',
        'wgc-blue-600': 'var(--wgc-blue-600)',
        'wgc-blue-700': 'var(--wgc-blue-700)',
        'wgc-navy-50': 'var(--wgc-navy-50)',
        'wgc-navy-100': 'var(--wgc-navy-100)',
        'wgc-navy-200': 'var(--wgc-navy-200)',
        'wgc-navy-300': 'var(--wgc-navy-300)',
        'wgc-navy-400': 'var(--wgc-navy-400)',
        'wgc-navy-500': 'var(--wgc-navy-500)',
        'wgc-navy-600': 'var(--wgc-navy-600)',
        'wgc-navy-700': 'var(--wgc-navy-700)',
        'wgc-navy-800': 'var(--wgc-navy-800)',
        'wgc-navy-900': 'var(--wgc-navy-900)',
        'wgc-navy-950': 'var(--wgc-navy-950)',
        'wgc-navy': 'var(--wgc-navy-500)',
        'wgc-white': 'var(--wgc-white)',
        'wgc-off': 'var(--wgc-off)',

        'wgc-gold-300': 'var(--wgc-gold-300)',
        'wgc-gold-500': 'var(--wgc-gold-500)',
        'wgc-gold-600': 'var(--wgc-gold-600)',
        'wgc-gold': 'var(--wgc-gold-500)',
        
        'wgc-emerald-50': 'var(--wgc-emerald-50)',
        'wgc-emerald-100': 'var(--wgc-emerald-100)',
        'wgc-emerald-200': 'var(--wgc-emerald-200)',
        'wgc-emerald-400': 'var(--wgc-emerald-400)',
        'wgc-emerald-500': 'var(--wgc-emerald-500)',
        'wgc-emerald-600': 'var(--wgc-emerald-600)',
        'wgc-emerald-700': 'var(--wgc-emerald-700)',

        'wgc-success': 'var(--wgc-success)',
        'wgc-warning': 'var(--wgc-warning)',
        'wgc-error': 'var(--wgc-error)',
      },
      boxShadow: {
        'premium': 'var(--wgc-shadow-premium)',
        'gold-glow': 'var(--wgc-glow-gold)',
        'navy-glow': '0 0 25px rgba(15, 23, 42, 0.1)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

