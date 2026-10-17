"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  FolderKanban,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Trash2,
  Building,
  Target,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

export default function ProjectsPage() {
  const {
    projects,
    addProject,
    deleteProject,
    addProjectMilestone,
    toggleProjectMilestone,
    tasks,
  } = useExecutiveStore();

  const [activeTab, setActiveTab] = useState<"all" | "internal" | "client">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New project state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<"internal" | "client">("internal");
  const [clientName, setClientName] = useState("");
  const [deadline, setDeadline] = useState("2026-11-30");
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [delayRisk, setDelayRisk] = useState<"low" | "medium" | "high">("low");

  // Milestone input per project
  const [newMilestoneTitles, setNewMilestoneTitles] = useState<Record<string, string>>({});

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "internal") return p.category === "internal";
    if (activeTab === "client") return p.category === "client";
    return true;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      description: desc.trim(),
      category,
      client_name: category === "client" ? clientName.trim() : undefined,
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
      deadline,
      progress_percentage: 0,
      budget,
      delay_risk: delayRisk,
    });
    setName("");
    setDesc("");
    setClientName("");
    setIsAddModalOpen(false);
  };

  const handleAddMilestone = (projId: string) => {
    const title = newMilestoneTitles[projId];
    if (!title || !title.trim()) return;
    addProjectMilestone(projId, title.trim(), deadline);
    setNewMilestoneTitles((prev) => ({ ...prev, [projId]: "" }));
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <FolderKanban className="w-4 h-4" /> Strategic Portfolio
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Projects & Milestones
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau progres inisiatif strategis internal Skillance dan delivery klien eksternal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "all" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveTab("internal")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "internal" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                }`}
              >
                Internal Skillance
              </button>
              <button
                onClick={() => setActiveTab("client")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "client" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                }`}
              >
                Klien Eksternal
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Buat Proyek
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter((t) => t.project_id === project.id);
            const completedTasks = projectTasks.filter((t) => t.status === "completed");

            return (
              <div
                key={project.id}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            project.category === "client"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {project.category === "client"
                            ? `Klien: ${project.client_name}`
                            : "Internal Skillance"}
                        </span>
                        {project.delay_risk === "high" && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" /> Risiko Keterlambatan
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#102A43] mt-1.5">{project.name}</h3>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus proyek "${project.name}"?`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {project.description && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Progres Keseluruhan</span>
                      <span className="font-bold text-blue-700">{project.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${project.progress_percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                      <span>Tugas: {completedTasks.length} / {projectTasks.length} selesai</span>
                      <span>Deadline: {project.deadline}</span>
                    </div>
                  </div>

                  {/* Milestones Section */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-blue-600" /> Key Milestones
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
                      {(project.milestones || []).map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-xs text-slate-600"
                        >
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={m.is_completed}
                              onChange={() => toggleProjectMilestone(project.id, m.id)}
                              className="rounded text-blue-600 focus:ring-0"
                            />
                            <span className={m.is_completed ? "line-through text-slate-400" : ""}>
                              {m.title}
                            </span>
                          </label>
                          <span className="text-[10px] text-slate-400">{m.target_date}</span>
                        </div>
                      ))}

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="+ Tambah milestone..."
                          value={newMilestoneTitles[project.id] || ""}
                          onChange={(e) =>
                            setNewMilestoneTitles((prev) => ({
                              ...prev,
                              [project.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddMilestone(project.id);
                          }}
                          className="text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddMilestone(project.id)}
                          className="text-xs text-blue-600 font-semibold hover:underline"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {project.budget && (
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                    <span>Anggaran / Nilai Kontrak:</span>
                    <span className="font-bold text-[#102A43]">{formatIDR(project.budget)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Buat Proyek */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-[#102A43]">Inisiasi Proyek Baru</h3>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Proyek *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Skillance AI Mobile App"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi & Tujuan</label>
                  <textarea
                    rows={2}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    >
                      <option value="internal">Internal Skillance</option>
                      <option value="client">Klien Eksternal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tenggat Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {category === "client" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Klien / Perusahaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: PT Kalla Group"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm"
                  >
                    Simpan Proyek
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
