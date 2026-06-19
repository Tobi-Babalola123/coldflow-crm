import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
// import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

// const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

export const metadata = {
  title: "ColdFlow CRM",
  description: "Cold outreach CRM",
};
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
