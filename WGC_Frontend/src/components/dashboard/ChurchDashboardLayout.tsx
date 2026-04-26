"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  RefreshCcw, 
  Landmark, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  Search, 
  ChevronDown,
  Layers,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: 'Overview', path: '/dashboard/church', icon: LayoutDashboard, exact: true },
  { label: 'Donations', path: '/dashboard/church/donations', icon: CreditCard },
  { label: 'Recurring', path: '/dashboard/church/recurring', icon: RefreshCcw },
  { label: 'Fees & Costs', path: '/dashboard/church/fees', icon: Percent },
  { label: 'Donors', path: '/dashboard/church/donors', icon: Users },
  { label: 'Campaigns', path: '/dashboard/church/campaigns', icon: Layers },
  { label: 'Payouts', path: '/dashboard/church/payouts', icon: Landmark },
  { label: 'Reports', path: '/dashboard/church/reports', icon: BarChart3 },
  { label: 'Settings', path: '/dashboard/church/settings', icon: Settings },
];

export default function ChurchDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleCollapsed = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-wgc-off border-r border-wgc-navy-100/40 transform transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-8 h-20 border-b border-wgc-navy-50 overflow-hidden whitespace-nowrap">
        <div className="min-w-[32px] w-8 h-8 rounded-lg bg-wgc-gold-500 flex items-center justify-center shadow-lg shadow-wgc-gold-500/20 transform rotate-12">
          <span className="text-wgc-navy-900 font-black text-lg leading-none -rotate-12">W</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col animate-in slide-in-from-left duration-300">
             <span className="text-[9px] font-black text-wgc-gold-600 uppercase tracking-[0.4em] leading-none mb-1">Way Point</span>
             <span className="text-[10px] font-black text-wgc-navy-900 tracking-tight leading-none uppercase font-mono">Church Console</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact 
            ? pathname === item.path 
            : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={closeMobileMenu}
              className={cn(
                "group flex items-center px-4 py-3 text-[10px] font-black rounded-xl transition-all border border-transparent uppercase tracking-[0.25em] overflow-hidden whitespace-nowrap font-mono",
                isActive 
                  ? "bg-white text-wgc-gold-600 shadow-sm border-wgc-gold-500/20" 
                  : "text-wgc-navy-400 hover:bg-white hover:text-wgc-navy-900"
              )}
            >
              <item.icon className={cn("transition-all", isCollapsed ? "w-5 h-5 mx-auto" : "w-4 h-4 mr-3")} />
              {!isCollapsed && <span className="animate-in fade-in duration-300">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-wgc-navy-50">
        <div className="flex flex-col gap-2">
          <button onClick={toggleCollapsed} 
            className="flex items-center justify-center p-3 rounded-xl hover:bg-white text-wgc-navy-400 transition-all border border-transparent hover:border-wgc-navy-50">
             <Menu className="w-4 h-4" />
          </button>
          <button onClick={logout}
            className="flex items-center justify-center p-3 rounded-xl hover:bg-red-50 text-red-400 transition-all border border-transparent hover:border-red-100">
             <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col z-30 transition-all duration-300 shadow-sm shadow-wgc-navy-950/5",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
          <aside className="absolute inset-y-0 left-0 w-72 bg-wgc-off shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-wgc-navy-100/20 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-6">
            <button onClick={toggleMobileMenu} className="md:hidden p-2 text-wgc-navy-400">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wgc-navy-300" />
                <input type="text" placeholder="Institutional Search Engine..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-wgc-off border border-wgc-navy-100/40 text-[11px] font-bold uppercase tracking-widest rounded-xl focus:outline-none focus:border-wgc-gold-500/50 transition-all placeholder:text-wgc-navy-200 font-mono" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-wgc-gold-50 border border-wgc-gold-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-wgc-gold-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-wgc-gold-600 font-mono">Enterprise Mode</span>
            </div>

            <div className="h-6 w-px bg-wgc-navy-50"></div>

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wgc-navy-900 to-black flex items-center justify-center shadow-lg font-black text-wgc-gold-500 text-xs border border-wgc-navy-50 transition-all group-hover:scale-105 uppercase">
                {user?.email?.charAt(0)}
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="text-[11px] font-black text-wgc-navy-900 tracking-tight leading-none uppercase">
                  {user?.email?.split('@')[0]}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   <p className="text-[8px] font-black text-wgc-navy-400 uppercase tracking-widest leading-none font-mono">Security: Live</p>
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-wgc-navy-300 group-hover:text-wgc-navy-900 transition-colors" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-wgc-off scroll-smooth">
          <div className="p-8 lg:p-12 max-w-[1600px] mx-auto min-h-full transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
