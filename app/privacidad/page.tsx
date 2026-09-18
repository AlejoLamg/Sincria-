import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | SincroIA.lat",
  description: "Políticas de tratamiento de datos personales y privacidad de SincroIA.lat.",
};

export default function PrivacidadPage() {
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
            Legal & Privacidad
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Política de Privacidad y Tratamiento de Datos
          </h1>
          <p className="text-gray-400 text-sm">
            Última actualización: Septiembre de 2026
          </p>
        </header>

        <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Identidad y Responsable del Tratamiento</h2>
            <p>
              SincroIA.lat (en adelante, &quot;SincroIA&quot; o &quot;la Agencia&quot;), con operaciones en Bogotá, Colombia, es el responsable del tratamiento de los datos personales suministrados por usuarios y clientes a través de este sitio web.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Datos Recopilados</h2>
            <p>
              A través de nuestro formulario de contacto y canales directos (WhatsApp, correo electrónico), recopilamos la siguiente información personal:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>Nombre completo o razón social.</li>
              <li>Dirección de correo electrónico corporativo o personal.</li>
              <li>Número de teléfono móvil o WhatsApp.</li>
              <li>Detalles y requerimientos técnicos del proyecto o servicio solicitado.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Finalidad del Tratamiento</h2>
            <p>
              Los datos recolectados se utilizan exclusivamente con los siguientes propósitos:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>Contactar al titular para presentar propuestas comerciales, cotizaciones técnicas y diagnósticos de automatización.</li>
              <li>Coordinar sesiones de consultoría inicial y asesoría técnica.</li>
              <li>Cumplir con obligaciones comerciales, contractuales y facturación derivadas de la prestación de nuestros servicios.</li>
              <li>Mejorar el rendimiento y la experiencia de usuario de nuestros canales digitales.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Almacenamiento y Seguridad de la Información</h2>
            <p>
              SincroIA implementa medidas técnicas, humanas y administrativas de seguridad mediante infraestructura cifrada y políticas de acceso restringido para proteger la información contra accesos no autorizados, adulteración o divulgación.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Derechos del Titular (Habeas Data)</h2>
            <p>
              Conforme a la Ley 1581 de 2012 de la República de Colombia y normativas equivalentes de protección de datos, el usuario tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales en cualquier momento enviando un correo a <span className="text-brand-cyan">contacto@sincroia.lat</span>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Enlaces a Terceros</h2>
            <p>
              Este sitio puede contener enlaces hacia herramientas externas como WhatsApp (Meta Platforms). SincroIA no se hace responsable de las políticas o prácticas de privacidad de dichas plataformas externas.
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SincroIA.lat. Todos los derechos reservados.</p>
          <Link href="/terminos" className="text-brand-cyan hover:underline">
            Ver Términos de Servicio →
          </Link>
        </div>
      </div>
    </main>
  );
}