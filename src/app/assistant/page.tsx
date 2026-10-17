"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useExecutiveStore } from "@/lib/store/executive-store";
import {
  Bot,
  Send,
  Sparkles,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";

export default function AssistantPage() {
  const {
    messages,
    sendAssistantMessage,
    applyProposedAction,
    rejectProposedAction,
    profile,
  } = useExecutiveStore();

  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isSending) return;
    setInputVal("");
    setIsSending(true);
    try {
      await sendAssistantMessage(text.trim());
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    "Apa 3 prioritas terpenting yang harus kuselesaikan hari ini?",
    "Atur jadwalku hari ini agar bebas bentrokan dan istirahat aman",
    "Buatkan tugas: Review progress sprint Skillance AI Platform",
    "Siapa saja stakeholder atau klien yang harus ku-follow up hari ini?",
  ];

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto space-y-4">
        {/* Assistant Header */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#102A43] to-blue-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#102A43]">Sekretaris Eksekutif Skillance</h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Siap Membantu
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Chief of Staff AI khusus CEO • Terintegrasi dengan jadwal WITA & data operasional
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Konteks Data Aktif & Terlindungi</span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 space-y-4 shadow-2xs">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? "bg-[#102A43] text-white"
                      : "bg-blue-600 text-white shadow-xs"
                  }`}
                >
                  {isUser ? "CEO" : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-3 ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#102A43] text-white rounded-tr-xs"
                        : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Proposed Actions (Action Confirmation Cards) */}
                  {msg.proposed_actions && msg.proposed_actions.length > 0 && (
                    <div className="space-y-2 mt-2 w-full">
                      {msg.proposed_actions.map((act) => (
                        <div
                          key={act.id}
                          className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 text-xs text-slate-800 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-900 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              Usulan Tindakan Terstruktur
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                act.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : act.status === "rejected"
                                  ? "bg-slate-200 text-slate-600"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {act.status === "confirmed"
                                ? "Telah Diterapkan"
                                : act.status === "rejected"
                                ? "Ditolak"
                                : "Menunggu Persetujuan"}
                            </span>
                          </div>

                          <p className="font-medium text-slate-700">{act.summary}</p>

                          {act.status === "pending" && (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => applyProposedAction(msg.id, act.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Konfirmasi & Terapkan
                              </button>
                              <button
                                onClick={() => rejectProposedAction(msg.id, act.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Abaikan
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 max-w-3xl mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                Sekretaris sedang menganalisis data eksekutif Anda...
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Quick Executive Prompt Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Saran:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-600 font-medium whitespace-nowrap text-[11px] transition-colors shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan jadwal, minta susun prioritas, atau perintahkan tambah tugas..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-[#102A43] placeholder-slate-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isSending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
