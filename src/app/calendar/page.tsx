"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import { formatDateID } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  MapPin,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { QuickAddModal } from "@/components/modals/quick-add-modal";

export default function CalendarPage() {
  const { calendarEvents, deleteCalendarEvent } = useExecutiveStore();
  const [selectedDate, setSelectedDate] = useState("2026-10-16");

  React.useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const filteredEvents = calendarEvents.filter((e) => {
    if (viewMode === "day") return e.date === selectedDate;
    return true; // For week/month all events visible
  }).sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4" /> Executive Calendar
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Kalender & Manajemen Agenda
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola blok Deep Work, rapat direksi, dan waktu istirahat (WITA, UTC+8)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode("day")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === "day" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                }`}
              >
                Hari
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === "week" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                }`}
              >
                Semua
              </button>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-slate-50"
            />

            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Agenda
            </button>
          </div>
        </div>

        {/* Calendar View Area */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#102A43]">
              {viewMode === "day"
                ? `Agenda: ${formatDateID(selectedDate)}`
                : "Seluruh Agenda Terjadwal"}
            </h2>
            <span className="text-xs text-slate-500">
              Total {filteredEvents.length} Agenda
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Tidak ada agenda terjadwal pada hari ini. Anda bebas menyusun blok Deep Work.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 shadow-2xs transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {ev.category.replace("_", " ")}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus agenda "${ev.title}"?`)) {
                          deleteCalendarEvent(ev.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Hapus Agenda"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#102A43]">{ev.title}</h3>
                    {ev.description && (
                      <p className="text-xs text-slate-500 mt-1">{ev.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-semibold text-blue-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.date} • {ev.start_time} - {ev.end_time} WITA</span>
                    </div>

                    {ev.location && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{ev.location}</span>
                      </div>
                    )}

                    {ev.meeting_url && (
                      <a
                        href={ev.meeting_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Buka Tautan Rapat</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <QuickAddModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          defaultTab="event"
        />
      </div>
    </AppShell>
  );
}
