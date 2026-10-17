"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sun,
  Bot,
  Calendar,
  CheckSquare,
  FolderKanban,
  Video,
  UserCheck,
  Lightbulb,
  Target,
  Sparkles,
  Timer,
  BookOpen,
  CalendarDays,
  BarChart3,
  Bell,
  Settings,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useExecutiveStore } from "@/lib/store/executive-store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string | number;
  badgeDanger?: boolean;
  isAIPill?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { notifications, tasks, followUps } = useExecutiveStore();

  const [todayStr, setTodayStr] = useState("2026-10-16");
  useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.is_read).length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== "completed" && t.due_date < todayStr
  ).length;
  const pendingFollowUps = followUps.filter((f) => f.status === "pending").length;

  const navigationGroups: NavGroup[] = [
    {
      title: "COMMAND CENTER",
      items: [
        { label: "Overview", href: "/", icon: LayoutDashboard },
        { label: "My Day", href: "/my-day", icon: Sun, badge: tasks.filter((t) => t.is_focus_today && t.status !== "completed").length },
        { label: "AI Assistant", href: "/assistant", icon: Bot, isAIPill: true },
        { label: "Calendar", href: "/calendar", icon: Calendar },
      ],
    },
    {
      title: "EXECUTION",
      items: [
        { label: "Tasks & Priorities", href: "/tasks", icon: CheckSquare, badge: overdueTasks > 0 ? `${overdueTasks} telat` : undefined, badgeDanger: overdueTasks > 0 },
        { label: "Projects", href: "/projects", icon: FolderKanban },
        { label: "Meetings & Notes", href: "/meetings", icon: Video },
        { label: "Follow-ups", href: "/follow-ups", icon: UserCheck, badge: pendingFollowUps > 0 ? pendingFollowUps : undefined },
        { label: "Ideas & Inbox", href: "/ideas", icon: Lightbulb },
      ],
    },
    {
      title: "PERSONAL GROWTH",
      items: [
        { label: "Goals & OKRs", href: "/goals", icon: Target },
        { label: "Habits & Routines", href: "/habits", icon: Sparkles },
        { label: "Focus Sessions", href: "/focus", icon: Timer },
        { label: "Personal Journal", href: "/journal", icon: BookOpen },
        { label: "Weekly Review", href: "/review", icon: CalendarDays },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Reports & Insights", href: "/reports", icon: BarChart3 },
        { label: "Notifications", href: "/notifications", icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
        { label: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B1F33] text-slate-300 flex flex-col border-r border-[#102A43] transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1E3A5F]/60 bg-[#071524]">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#102A43] border border-blue-400/30 flex items-center justify-center text-white font-bold text-sm shadow-md">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-white group-hover:text-blue-400 transition-colors">
                SKILLANCE
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Executive Assistant
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-[#1E3A5F] text-white font-semibold shadow-sm border border-blue-500/20"
                        : "text-slate-300 hover:bg-[#102A43] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors shrink-0",
                          isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-300"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.isAIPill && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                        AI
                      </span>
                    )}

                    {item.badge !== undefined && !item.isAIPill && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] rounded font-semibold",
                          item.badgeDanger
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-[#102A43] text-slate-300 border border-slate-700"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* CEO Identity Footer */}
        <div className="p-3 border-t border-[#1E3A5F]/60 bg-[#071524]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#0B1F33] border border-[#1E3A5F]">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 text-xs font-semibold shrink-0">
              CEO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Bapak CEO</p>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Skillance Indonesia
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
