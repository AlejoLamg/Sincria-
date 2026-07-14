import Image from "next/image";

export default function Sidebar() {
  // En tu lista de menuItems
const menuItems = ["Dashboard", "Clientes", "Automatizaciones", "Configuración"];
  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 h-screen flex flex-col p-6">
      {/* Logo Area */}
      <div className="mb-10 flex justify-center">
        <Image 
          src="/logo.webp" 
          alt="Sincro.ia Logo" 
          width={140} 
          height={40} 
          priority 
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <a 
            key={item} 
            href={`/admin/${item.toLowerCase()}`} 
            className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all font-medium text-sm tracking-tight"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* User Section (Opcional, pero muy pro) */}
      <div className="pt-6 border-t border-neutral-800">
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">
          Administrador
        </p>
        <p className="text-sm text-white mt-1">Alejo Melo</p>
      </div>
    </aside>
  );
}