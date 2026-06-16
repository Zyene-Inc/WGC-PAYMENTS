"use client";

import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wgc-gold-50 border border-wgc-gold-500/10 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-wgc-gold-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-wgc-gold-600 uppercase tracking-[0.3em] font-mono">Registry Phase 01</span>
           </div>
           <h1 className="text-4xl font-bold text-wgc-navy-900 tracking-tight">Onboarding Application Portal</h1>
           <p className="text-slate-500 font-medium tracking-tight mt-2 opacity-80 italic">Establish your ministry settlement rails securely with WGC infrastructure.</p>
        </div>
        
        <OnboardingForm />
      </div>
    </div>
  );
}
