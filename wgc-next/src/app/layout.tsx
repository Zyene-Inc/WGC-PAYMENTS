import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wgcpayments.com"),
  title: "WGC | Payment Infrastructure for Church & Nonprofit Software",
  description: "White-label donation engine and settlement rails for software that serves churches and nonprofits. Lower fees, low-cost ACH, and PCI Level 1 security.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "WGC | Payment Infrastructure for Church & Nonprofit Software",
    description: "White-label donation engine and settlement rails for software that serves churches and nonprofits. Lower fees, low-cost ACH, and PCI Level 1 security.",
    type: "website",
    images: ["/wgc-brand-final.png"],
    url: "https://www.wgcpayments.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "WGC | Payment Infrastructure for Church & Nonprofit Software",
    description: "White-label donation engine and settlement rails for software that serves churches and nonprofits. Lower fees, low-cost ACH, and PCI Level 1 security.",
    images: ["/wgc-brand-final.png"],
  },
  icons: {
    icon: "/favicon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
