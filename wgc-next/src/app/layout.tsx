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
  title: "WGC — Payments Built for Church Software",
  description: "Waypoint Gateway Collective is the embedded payment processing rail for church and nonprofit software. Lower fees, instant payouts, white-label ready.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "WGC — Payments Built for Church Software",
    description: "Waypoint Gateway Collective is the embedded payment processing rail for church and nonprofit software. Lower fees, instant payouts, white-label ready.",
    type: "website",
    images: ["/wgc-brand-final.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "WGC — Payments Built for Church Software",
    description: "Waypoint Gateway Collective is the embedded payment processing rail for church and nonprofit software. Lower fees, instant payouts, white-label ready.",
    images: ["/wgc-brand-final.png"],
  },
  icons: {
    icon: "/favicon.png",
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
