"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Bell,
  CheckCircle2,
  Trash2,
  Calendar,
  AlertTriangle,
  UserCheck,
  Check,
} from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useExecutiveStore();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Bell className="w-4 h-4" /> System Alerts & Reminders
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Notifikasi & Pengingat
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Peringatan tenggat waktu, agenda rapat, dan tindak lanjut follow-up
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Tandai Semua Dibaca
            </button>
            <button
              onClick={clearNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bersihkan
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-400">
              Tidak ada notifikasi saat ini. Seluruh agenda dan komitmen terkendali rapi.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  n.is_read ? "bg-white" : "bg-blue-50/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 p-2 rounded-xl text-white ${
                      n.type === "agenda"
                        ? "bg-blue-600"
                        : n.type === "followup"
                        ? "bg-purple-600"
                        : "bg-amber-600"
                    }`}
                  >
                    {n.type === "agenda" && <Calendar className="w-4 h-4" />}
                    {n.type === "followup" && <UserCheck className="w-4 h-4" />}
                    {n.type !== "agenda" && n.type !== "followup" && <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#102A43]">{n.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>{new Date(n.created_at).toLocaleString("id-ID")}</span>
                      {n.link_url && (
                        <Link
                          href={n.link_url}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          Buka Halaman Terkait &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="text-xs text-blue-600 hover:underline font-semibold whitespace-nowrap"
                  >
                    Tandai Dibaca
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
