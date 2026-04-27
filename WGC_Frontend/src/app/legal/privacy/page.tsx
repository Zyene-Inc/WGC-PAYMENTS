import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollFade from "@/components/ui/ScrollFade";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white font-sans">
        {/* MINISTRY HERO */}
        <section className="relative bg-white pt-32 pb-24 overflow-hidden border-b border-wgc-navy-800 text-center">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg className="w-full h-full" fill="none">
              <pattern id="legal-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#legal-grid)" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none text-[20rem] font-bold text-wgc-gold-500 leading-none">✝</div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollFade>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-wgc-gold-500/30 bg-wgc-gold-500/10 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-wgc-gold-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wgc-gold-500/90 font-mono">Data Sovereignty Protocol</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6 text-wgc-navy-900">
                Privacy <span className="text-wgc-gold-500">Policy</span>
              </h1>
              <p className="text-[11px] font-bold text-wgc-navy-400 uppercase tracking-[0.4em] mb-10 font-mono">Ministry Data Stewardship Ledger</p>
            </ScrollFade>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollFade>
              <div className="flex items-center justify-between mb-16 pb-8 border-b border-wgc-navy-100 font-mono">
                <div className="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest">Version: 2026.04.A</div>
                <div className="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest italic opacity-70">Effective: April 20, 2026</div>
              </div>

              <div className="text-wgc-navy-900 space-y-16 tracking-tight opacity-90">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">Ministry Commitment</h2>
                  </div>
                  <p className="leading-relaxed font-medium text-wgc-navy-600">
                    Way Point Gateway Collective (WGC) was built on the foundation of radical transparency. As an infrastructure provider serving mission-critical software, we recognize that the data flowing through our rails represents the stewardship of the global Church. We treat this data with the reverence and security it deserves.
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">01. Data Governance</h2>
                  </div>
                  <p className="leading-relaxed mb-6 font-medium text-wgc-navy-600">
                    Unlike traditional processors, WGC does not view donors as &quot;leads&quot; or &quot;customers.&quot; Donors belong to the Church, and the merchant relationship belongs to you, our software partner.
                  </p>
                  <ul className="space-y-4 font-medium text-wgc-navy-600">
                     <li className="flex items-start gap-4">
                       <div className="w-5 h-5 rounded bg-wgc-gold-500/10 flex items-center justify-center text-wgc-gold-600 mt-1 flex-shrink-0 border border-wgc-gold-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-wgc-gold-600"></div>
                       </div>
                       <span>We do not sell, rent, or trade donor lists to third parties for marketing purposes.</span>
                     </li>
                     <li className="flex items-start gap-4">
                       <div className="w-5 h-5 rounded bg-wgc-gold-500/10 flex items-center justify-center text-wgc-gold-600 mt-1 flex-shrink-0 border border-wgc-gold-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-wgc-gold-600"></div>
                       </div>
                       <span>We collect only the minimum data required to process ministry payments and satisfy global anti-money laundering (AML) regulations.</span>
                     </li>
                  </ul>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">02. Transferable Vault</h2>
                  </div>
                  <p className="leading-relaxed font-medium text-wgc-navy-600">
                    WGC operates under a protocol of <strong>Vault Sovereignty</strong>. This means that at any point, a software partner may request a PCI-compliant transfer of their merchant and payment token data to another processor. We do not use technical lock-in as a business strategy.
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-8 bg-wgc-gold-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold tracking-tight m-0">03. Security Standards</h2>
                  </div>
                  <p className="leading-relaxed font-medium text-wgc-navy-600">
                    All data is processed using AES-256 encryption within a PCI Level 1 compliant environment. Our internal access controls follow the principle of least privilege, ensuring that only necessary ministry personnel can interact with sensitive systems.
                  </p>
                </section>
              </div>

              {/* FAQ Summary Card */}
              <div className="mt-24 p-10 bg-wgc-off rounded-[2.5rem] border border-wgc-navy-100 shadow-sm">
                 <h4 className="text-xl font-bold text-wgc-navy-900 mb-4 tracking-tight">Privacy Questions?</h4>
                 <p className="text-wgc-navy-500 mb-6 font-medium leading-relaxed tracking-tight opacity-80">
                   For full detailed data processing agreements or specific privacy inquiries related to your software integration, please contact our governance team.
                 </p>
                 <a href="mailto:governance@wgcpayments.com" className="text-wgc-gold-600 font-bold text-xs uppercase tracking-widest hover:text-black transition-colors font-mono">governance@wgcpayments.com</a>
              </div>
            </ScrollFade>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
