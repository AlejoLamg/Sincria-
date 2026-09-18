"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

export interface PlanItem {
  name: string;
  price: number;
  billing: string;
  label: string;
}

export interface ModuleItem {
  name: string;
  desc: string;
  price: number;
}

export function formatCOP(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

export const AVAILABLE_PLANS: Record<string, PlanItem> = {
  "WEB BASE": {
    name: "WEB BASE",
    price: 1890000,
    billing: "Pago único",
    label: "Plan Web Base (Página web rápida y moderna - $1.890.000 COP)",
  },
  "E-COMMERCE": {
    name: "E-COMMERCE",
    price: 3490000,
    billing: "Pago único",
    label: "Plan E-commerce (Tienda virtual con Wompi/PSE - $3.490.000 COP)",
  },
  "IA PRO": {
    name: "IA PRO",
    price: 2490000,
    billing: "Pago único",
    label: "Plan IA Pro (Agente virtual y automatización 24/7 - $2.490.000 COP)",
  },
  "ECOSISTEMA TOTAL": {
    name: "ECOSISTEMA TOTAL",
    price: 5490000,
    billing: "Pago único",
    label: "Plan Ecosistema Total (Web ultra veloz + Agente IA - $5.490.000 COP)",
  },
};

export const DEFAULT_OBJECTIVE = "Selecciona una opción para tu negocio...";

interface ProjectConfigContextType {
  selectedPlan: PlanItem | null;
  selectedObjective: string;
  selectedModules: ModuleItem[];
  basePrice: number;
  modulesPrice: number;
  totalEstimatedPrice: number;
  selectPlanByName: (planName: string) => void;
  setObjective: (objective: string) => void;
  toggleModule: (module: ModuleItem) => void;
  removeModule: (moduleName: string) => void;
  isModuleSelected: (moduleName: string) => boolean;
  clearConfig: () => void;
}

const ProjectConfigContext = createContext<ProjectConfigContextType | undefined>(undefined);

export function ProjectConfigProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<string>(DEFAULT_OBJECTIVE);
  const [selectedModules, setSelectedModules] = useState<ModuleItem[]>([]);

  const selectPlanByName = (planName: string) => {
    const plan = AVAILABLE_PLANS[planName];
    if (plan) {
      setSelectedPlan(plan);
      setSelectedObjective(plan.label);
    }
  };

  const setObjective = (objective: string) => {
    setSelectedObjective(objective);
    // If objective matches a known plan label, also update selectedPlan
    const matchedPlan = Object.values(AVAILABLE_PLANS).find((p) => p.label === objective);
    if (matchedPlan) {
      setSelectedPlan(matchedPlan);
    }
  };

  const toggleModule = (module: ModuleItem) => {
    setSelectedModules((prev) => {
      const exists = prev.some((m) => m.name === module.name);
      if (exists) {
        return prev.filter((m) => m.name !== module.name);
      }
      return [...prev, module];
    });
  };

  const removeModule = (moduleName: string) => {
    setSelectedModules((prev) => prev.filter((m) => m.name !== moduleName));
  };

  const isModuleSelected = (moduleName: string) => {
    return selectedModules.some((m) => m.name === moduleName);
  };

  const clearConfig = () => {
    setSelectedPlan(null);
    setSelectedObjective(DEFAULT_OBJECTIVE);
    setSelectedModules([]);
  };

  const basePrice = selectedPlan?.price || 0;
  const modulesPrice = useMemo(() => {
    return selectedModules.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedModules]);

  const totalEstimatedPrice = basePrice + modulesPrice;

  return (
    <ProjectConfigContext.Provider
      value={{
        selectedPlan,
        selectedObjective,
        selectedModules,
        basePrice,
        modulesPrice,
        totalEstimatedPrice,
        selectPlanByName,
        setObjective,
        toggleModule,
        removeModule,
        isModuleSelected,
        clearConfig,
      }}
    >
      {children}
    </ProjectConfigContext.Provider>
  );
}

export function useProjectConfig() {
  const context = useContext(ProjectConfigContext);
  if (!context) {
    throw new Error("useProjectConfig must be used within a ProjectConfigProvider");
  }
  return context;
}
