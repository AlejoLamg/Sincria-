import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

// 1. LA SOLUCIÓN DE RAÍZ: Definimos estrictamente la estructura de los datos
interface Lead {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  objetivo: string;
  comentarios: string;
  created_at: string;
}

interface LeadsTableProps {
  query?: string;
}

// 2. Le decimos a TypeScript que la promesa devolverá un arreglo de tipo "Lead", no "any"
async function getLeads(query: string): Promise<Lead[]> {
  let request = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (query) {
    request = request.ilike('nombre', `%${query}%`);
  }

  const { data, error } = await request;

  if (error) {
    console.error("Error al traer leads:", error);
    return [];
  }
  
  // Forzamos amablemente el tipo de dato que devuelve Supabase
  return (data as Lead[]) || [];
}

export default async function LeadsTable({ query = "" }: LeadsTableProps) {
  const leads = await getLeads(query);

  if (!leads || leads.length === 0) {
    return (
      <div className="p-10 text-center text-white bg-neutral-900 border border-neutral-800 rounded-xl">
        <p className="text-lg font-bold">No se están recibiendo datos.</p>
        <p className="text-sm text-yellow-500 mt-2">
          Si tienes registros en Supabase, ve a tu panel de Supabase &gt; Authentication &gt; Policies y asegúrate de desactivar el <strong>Row Level Security (RLS)</strong> para la tabla &apos;leads&apos;, o crea una política de lectura pública.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-800 rounded-xl">
      <table className="w-full text-sm text-left text-neutral-300">
        <thead className="text-xs uppercase bg-neutral-800/50 text-neutral-400 border-b border-neutral-800">
          <tr>
            <th className="px-6 py-4">Nombre</th>
            <th className="px-6 py-4">Contacto</th>
            <th className="px-6 py-4">Objetivo</th>
            <th className="px-6 py-4">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800 bg-neutral-900">
          {/* 3. Tipamos la variable lead estrictamente como "Lead" en el .map */}
          {leads.map((lead: Lead) => (
            <tr key={lead.id} className="hover:bg-neutral-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white hover:text-blue-400 underline">
                <Link href={`/admin/clientes/${lead.id}`}>
                  {lead.nombre || "Cliente sin nombre"}
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="text-white">{lead.email || "-"}</div>
                <div className="text-neutral-500 text-xs">{lead.telefono || "-"}</div>
              </td>
              <td className="px-6 py-4">
                <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                  {lead.objetivo || "-"}
                </span>
              </td>
              <td className="px-6 py-4 text-neutral-500">
                {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}