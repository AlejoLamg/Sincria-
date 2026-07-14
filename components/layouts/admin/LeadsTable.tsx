import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface LeadsTableProps {
  query?: string;
}

// Cambiamos el tipo a any[] temporalmente para evitar que TypeScript 
// bloquee si las columnas en tu base de datos tienen mayúsculas
async function getLeads(query: string): Promise<any[]> {
  let request = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (query) {
    // Si tu columna es Nombre con mayúscula, esto podría fallar, 
    // pero lo dejamos en minúscula por estándar
    request = request.ilike('nombre', `%${query}%`);
  }

  const { data, error } = await request;

  if (error) {
    console.error("Error al traer leads:", error);
    return [];
  }
  
  return data || [];
}

export default async function LeadsTable({ query = "" }: LeadsTableProps) {
  const leads = await getLeads(query);

  // Esto imprimirá en la terminal de tu PC (donde corre npm run dev) lo que realmente llega
  console.log("Datos que llegan de Supabase:", leads);

  // Si llega vacío, mostramos esta alerta en pantalla
  if (!leads || leads.length === 0) {
    return (
      <div className="p-10 text-center text-white bg-neutral-900 border border-neutral-800 rounded-xl">
        <p className="text-lg font-bold">No se están recibiendo datos.</p>
        <p className="text-sm text-yellow-500 mt-2">
          Si tienes registros en Supabase, ve a tu panel de Supabase  Authentication  Policies y asegúrate de desactivar el <strong>Row Level Security (RLS)</strong> para la tabla 'leads', o crea una política de lectura pública.
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
          {leads.map((lead: any) => (
            <tr key={lead.id || Math.random()} className="hover:bg-neutral-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white hover:text-blue-400 underline">
                <Link href={`/admin/clientes/${lead.id}`}>
                  {/* Busca el nombre en minúscula o mayúscula */}
                  {lead.nombre || lead.Nombre || lead.name || "Cliente sin nombre"}
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="text-white">{lead.email || lead.Email || "-"}</div>
                <div className="text-neutral-500 text-xs">{lead.telefono || lead.Telefono || "-"}</div>
              </td>
              <td className="px-6 py-4">
                <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                  {lead.objetivo || lead.Objetivo || "-"}
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