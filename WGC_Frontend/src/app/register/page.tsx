"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["partner_admin", "church_admin"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "partner_admin",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create account");
      }

      router.push("/login?registered=true");
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
        <h2 className="text-3xl font-bold text-wgc-navy-900 tracking-tight">Create your account</h2>
        <p className="mt-3 text-sm text-wgc-navy-400 font-medium">
          Or{" "}
          <Link href="/login" className="text-wgc-gold-600 hover:text-wgc-gold-500 font-bold transition-colors">
            sign in to existing account
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

            <div>
              <label htmlFor="role" className="block text-xs font-bold text-wgc-navy-400 uppercase tracking-widest mb-2">
                I am a...
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  {...register("role")}
                  className="block w-full px-4 py-3 border border-wgc-navy-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-wgc-gold-500/20 focus:border-wgc-gold-500 sm:text-sm bg-wgc-off/50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                >
                  <option value="partner_admin">Software Partner</option>
                  <option value="church_admin">Church Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-wgc-gold-600 focus:ring-wgc-gold-500 border-wgc-navy-200 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-[11px] font-bold">
                <label htmlFor="terms" className="text-wgc-navy-400 uppercase tracking-widest cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-wgc-gold-600 hover:text-wgc-gold-500 transition-colors">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-wgc-gold-600 hover:text-wgc-gold-500 transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-md bg-red-50 text-sm text-red-600 border border-red-100 font-medium">
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
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
