"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Sparkles,
  Plus,
  Flame,
  CheckCircle2,
  Trash2,
  Sun,
  Moon,
  Clock,
} from "lucide-react";

export default function HabitsPage() {
  const { habits, addHabit, deleteHabit, toggleHabitLog, isHabitCompleted } = useExecutiveStore();
  const [selectedDate, setSelectedDate] = useState("2026-10-16");

  React.useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Habit form
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "anytime">("morning");
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "weekly">("daily");

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHabit({
      title: title.trim(),
      description: desc.trim(),
      frequency,
      time_of_day: timeOfDay,
      target_days_per_week: frequency === "daily" ? 7 : frequency === "weekdays" ? 5 : 3,
      is_active: true,
    });
    setTitle("");
    setDesc("");
    setIsAddOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> High-Performance Routines
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Habits & Routines
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Jaga konsistensi rutinitas pagi, tengah hari, dan sore untuk kejernihan berpikir eksekutif
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            />
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Rutinitas
            </button>
          </div>
        </div>

        {/* Habits Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const isDone = isHabitCompleted(habit.id, selectedDate);

            return (
              <div
                key={habit.id}
                className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDone
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-[#E2E8F0] hover:border-blue-300 shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                      {habit.time_of_day === "morning" && <Sun className="w-3 h-3 text-amber-500" />}
                      {habit.time_of_day === "evening" && <Moon className="w-3 h-3 text-indigo-500" />}
                      {habit.time_of_day}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus rutinitas "${habit.title}"?`)) {
                          deleteHabit(habit.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#102A43] mt-2">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {habit.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{habit.streak_current || 0} Hari Streak</span>
                  </div>

                  <button
                    onClick={() => toggleHabitLog(habit.id, selectedDate)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-2xs ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? "Selesai Hari Ini" : "Tandai Check-in"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Tambah Habit */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-[#102A43]">Rutinitas Baru</h3>
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Rutinitas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Evaluasi Penjualan & Pipeline Jam 16:00"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu Eksekusi</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="morning">Pagi (Morning Routine)</option>
                    <option value="afternoon">Siang (Afternoon Break/Focus)</option>
                    <option value="evening">Sore / Malam (Shutdown Routine)</option>
                    <option value="anytime">Kapan Saja</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg shadow-sm"
                  >
                    Simpan Rutinitas
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
