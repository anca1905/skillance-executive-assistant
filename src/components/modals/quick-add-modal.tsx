"use client";

import React, { useState } from "react";
import { X, CheckSquare, Calendar, UserCheck, Lightbulb } from "lucide-react";
import { useExecutiveStore } from "@/lib/store/executive-store";
import { Priority } from "@/types";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "task" | "event" | "followup" | "idea";
}

export function QuickAddModal({ isOpen, onClose, defaultTab = "task" }: QuickAddModalProps) {
  const [tab, setTab] = useState<"task" | "event" | "followup" | "idea">(defaultTab);
  const { addTask, addCalendarEvent, addFollowUp, addIdea, projects } = useExecutiveStore();

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<Priority>("medium");
  const [taskDueDate, setTaskDueDate] = useState("2026-10-16");
  const [taskDuration, setTaskDuration] = useState(30);
  const [taskProjectId, setTaskProjectId] = useState("");

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-16");
  const [eventStart, setEventStart] = useState("10:00");
  const [eventEnd, setEventEnd] = useState("11:00");
  const [eventCategory, setEventCategory] = useState<any>("meeting");
  const [eventConflictMsg, setEventConflictMsg] = useState("");

  // Follow-up state
  const [fuName, setFuName] = useState("");
  const [fuOrg, setFuOrg] = useState("");
  const [fuContext, setFuContext] = useState("");
  const [fuDate, setFuDate] = useState("2026-10-16");

  // Idea state
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [ideaCat, setIdeaCat] = useState<any>("business");

  if (!isOpen) return null;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      priority: taskPriority,
      status: "planned",
      due_date: taskDueDate,
      planned_date: taskDueDate,
      estimated_duration_minutes: Number(taskDuration),
      project_id: taskProjectId || null,
      labels: ["Executive"],
    });
    setTaskTitle("");
    onClose();
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    setEventConflictMsg("");
    const res = addCalendarEvent({
      title: eventTitle.trim(),
      date: eventDate,
      start_time: eventStart,
      end_time: eventEnd,
      category: eventCategory,
    });
    if (!res.success && res.conflict) {
      setEventConflictMsg(`Bentrokan terdeteksi dengan agenda: "${res.conflict.title}" (${res.conflict.start_time} - ${res.conflict.end_time})`);
      return;
    }
    setEventTitle("");
    onClose();
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuName.trim() || !fuContext.trim()) return;
    addFollowUp({
      name: fuName.trim(),
      organization: fuOrg.trim(),
      communication_context: fuContext.trim(),
      last_contacted_date: new Date().toISOString().split("T")[0],
      follow_up_date: fuDate,
      status: "pending",
    });
    setFuName("");
    setFuOrg("");
    setFuContext("");
    onClose();
  };

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;
    addIdea({
      title: ideaTitle.trim(),
      description: ideaDesc.trim(),
      category: ideaCat,
      status: "inbox",
    });
    setIdeaTitle("");
    setIdeaDesc("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0B1F33] text-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide">Quick Capture Eksekutif</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-600">
          <button
            onClick={() => { setTab("task"); setEventConflictMsg(""); }}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === "task"
                ? "border-blue-600 text-blue-600 bg-white font-semibold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Tugas
          </button>
          <button
            onClick={() => { setTab("event"); setEventConflictMsg(""); }}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === "event"
                ? "border-blue-600 text-blue-600 bg-white font-semibold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Agenda
          </button>
          <button
            onClick={() => { setTab("followup"); setEventConflictMsg(""); }}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === "followup"
                ? "border-blue-600 text-blue-600 bg-white font-semibold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Follow-up
          </button>
          <button
            onClick={() => { setTab("idea"); setEventConflictMsg(""); }}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === "idea"
                ? "border-blue-600 text-blue-600 bg-white font-semibold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" /> Ide
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === "task" && (
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Tugas Eksekutif *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tinjau Kontrak Kerja Sama Skillance AI"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prioritas</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="critical">Critical (Dampak Tertinggi)</option>
                    <option value="high">High (Tinggi)</option>
                    <option value="medium">Medium (Sedang)</option>
                    <option value="low">Low (Rendah)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimasi Durasi</label>
                  <select
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value={15}>15 Menit</option>
                    <option value={30}>30 Menit</option>
                    <option value={45}>45 Menit</option>
                    <option value={60}>60 Menit (1 Jam)</option>
                    <option value={90}>90 Menit</option>
                    <option value={120}>120 Menit (2 Jam)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tenggat Waktu</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kaitkan ke Proyek</label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 truncate"
                  >
                    <option value="">(Tanpa Proyek / Umum)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg transition-colors shadow-sm"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          )}

          {tab === "event" && (
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Agenda / Pertemuan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rapat Evaluasi Q4 Direksi"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mulai (WITA)</label>
                  <input
                    type="time"
                    value={eventStart}
                    onChange={(e) => setEventStart(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selesai (WITA)</label>
                  <input
                    type="time"
                    value={eventEnd}
                    onChange={(e) => setEventEnd(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Agenda</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="deep_work">Deep Work (Fokus Strategis)</option>
                  <option value="meeting">Meeting (Rapat Internal)</option>
                  <option value="client_work">Client Work (Klien / Investor)</option>
                  <option value="administration">Administration (Operasional)</option>
                  <option value="personal">Personal (Pribadi)</option>
                  <option value="rest">Rest (Waktu Istirahat)</option>
                </select>
              </div>

              {eventConflictMsg && (
                <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
                  ⚠️ {eventConflictMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg transition-colors shadow-sm"
                >
                  Buat Agenda
                </button>
              </div>
            </form>
          )}

          {tab === "followup" && (
            <form onSubmit={handleFollowUpSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kontak / Orang *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Hendra Wijaya"
                    value={fuName}
                    onChange={(e) => setFuName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organisasi / Perusahaan</label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Bahari Nusantara"
                    value={fuOrg}
                    onChange={(e) => setFuOrg(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konteks Komunikasi / Bahasan *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Konfirmasi revisi kontrak adendum sebelum Jumat sore."
                  value={fuContext}
                  onChange={(e) => setFuContext(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Tindak Lanjut (Follow-up)</label>
                <input
                  type="date"
                  value={fuDate}
                  onChange={(e) => setFuDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg transition-colors shadow-sm"
                >
                  Simpan Follow-up
                </button>
              </div>
            </form>
          )}

          {tab === "idea" && (
            <form onSubmit={handleIdeaSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Ide / Tangkapan Pikiran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul AI Voice Note untuk Rangkuman Rapat"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Ide & Pemikiran Awal</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan catatan singkat agar ide tidak hilang saat Anda sedang sibuk..."
                  value={ideaDesc}
                  onChange={(e) => setIdeaDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={ideaCat}
                  onChange={(e) => setIdeaCat(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="business">Business (Peluang Bisnis / Revenue)</option>
                  <option value="product">Product (Inovasi Fitur & Platform)</option>
                  <option value="technology">Technology (Arsitektur & Infrastruktur)</option>
                  <option value="personal">Personal (Pengembangan Diri)</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-lg transition-colors shadow-sm"
                >
                  Simpan ke Inbox Ide
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
