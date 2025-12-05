"use client";

import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Sparkles,
  Trash2,
  Target,
  MessageSquare,
  FileText,
  Plug
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onTrashClick?: () => void;
  onTasksClick?: () => void;
}

export function Sidebar({ open, onToggle, onTrashClick, onTasksClick }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, onClick: () => router.push("/") },
    { icon: CheckSquare, label: "Tarefas", active: false, onClick: onTasksClick || (() => router.push("/")) },
    { icon: Target, label: "KPIs", active: false, onClick: () => router.push("/kpis") },
    { icon: MessageSquare, label: "Avaliações", active: false, onClick: () => router.push("/evaluations") },
    { icon: FileText, label: "Relatórios", active: false, onClick: () => router.push("/reports") },
    { icon: Plug, label: "Integrações", active: false, onClick: () => router.push("/integrations") },
    { icon: Trash2, label: "Lixeira", active: false, onClick: onTrashClick },
    { icon: Settings, label: "Configurações", active: false, onClick: () => router.push("/settings") },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#0D0D0D] border-r border-gray-800 z-50 transition-all duration-300 ${
          open ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {open ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#45a049] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">Produtiva</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#45a049] flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className={`text-gray-400 hover:text-white hover:bg-gray-800 ${!open && 'hidden'}`}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item.active
                    ? "bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                } ${!open && 'justify-center'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {open && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button 
              onClick={() => router.push("/settings")}
              className={`w-full flex items-center gap-3 hover:bg-gray-800 rounded-xl p-2 transition-all duration-300 ${!open && 'justify-center'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#45a049] flex items-center justify-center text-white font-bold">
                JS
              </div>
              {open && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">João Silva</p>
                  <p className="text-xs text-gray-400 truncate">Gestor</p>
                </div>
              )}
            </button>
          </div>

          {/* Toggle Button (Desktop) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Menu className="w-3 h-3" />
          </Button>
        </div>
      </aside>
    </>
  );
}
