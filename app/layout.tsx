import "@/styles/globals.css";
import { Metadata } from "next";
import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { Open_Sans } from "next/font/google";

import NavBar from "@/components/NavBar";
import {
  AuthProvider,
  useAuthContext,
} from "@/components/Prividers/AuthProvider";
import React from "react";
import LayoutContent from "./LayoutContent";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans-og",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Choose weights you need
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "WorkInTEXAS.com",
    template: `%s - HeyGen Interactive Avatar SDK Demo`,
  },
  icons: {
    icon: "/metalogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} ${openSans.variable}`}
      lang="en"
    >
      <head />
      <body
        className="min-h-screen"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
        }}
      >
        <AuthProvider>
          <main className="relative flex flex-column h-screen w-screen overflow-hidden">
            <LayoutContent>{children}</LayoutContent>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
