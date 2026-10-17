"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import { formatDateID } from "@/lib/utils";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Timer,
  RotateCcw,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { QuickAddModal } from "@/components/modals/quick-add-modal";

export default function MyDayPage() {
  const {
    profile,
    tasks,
    calendarEvents,
    toggleTaskStatus,
    toggleFocusToday,
    rescheduleTask,
    generatePlanMyDay,
    applyPlanMyDay,
  } = useExecutiveStore();

  const [selectedDate, setSelectedDate] = useState("2026-10-16");
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [rescheduleModalTask, setRescheduleModalTask] = useState<string | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState("2026-10-16");

  // Plan My Day Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [plannedPlan, setPlannedPlan] = useState<{ slots: any[]; warnings: string[] }>({
    slots: [],
    warnings: [],
  });

  const dayTasks = tasks.filter(
    (t) => (t.planned_date === selectedDate || t.due_date === selectedDate || t.is_focus_today)
  );
  const dayEvents = calendarEvents
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleOpenPlanMyDay = () => {
    const plan = generatePlanMyDay(selectedDate);
    setPlannedPlan(plan);
    setIsPreviewOpen(true);
  };

  const handleConfirmPlanMyDay = () => {
    applyPlanMyDay(selectedDate, plannedPlan.slots);
    setIsPreviewOpen(false);
  };

  const handleApplyReschedule = (taskId: string) => {
    rescheduleTask(taskId, newRescheduleDate);
    setRescheduleModalTask(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Daily Executive Planner
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              My Day — {formatDateID(selectedDate)}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Jam Kerja: {profile.work_start_time} - {profile.work_end_time} WITA • Istirahat: {profile.break_start_time} - {profile.break_end_time} WITA
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleOpenPlanMyDay}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Plan My Day (AI)
            </button>
            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#102A43] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tugas Baru
            </button>
          </div>
        </div>

        {/* Content Layout: 2 Columns (Timeline & Tasks List) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Schedule & Time Blocking Timeline (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Timeline & Time Blocking
              </h2>
              <span className="text-xs font-semibold text-slate-500">Zona WITA</span>
            </div>

            <div className="space-y-3">
              {/* Break Time Indicator */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Waktu Istirahat Siang
                </span>
                <span className="font-bold">{profile.break_start_time} - {profile.break_end_time} WITA</span>
              </div>

              {/* Combined Scheduled Items (Events + Planned Tasks) */}
              {dayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                      Agenda: {ev.category}
                    </span>
                    <p className="text-xs font-bold text-[#102A43] mt-1">{ev.title}</p>
                    {ev.location && <p className="text-[11px] text-slate-500 mt-0.5">{ev.location}</p>}
                  </div>
                  <span className="text-xs font-bold text-blue-800 whitespace-nowrap">
                    {ev.start_time} - {ev.end_time}
                  </span>
                </div>
              ))}

              {/* Tasks that have planned time */}
              {dayTasks
                .filter((t) => t.planned_start_time)
                .sort((a, b) => (a.planned_start_time || "").localeCompare(b.planned_start_time || ""))
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded uppercase">
                        Blok Tugas ({task.estimated_duration_minutes} mnt)
                      </span>
                      <p className="text-xs font-bold text-[#102A43] mt-1">{task.title}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      {task.planned_start_time} - {task.planned_end_time}
                    </span>
                  </div>
                ))}

              {dayEvents.length === 0 && dayTasks.filter((t) => t.planned_start_time).length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Belum ada blok waktu yang ditetapkan. Klik &quot;Plan My Day&quot; untuk menyusun jadwal cerdas secara otomatis.
                </div>
              )}
            </div>
          </div>

          {/* Right: Tasks List & Execution Center (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#102A43]">
                Daftar Tugas Hari Ini ({dayTasks.length})
              </h2>
              <span className="text-xs text-slate-500">
                Selesai: {dayTasks.filter((t) => t.status === "completed").length}
              </span>
            </div>

            {dayTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Tidak ada tugas untuk tanggal ini. Tambahkan tugas baru atau pilih tanggal lain.
              </div>
            ) : (
              <div className="space-y-3">
                {dayTasks.map((task) => {
                  const isDone = task.status === "completed";
                  const isOverdue = !isDone && task.due_date < selectedDate;

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? "bg-slate-50 border-slate-200 opacity-60"
                          : "bg-white border-slate-200 hover:border-blue-300 shadow-2xs"
                      }`}
                    >
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
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-xs font-bold truncate ${
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
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                            <span>Est: {task.estimated_duration_minutes} menit</span>
                            {task.planned_start_time && (
                              <span className="text-blue-600 font-medium">
                                Jadwal: {task.planned_start_time} - {task.planned_end_time} WITA
                              </span>
                            )}
                            {isOverdue && (
                              <span className="text-red-600 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Terlambat
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: Start Focus & Reschedule */}
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                            <Link
                              href={`/focus?taskId=${task.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              <Timer className="w-3 h-3" /> Start Focus
                            </Link>

                            <button
                              onClick={() => {
                                setNewRescheduleDate(selectedDate);
                                setRescheduleModalTask(task.id);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" /> Reschedule
                            </button>

                            <button
                              onClick={() => toggleFocusToday(task.id)}
                              className={`ml-auto text-[10px] font-semibold px-2 py-1 rounded transition-colors ${
                                task.is_focus_today
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {task.is_focus_today ? "★ Top 3 Fokus" : "+ Jadikan Top Focus"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Plan My Day AI Confirmation Preview */}
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 bg-[#0B1F33] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold tracking-wide">Preview Rencana Jadwal Eksekutif</h3>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mesin Smart Planner telah menyusun blok waktu bebas bentrokan untuk tugas-tugas prioritas Anda, dengan tetap melindungi jam istirahat ({profile.break_start_time} - {profile.break_end_time}) dan rapat yang sudah ada:
                </p>

                {plannedPlan.slots.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 bg-slate-50 rounded-xl text-center">
                    Tidak ada tugas yang perlu dijadwalkan ulang atau seluruh tugas sudah selesai.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {plannedPlan.slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="font-bold text-[#102A43] truncate">{slot.taskTitle}</p>
                          <span className="text-[10px] text-slate-500">Durasi: {slot.durationMinutes} mnt</span>
                        </div>
                        <span className="font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded">
                          {slot.startTime} - {slot.endTime} WITA
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {plannedPlan.warnings.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                    <p className="font-bold">Perhatian:</p>
                    {plannedPlan.warnings.map((w, i) => (
                      <p key={i}>• {w}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmPlanMyDay}
                  disabled={plannedPlan.slots.length === 0}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  Konfirmasi & Terapkan Jadwal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Reschedule Task */}
        {rescheduleModalTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-[#102A43]">Pindahkan Jadwal Tugas</h3>
              <p className="text-xs text-slate-500">Pilih tanggal baru untuk mengeksekusi tugas ini:</p>
              <input
                type="date"
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRescheduleModalTask(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleApplyReschedule(rescheduleModalTask)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg"
                >
                  Simpan Jadwal Baru
                </button>
              </div>
            </div>
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
