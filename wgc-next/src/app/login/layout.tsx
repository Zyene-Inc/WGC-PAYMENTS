import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | WGC Partner Console",
  description: "Secure login for WGC partners and ministry merchants.",
  openGraph: {
    title: "Log In | WGC Partner Console",
    description: "Secure login for WGC partners and ministry merchants.",
    url: "https://www.wgcpayments.com/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
