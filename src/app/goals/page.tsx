"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Target,
  Plus,
  CheckCircle2,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { GoalTimeframe } from "@/types";

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal, updateKeyResult } = useExecutiveStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Goal Form
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [timeframe, setTimeframe] = useState<GoalTimeframe>("quarterly");
  const [period, setPeriod] = useState("Q4 2026");
  const [deadline, setDeadline] = useState("2026-12-31");

  const filteredGoals = goals.filter((g) => {
    if (selectedTimeframe === "all") return true;
    return g.timeframe === selectedTimeframe;
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({
      title: title.trim(),
      description: desc.trim(),
      timeframe,
      period,
      status: "on_track",
      progress_percentage: 0,
      deadline,
      key_results: [],
    });
    setTitle("");
    setDesc("");
    setIsAddModalOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Target className="w-4 h-4" /> Strategic Objectives
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Goals & OKRs
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Lacak target tahunan, kuartalan, dan bulanan perusahaan beserta Key Results terukur
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            >
              <option value="all">Semua Periode</option>
              <option value="quarterly">Kuartalan (Quarterly)</option>
              <option value="annual">Tahunan (Annual)</option>
              <option value="monthly">Bulanan</option>
            </select>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tetapkan Target Baru
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {goal.period} ({goal.timeframe})
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      Status: {goal.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#102A43] mt-2">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-xs text-slate-500 mt-1">{goal.description}</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Hapus target "${goal.title}"?`)) {
                      deleteGoal(goal.id);
                    }
                  }}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Goal Overall Progress */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Pencapaian Key Results</span>
                  <span className="font-bold text-blue-700">{goal.progress_percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Key Results */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-700">Key Results Terukur:</p>
                <div className="space-y-2">
                  {(goal.key_results || []).map((kr) => (
                    <div
                      key={kr.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-medium text-slate-800">{kr.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-700">
                          {kr.current_value} / {kr.target_value} {kr.unit}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={kr.target_value}
                          value={kr.current_value}
                          onChange={(e) =>
                            updateKeyResult(goal.id, kr.id, Number(e.target.value))
                          }
                          className="w-24 accent-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Buat Target */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-[#102A43]">Tetapkan Target / Objective</h3>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Objective *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ekspansi Pasar B2B Skillance di Indonesia Timur"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Timeframe</label>
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    >
                      <option value="quarterly">Kuartalan</option>
                      <option value="annual">Tahunan</option>
                      <option value="monthly">Bulanan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Periode Label</label>
                    <input
                      type="text"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
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
                    Simpan Target
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
