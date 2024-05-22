import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/utils/ui";
import { Web3Provider } from "@/sections/provider/Web3Provider";
import { AppProvider } from "@/context/app";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/sections/layout/Header";
import { AIPopupLayout } from "@/components/features/ai/AIPopupLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "w-screen bg-muted min-h-screen flex flex-col gap-4"
        )}
      >
        <Web3Provider>
          <AppProvider>
            {/* <Header /> */}

            {children}
            <Toaster />
            <AIPopupLayout />
          </AppProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
