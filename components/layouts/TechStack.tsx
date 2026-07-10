"use client";
import { motion } from "framer-motion";
import { Cpu, Layout, BrainCircuit, Rocket, Code2, Terminal } from "lucide-react";

export default function TechStack() {
  const stack = [
    { name: "Next.js", icon: <Layout size={20} /> },
    { name: "Tailwind", icon: <Cpu size={20} /> },
    { name: "OpenAI", icon: <BrainCircuit size={20} /> },
    { name: "Vercel", icon: <Rocket size={20} /> },
    { name: "TypeScript", icon: <Code2 size={20} /> },
    { name: "Python", icon: <Terminal size={20} /> },
  ];

  return (
    <section className="py-20 bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-12">
          Tecnología de precisión
        </h2>
        
        {/* Grid compacta y centrada */}
        <div className="flex flex-wrap justify-center gap-4">
          {stack.map((item, index) => (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 px-6 py-3 border border-white/5 rounded-full bg-white/[0.02] hover:border-brand-cyan/30 transition-all"
            >
              <div className="text-brand-cyan">{item.icon}</div>
              <span className="text-sm font-medium text-gray-300">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}