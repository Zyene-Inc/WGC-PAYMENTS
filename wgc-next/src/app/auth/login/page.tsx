"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid email or password");
      }

      // Store in localStorage
      localStorage.setItem("wgc_auth_token", result.token);
      localStorage.setItem("wgc_user_data", JSON.stringify(result.user));

      // Redirect logic based on application status
      if (result.user.applicationStatus === "approved") {
        router.push("/dashboard/church");
      } else {
        router.push("/dashboard/church/onboarding/status");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
           <div className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl bg-wgc-gold-500 flex items-center justify-center shadow-lg shadow-wgc-gold-500/20 transform rotate-12">
               <span className="text-wgc-navy-900 font-black text-xl -rotate-12">W</span>
             </div>
             <span className="font-black text-wgc-navy-900 uppercase tracking-tighter text-2xl">WGC Payments</span>
           </div>
        </Link>
        <h2 className="text-3xl font-bold text-wgc-navy-900 tracking-tight">Welcome back</h2>
        <p className="mt-3 text-sm text-slate-500 font-medium">
          Access your stewardship command center.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-10 px-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200 rounded-[2.5rem] sm:px-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 font-mono">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className={cn(
                  "block w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 transition-all font-medium",
                  errors.email && "border-red-300"
                )}
                placeholder="admin@church.org"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 font-mono">Password</label>
              <input
                type="password"
                {...register("password")}
                className={cn(
                  "block w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 transition-all font-medium",
                  errors.password && "border-red-300"
                )}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <input type="checkbox" id="remember" className="rounded-md border-slate-200 text-wgc-gold-500 focus:ring-wgc-gold-500" />
                 <label htmlFor="remember" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Remember me</label>
               </div>
               <Link href="#" className="text-[10px] font-bold text-wgc-gold-600 uppercase tracking-widest font-mono hover:text-black">Forgot Password?</Link>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600 uppercase tracking-widest font-mono">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-wgc-navy-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center font-mono"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authenticate"}
            </button>

            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-50">
              <Key className="w-4 h-4 text-wgc-gold-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">End-to-end encrypted session</span>
            </div>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-[0.1em] font-mono">
            New to WGC?{" "}
            <Link href="/auth/register" className="text-wgc-gold-600 hover:text-black transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
