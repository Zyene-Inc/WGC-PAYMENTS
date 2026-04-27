"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  RefreshCcw, 
  Landmark, 
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the partner dashboard
const MOCK_STATS = {
  totalVolume: 1245600, // $1,245,600
  totalMerchants: 48,
  activeRecurring: 1240,
  pendingPayoutsTotal: 12500, // $12,500
  actionItems: [
    { label: "Pending verifications", count: 3 },
    { label: "Failed KYC attempts", count: 1 },
    { label: "Migration jobs active", count: 2 },
  ],
  recentPayments: [
    { 
      donor: { firstName: "Johnathan", lastName: "Doe", email: "j.doe@example.com" },
      merchant: { legalName: "Grace Community Church" },
      amount: 25000, 
      status: "success",
      createdAt: new Date().toISOString()
    },
    { 
      donor: { firstName: "Sarah", lastName: "Miller", email: "smiller@test.com" },
      merchant: { legalName: "Global Relief Initiative" },
      amount: 10000, 
      status: "pending",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    { 
      donor: { firstName: "Michael", lastName: "Thompson", email: "mike.t@provider.net" },
      merchant: { legalName: "Grace Community Church" },
      amount: 50000, 
      status: "success",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    { 
      donor: { firstName: "Esther", lastName: "Williams", email: "esther.w@domain.org" },
      merchant: { legalName: "City Mission Collective" },
      amount: 15000, 
      status: "failed",
      createdAt: new Date(Date.now() - 14400000).toISOString()
    },
  ]
};

export default function DashboardHomePage() {
  const [stats, setStats] = useState<typeof MOCK_STATS | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setStats(MOCK_STATS);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-wgc-navy-900 tracking-tight">Overview Dashboard</h2>
            <p className="text-[11px] font-medium text-wgc-navy-400 uppercase tracking-widest mt-1 font-mono">Ministry monitoring of platform-wide stewardships.</p>
          </div>
          <button className="bg-white border border-wgc-navy-100 shadow-sm text-wgc-navy-900 px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-wgc-navy-900 hover:border-black transition-all active:scale-95 font-mono">
            System Analytics
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Processed Volume (30D)" 
            value={formatCurrency(stats?.totalVolume || 0)} 
            footer="+4.2% Growth" 
            footerColor="text-green-600"
            icon={TrendingUp}
          />
          <StatCard 
            label="Active Merchants" 
            value={stats?.totalMerchants || 0} 
            footer="Platform Nodes" 
            icon={Users}
          />
          <StatCard 
            label="Sub-Engine Activity" 
            value={stats?.activeRecurring || 0} 
            footer="Recurring Plans" 
            icon={RefreshCcw}
          />
          <StatCard 
            label="Pending Payouts" 
            value={formatCurrency(stats?.pendingPayoutsTotal || 0)} 
            footer="Settling T+2" 
            valueColor="text-wgc-gold-600"
            icon={Landmark}
          />
        </div>

        {/* Attention Required */}
        {stats?.actionItems && stats.actionItems.length > 0 && (
          <div className="bg-red-50/50 border border-red-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-6 flex items-center gap-3 font-mono">
              <AlertCircle className="w-4 h-4" /> Operational Inconsistencies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.actionItems.map((item) => (
                <div key={item.label} className="bg-white p-6 rounded-2xl border border-red-100 flex items-center justify-between group cursor-pointer hover:bg-red-600 hover:border-red-600 transition-all shadow-sm">
                  <div>
                    <p className="text-[9px] font-bold text-wgc-navy-400 uppercase tracking-widest font-mono group-hover:text-wgc-navy-900 transition-colors">{item.label}</p>
                    <p className="text-3xl font-bold text-red-600 group-hover:text-wgc-navy-900 transition-colors">{item.count}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-white/20 group-hover:text-wgc-navy-900 transition-all">
                    <TrendingUp className="w-5 h-5 opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-[3rem] border border-wgc-navy-100 shadow-xl shadow-wgc-navy-950/5 overflow-hidden">
          <div className="px-10 py-6 border-b border-wgc-navy-50 bg-wgc-navy-50/10 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-wgc-navy-900 uppercase tracking-[0.2em] font-mono">Live Transaction Ledger</h3>
            <span className="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-widest font-mono">{stats?.recentPayments?.length || 0} Recent Events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-wgc-navy-50/30 text-[10px] font-bold text-wgc-navy-400 uppercase tracking-[0.15em] border-b border-wgc-navy-50 font-mono">
                  <th className="px-10 py-5">Identity Protocol</th>
                  <th className="px-10 py-5">Ministry Recipient</th>
                  <th className="px-10 py-5 text-right">Settled Amount</th>
                  <th className="px-10 py-5 text-center">Execution Status</th>
                  <th className="px-10 py-5 text-right">Execution Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wgc-navy-50">
                {stats?.recentPayments.map((payment, i) => (
                  <tr key={i} className="hover:bg-wgc-navy-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="font-bold text-wgc-navy-900 text-xs tracking-tight">{payment.donor?.firstName} {payment.donor?.lastName}</div>
                      <div className="text-[9px] text-wgc-navy-400 font-mono tracking-tighter uppercase mt-1">{payment.donor?.email}</div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-wgc-off border border-wgc-navy-50 text-[10px] font-bold text-wgc-navy-900 uppercase tracking-tight font-mono">
                        {payment.merchant?.legalName}
                      </div>
                    </td>
                    <td className="px-10 py-6 font-bold text-wgc-navy-900 text-right tabular-nums text-sm">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border font-mono",
                        payment.status === "success" ? "bg-green-50 text-green-600 border-green-100" :
                        payment.status === "pending" ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                        "bg-red-50 text-red-600 border-red-100"
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right tabular-nums text-wgc-navy-400 font-bold text-[10px] uppercase font-mono">{formatDate(payment.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ 
  label, 
  value, 
  footer, 
  icon: Icon, 
  valueColor = "text-wgc-navy-900",
  footerColor = "text-wgc-navy-400"
}: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-wgc-navy-100 shadow-lg shadow-wgc-navy-950/5 flex flex-col justify-between group hover:-translate-y-1 transition-all">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-bold text-wgc-navy-400 uppercase tracking-[0.15em] font-mono">{label}</p>
        <div className="w-10 h-10 rounded-xl bg-wgc-off border border-wgc-navy-50 flex items-center justify-center text-wgc-navy-300 group-hover:text-wgc-gold-500 transition-colors shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className={cn("text-3xl font-bold tracking-tighter", valueColor)}>{value}</p>
        <div className={cn("flex items-center gap-2 text-[10px] font-medium mt-4 uppercase tracking-[0.1em] font-mono", footerColor)}>
           {footer}
        </div>
      </div>
    </div>
  );
}
