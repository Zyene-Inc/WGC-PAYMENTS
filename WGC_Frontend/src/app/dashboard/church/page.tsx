"use client";

import { useState, useEffect } from "react";
import ChurchDashboardLayout from "@/components/dashboard/ChurchDashboardLayout";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Landmark, 
  Activity, 
  Wallet, 
  Info, 
  ArrowRight, 
  Download,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for church console
const MOCK_SUMMARY = {
  grossVolume: 4256050, // $42,560.50
  totalFees: 98025, // $980.25
  netDeposited: 4158025, // $41,580.25
  pending: 125000, // $1,250.00
  nextPayout: "Apr 25, 2026",
};

const MONEY_FLOW_STEPS = [
  { label: 'Gross Donations', value: '$42,560.50', icon: Wallet, color: 'text-wgc-navy-900' },
  { label: 'Processing (Card/ACH)', value: '-$850.12', icon: CreditCard, color: 'text-red-500' },
  { label: 'Platform Fee', value: '-$130.13', icon: Activity, color: 'text-red-500' },
  { label: 'Adjustments', value: '$0.00', icon: AlertTriangle, color: 'text-wgc-navy-400' },
  { label: 'Net Deposit', value: '$41,580.25', icon: Landmark, color: 'text-wgc-gold-600' }
];

const INSIGHTS = [
  { type: 'savings', title: 'ACH Opportunity', message: 'Switching to ACH for recurring donors could save your ministry $142.50 this month.', icon: Landmark },
  { type: 'alert', title: 'Fee Tracking', message: 'Your effective fee rate increased by 0.2% due to higher international card usage.', icon: TrendingUp },
  { type: 'savings', title: 'Optimizer', message: 'Highest cost method this week: Physical Card Entries. Encourage online giving.', icon: CreditCard }
];

