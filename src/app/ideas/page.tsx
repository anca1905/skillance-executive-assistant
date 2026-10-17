"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Lightbulb,
  Plus,
  ArrowRight,
  FolderPlus,
  CheckSquare,
  Trash2,
  Archive,
} from "lucide-react";
import { QuickAddModal } from "@/components/modals/quick-add-modal";

export default function IdeasPage() {
  const {
    ideas,
    convertIdeaToTask,
    convertIdeaToProject,
    deleteIdea,
    updateIdea,
  } = useExecutiveStore();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredIdeas = ideas.filter((i) => {
    if (activeCategory === "all") return true;
    return i.category === activeCategory;
  });

  const handleConvertToTask = (id: string) => {
    const task = convertIdeaToTask(id);
    setSuccessMsg(`Ide berhasil dikonversi menjadi Tugas: "${task.title}"`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleConvertToProject = (id: string) => {
    const proj = convertIdeaToProject(id);
    setSuccessMsg(`Ide berhasil dikonversi menjadi Proyek: "${proj.name}"`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" /> Innovation & Brain Dump
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Ideas & Inbox
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tangkap ide bisnis & produk seketika, lalu ubah menjadi rencana aksi nyata
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            >
              <option value="all">Semua Kategori</option>
              <option value="business">Business</option>
              <option value="product">Product</option>
              <option value="technology">Technology</option>
              <option value="personal">Personal</option>
            </select>

            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tangkap Ide Baru
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold animate-fade-in">
            ✓ {successMsg}
          </div>
        )}

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-2 bg-white p-12 text-center text-xs text-slate-400 rounded-2xl border border-[#E2E8F0]">
              Belum ada ide yang dicatat. Tangkap ide pertama Anda!
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {idea.category}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus ide "${idea.title}"?`)) {
                          deleteIdea(idea.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#102A43] mt-2">{idea.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{idea.description}</p>

                  {idea.follow_up_notes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg mt-3 border border-slate-100">
                      <strong>Catatan:</strong> {idea.follow_up_notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    Status: <strong className="uppercase text-slate-600">{idea.status}</strong>
                  </span>

                  {idea.converted_to_type ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      ✓ Dikonversi ke {idea.converted_to_type}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConvertToTask(idea.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <CheckSquare className="w-3.5 h-3.5" /> Jadi Tugas
                      </button>
                      <button
                        onClick={() => handleConvertToProject(idea.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                      >
                        <FolderPlus className="w-3.5 h-3.5" /> Jadi Proyek
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <QuickAddModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          defaultTab="idea"
        />
      </div>
    </AppShell>
  );
}
