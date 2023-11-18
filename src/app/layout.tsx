import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decentralised P2P insurance",
  description: "Connect wallet and keep it safe",
  icons: {
    icon: "/images/favicon.ico", // /public path
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grid h-screen place-items-center bg-slate-500">
        {children}
      </body>
    </html>
  );
}
