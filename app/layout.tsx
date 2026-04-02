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
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-950 text-white`}
        suppressHydrationWarning
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white focus:rounded-md focus:m-2">
          Pular para conteúdo principal
        </a>
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
