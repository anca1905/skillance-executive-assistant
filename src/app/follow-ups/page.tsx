"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  UserCheck,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { QuickAddModal } from "@/components/modals/quick-add-modal";

export default function FollowUpsPage() {
  const { followUps, markFollowUpDone, deleteFollowUp } = useExecutiveStore();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("pending");

  const filtered = followUps.filter((f) => {
    if (filterStatus === "all") return true;
    return f.status === filterStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <UserCheck className="w-4 h-4" /> Stakeholder Relationship
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Follow-up Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola komitmen komunikasi dengan klien, investor, dan mitra strategis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            >
              <option value="pending">Menunggu Tindak Lanjut</option>
              <option value="done">Selesai</option>
              <option value="all">Semua Status</option>
            </select>

            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Follow-up
            </button>
          </div>
        </div>

        {/* Follow-ups List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-slate-400 rounded-2xl border border-[#E2E8F0]">
              Tidak ada data follow-up untuk kategori ini.
            </div>
          ) : (
            filtered.map((fu) => {
              const isDone = fu.status === "done";

              return (
                <div
                  key={fu.id}
                  className={`bg-white p-5 rounded-2xl border transition-all ${
                    isDone ? "border-slate-200 opacity-60" : "border-[#E2E8F0] hover:border-blue-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => markFollowUpDone(fu.id)}
                        className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isDone
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 hover:border-blue-600 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#102A43]">{fu.name}</h3>
                          {fu.organization && (
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              {fu.organization}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {fu.communication_context}
                        </p>

                        {fu.next_action && (
                          <div className="mt-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block">
                            Rencana Tindakan: {fu.next_action}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                          <span>Kontak Terakhir: {fu.last_contacted_date}</span>
                          <span className="font-semibold text-slate-700">
                            Jatuh Tempo Follow-up: {fu.follow_up_date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus follow-up untuk ${fu.name}?`)) {
                          deleteFollowUp(fu.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <QuickAddModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          defaultTab="followup"
        />
      </div>
    </AppShell>
  );
}
