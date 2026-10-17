"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Target,
  Layers,
  TrendingUp,
} from "lucide-react";

export default function ReportsPage() {
  const { tasks, calendarEvents, focusSessions, projects, goals } = useExecutiveStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.duration_minutes, 0);

  // Category breakdown of events
  const deepWorkCount = calendarEvents.filter((e) => e.category === "deep_work").length;
  const meetingCount = calendarEvents.filter((e) => e.category === "meeting").length;
  const clientWorkCount = calendarEvents.filter((e) => e.category === "client_work").length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> Executive Analytics
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
            Reports & Insights
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis alokasi waktu eksekutif, rasio penyelesaian tugas, dan metrik fokus
          </p>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Tingkat Penyelesaian Tugas
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#102A43]">{taskCompletionRate}%</span>
              <span className="text-xs text-slate-500">{completedTasks} dari {totalTasks} Tugas</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Durasi Deep Work
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-blue-600">{totalFocusMinutes} mnt</span>
              <span className="text-xs text-slate-500">{(totalFocusMinutes / 60).toFixed(1)} Jam Aktual</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (totalFocusMinutes / 300) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Portfolio Proyek Aktif
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#102A43]">{projects.length}</span>
              <span className="text-xs text-slate-500">
                {projects.filter((p) => p.category === "client").length} Klien • {projects.filter((p) => p.category === "internal").length} Internal
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full w-3/4" />
            </div>
          </div>
        </div>

        {/* Breakdown Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Distribusi Alokasi Agenda
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Deep Work (Fokus Mandiri)</span>
                <span className="font-bold text-[#102A43]">{deepWorkCount} Agenda</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Rapat Internal (Team Sync)</span>
                <span className="font-bold text-[#102A43]">{meetingCount} Agenda</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Rapat Klien / Partner Bisnis</span>
                <span className="font-bold text-[#102A43]">{clientWorkCount} Agenda</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Ringkasan Kesehatan Operasional
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Semua metrik dan perhitungan berasal dari basis data riil aplikasi Anda. Untuk memaksimalkan efektivitas sebagai CEO, pertahankan rasio Deep Work minimal 40% dari total jam kerja harian Anda.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
