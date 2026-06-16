"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  FileSearch,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "draft" | "submitted" | "under_review" | "needs_more_info" | "approved" | "rejected";

export default function StatusPortalPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetching status for demo
    const timer = setTimeout(() => {
      // In real app, fetch from API
      const userStr = localStorage.getItem("wgc_user_data");
      if (userStr) {
        const user = JSON.parse(userStr);
        setStatus(user.applicationStatus || "draft");
      } else {
        setStatus("draft");
      }
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case "draft":
        return {
          icon: FileSearch,
          color: "text-amber-500",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-100",
          title: "Application in Draft",
          message: "You haven't submitted your onboarding application yet. Please complete the remaining steps to initiate underwriting.",
          cta: { label: "Continue Application", href: "/dashboard/church/onboarding" }
        };
      case "submitted":
      case "under_review":
        return {
          icon: Clock,
          color: "text-wgc-gold-600",
          bgColor: "bg-wgc-gold-50",
          borderColor: "border-wgc-gold-500/20",
          title: "Application Under Review",
          message: "Our underwriting team is currently reviewing your mission profile and documentation. This typically takes 24-48 business hours.",
          cta: null
        };
      case "needs_more_info":
        return {
          icon: AlertCircle,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
          title: "Additional Information Required",
          message: "We need a few more details to finalize your application. Please check the messages below for specific requests.",
          cta: { label: "Provide Information", href: "/dashboard/church/onboarding" }
        };
      case "approved":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-100",
          title: "Application Approved",
          message: "Congratulations! Your ministry has been approved for WGC Payments. You can now access your live stewardship dashboard.",
          cta: { label: "Launch Payments Dashboard", href: "/dashboard/church" }
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-100",
          title: "Application Declined",
          message: "Unfortunately, we are unable to approve your application at this time. Please contact our support team for more information.",
          cta: null
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <Loader2 className="w-8 h-8 text-wgc-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
           <Link href="/" className="inline-block mb-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-wgc-gold-500 flex items-center justify-center shadow-lg shadow-wgc-gold-500/20 transform rotate-12">
                  <span className="text-wgc-navy-900 font-black text-xl -rotate-12">W</span>
                </div>
                <span className="font-black text-wgc-navy-900 uppercase tracking-tighter text-2xl">WGC Payments</span>
              </div>
           </Link>
           <h1 className="text-4xl font-bold text-wgc-navy-900 tracking-tight">Application Status Portal</h1>
           <p className="text-slate-500 font-medium tracking-tight mt-2 opacity-80">Track your progress from mission registry to live settlement.</p>
        </div>

        {/* Status Card */}
        {config && (
          <div className={cn(
            "bg-white rounded-[3rem] p-10 md:p-16 border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative overflow-hidden",
            config.borderColor
          )}>
             <div className="flex flex-col items-center text-center">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm border",
                  config.bgColor, config.color, config.borderColor
                )}>
                   <config.icon className="w-10 h-10" />
                </div>
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-6">
                   <div className={cn("w-2 h-2 rounded-full", config.color.replace('text-', 'bg-'))}></div>
                   <span className={cn("text-[10px] font-black uppercase tracking-widest font-mono", config.color)}>{status?.replace('_', ' ')}</span>
                </div>

                <h2 className="text-3xl font-bold text-wgc-navy-900 tracking-tight mb-4">{config.title}</h2>
                <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed tracking-tight mb-10 italic">
                   "{config.message}"
                </p>

                {config.cta && (
                  <Link 
                    href={config.cta.href}
                    className="flex items-center gap-3 px-12 py-5 bg-wgc-navy-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-black transform transition-all active:scale-95 font-mono"
                  >
                    {config.cta.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
             </div>

             {/* Background branding */}
             <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none select-none text-[12rem] font-black text-wgc-navy-900 leading-none">WGC</div>
          </div>
        )}

        {/* Secondary Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm group hover:border-wgc-gold-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-wgc-navy-50 flex items-center justify-center text-wgc-navy-900 border border-wgc-navy-100 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                 </div>
                 <h3 className="text-sm font-bold text-wgc-navy-900 uppercase tracking-widest font-mono">Messages from WGC</h3>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">No active messages.</p>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm group hover:border-wgc-gold-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-wgc-navy-50 flex items-center justify-center text-wgc-navy-900 border border-wgc-navy-100 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="text-sm font-bold text-wgc-navy-900 uppercase tracking-widest font-mono">Support Contact</h3>
              </div>
              <p className="text-xs font-bold text-wgc-gold-600 uppercase tracking-widest font-mono">support@wgcpayments.com</p>
           </div>
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center">
           <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl border border-wgc-gold-500/20 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
             <div className="w-2 h-2 rounded-full bg-wgc-gold-500 animate-ping"></div>
             <p className="text-[10px] font-bold text-wgc-navy-600 uppercase tracking-widest font-mono">
               Live monitoring of your <span className="text-wgc-gold-500">Ministry Settlement Application</span>.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
