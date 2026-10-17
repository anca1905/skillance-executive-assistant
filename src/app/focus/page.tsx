"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

function FocusSessionContent() {
  const searchParams = useSearchParams();
  const urlTaskId = searchParams.get("taskId");

  const { tasks, recordFocusSession, focusSessions } = useExecutiveStore();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(urlTaskId || "");
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [completedSuccess, setCompletedSuccess] = useState(false);

  // Set selected task from URL param if available
  useEffect(() => {
    if (urlTaskId) setSelectedTaskId(urlTaskId);
  }, [urlTaskId]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleStart = () => {
    if (!isActive && !startTime) {
      setStartTime(new Date().toISOString());
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(targetMinutes * 60);
    setStartTime(null);
  };

  const handleSetDuration = (min: number) => {
    setTargetMinutes(min);
    setSecondsRemaining(min * 60);
    setIsActive(false);
    setStartTime(null);
  };

  const handleFinishSession = () => {
    const elapsedMinutes = Math.max(
      1,
      Math.round((targetMinutes * 60 - secondsRemaining) / 60)
    );
    const task = tasks.find((t) => t.id === selectedTaskId);

    recordFocusSession({
      task_id: selectedTaskId || null,
      task_title: task ? task.title : "Deep Work Umum CEO",
      duration_minutes: elapsedMinutes,
      target_duration_minutes: targetMinutes,
      notes: notes.trim(),
      started_at: startTime || new Date().toISOString(),
      ended_at: new Date().toISOString(),
    });

    setIsActive(false);
    setCompletedSuccess(true);
    setNotes("");
    setTimeout(() => setCompletedSuccess(false), 5000);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <Timer className="w-4 h-4" /> Deep Work Chamber
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
            Focus Sessions (Pomodoro)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Blok waktu fokus mendalam tanpa gangguan untuk eksekusi tugas berdampak tinggi
          </p>
        </div>
      </div>

      {completedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Sesi fokus berhasil dicatat ke riwayat eksekutif Anda!
        </div>
      )}

      {/* Main Focus Card */}
      <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-2xs max-w-2xl mx-auto text-center space-y-6">
        {/* Task Selection */}
        <div className="text-left">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Pilih Tugas untuk Sesi Fokus:
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">(Sesi Fokus Umum / Tanpa Tugas Spesifik)</option>
            {tasks
              .filter((t) => t.status !== "completed")
              .map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.priority.toUpperCase()}] {t.title}
                </option>
              ))}
          </select>
        </div>

        {/* Duration Preset Selector */}
        <div className="flex items-center justify-center gap-2">
          {[15, 25, 45, 50, 60].map((min) => (
            <button
              key={min}
              onClick={() => handleSetDuration(min)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                targetMinutes === min
                  ? "bg-[#102A43] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {min} Menit
            </button>
          ))}
        </div>

        {/* Big Countdown Display */}
        <div className="py-6">
          <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#102A43] font-mono">
            {timeString}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {isActive ? "Sesi Berjalan — Minimalkan Distraksi" : "Siap Memulai Deep Work"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Play className="w-4 h-4 fill-white" /> Mulai Sesi
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Pause className="w-4 h-4 fill-white" /> Jeda Sementara
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {(startTime || isActive) && (
            <button
              onClick={handleFinishSession}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Selesaikan & Simpan
            </button>
          )}
        </div>

        {/* Focus Notes Input */}
        <div className="text-left pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Refleksi / Hasil Sesi:
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tuliskan kemajuan yang berhasil dicapai selama blok fokus ini..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Focus History */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" /> Riwayat Sesi Fokus Terbaru
        </h2>

        {focusSessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Belum ada riwayat fokus tercatat.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {focusSessions.slice(0, 5).map((fs) => (
              <div key={fs.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#102A43]">{fs.task_title || "Deep Work"}</p>
                  {fs.notes && <p className="text-slate-500 text-[11px] mt-0.5">{fs.notes}</p>}
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {fs.duration_minutes} Menit
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(fs.started_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FocusPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Memuat Sesi Fokus...</div>}>
        <FocusSessionContent />
      </Suspense>
    </AppShell>
  );
}
