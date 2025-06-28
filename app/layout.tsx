import "@/styles/globals.css";
import { Metadata } from "next";
import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

import NavBar from "@/components/NavBar";

const fontSans = FontSans({
  subsets: ["latin"],
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
      className={`${fontSans.variable} ${fontMono.variable}`}
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
        <main className="relative flex flex-column h-screen w-screen overflow-hidden">
          <div
          // className="flex-1 overflow-hidden"
          // style={{
          //   backgroundColor: "var(--bg-secondary)",
          //   padding: "var(--space-6) var(--space-8)",
          //   height: "calc(100vh - 5rem)", // Account for navbar
          //   maxHeight: "calc(100vh - 5rem)",
          // }}
          >
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
