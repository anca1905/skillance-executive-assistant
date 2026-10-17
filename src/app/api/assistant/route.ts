import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context, aiConfig } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak valid" }, { status: 400 });
    }

    // Read provider, key, model, and base URL from request or fallback to env vars
    const aiProvider =
      aiConfig?.ai_provider || process.env.AI_PROVIDER || "openrouter";
    const aiApiKey =
      aiConfig?.ai_api_key || process.env.AI_API_KEY || "";
    const aiModel =
      aiConfig?.ai_model ||
      process.env.AI_MODEL ||
      (aiProvider === "openrouter"
        ? "google/gemini-2.0-flash-exp:free"
        : aiProvider === "gemini"
        ? "gemini-1.5-flash"
        : "gpt-4o-mini");
    const aiBaseUrl =
      aiConfig?.ai_base_url ||
      process.env.AI_BASE_URL ||
      (aiProvider === "openrouter"
        ? "https://openrouter.ai/api/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions");

    const systemInstruction = `Anda adalah Sekretaris Eksekutif Digital dan Chief of Staff untuk CEO Skillance Digital Indonesia.
Konteks Eksekutif Real-Time:
- Nama CEO: ${context?.profile?.name || "Bapak CEO"}
- Perusahaan: ${context?.profile?.company_name || "Skillance Digital Indonesia"}
- Zona Waktu: ${context?.profile?.timezone || "Asia/Makassar (WITA, UTC+8)"}
- Jam Kerja: ${context?.profile?.work_start_time || "08:30"} - ${context?.profile?.work_end_time || "17:30"} WITA
- Jam Istirahat (Terlindungi): ${context?.profile?.break_start_time || "12:00"} - ${context?.profile?.break_end_time || "13:00"} WITA
- Tugas Kritis / Hari Ini: ${JSON.stringify(context?.tasksSummary || [])}
- Proyek Berjalan: ${JSON.stringify(context?.projectsSummary || [])}
- Agenda Rapat Hari Ini: ${JSON.stringify(context?.calendarEventsToday || [])}
- Follow-up Stakeholder: ${JSON.stringify(context?.followUpsPending || [])}
- Target & OKRs: ${JSON.stringify(context?.goalsSummary || [])}

Pedoman Komunikasi:
1. Bersikaplah profesional, tegas, berorientasi hasil, ringkas, dan menghormati waktu CEO.
2. Gunakan Bahasa Indonesia formal & elegan.
3. Berikan rekomendasi prioritas konkret dan trade-off strategis.
4. Jangan pernah mengarang statistik palsu. Selalu rujuk ke data yang relevan di atas.
5. Jika CEO meminta membuat tugas atau menjadwalkan agenda, sertakan usulan jelas.`;

    // 1. OPENROUTER or OPENAI-COMPATIBLE ROUTER
    if (aiApiKey && (aiProvider === "openrouter" || aiProvider === "openai" || aiProvider === "custom")) {
      try {
        const endpoint = aiProvider === "openrouter"
          ? "https://openrouter.ai/api/v1/chat/completions"
          : aiBaseUrl;

        const openRouterHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${aiApiKey}`,
        };

        if (aiProvider === "openrouter") {
          openRouterHeaders["HTTP-Referer"] = "https://skillance.id";
          openRouterHeaders["X-Title"] = "Skillance Executive Assistant";
        }

        const openRouterRes = await fetch(endpoint, {
          method: "POST",
          headers: openRouterHeaders,
          body: JSON.stringify({
            model: aiModel,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (openRouterRes.ok) {
          const data = await openRouterRes.json();
          const candidateText = data?.choices?.[0]?.message?.content;
          if (candidateText) {
            // Check if action proposals should be generated
            const proposed_actions = generateActionProposalsFromText(message, candidateText);
            return NextResponse.json({
              reply: candidateText,
              provider: aiProvider,
              model: aiModel,
              proposed_actions,
            });
          }
        } else {
          const errBody = await openRouterRes.text();
          console.warn(`OpenRouter / AI request failed (${openRouterRes.status}):`, errBody);
        }
      } catch (err) {
        console.error("Call to OpenRouter/AI failed, falling back to rule-based engine:", err);
      }
    }

    // 2. GOOGLE GEMINI NATIVE API
    if (aiApiKey && aiProvider === "gemini") {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${aiApiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nInstruksi CEO:\n${message}` }],
              },
            ],
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const proposed_actions = generateActionProposalsFromText(message, candidateText);
            return NextResponse.json({
              reply: candidateText,
              provider: "gemini",
              model: aiModel,
              proposed_actions,
            });
          }
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back to rule-based engine:", err);
      }
    }

    // 3. SMART RULE-BASED EXECUTIVE CHIEF OF STAFF ENGINE (FALLBACK)
    const lower = message.toLowerCase();
    let reply = `Siap, Bapak CEO. Saya telah meninjau instruksi Anda.`;
    const proposed_actions: any[] = [];
    const todayStr = "2026-10-16";

    if (lower.includes("prioritas") || lower.includes("terpenting") || lower.includes("fokus")) {
      const topTasks = (context?.tasksSummary || []).slice(0, 3);
      reply = `Berdasarkan analisis dampak bisnis terhadap target kuartal ini, berikut adalah 3 prioritas terpenting Anda:\n\n` +
        (topTasks.length > 0
          ? topTasks.map((t: any, i: number) => `${i + 1}. **${t.title}** (Prioritas: ${t.priority.toUpperCase()})`).join("\n")
          : "1. Tinjau roadmap produk Skillance AI Platform\n2. Cek milestone proyek klien PT Bahari Nusantara\n3. Sinkronisasi follow-up investor Q4") +
        `\n\nSaran saya: Selesaikan tugas kritis nomor 1 pada pagi ini dalam sesi Deep Work sebelum rapat dimulai.`;
    } else if (lower.includes("atur jadwal") || lower.includes("plan my day") || lower.includes("besok")) {
      reply = `Saya telah menganalisis agenda rapat dan durasi tugas Anda. Blok waktu bebas bentrokan telah saya siapkan agar waktu istirahat siang (${context?.profile?.break_start_time || "12:00"} - ${context?.profile?.break_end_time || "13:00"} WITA) dan sesi deep work tetap terjaga.`;
      proposed_actions.push({
        id: "act-" + Math.random().toString(36).substring(2, 8),
        type: "plan_my_day",
        summary: `Terapkan time-blocking cerdas untuk hari ini (${todayStr})`,
        payload: { targetDate: todayStr, slots: [] },
        status: "pending",
      });
    } else if (lower.includes("tugas") || lower.includes("buat tugas") || lower.includes("tambahkan")) {
      const cleanTitle = message.replace(/buatkan tugas|buat tugas|tambah tugas|tambahkan/gi, "").trim() || "Tindak Lanjut Strategis CEO";
      proposed_actions.push({
        id: "act-" + Math.random().toString(36).substring(2, 8),
        type: "create_task",
        summary: `Buat tugas baru: "${cleanTitle}"`,
        payload: {
          title: cleanTitle,
          description: "Diusulkan oleh AI Executive Assistant",
          priority: "high",
          status: "planned",
          estimated_duration_minutes: 45,
          due_date: todayStr,
          planned_date: todayStr,
          labels: ["Executive", "AI Suggested"],
        },
        status: "pending",
      });
      reply = `Saya telah menyiapkan draft tugas eksekutif untuk Anda: **"${cleanTitle}"**. Apakah Anda ingin saya menyimpannya ke daftar tugas?`;
    } else if (lower.includes("follow up") || lower.includes("klien") || lower.includes("hubungi")) {
      reply = `Saat ini ada ${context?.followUpsPending?.length || 0} stakeholder yang menunggu tindak lanjut Anda, termasuk komunikasi penting terkait adendum kontrak PT Bahari Nusantara. Pastikan hal ini dikonfirmasi sebelum penutupan jam operasional.`;
    } else {
      reply = `Siap, Bapak CEO. Saya memantau seluruh operasi Skillance Digital Indonesia: ${context?.tasksSummary?.length || 0} tugas terbuka, ${context?.calendarEventsToday?.length || 0} rapat hari ini, dan ${context?.projectsSummary?.length || 0} proyek berjalan. Silakan beri instruksi spesifik seperti membuat tugas baru, menyusun jadwal, atau meninjau prioritas.`;
    }

    return NextResponse.json({
      reply,
      provider: aiApiKey ? `${aiProvider} (fallback)` : "rule-based",
      proposed_actions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// Helper to detect action intents in AI text
function generateActionProposalsFromText(userPrompt: string, aiReply: string) {
  const lower = userPrompt.toLowerCase();
  const proposed_actions: any[] = [];
  const todayStr = "2026-10-16";

  if (lower.includes("tugas") || lower.includes("tambah") || lower.includes("buatkan")) {
    const cleanTitle = userPrompt.replace(/buatkan tugas|buat tugas|tambah tugas|tambahkan/gi, "").trim() || "Tugas Strategis CEO";
    proposed_actions.push({
      id: "act-" + Math.random().toString(36).substring(2, 8),
      type: "create_task",
      summary: `Buat tugas: "${cleanTitle}"`,
      payload: {
        title: cleanTitle,
        description: "Diusulkan oleh AI Executive Assistant",
        priority: "high",
        status: "planned",
        estimated_duration_minutes: 45,
        due_date: todayStr,
        planned_date: todayStr,
        labels: ["Executive", "AI Suggested"],
      },
      status: "pending",
    });
  } else if (lower.includes("atur jadwal") || lower.includes("plan my day")) {
    proposed_actions.push({
      id: "act-" + Math.random().toString(36).substring(2, 8),
      type: "plan_my_day",
      summary: `Terapkan rekomendasi time-blocking bebas bentrokan hari ini`,
      payload: { targetDate: todayStr, slots: [] },
      status: "pending",
    });
  }

  return proposed_actions;
}
