"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  formatDateID,
  getExecutiveGreeting,
  formatIDR,
} from "@/lib/utils";
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Bot,
  AlertTriangle,
  FolderKanban,
  Target,
  UserCheck,
  Flame,
  CheckSquare,
  ShieldAlert,
} from "lucide-react";
import { QuickAddModal } from "@/components/modals/quick-add-modal";

export default function DashboardOverviewPage() {
  const {
    profile,
    tasks,
    projects,
    calendarEvents,
    followUps,
    goals,
    habits,
    toggleTaskStatus,
    toggleHabitLog,
    isHabitCompleted,
  } = useExecutiveStore();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState<"task" | "event" | "followup" | "idea">("task");

  const [todayStr, setTodayStr] = useState("2026-10-16");
  const [formattedToday, setFormattedToday] = useState("Jumat, 16 Oktober 2026");
  const [greeting, setGreeting] = useState("Selamat Pagi");

  useEffect(() => {
    const now = new Date();
    setTodayStr(now.toISOString().split("T")[0]);
    setFormattedToday(formatDateID(now));
    setGreeting(getExecutiveGreeting());
  }, []);

  // Calculations from REAL store data
  const todayFocusTasks = tasks.filter((t) => t.is_focus_today || t.priority === "critical").slice(0, 3);
  const todayEvents = calendarEvents
    .filter((e) => e.date === todayStr)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const pendingTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled");
  const overdueTasks = pendingTasks.filter((t) => t.due_date < todayStr);
  const completedTodayTasks = tasks.filter((t) => t.completed_at && t.completed_at.startsWith(todayStr));
  const dueTodayTasks = pendingTasks.filter((t) => t.due_date === todayStr);

  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 3);
  const pendingFollowUps = followUps.filter((f) => f.status === "pending").slice(0, 3);

  // Active habits completion calculation
  const totalActiveHabits = habits.filter((h) => h.is_active).length;
  const completedHabitsToday = habits.filter((h) => h.is_active && isHabitCompleted(h.id, todayStr)).length;
  const habitCompletionRate = totalActiveHabits > 0 ? Math.round((completedHabitsToday / totalActiveHabits) * 100) : 0;

  // AI Daily Briefing Synthesis
  const briefingRiskCount = overdueTasks.length + projects.filter((p) => p.delay_risk === "high").length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Executive Command Center
            </div>
            <h1 className="text-2xl font-bold text-[#102A43]">
              {greeting}, {profile.name}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {profile.title} • {profile.company_name} — {formattedToday}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => { setQuickAddTab("task"); setQuickAddOpen(true); }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#102A43] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Tugas
            </button>
            <button
              onClick={() => { setQuickAddTab("event"); setQuickAddOpen(true); }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#102A43] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" /> Buat Agenda
            </button>
            <Link
              href="/assistant"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Bot className="w-4 h-4" /> Tanya Asisten
            </Link>
          </div>
        </div>

        {/* AI Briefing Banner */}
        <div className="bg-gradient-to-r from-[#0B1F33] to-[#102A43] text-white p-5 rounded-2xl shadow-md border border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide flex items-center gap-2">
                  Executive AI Briefing Hari Ini
                  {briefingRiskCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {briefingRiskCount} Perlu Perhatian
                    </span>
                  )}
                </h2>
                <Link
                  href="/my-day"
                  className="text-xs text-blue-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
                >
                  Buka Daily Planner <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Hari ini Anda memiliki <strong className="text-white">{todayEvents.length} agenda rapat</strong> dan{" "}
                <strong className="text-white">{dueTodayTasks.length} tugas jatuh tempo</strong>.
                {overdueTasks.length > 0 ? (
                  <span className="text-amber-300">
                    {" "}Terdapat {overdueTasks.length} tugas tertunda yang sebaiknya diprioritaskan atau dijadwalkan ulang.
                  </span>
                ) : (
                  <span> Tidak ada tugas yang terlewat. Ritme eksekusi terjaga optimal.</span>
                )}
                {" "}Waktu istirahat ({profile.break_start_time} - {profile.break_end_time} WITA) terlindungi tanpa jadwal tumpang tindih.
              </p>
            </div>
          </div>
        </div>

        {/* Grid 1: Today's Focus & Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Today's Focus (Top 3 Priorities) - 7 cols */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <h2 className="text-sm font-bold text-[#102A43]">Today&apos;s Focus — Tiga Prioritas Kritis</h2>
                </div>
                <Link href="/my-day" className="text-xs text-blue-600 hover:underline font-medium">
                  Atur di My Day
                </Link>
              </div>

              {todayFocusTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Belum ada fokus yang ditandai untuk hari ini. Tambahkan tugas atau gunakan &quot;Plan My Day&quot;.
                </div>
              ) : (
                <div className="space-y-3">
                  {todayFocusTasks.map((task, idx) => {
                    const isDone = task.status === "completed";
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isDone
                            ? "bg-slate-50 border-slate-200 opacity-60"
                            : "bg-white border-slate-200 hover:border-blue-300 shadow-2xs"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isDone
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-slate-300 hover:border-blue-600 text-transparent hover:text-slate-400"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                              <p
                                className={`text-xs font-semibold truncate ${
                                  isDone ? "line-through text-slate-400" : "text-[#102A43]"
                                }`}
                              >
                                {task.title}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                              <span className="px-1.5 py-0.5 rounded font-semibold text-[9px] uppercase bg-red-50 text-red-700 border border-red-200">
                                {task.priority}
                              </span>
                              {task.planned_start_time && (
                                <span className="flex items-center gap-1 text-slate-600">
                                  <Clock className="w-3 h-3 text-blue-500" />
                                  {task.planned_start_time} - {task.planned_end_time} WITA
                                </span>
                              )}
                              <span>• Est. {task.estimated_duration_minutes} mnt</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Selesai hari ini: <strong>{completedTodayTasks.length}</strong> tugas</span>
              <Link href="/tasks" className="text-blue-600 hover:underline font-medium">
                Lihat Semua Tugas &rarr;
              </Link>
            </div>
          </div>

          {/* Today's Schedule Timeline - 5 cols */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-[#102A43]">Agenda Hari Ini (WITA)</h2>
                </div>
                <Link href="/calendar" className="text-xs text-blue-600 hover:underline font-medium">
                  Kalender
                </Link>
              </div>

              {todayEvents.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Tidak ada agenda rapat terjadwal untuk hari ini. Waktu luang ideal untuk Deep Work.
                </div>
              ) : (
                <div className="space-y-3">
                  {todayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {ev.start_time} - {ev.end_time}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-slate-500">
                          {ev.category.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#102A43] mt-2 truncate">{ev.title}</p>
                      {ev.meeting_url && (
                        <a
                          href={ev.meeting_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-1.5 text-[11px] text-blue-600 hover:underline font-medium"
                        >
                          Buka Link Rapat &rarr;
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Total agenda: <strong>{todayEvents.length}</strong> blok</span>
              <button
                onClick={() => { setQuickAddTab("event"); setQuickAddOpen(true); }}
                className="text-blue-600 hover:underline font-medium"
              >
                + Tambah Agenda
              </button>
            </div>
          </div>
        </div>

        {/* Grid 2: Task Overview, Active Projects, Goals & OKRs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Task Overview Summary */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-slate-500" /> Ringkasan Tugas
              </h2>
              <Link href="/tasks" className="text-xs text-blue-600 hover:underline">
                Kelola
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-lg font-bold text-[#102A43]">{pendingTasks.length}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Belum Selesai</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
                <p className="text-lg font-bold text-red-600">{overdueTasks.length}</p>
                <p className="text-[10px] text-red-700 font-medium mt-0.5">Terlambat</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <p className="text-lg font-bold text-amber-700">{dueTodayTasks.length}</p>
                <p className="text-[10px] text-amber-800 font-medium mt-0.5">Hari Ini</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <p className="text-lg font-bold text-emerald-700">{completedTodayTasks.length}</p>
                <p className="text-[10px] text-emerald-800 font-medium mt-0.5">Selesai Hari Ini</p>
              </div>
            </div>
          </div>

          {/* 2. Active Projects Progress */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-slate-500" /> Proyek Aktif
              </h2>
              <Link href="/projects" className="text-xs text-blue-600 hover:underline">
                Semua
              </Link>
            </div>
            <div className="space-y-3 mt-2">
              {activeProjects.map((p) => (
                <div key={p.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#102A43] truncate">{p.name}</p>
                    <span className="text-[10px] font-semibold text-slate-500">{p.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${p.progress_percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                    <span className="capitalize">{p.category === "client" ? p.client_name : "Internal"}</span>
                    {p.delay_risk === "high" && (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Risiko Keterlambatan
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CEO Goals & OKRs */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-slate-500" /> Target & OKR Q4
              </h2>
              <Link href="/goals" className="text-xs text-blue-600 hover:underline">
                Detail
              </Link>
            </div>
            <div className="space-y-3 mt-2">
              {goals.slice(0, 2).map((g) => (
                <div key={g.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60">
                  <p className="text-xs font-bold text-[#102A43] line-clamp-1">{g.title}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                    <span>Progres OKR</span>
                    <span className="font-semibold text-blue-600">{g.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${g.progress_percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid 3: Follow-up Center & Personal Wellbeing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Follow-up Center - 7 cols */}
          <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-[#102A43]">Follow-up Klien & Stakeholder</h2>
              </div>
              <Link href="/follow-ups" className="text-xs text-blue-600 hover:underline font-medium">
                Pusat Follow-up
              </Link>
            </div>

            {pendingFollowUps.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                Seluruh follow-up telah tuntas dilaksanakan.
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingFollowUps.map((fu) => (
                  <div
                    key={fu.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#102A43]">
                        {fu.name} {fu.organization ? `(${fu.organization})` : ""}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                        {fu.communication_context}
                      </p>
                      {fu.next_action && (
                        <p className="text-[10px] text-blue-600 font-medium mt-1">
                          Aksi: {fu.next_action}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap bg-white px-2 py-1 rounded border border-slate-200">
                      Tenggat: {fu.follow_up_date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Wellbeing & Routine - 5 cols */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-[#102A43]">Wellbeing & Konsistensi</h2>
              </div>
              <Link href="/habits" className="text-xs text-blue-600 hover:underline font-medium">
                Kebiasaan
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Konsistensi Rutinitas Hari Ini</span>
                <span className="text-xs font-bold text-blue-700">{habitCompletionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${habitCompletionRate}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {habits.slice(0, 3).map((h) => {
                const done = isHabitCompleted(h.id, todayStr);
                return (
                  <div
                    key={h.id}
                    onClick={() => toggleHabitLog(h.id, todayStr)}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className={`text-xs ${done ? "line-through text-slate-400 font-normal" : "font-medium text-slate-700"}`}>
                      {h.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {done ? "Selesai" : "Check-in"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        defaultTab={quickAddTab}
      />
    </AppShell>
  );
}
