"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Target,
  FolderKanban,
  Flame,
  Save,
  ArrowRight,
} from "lucide-react";

export default function WeeklyReviewPage() {
  const { tasks, projects, goals, habits, focusSessions } = useExecutiveStore();

  const [evaluationNotes, setEvaluationNotes] = useState("");
  const [nextWeekPlan, setNextWeekPlan] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [todayStr, setTodayStr] = useState("2026-10-16");

  useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const delayedTasks = tasks.filter(
    (t) => t.status !== "completed" && t.due_date < todayStr
  );
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const highRiskProjects = projects.filter((p) => p.delay_risk === "high");

  const handleSaveReview = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <CalendarDays className="w-4 h-4" /> Weekly Executive Cadence
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Weekly Review & Retrospective
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi ritme kerja mingguan: pencapaian, durasi deep work, dan rencana strategis pekan depan
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Evaluasi mingguan berhasil disimpan!
          </div>
        )}

        {/* Weekly Metric Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs text-center">
            <p className="text-2xl font-bold text-emerald-600">{completedTasks.length}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Tugas Diselesaikan</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs text-center">
            <p className="text-2xl font-bold text-blue-600">{totalFocusMinutes} mnt</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Total Waktu Fokus</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs text-center">
            <p className="text-2xl font-bold text-amber-600">{delayedTasks.length}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Tugas Tertunda</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs text-center">
            <p className="text-2xl font-bold text-purple-600">{highRiskProjects.length}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Proyek Perlu Perhatian</p>
          </div>
        </div>

        {/* Synthesis & User Evaluation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-[#102A43]">
              Evaluasi Kinerja Mingguan (Manual Review)
            </h2>
            <p className="text-xs text-slate-500">
              Bagaimana Anda menilai efektivitas delegasi, kecepatan eksekusi, dan keseimbangan waktu minggu ini?
            </p>
            <textarea
              rows={6}
              value={evaluationNotes}
              onChange={(e) => setEvaluationNotes(e.target.value)}
              placeholder="Tuliskan evaluasi kepemimpinan mingguan Anda..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-[#102A43]">
              Rekomendasi & Rencana Pekan Depan
            </h2>
            <p className="text-xs text-slate-500">
              Tetapkan 3 sasaran strategis utama yang ingin dicapai pada minggu berikutnya:
            </p>
            <textarea
              rows={6}
              value={nextWeekPlan}
              onChange={(e) => setNextWeekPlan(e.target.value)}
              placeholder="1. Finalisasi UAT Proyek PT Bahari&#10;2. Onboarding 10 CEO perdana&#10;3. Rapat evaluasi OKR mid-quarter..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveReview}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-xl shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan Review Mingguan
          </button>
        </div>
      </div>
    </AppShell>
  );
}
