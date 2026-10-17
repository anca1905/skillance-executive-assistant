# Skillance Executive Assistant

> **"Lead with Clarity. Execute with Purpose."**  
> Personal executive management system & command center khusus CEO Skillance Digital Indonesia.

---

## Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**.

### 1. Jalankan Server Development

Buka terminal di folder `c:\laragon\www\asisten` lalu jalankan perintah:

```bash
npm run dev
```

### 2. Buka di Browser

Akses URL berikut di browser Anda:
```
http://localhost:3000
```

Aplikasi sudah langsung siap digunakan dengan data awal realistis (*seed data*) untuk CEO Skillance Digital Indonesia, zona waktu WITA (Asia/Makassar, UTC+8), dan antarmuka Bahasa Indonesia yang elegan.

---

## Fitur Utama yang Sudah Aktif

1. **Executive Command Center (Dashboard)**
   - Sapaan dinamis lokal (Pagi/Siang/Sore/Malam).
   - **Today's Focus**: 3 prioritas kritis berbobot bisnis tertinggi.
   - **Today's Schedule**: Timeline rapat & blok Deep Work hari ini.
   - **Task & Project Health**: Pelacakan risiko keterlambatan dan tenggat waktu.
   - **Follow-up & Wellbeing**: Rutinitas dan komitmen klien.
   - **AI Daily Briefing**: Rangkuman status operasional harian.

2. **My Day — Daily Executive Planner**
   - Timeline jadwal harian dan time-blocking bebas bentrokan (*conflict-free*).
   - Tombol **Plan My Day (AI / Rule-based)** dengan dialog konfirmasi sebelum diterapkan ke jadwal.
   - Proteksi otomatis jam istirahat (*protected break time*).
   - Tombol **Start Focus** dan **Reschedule** langsung dari item tugas.

3. **AI Personal Secretary (`/assistant`)**
   - Berperan sebagai Chief of Staff & Sekretaris Eksekutif Digital.
   - Memahami data nyata tugas, agenda, proyek, dan follow-up Anda.
   - Mengusulkan tindakan terstruktur (*proposed actions*) dengan tombol **Konfirmasi & Terapkan** atau **Abaikan**.
   - Dilengkapi *Fallback Smart Rule-Based Engine* jika API key eksternal belum diisi, sehingga sistem selalu responsif.

4. **Tasks & Priorities (`/tasks`)**
   - Tampilan **List** dan **Kanban Board**.
   - Filter status, prioritas (Critical, High, Medium, Low), proyek, dan pencarian.
   - Subtasks checklist interaktif per tugas.

5. **Projects & Milestones (`/projects`)**
   - Pemisahan proyek internal Skillance dan proyek klien eksternal.
   - Indikator risiko keterlambatan (*delay risk*).
   - Milestone checklist dan progres otomatis.

6. **Calendar & Meetings (`/calendar` & `/meetings`)**
   - Deteksi bentrokan waktu otomatis jika ada rapat tumpang tindih.
   - Kategori agenda: Deep Work, Meeting, Client Work, Administration, Rest.
   - Pencatatan notula rapat (*meeting notes*) dan link Google Meet/Zoom.

7. **Follow-ups & Ideas (`/follow-ups` & `/ideas`)**
   - Pelacakan janji komunikasi dengan stakeholder.
   - Quick capture ide inovasi dan konversi 1-klik menjadi Tugas atau Proyek.

8. **Personal Growth (`/goals`, `/habits`, `/focus`, `/journal`, `/review`)**
   - Pelacakan OKRs kuartalan dan tahunan.
   - Rutinitas pagi & malam dengan pencatat *streak*.
   - Timer fokus Pomodoro yang terikat dengan tugas.
   - Jurnal refleksi harian (Wins, Blockers, Lessons Learned, Tomorrow's Priorities).
   - Weekly Review mingguan.

---

## Konfigurasi Lanjutan (Opsional)

### Integrasi Supabase
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Salin dan jalankan skrip SQL di `supabase/schema.sql` pada menu **SQL Editor** Supabase.
3. Masukkan URL dan Anon Key ke file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   ```

### Integrasi AI Provider (OpenRouter / 9 Router / Gemini / OpenAI)

Aplikasi mendukung token dari **OpenRouter (9 Router)** secara langsung:

1. **Cara 1: Lewat Menu Pengaturan di Website (Paling Mudah)**
   - Buka menu **Settings** (`/settings`) di web.
   - Pada bagian **Konfigurasi AI Assistant**, pilih Provider: **OpenRouter (9 Router)**.
   - Masukkan token Anda (yang berawalan `sk-or-v1-...`).
   - Pilih model favorit Anda (contoh: `deepseek/deepseek-chat`, `openai/gpt-4o-mini`, `anthropic/claude-3.5-sonnet`, atau `google/gemini-2.0-flash-exp:free`).
   - Klik **Simpan Pengaturan & Token AI**.
   - Asisten AI di halaman **`/assistant`** akan langsung menggunakan model dan token OpenRouter Anda!

2. **Cara 2: Lewat File `.env.local`**
   - Masukkan ke file `.env.local`:
     ```env
     AI_PROVIDER=openrouter
     AI_API_KEY=sk-or-v1-xxxx
     AI_MODEL=deepseek/deepseek-chat
     ```
   - Restart server development (`npm run dev`).
