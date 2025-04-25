import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Spline from "@splinetool/react-spline/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonic Pulse",
  description: "Analytics for Sonic SVM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="fixed z-0 h-full w-full">
      <Spline
        scene="https://prod.spline.design/OQc-SnFtfeOCAlCK/scene.splinecode" 
      />
      </div>
        {children}
      </body>
    </html>
  );
}
