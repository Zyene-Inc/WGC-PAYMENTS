import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Partner Account | WGC",
  description: "Start your WGC partner registration.",
  openGraph: {
    title: "Create a Partner Account | WGC",
    description: "Start your WGC partner registration.",
    url: "https://www.wgcpayments.com/register",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
