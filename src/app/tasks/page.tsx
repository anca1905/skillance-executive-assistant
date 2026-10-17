"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Columns,
  List,
  AlertTriangle,
  Timer,
  Check,
} from "lucide-react";
import { QuickAddModal } from "@/components/modals/quick-add-modal";
import { Priority, TaskStatus } from "@/types";

export default function TasksPage() {
  const {
    tasks,
    projects,
    toggleTaskStatus,
    deleteTask,
    updateTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useExecutiveStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<Record<string, string>>({});

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    const matchesProject = projectFilter === "all" || t.project_id === projectFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const handleAddSubtask = (taskId: string) => {
    const title = newSubtaskTitles[taskId];
    if (!title || !title.trim()) return;
    addSubtask(taskId, title.trim());
    setNewSubtaskTitles((prev) => ({ ...prev, [taskId]: "" }));
  };

  const kanbanColumns: { status: TaskStatus; label: string }[] = [
    { status: "inbox", label: "Inbox" },
    { status: "planned", label: "Planned" },
    { status: "in_progress", label: "In Progress" },
    { status: "waiting", label: "Waiting" },
    { status: "completed", label: "Completed" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <CheckSquare className="w-4 h-4" /> Execution Management
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Tasks & Priorities
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar eksekusi tugas strategis berbobot tinggi dengan subtasks dan integrasi fokus
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md flex items-center gap-1 transition-colors ${
                  viewMode === "list" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                }`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 rounded-md flex items-center gap-1 transition-colors ${
                  viewMode === "kanban" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                }`}
              >
                <Columns className="w-3.5 h-3.5" /> Kanban
              </button>
            </div>

            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Tugas
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama tugas atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="inbox">Inbox</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            >
              <option value="all">Semua Prioritas</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            >
              <option value="all">Semua Proyek</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Content: List vs Kanban */}
        {viewMode === "list" ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                Tidak ada tugas yang sesuai dengan kriteria filter.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isDone = task.status === "completed";
                const proj = projects.find((p) => p.id === task.project_id);

                return (
                  <div key={task.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isDone
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 hover:border-blue-600 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`text-sm font-bold truncate ${
                              isDone ? "line-through text-slate-400" : "text-[#102A43]"
                            }`}
                          >
                            {task.title}
                          </p>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              task.priority === "critical"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "high"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Status: {task.status}
                          </span>
                          {proj && (
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              Proyek: {proj.name}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>Tenggat: {task.due_date}</span>
                          <span>• Estimasi: {task.estimated_duration_minutes} mnt</span>
                        </div>

                        {/* Subtasks / Checklist */}
                        <div className="mt-3 pl-2 border-l-2 border-slate-200 space-y-1.5">
                          {(task.subtasks || []).map((st) => (
                            <div key={st.id} className="flex items-center gap-2 text-xs text-slate-600">
                              <input
                                type="checkbox"
                                checked={st.is_completed}
                                onChange={() => toggleSubtask(task.id, st.id)}
                                className="rounded text-blue-600 focus:ring-0"
                              />
                              <span className={st.is_completed ? "line-through text-slate-400" : ""}>
                                {st.title}
                              </span>
                              <button
                                onClick={() => deleteSubtask(task.id, st.id)}
                                className="text-slate-400 hover:text-red-500 text-[10px] ml-auto"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="+ Tambah subtask checklist..."
                              value={newSubtaskTitles[task.id] || ""}
                              onChange={(e) =>
                                setNewSubtaskTitles((prev) => ({ ...prev, [task.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddSubtask(task.id);
                              }}
                              className="text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => handleAddSubtask(task.id)}
                              className="text-xs text-blue-600 font-semibold hover:underline"
                            >
                              Simpan
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100 text-xs">
                          <Link
                            href={`/focus?taskId=${task.id}`}
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                          >
                            <Timer className="w-3 h-3" /> Fokus Sekarang
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus tugas "${task.title}"?`)) {
                                deleteTask(task.id);
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 ml-auto flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          ) : (
            /* Kanban Board View */
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
              {kanbanColumns.map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col.status);

                return (
                  <div key={col.status} className="bg-slate-100/70 p-3 rounded-2xl border border-slate-200 flex flex-col">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-[#102A43] uppercase tracking-wide">
                        {col.label}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[65vh]">
                      {colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-all space-y-2"
                        >
                          <p className="text-xs font-bold text-[#102A43] leading-snug">{task.title}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="uppercase font-bold text-red-600">{task.priority}</span>
                            <span>{task.estimated_duration_minutes} mnt</span>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => toggleTaskStatus(task.id)}
                              className="text-[10px] text-blue-600 font-semibold hover:underline"
                            >
                              {task.status === "completed" ? "Buka Kembali" : "Selesaikan"}
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        <QuickAddModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          defaultTab="task"
        />
      </div>
    </AppShell>
  );
}
