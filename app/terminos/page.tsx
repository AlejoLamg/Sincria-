import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Servicio | SincroIA.lat",
  description: "Términos y condiciones para el desarrollo web, integraciones de software y automatización con IA de SincroIA.lat.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-brand-navy text-white py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-brand-cyan hover:underline"
        >
          ← Volver a SincroIA.lat
        </Link>

        <header className="space-y-3 border-b border-white/10 pb-8">
          <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase">
            Legal & Contratación
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Términos y Condiciones de Servicio
          </h1>
          <p className="text-gray-400 text-sm">
            Última actualización: Septiembre de 2026
          </p>
        </header>

        <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Aceptación de los Términos</h2>
            <p>
              Al acceder a este portal, solicitar una consultoría o contratar cualquiera de los planes de desarrollo o automatización ofrecidos por SincroIA.lat, el usuario acepta de manera íntegra estos Términos y Condiciones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Alcance de los Servicios</h2>
            <p>
              SincroIA ofrece servicios de ingeniería de software que incluyen:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>Desarrollo de portales web y tiendas virtuales de alto rendimiento (Next.js, React).</li>
              <li>Diseño, entrenamiento y despliegue de agentes inteligentes y automatizaciones de IA.</li>
              <li>Integración de pasarelas de pago, CRMs y APIs personalizadas.</li>
              <li>Mantenimiento técnico y soporte evolutivo mediante membresías mensuales.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Modalidad de Pago y Cotizaciones</h2>
            <p>
              Los precios presentados en el sitio web corresponden a valores base de referencia en pesos colombianos (COP). Cada proyecto formal incluye una propuesta comercial detallando alcance, cronograma y etapas de desembolso (típicamente 50% anticipo al iniciar y 50% contra entrega a satisfacción), aceptando pagos mediante pasarelas autorizadas (Wompi, PSE, Bold) y transferencias bancarias nacionales.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Propiedad Intelectual</h2>
            <p>
              Una vez cancelada la totalidad del valor acordado por el proyecto, el cliente adquiere la titularidad sobre los entregables y el código fuente desarrollado a medida, reservándose SincroIA el derecho de exhibir el trabajo realizado en su portafolio comercial salvo acuerdo explícito de confidencialidad (NDA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Garantía y Soporte Post-Lanzamiento</h2>
            <p>
              Todos nuestros desarrollos incluyen un periodo de garantía de lanzamiento para corregir cualquier defecto técnico o error imprevisto. Modificaciones de alcance o soporte continuo posterior se rigen bajo los planes de membresía o acuerdos de nivel de servicio (SLA).
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SincroIA.lat. Todos los derechos reservados.</p>
          <Link href="/privacidad" className="text-brand-cyan hover:underline">
            Ver Política de Privacidad →
          </Link>
        </div>
      </div>
    </main>
  );
}