export default function ChurchDashboardPage() {
  const [summary, setSummary] = useState<typeof MOCK_SUMMARY | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSummary(MOCK_SUMMARY);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <ChurchDashboardLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12 font-sans">
        {/* 1. FINANCIAL SUMMARY STRIP */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-wgc-navy-950/5 border border-wgc-navy-100/40 relative group overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-wgc-gold-500/5 blur-3xl pointer-events-none group-hover:bg-wgc-gold-500/10 transition-all duration-1000"></div>
          
          <div className="relative flex flex-wrap items-center justify-between gap-12 px-4 py-2">
             {[
               { label: 'Gross Volume', value: formatCurrency(summary?.grossVolume || 0), info: true },
               { label: 'Total Fees', value: formatCurrency(summary?.totalFees || 0) },
               { label: 'Net Deposited', value: formatCurrency(summary?.netDeposited || 0), highlight: true },
               { label: 'Pending', value: formatCurrency(summary?.pending || 0), subValue: 'Awaiting sync' },
               { label: 'Next Payout', value: summary?.nextPayout || '—' }
             ].map((item, i) => (
               <div key={item.label} className="flex flex-col">
                  <span className="text-[10px] font-bold text-wgc-navy-300 uppercase tracking-[0.25em] mb-3 flex items-center gap-1.5 leading-none font-mono">
                    {item.label}
                    {item.info && <Info className="w-2.5 h-2.5 opacity-40" />}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-xl font-bold tracking-tight leading-none",
                      item.highlight ? "text-wgc-gold-600" : "text-wgc-navy-900"
                    )}>
                      {item.value}
                    </span>
                    {item.subValue && <span className="text-[9px] font-bold text-wgc-navy-300 uppercase tracking-widest opacity-60 font-mono">{item.subValue}</span>}
                  </div>
               </div>
             ))}

             <div className="h-12 w-px bg-wgc-navy-50 hidden xl:block"></div>

             {/* Performance Mark */}
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-wgc-navy-300 uppercase tracking-[0.25em] mb-3 leading-none font-mono">Performance Mark</span>
                <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-wgc-navy-50 shadow-2xl">
                   <div className="w-1.5 h-1.5 rounded-full bg-wgc-gold-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-wgc-gold-500 tracking-widest uppercase font-mono">0.00% Net Fee</span>
                </div>
             </div>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wgc-gold-50 border border-wgc-gold-500/10">
              <div className="w-1 h-1 rounded-full bg-wgc-gold-500"></div>
              <span className="text-[9px] font-bold text-wgc-gold-600 uppercase tracking-[0.3em] font-mono">Kingdom Infrastructure</span>
            </div>
            <h2 className="text-4xl font-bold text-wgc-navy-900 tracking-tight leading-none">Hub Intelligence</h2>
            <p className="text-[11px] font-medium text-wgc-navy-400 uppercase tracking-[0.15em] italic font-mono">Real-time stewardship monitoring & cost-efficiency modeling.</p>
          </div>
          <button className="flex items-center px-10 py-4 bg-white border border-wgc-navy-100 text-wgc-navy-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transform transition-all hover:bg-black hover:text-wgc-navy-900 hover:border-black active:scale-95 shadow-sm font-mono">
            <Download className="w-4 h-4 mr-3" /> Export Ledger
          </button>
        </div>

        {/* 2. MONEY FLOW VISUALIZATION */}
        <div className="bg-white border border-wgc-navy-100/60 rounded-[3rem] p-12 shadow-2xl shadow-wgc-navy-950/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-wgc-gold-500 via-amber-600 to-wgc-gold-500"></div>
           
           <div className="flex items-center justify-between mb-16 px-4">
              <div>
                 <h3 className="text-2xl font-bold text-wgc-navy-900 tracking-tight">Institutional Money Flow</h3>
                 <footer className="flex items-center gap-3 mt-3">
                    <div className="w-10 h-px bg-wgc-gold-500/30"></div>
                    <span className="text-[10px] font-bold text-wgc-gold-600 uppercase tracking-[0.3em] font-mono">Full Transparency Engine</span>
                 </footer>
              </div>
              <div className="w-14 h-14 rounded-[1.5rem] border border-wgc-navy-100 flex items-center justify-center text-wgc-navy-300 bg-wgc-off shadow-inner">
                 <Activity className="w-7 h-7" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {MONEY_FLOW_STEPS.map((step, i) => (
                <div key={i} className="relative">
                   <div className="bg-wgc-off border border-wgc-navy-100/40 rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-wgc-navy-950/5 hover:-translate-y-1 group">
                      <span className="text-[9px] font-bold text-wgc-navy-400 uppercase tracking-[0.3em] block mb-8 leading-none font-mono opacity-60">{step.label}</span>
                      <div className="flex items-center justify-between">
                         <span className={cn("text-xl font-bold tracking-tighter", step.color)}>{step.value}</span>
                         <step.icon className={cn("w-5 h-5", step.color)} />
                      </div>
                   </div>
                   {i < 4 && (
                     <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block text-wgc-navy-100 z-20">
                        <ArrowRight className="w-5 h-5 opacity-30" />
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* 3. SMART INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-2">
          {INSIGHTS.map((insight, i) => (
            <div key={i} className="bg-white border border-wgc-navy-100/60 rounded-[2.5rem] p-10 shadow-lg shadow-wgc-navy-950/5 group hover:border-wgc-gold-500/30 transition-all">
               <div className="flex items-center gap-5 mb-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-wgc-gold-500/10",
                    insight.type === 'savings' ? 'bg-wgc-gold-50 text-wgc-gold-600' : 'bg-red-50 text-red-500'
                  )}>
                     <insight.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-[11px] font-bold text-wgc-navy-900 uppercase tracking-[0.25em] leading-tight font-mono">{insight.title}</h4>
               </div>
               <p className="text-sm font-medium text-wgc-navy-400 leading-relaxed italic tracking-tight opacity-80">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>
    </ChurchDashboardLayout>
  );
}
