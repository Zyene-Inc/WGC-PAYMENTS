import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollFade from "@/components/ui/ScrollFade";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white font-sans">
        {/* MINISTRY HERO */}
        <section className="relative bg-white pt-32 pb-24 overflow-hidden border-b border-wgc-navy-800 text-center">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg className="w-full h-full" fill="none">
              <pattern id="terms-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#terms-grid)" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none text-[20rem] font-bold text-wgc-gold-500 leading-none">✝</div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollFade>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-wgc-gold-500/30 bg-wgc-gold-500/10 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-wgc-gold-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wgc-gold-500/90 font-mono">Kingdom Governance</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6 text-wgc-navy-900">
                Terms of <span className="text-wgc-gold-500">Service</span>
              </h1>
              <p className="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-[0.4em] mb-10 font-mono">Software Partner Master Agreement</p>
            </ScrollFade>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollFade>
              <div className="text-wgc-navy-900 space-y-16 tracking-tight opacity-90">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">1. Acceptance of Terms</h2>
                  </div>
                  <p className="leading-relaxed">
                    By accessing or using the Way Point Gateway Collective (WGC) payment processing infrastructure, its APIs, and dashboard (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service. WGC operates exclusively as a B2B infrastructure provider for software companies (&quot;Partners&quot;) serving the Church and nonprofit sectors.
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">2. Nature of the Relationship</h2>
                  </div>
                  <p className="leading-relaxed mb-6">
                    WGC acts as a technical orchestration layer between your software platform and financial institutions. 
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3">
                       <div className="w-5 h-5 rounded bg-wgc-gold-500/10 flex items-center justify-center text-wgc-gold-600 mt-1 flex-shrink-0 border border-wgc-gold-500/20">
                         <span className="text-[10px] uppercase font-bold font-mono">A</span>
                       </div>
                       <span><strong>White-Label Responsibility:</strong> You are responsible for the first-tier support and pricing communication for your merchants.</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="w-5 h-5 rounded bg-wgc-gold-500/10 flex items-center justify-center text-wgc-gold-600 mt-1 flex-shrink-0 border border-wgc-gold-500/20">
                         <span className="text-[10px] uppercase font-bold font-mono">B</span>
                       </div>
                       <span><strong>Merchant Conduct:</strong> You agree to only onboard mission-aligned entities that comply with WGC&apos;s ethical and religious service guidelines.</span>
                     </li>
                  </ul>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">3. Fee Orchestration</h2>
                  </div>
                  <p className="leading-relaxed font-bold italic mb-6 text-wgc-gold-600">
                     The standard platform fee structure is 2.3% + $0.25 per successful transaction.
                  </p>
                  <p className="leading-relaxed">
                    Fees are automatically deducted at the point of sale via WGC&apos;s automated settlement logic. Partners can configure their own markups or platform fees within the WGC Dashboard, and these will be disbursed according to the agreed-upon payout schedule.
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">4. Settlement & Payouts</h2>
                  </div>
                  <p className="leading-relaxed">
                    Card settlements typically follow a T+2 business day schedule. ACH settlements may take up to 3-5 business days depending on the processing bank. WGC reserves the right to delay payouts or hold reserves in the event of high refund/chargeback activity or suspected ministry risk.
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">5. Mission Alignment</h2>
                  </div>
                  <p className="leading-relaxed italic text-wgc-navy-600 opacity-80">
                    &quot;Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.&quot; (Colossians 3:23)
                  </p>
                  <p className="leading-relaxed">
                    WGC is committed to serving the Kingdom. We reserve the right to terminate service for any partner whose software or primary use case actively opposes or undermines the mission of the churches we serve.
                  </p>
                </section>
              </div>

              <div className="mt-20 pt-10 border-t border-wgc-navy-100 flex items-center justify-between">
                <p className="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-widest font-mono">© 2026 Way Point Gateway Collective</p>
                <p className="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-widest font-mono">governance@wgcpayments.com</p>
              </div>
            </ScrollFade>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
