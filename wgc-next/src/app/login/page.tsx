"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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

      // Store in localStorage for consistency with original app
      localStorage.setItem("wgc_auth_token", result.token);
      localStorage.setItem("wgc_user_data", JSON.stringify(result.user));

      if (result.user.role === "church_admin") {
        router.push("/dashboard/church");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wgc-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex flex-col items-center justify-center mb-10 w-full">
          <Link href="/" className="block cursor-pointer group">
            <div className="h-24 w-auto transform transition-all duration-500 group-hover:scale-105">
              <img src="/wgc-logo.svg" alt="Waypoint Gateway Collective" className="h-full w-auto object-contain" />
            </div>
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-wgc-navy-900 tracking-tight">Sign in to your account</h2>
        <p className="mt-3 text-sm text-wgc-navy-400 font-medium">
          Or{" "}
          <Link href="/register" className="text-wgc-gold-600 hover:text-wgc-gold-500 font-bold transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-wgc-gray-100 rounded-xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-wgc-navy-400 uppercase tracking-widest mb-2">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="name@church.org"
                  className={cn(
                    "appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-wgc-navy-200 focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 sm:text-sm bg-wgc-off/50 transition-all",
                    errors.email ? "border-red-300" : "border-wgc-navy-100"
                  )}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-wgc-navy-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={cn(
                    "appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-wgc-navy-200 focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 sm:text-sm bg-wgc-off/50 transition-all",
                    errors.password ? "border-red-300" : "border-wgc-navy-100"
                  )}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-wgc-gold-600 focus:ring-wgc-gold-500 border-wgc-navy-200 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-wgc-navy-400 uppercase tracking-widest cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-[11px] font-bold">
                <a href="#" className="text-wgc-gold-600 hover:text-wgc-gold-500 transition-colors uppercase tracking-wider">
                  Forgot your password?
                </a>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-md bg-red-50 text-sm text-red-600 border border-red-100 font-medium animate-in fade-in slide-in-from-top-1">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 bg-wgc-gold-500 text-wgc-navy-900 hover:bg-black hover:text-wgc-navy-900 rounded-xl shadow-lg text-sm font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-widest"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
