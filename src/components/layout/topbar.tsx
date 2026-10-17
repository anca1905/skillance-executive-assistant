"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Plus,
  Bot,
  Bell,
  Clock,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useExecutiveStore } from "@/lib/store/executive-store";
import { QuickAddModal } from "../modals/quick-add-modal";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { profile, notifications, resetToDemoData } = useExecutiveStore();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // WITA / Asia/Makassar context (UTC+8)
      const timeFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: profile.timezone || "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: profile.timezone || "Asia/Makassar",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      setCurrentTimeStr(timeFormatter.format(now) + " WITA");
      setCurrentDateStr(dateFormatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [profile.timezone]);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left: Mobile hamburger & Time Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-800">{currentTimeStr || "WITA"}</span>
            <span className="text-slate-300">|</span>
            <span>{currentDateStr}</span>
          </div>
        </div>

        {/* Right: Quick actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask AI Shortcut */}
          <Link
            href="/assistant"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Tanya Asisten</span>
          </Link>

          {/* Quick Capture (+) Button */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tambah Cepat</span>
          </button>

          {/* Reset Demo Data button for easy CEO testing */}
          <button
            onClick={() => {
              if (confirm("Reset ulang seluruh data ke template awal Skillance Digital Indonesia?")) {
                resetToDemoData();
              }
            }}
            title="Reset ke Contoh Data Awal"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Notifikasi Eksekutif</span>
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Lihat Semua
                  </Link>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-400">
                      Tidak ada notifikasi saat ini
                    </div>
                  ) : (
                    notifications.slice(0, 4).map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CEO User Pill */}
          <Link
            href="/settings"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[#102A43] text-white flex items-center justify-center text-[10px] font-bold">
              C
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden md:inline">
              {profile.name}
            </span>
          </Link>
        </div>
      </header>

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
}
