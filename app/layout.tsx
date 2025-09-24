"use client";
import { useEffect } from 'react';
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "./components/Layout";
import { Providers } from "./providers/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConstruJoy - Sistema de Gestão de Crédito",
  description: "Sistema de gestão de crédito para clientes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const loginURL = "https://studio--studio-5593614148-ea971.us-central1.hosted.app/";
    if (window.top === window.self) {
        if (document.referrer && !document.referrer.startsWith(loginURL)) {
          window.location.href = loginURL;
        }
    }
  }, []);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-900 text-white`}
        suppressHydrationWarning
      >
        <Layout>
          <Providers>
            {children}
          </Providers>
        </Layout>
        <Toaster />
      </body>
    </html>
  );
}
