import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { RegistrationProvider } from "@/context/RegistrationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AWS Student Community Day 2026 | AWS Student Builder Groups REC",
  description: "Join us for the premier AWS Student Community Day on September 12, 2026, hosted by the AWS Student Builder Groups at REC College. Discover cloud intelligence, GenAI, serverless computing, and more.",
  icons: {
    icon: "/aws_sbg_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#020205] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <RegistrationProvider>
          <CustomCursor />
          {children}
        </RegistrationProvider>
      </body>
    </html>
  );
}

