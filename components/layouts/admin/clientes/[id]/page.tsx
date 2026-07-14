import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function DetalleClientePage({ params }: { params: { id: string } }) {
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !lead) {
    return <div className="text-white p-10">Cliente no encontrado.</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-neutral-900 rounded-xl border border-neutral-800">
      <Link href="/admin" className="text-blue-400 hover:underline">← Volver al Dashboard</Link>
      
      <h1 className="text-3xl font-bold text-white">{lead.nombre}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-neutral-800 rounded-lg">
          <p className="text-neutral-500 text-xs uppercase">Email</p>
          <p className="text-white">{lead.email}</p>
        </div>
        <div className="p-4 bg-neutral-800 rounded-lg">
          <p className="text-neutral-500 text-xs uppercase">Teléfono</p>
          <p className="text-white">{lead.telefono}</p>
        </div>
      </div>

      <div className="p-4 bg-neutral-800 rounded-lg">
        <p className="text-neutral-500 text-xs uppercase">Objetivo</p>
        <p className="text-blue-400 font-semibold">{lead.objetivo}</p>
      </div>

      <div className="p-4 bg-neutral-800 rounded-lg">
        <p className="text-neutral-500 text-xs uppercase">Comentarios adicionales</p>
        <p className="text-white mt-1">{lead.comentarios || "Sin comentarios."}</p>
      </div>
    </div>
  );
}