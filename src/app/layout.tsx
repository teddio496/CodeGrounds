"use client";

import React from "react";
import "./globals.css";
import { SidebarDemo } from "@/src/app/components/ui/SidebarDemo";
import { Toaster } from "@/src/app/components/ui/toaster";
import { ThemeProvider } from "@/src/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#333333]">
      <ThemeProvider>
        <SidebarDemo>
          {children}
        <Toaster />
        </SidebarDemo>
      </ThemeProvider>
      </body>
    </html>
  );
}
