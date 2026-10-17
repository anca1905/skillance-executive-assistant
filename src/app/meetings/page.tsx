"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Video,
  Plus,
  Clock,
  MapPin,
  FileText,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { QuickAddModal } from "@/components/modals/quick-add-modal";

export default function MeetingsPage() {
  const { calendarEvents, updateCalendarEvent, deleteCalendarEvent } = useExecutiveStore();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [meetingNotes, setMeetingNotes] = useState("");

  const meetings = calendarEvents.filter(
    (e) => e.category === "meeting" || e.category === "client_work"
  );

  const handleSaveNotes = (id: string) => {
    updateCalendarEvent(id, { notes: meetingNotes });
    setEditingNotesId(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Video className="w-4 h-4" /> Executive Sync & Notes
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Meetings & Notes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Notula rapat direksi, link konferensi video, dan daftar keputusan eksekutif
            </p>
          </div>

          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Jadwalkan Rapat
          </button>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-slate-400 rounded-2xl border border-[#E2E8F0]">
              Tidak ada rapat atau sesi sync yang tersimpan.
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {m.category === "client_work" ? "Rapat Klien / Partner" : "Rapat Internal"}
                    </span>
                    <h3 className="text-sm font-bold text-[#102A43] mt-1.5">{m.title}</h3>
                    {m.description && <p className="text-xs text-slate-500 mt-1">{m.description}</p>}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus agenda rapat "${m.title}"?`)) {
                        deleteCalendarEvent(m.id);
                      }
                    }}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1 font-semibold text-blue-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{m.date} • {m.start_time} - {m.end_time} WITA</span>
                  </div>

                  {m.location && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{m.location}</span>
                    </div>
                  )}

                  {m.meeting_url && (
                    <a
                      href={m.meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Google Meet / Zoom</span>
                    </a>
                  )}
                </div>

                {/* Meeting Notes Section */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      Notula & Keputusan Penting
                    </span>
                    {editingNotesId !== m.id && (
                      <button
                        onClick={() => {
                          setEditingNotesId(m.id);
                          setMeetingNotes(m.notes || "");
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline"
                      >
                        {m.notes ? "Edit Notula" : "+ Catat Notula"}
                      </button>
                    )}
                  </div>

                  {editingNotesId === m.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={meetingNotes}
                        onChange={(e) => setMeetingNotes(e.target.value)}
                        placeholder="Tuliskan poin hasil diskusi, tindakan tindak lanjut, dan kesepakatan..."
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSaveNotes(m.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-md"
                        >
                          Simpan Notula
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 italic bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                      {m.notes || "Belum ada catatan rapat untuk agenda ini."}
                    </p>
                  )}
                </div>
              </div>
            ))
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
