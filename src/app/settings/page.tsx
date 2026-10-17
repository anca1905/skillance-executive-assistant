"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Settings,
  Save,
  CheckCircle2,
  Database,
  Bot,
  Clock,
  RotateCcw,
  ShieldCheck,
  Key,
  Cpu,
  Globe,
} from "lucide-react";

export default function SettingsPage() {
  const { profile, updateProfile, resetToDemoData } = useExecutiveStore();

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [company, setCompany] = useState(profile.company_name);
  const [email, setEmail] = useState(profile.email);
  const [timezone, setTimezone] = useState(profile.timezone || "Asia/Makassar");
  const [workStart, setWorkStart] = useState(profile.work_start_time || "08:30");
  const [workEnd, setWorkEnd] = useState(profile.work_end_time || "17:30");
  const [breakStart, setBreakStart] = useState(profile.break_start_time || "12:00");
  const [breakEnd, setBreakEnd] = useState(profile.break_end_time || "13:00");
  const [focusDuration, setFocusDuration] = useState(profile.default_focus_duration || 25);

  // AI Configuration State
  const [aiProvider, setAiProvider] = useState<any>(profile.ai_provider || "openrouter");
  const [aiApiKey, setAiApiKey] = useState(profile.ai_api_key || "");
  const [aiModel, setAiModel] = useState(profile.ai_model || "deepseek/deepseek-chat");
  const [aiBaseUrl, setAiBaseUrl] = useState(profile.ai_base_url || "");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      title: title.trim(),
      company_name: company.trim(),
      email: email.trim(),
      timezone,
      work_start_time: workStart,
      work_end_time: workEnd,
      break_start_time: breakStart,
      break_end_time: breakEnd,
      default_focus_duration: Number(focusDuration),
      ai_provider: aiProvider,
      ai_api_key: aiApiKey.trim(),
      ai_model: aiModel.trim(),
      ai_base_url: aiBaseUrl.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <Settings className="w-4 h-4" /> System Personalization
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] mt-1">
              Pengaturan & Preferensi CEO
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan identitas eksekutif, jam kerja, zona waktu, dan token provider AI (OpenRouter / Gemini / OpenAI)
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Pengaturan dan kredensial AI berhasil diperbarui!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* AI Provider Configuration (OpenRouter / 9 Router / Gemini / OpenAI) */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-sm font-bold text-[#102A43]">
                    Konfigurasi AI Assistant (OpenRouter / Router AI)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Gunakan token dari OpenRouter (atau router API lainnya) untuk mengakses Claude, DeepSeek, GPT-4o, atau Gemini.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {aiApiKey ? "Token Terpasang" : "Fallback Rule-Based"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Provider AI
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => {
                    const prov = e.target.value;
                    setAiProvider(prov);
                    if (prov === "openrouter" && !aiModel) setAiModel("deepseek/deepseek-chat");
                    if (prov === "gemini" && !aiModel) setAiModel("gemini-1.5-flash");
                    if (prov === "openai" && !aiModel) setAiModel("gpt-4o-mini");
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="openrouter">OpenRouter (9 Router / Router AI)</option>
                  <option value="gemini">Google Gemini AI</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                  <option value="custom">Custom OpenAI-Compatible Router</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Model
                </label>
                <input
                  type="text"
                  placeholder="Contoh: deepseek/deepseek-chat atau openai/gpt-4o-mini"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>API Key / Token (Bearer Token)</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Contoh: <code className="bg-slate-100 px-1 rounded">sk-or-v1-...</code>
                  </span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Tempel token OpenRouter / 9 router Anda di sini..."
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  *Token disimpan aman di penyimpanan lokal peramban Anda dan tidak disebarkan ke publik.
                </p>
              </div>

              {aiProvider === "custom" && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Custom Base URL Endpoint
                  </label>
                  <input
                    type="text"
                    placeholder="https://your-custom-router.com/v1/chat/completions"
                    value={aiBaseUrl}
                    onChange={(e) => setAiBaseUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-[#102A43]">Pilihan Model Populer di OpenRouter:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "deepseek/deepseek-chat",
                  "openai/gpt-4o-mini",
                  "anthropic/claude-3.5-sonnet",
                  "google/gemini-2.0-flash-exp:free",
                  "meta-llama/llama-3.3-70b-instruct",
                ].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setAiProvider("openrouter");
                      setAiModel(m);
                    }}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-blue-400 text-[10px] font-mono text-slate-700"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Executive Profile Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#102A43] border-b border-slate-100 pb-2">
              Identitas Eksekutif
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Posisi *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Time & Schedule Rules Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#102A43] border-b border-slate-100 pb-2">
              Parameter Waktu & Jam Kerja (Smart Planner)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Zona Waktu Operasional
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="Asia/Makassar">Asia/Makassar (WITA, UTC+8)</option>
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB, UTC+7)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT, UTC+9)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Mulai Kerja
                </label>
                <input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Selesai Kerja
                </label>
                <input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mulai Jam Istirahat (Protected)
                </label>
                <input
                  type="time"
                  value={breakStart}
                  onChange={(e) => setBreakStart(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selesai Jam Istirahat
                </label>
                <input
                  type="time"
                  value={breakEnd}
                  onChange={(e) => setBreakEnd(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Durasi Sesi Fokus Default (Menit)
                </label>
                <select
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value={25}>25 Menit (Standar Pomodoro)</option>
                  <option value={50}>50 Menit (Deep Work Intensif)</option>
                  <option value={60}>60 Menit (1 Jam Penuh)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset ulang seluruh data ke template awal Skillance Digital Indonesia?")) {
                  resetToDemoData();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Data Demo
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#102A43] hover:bg-[#0B1F33] rounded-xl shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan & Token AI
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
