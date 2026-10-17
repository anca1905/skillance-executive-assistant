import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isToday, isTomorrow, isYesterday } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_APP_DATE = "2026-10-16";

// Get safe date string for client SSR prerender
export function getSafeToday(): string {
  if (typeof window === "undefined") {
    return DEFAULT_APP_DATE;
  }
  return new Date().toISOString().split("T")[0];
}

// Format currency to IDR
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date in Indonesian format (e.g. "Kamis, 16 Oktober 2026")
export function formatDateID(date: string | Date, pattern: string = "EEEE, d MMMM yyyy"): string {
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, pattern, { locale: id });
  } catch {
    return String(date);
  }
}

// Format relative date (e.g., "Hari ini", "Besok", "Kemarin", or "16 Okt")
export function formatRelativeDateID(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) return "Hari ini";
    if (isTomorrow(d)) return "Besok";
    if (isYesterday(d)) return "Kemarin";
    return format(d, "d MMM yyyy", { locale: id });
  } catch {
    return dateStr;
  }
}

// Format time in Asia/Makassar context (WITA)
export function formatTimeWITA(timeStr: string): string {
  if (timeStr.length === 5) return `${timeStr} WITA`;
  try {
    const d = parseISO(timeStr);
    return `${format(d, "HH:mm")} WITA`;
  } catch {
    return timeStr;
  }
}

// Dynamic greeting based on hour (WITA / local)
export function getExecutiveGreeting(hour?: number): string {
  let currentHour = hour;
  if (currentHour === undefined) {
    if (typeof window === "undefined") {
      currentHour = 9;
    } else {
      currentHour = new Date().getHours();
    }
  }
  if (currentHour >= 4 && currentHour < 11) {
    return "Selamat Pagi";
  } else if (currentHour >= 11 && currentHour < 15) {
    return "Selamat Siang";
  } else if (currentHour >= 15 && currentHour < 18) {
    return "Selamat Sore";
  } else {
    return "Selamat Malam";
  }
}

// Generate unique ID for client-side items
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
