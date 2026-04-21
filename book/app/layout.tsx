import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Book Buddy",
  description: "Book management system by Cloud Solutions",
};

import { Navbar } from "@/components/ui/navbar";

import { ConsoleSilencer } from "@/components/ui/console-silencer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", inter.variable, geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable)}
      >
        <body className="min-h-full flex flex-col font-inter bg-black text-white">
          <ConsoleSilencer />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
