import LeadsTable from "@/components/layouts/admin/LeadsTable";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q || "";

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Dashboard Sincro.ia</h1>
        <button className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition">
          Actualizar Datos
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Distribución por Servicio</h2>
          <p className="text-neutral-500 text-sm">Visualización de demanda en desarrollo.</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Leads Recientes</h2>
          <p className="text-neutral-500 text-sm">Resumen de actividad mensual.</p>
        </div>
      </div>

      <div className="mt-8 bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">Base de Datos de Clientes</h2>
          <form className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre..." 
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-blue-500 w-full md:w-64"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition font-medium">
              Buscar
            </button>
          </form>
        </div>
        
        <LeadsTable query={query} />
      </div>
    </div>
  );
}