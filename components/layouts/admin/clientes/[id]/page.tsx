import Sidebar from '@/components/layouts/admin/Sidebar';
import LeadsTable from '@/components/layouts/admin/LeadsTable';
// Aquí importaremos los demás módulos luego

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-sincro-background text-white font-sans">
      
      {/* 1. Nuestro Sidebar actual (lo estilizaremos después) */}
      <Sidebar />

      {/* Área Central Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Cabecera */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alejandro 👋</h1>
            <p className="text-neutral-400 mt-1 text-sm">Here's what's happening with your business today.</p>
          </div>
          {/* Botones de acción (Buscar, Notificaciones) irían aquí */}
        </header>

        {/* Espacio para las 4 Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           {/* Aquí crearemos los StatCards */}
           <div className="h-32 bg-sincro-surface border border-sincro-border rounded-xl"></div>
           <div className="h-32 bg-sincro-surface border border-sincro-border rounded-xl"></div>
           <div className="h-32 bg-sincro-surface border border-sincro-border rounded-xl"></div>
           <div className="h-32 bg-sincro-surface border border-sincro-border rounded-xl"></div>
        </div>

        {/* Pantalla Dividida: Leads vs Proyectos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Columna Izquierda: Nuestra tabla de Leads */}
          <div className="bg-sincro-surface border border-sincro-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="text-sincro-blue">🛡️</span> Leads Pipeline
            </h2>
            <LeadsTable />
          </div>

          {/* Columna Derecha: Proyectos (Próximo paso) */}
          <div className="bg-sincro-surface border border-sincro-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="text-neutral-400">📁</span> Active Projects
            </h2>
            {/* Aquí irá nuestro ProjectsWidget */}
            <div className="h-64 flex items-center justify-center text-neutral-600 text-sm border border-dashed border-sincro-border rounded-lg">
              Módulo de proyectos en construcción...
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}