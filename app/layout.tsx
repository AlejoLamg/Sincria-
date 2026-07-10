import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

// Cargamos una fuente geométrica para títulos y una limpia para lectura
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sincroia.lat | Desarrollo Web de Alto Rendimiento y Automatización con IA",
  description: "Desplegamos portales web ultra veloces y agentes conversacionales de IA autónomos 24/7 para maximizar las ventas de tu negocio.",
  icons: {
    icon: '/favicon.jpg',
  },
  keywords: [
    "Sincro", "Desarrollo web premium", "Agentes de IA", "Automatización de negocios", 
    "Portales web Next.js", "Inteligencia Artificial para empresas", "Optimización web performance"
  ],
  authors: [{ name: "Sincro Agency" }],
  openGraph: {
    title: "Sincro.ia | Ecosistema de Automatización Total",
    description: "Portales web de rendimiento extremo y agentes IA autónomos que califican y cierran clientes en piloto automático.",
    url: "https://sincroia.lat",
    siteName: "Sincro.ia",
    locale: "es_CO",
    type: "website",
    
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-brand-navy text-white`}>
        {children}
      </body>
    </html>
  );
}