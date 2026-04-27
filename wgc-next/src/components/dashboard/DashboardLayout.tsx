"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  RefreshCcw, 
  Landmark, 
  ArrowUpDown, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Merchants", href: "/dashboard/merchants", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard, group: "Ministry" },
  { name: "Recurring", href: "/dashboard/recurring", icon: RefreshCcw },
  { name: "Payouts", href: "/dashboard/payouts", icon: Landmark },
  { name: "Migration", href: "/dashboard/migration", icon: ArrowUpDown, group: "System" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname === "/dashboard/merchants") return "Merchants Directory";
    if (pathname.startsWith("/dashboard/merchants/")) return "Merchant Details";
    if (pathname === "/dashboard/payments") return "Transaction History";
    if (pathname === "/dashboard/recurring") return "Recurring Payments";
    if (pathname === "/dashboard/payouts") return "Payout Management";
    if (pathname === "/dashboard/migration") return "Migration Center";
    if (pathname === "/dashboard/settings") return "Ministry Configuration";
    return "WGC Platform";
  };

  const SidebarContent = () => (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 px-6 py-8 space-y-1 overflow-y-auto">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-8 h-8 rounded-lg bg-wgc-gold-600 flex items-center justify-center shadow-lg shadow-wgc-gold-600/20">
            <span className="text-wgc-navy-900 font-black text-lg">W</span>
          </div>
          <div>
            <p className="text-[9px] font-black text-wgc-gold-600 uppercase tracking-widest leading-none mb-1">Way Point</p>
            <p className="text-xs font-black text-wgc-navy-900 tracking-tight leading-none uppercase">COLLECTIVE</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link 
            href="/" 
            onClick={closeMenu} 
            className="flex items-center px-4 py-3 text-[10px] font-bold rounded-xl text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-black transition-all border border-transparent uppercase tracking-[0.2em] mb-4 group font-mono"
          >
            <Menu className="w-4 h-4 mr-3 opacity-50" />
            Back to Home
          </Link>
          
          <div className="h-px bg-wgc-navy-50 mb-6 mx-4"></div>

          {NAV_ITEMS.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            
            return (
              <div key={item.href}>
                {item.group && (
                  <div className="pt-6 pb-2 px-4">
                     <p className="text-[9px] font-black text-wgc-navy-200 uppercase tracking-[0.3em] font-mono">{item.group}</p>
                  </div>
                )}
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center px-4 py-3.5 text-[10px] font-bold rounded-xl transition-all border border-transparent uppercase tracking-[0.2em] font-mono",
                    isActive 
                      ? "bg-wgc-navy-50 text-wgc-navy-900 shadow-sm border-wgc-navy-100/50" 
                      : "text-wgc-navy-400 hover:bg-wgc-navy-50 hover:text-wgc-navy-900"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-wgc-navy-50">
        <button 
          onClick={() => {
            closeMenu();
            logout();
          }}
          className="flex items-center w-full px-4 py-3 text-[10px] font-black rounded-xl text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.2em] border border-transparent font-mono"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-wgc-off overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-wgc-navy-100 shadow-sm z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" onClick={toggleMenu}></div>
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 border-b border-wgc-navy-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-wgc-navy-300 uppercase tracking-widest font-mono">Navigation</span>
              <button onClick={toggleMenu} className="p-2 text-wgc-navy-400 hover:text-wgc-navy-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-wgc-navy-100/50 flex items-center justify-between px-6 md:px-10 z-10 transition-all">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={toggleMenu} className="md:hidden p-2 text-wgc-navy-400 hover:bg-wgc-navy-50 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-wgc-gold-600 uppercase tracking-[0.35em] mb-0.5 whitespace-nowrap font-mono">Platform Console</span>
              <h1 className="text-sm md:text-lg font-black text-wgc-navy-900 tracking-tight leading-none uppercase truncate max-w-[150px] md:max-w-none">
                {getPageTitle()}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] md:text-xs font-black text-wgc-navy-900 tracking-tight truncate max-w-[120px] md:max-w-none uppercase">{user?.email}</p>
              <p className="text-[8px] md:text-[10px] font-black text-wgc-navy-400 uppercase tracking-[0.2em] mt-0.5 font-mono">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-wgc-off border border-wgc-navy-100 flex items-center justify-center shadow-sm font-black text-wgc-navy-900 transition-transform active:scale-95 text-xs md:text-base uppercase bg-gradient-to-br from-wgc-gold-500 to-amber-600 border-none text-wgc-navy-900 shadow-lg shadow-wgc-gold-500/10">
              {user?.email?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-wgc-off/30 relative">
          <div className="relative z-10 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
