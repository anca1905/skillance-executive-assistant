import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExecutiveStoreProvider } from "@/lib/store/executive-store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skillance Executive Assistant — Lead with Clarity. Execute with Purpose.",
  description: "Personal executive management system dan command center khusus CEO Skillance Digital Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F7FA] text-[#172B4D] font-sans">
        <ExecutiveStoreProvider>
          {children}
        </ExecutiveStoreProvider>
      </body>
    </html>
  );
}
