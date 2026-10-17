"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import { formatDateID } from "@/lib/utils";
import {
  BookOpen,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
} from "lucide-react";

export default function JournalPage() {
  const { journalEntries, saveJournalEntry, getJournalForDate } = useExecutiveStore();
  const [selectedDate, setSelectedDate] = useState("2026-10-16");

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Form states
  const [winsText, setWinsText] = useState("");
  const [blockersText, setBlockersText] = useState("");
  const [lessons, setLessons] = useState("");
  const [tomorrowText, setTomorrowText] = useState("");
  const [energyLevel, setEnergyLevel] = useState<"high" | "normal" | "low">("high");
  const [notes, setNotes] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing entry for selectedDate
  useEffect(() => {
    const existing = getJournalForDate(selectedDate);
    if (existing) {
      setWinsText(existing.wins.join("\n"));
      setBlockersText(existing.blockers.join("\n"));
      setLessons(existing.lessons_learned || "");
      setTomorrowText(existing.tomorrow_priorities.join("\n"));
      setEnergyLevel(existing.energy_level || "high");
      setNotes(existing.notes || "");
    } else {
      setWinsText("");
      setBlockersText("");
      setLessons("");
      setTomorrowText("");
      setEnergyLevel("high");
      setNotes("");
    }
  }, [selectedDate, getJournalForDate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveJournalEntry({
      date: selectedDate,
      wins: winsText.split("\n").filter((s) => s.trim().length > 0),
      blockers: blockersText.split("\n").filter((s) => s.trim().length > 0),
      lessons_learned: lessons.trim(),
      tomorrow_priorities: tomorrowText.split("\n").filter((s) => s.trim().length > 0),
      energy_level: energyLevel,
      notes: notes.trim(),
    });
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
              <BookOpen className="w-4 h-4" /> Executive Reflection
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Personal Journal & Daily Shutdown
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Refleksi harian CEO: catat kemenangan, hambatan, pelajaran, dan arah prioritas esok hari
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            />
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Jurnal refleksi untuk {formatDateID(selectedDate)} berhasil disimpan!
          </div>
        )}

        {/* Journal Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wins & Achievements */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Pencapaian & Kemenangan Hari Ini (1 per baris)
              </label>
              <textarea
                rows={4}
                value={winsText}
                onChange={(e) => setWinsText(e.target.value)}
                placeholder="Contoh:&#10;• Arsitektur platform selesai tepat waktu&#10;• Presentasi klien PT Bahari Nusantara disetujui"
                className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Blockers & Friction */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Hambatan & Distraksi yang Terjadi (1 per baris)
              </label>
              <textarea
                rows={4}
                value={blockersText}
                onChange={(e) => setBlockersText(e.target.value)}
                placeholder="Contoh:&#10;• Rapat ad-hoc memotong blok fokus siang&#10;• Respon vendor cloud lambat"
                className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Lessons Learned */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Pelajaran yang Didapat (Lesson Learned)
              </label>
              <textarea
                rows={4}
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="Insight kepemimpinan atau operasional yang dipelajari hari ini..."
                className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Tomorrow's Priorities */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Rencana & 3 Prioritas Utama Besok (1 per baris)
              </label>
              <textarea
                rows={4}
                value={tomorrowText}
                onChange={(e) => setTomorrowText(e.target.value)}
                placeholder="Contoh:&#10;• Kick-off review sprint tim Engineering&#10;• Finalisasi pitch deck investor"
                className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Energy Level & Notes */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Tingkat Energi Hari Ini:
              </span>
              <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                {(["high", "normal", "low"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergyLevel(level)}
                    className={`px-3 py-1 rounded-md capitalize transition-colors ${
                      energyLevel === level ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-xl shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" /> Simpan Jurnal Refleksi
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
