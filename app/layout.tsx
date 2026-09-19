import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ProjectConfigProvider } from "@/context/ProjectConfigContext";
import Script from "next/script";
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
  metadataBase: new URL("https://www.sincroia.lat"),
  title: "SincroIA.lat | Desarrollo Web de Alto Rendimiento y Automatización con IA en Colombia",
  description: "Desplegamos portales web ultra veloces y agentes conversacionales de IA autónomos 24/7 en Colombia y LATAM para maximizar las ventas de tu negocio.",
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  keywords: [
    "Sincro", "Desarrollo web Colombia", "Agentes de IA Bogotá", "Automatización de negocios Colombia", 
    "Portales web Next.js", "Inteligencia Artificial para empresas", "Optimización web performance",
    "Precios desarrollo web Colombia", "Chatbots de IA para WhatsApp"
  ],
  authors: [{ name: "Sincro Agency" }],
  openGraph: {
    title: "SincroIA.LAT | Desarrollo Web de Alto Rendimiento & Agentes de IA",
    description: "Portales web de rendimiento extremo y agentes de IA autónomos 24/7 en Colombia que califican y cierran clientes en piloto automático.",
    url: "https://www.sincroia.lat",
    siteName: "SincroIA.lat",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SincroIA - Portales Web y Agentes de IA en Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SincroIA.LAT | Desarrollo Web & Automatización con IA",
    description: "Portales web de rendimiento extremo y agentes IA autónomos que cierran clientes 24/7.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.sincroia.lat/#organization",
      "name": "SincroIA",
      "url": "https://www.sincroia.lat",
      "logo": "https://www.sincroia.lat/logo.webp",
      "description": "Agencia de ingeniería de software de alto rendimiento y automatización con agentes de Inteligencia Artificial para empresas en Bogotá, Colombia.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bogotá",
        "addressCountry": "CO"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+57-312-463-0488",
        "contactType": "Customer Service",
        "availableLanguage": ["Spanish", "English"]
      }
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.sincroia.lat/#service",
      "name": "SincroIA - Desarrollo Web & Agentes de IA",
      "telephone": "+57-312-463-0488",
      "url": "https://www.sincroia.lat",
      "priceRange": "$$",
      "currenciesAccepted": "COP",
      "paymentAccepted": "Wompi, PSE, Bold, Tarjeta de Crédito, Transferencia Bancaria",
      "areaServed": [
        {
          "@type": "Country",
          "name": "Colombia"
        },
        {
          "@type": "Continent",
          "name": "Latin America"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios Digitales y Soluciones con IA",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Portal Web Ultra Veloz Next.js",
              "description": "Portales web de carga < 0.8s diseñados para maximizar la conversión y el posicionamiento orgánico en Google."
            },
            "price": "1890000",
            "priceCurrency": "COP"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Agente de IA Conversacional Pro 24/7",
              "description": "Asistente inteligente para WhatsApp y Web que califica prospectos, entrega presupuestos y agenda citas en automático."
            },
            "price": "2490000",
            "priceCurrency": "COP"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "E-commerce Transaccional Pro",
              "description": "Tiendas virtuales ultra veloces con pasarelas de pago colombianas (Wompi, Bold, PSE, Nequi) y checkout instantáneo."
            },
            "price": "3690000",
            "priceCurrency": "COP"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Ecosistema Total (Web Ultra Veloz + Agente IA)",
              "description": "Solución integral sincronizada: Portal web de alto rendimiento y Agente de IA 24/7 conectado a WhatsApp y Web."
            },
            "price": "4890000",
            "priceCurrency": "COP"
          }
        ]
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-brand-navy text-white`}>
        <ProjectConfigProvider>
          {children}
        </ProjectConfigProvider>
        {/* Contenedor de notificaciones globales en top-right para no solapar el botón de WhatsApp */}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}