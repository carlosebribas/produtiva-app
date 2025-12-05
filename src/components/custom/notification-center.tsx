"use client";

import { useState, useEffect } from "react";
import { Bell, X, CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";
import { supabase, type Notification } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) throw error;
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-lg bg-[#1A1A1A] border border-gray-800 text-gray-400 hover:text-white hover:border-[#4CAF50] transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Notificações</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-800 text-white hover:bg-gray-800"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-400">Carregando...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      notification.read
                        ? "bg-[#0A0A0A] border-gray-800"
                        : "bg-[#1A1A1A] border-[#4CAF50] shadow-lg shadow-[#4CAF50]/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${notification.read ? "text-gray-300" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.created_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
