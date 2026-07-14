import Sidebar from "@/components/layouts/admin/Sidebar"; // Necesitaremos crear este componente

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Barra Lateral Fija */}
      <Sidebar />
      
      {/* Área de Contenido Principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}