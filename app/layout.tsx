import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "./components/Layout";
import { Providers } from "./providers/Providers";

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
        className={`${inter.className} bg-gray-900 text-white`}
        suppressHydrationWarning
      >
        <Layout>
          <Providers>
            {children}
          </Providers>
        </Layout>
      </body>
    </html>
  );
}
