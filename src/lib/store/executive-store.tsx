"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  Profile,
  Task,
  Project,
  CalendarEvent,
  FollowUp,
  Goal,
  Habit,
  HabitLog,
  FocusSession,
  JournalEntry,
  Idea,
  AppNotification,
  AssistantConversation,
  AssistantMessage,
  ProposedAction,
  TaskStatus,
  ProjectStatus,
  FollowUpStatus,
} from "@/types";
import {
  initialProfile,
  initialProjects,
  initialTasks,
  initialCalendarEvents,
  initialFollowUps,
  initialGoals,
  initialHabits,
  initialHabitLogs,
  initialFocusSessions,
  initialJournalEntries,
  initialIdeas,
  initialNotifications,
  initialConversation,
  initialMessages,
} from "./initial-data";
import { generateUUID } from "../utils";

interface PlannedSlot {
  taskId: string;
  taskTitle: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

interface ExecutiveStoreContextType {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  toggleFocusToday: (id: string) => void;
  rescheduleTask: (id: string, date: string, startTime?: string, endTime?: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  projects: Project[];
  addProject: (project: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProjectMilestone: (projectId: string, title: string, targetDate: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;

  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, "id" | "user_id" | "created_at" | "updated_at">) => { success: boolean; conflict?: CalendarEvent; event?: CalendarEvent };
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  checkEventConflict: (date: string, startTime: string, endTime: string, excludeId?: string) => CalendarEvent | null;

  followUps: FollowUp[];
  addFollowUp: (item: Omit<FollowUp, "id" | "user_id" | "created_at" | "updated_at">) => FollowUp;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;
  markFollowUpDone: (id: string) => void;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateKeyResult: (goalId: string, krId: string, currentValue: number) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "user_id" | "created_at">) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitLog: (habitId: string, date: string) => void;
  isHabitCompleted: (habitId: string, date: string) => boolean;
  habitLogs: HabitLog[];

  focusSessions: FocusSession[];
  recordFocusSession: (session: Omit<FocusSession, "id" | "user_id" | "created_at">) => void;

  journalEntries: JournalEntry[];
  saveJournalEntry: (entry: Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">) => void;
  getJournalForDate: (date: string) => JournalEntry | undefined;

  ideas: Idea[];
  addIdea: (idea: Omit<Idea, "id" | "user_id" | "created_at" | "updated_at">) => Idea;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  convertIdeaToTask: (ideaId: string) => Task;
  convertIdeaToProject: (ideaId: string) => Project;

  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  conversations: AssistantConversation[];
  currentConversationId: string;
  setCurrentConversationId: (id: string) => void;
  messages: AssistantMessage[];
  sendAssistantMessage: (text: string) => Promise<void>;
  applyProposedAction: (messageId: string, actionId: string) => void;
  rejectProposedAction: (messageId: string, actionId: string) => void;

  // Plan My Day Engine
  generatePlanMyDay: (targetDate: string) => { slots: PlannedSlot[]; warnings: string[] };
  applyPlanMyDay: (targetDate: string, slots: PlannedSlot[]) => void;

  isInitialized: boolean;
  resetToDemoData: () => void;
}

const STORAGE_KEY = "skillance_executive_assistant_v1";

const ExecutiveStoreContext = createContext<ExecutiveStoreContextType | null>(null);

export function ExecutiveStoreProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(initialHabitLogs);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(initialFocusSessions);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [conversations, setConversations] = useState<AssistantConversation[]>([initialConversation]);
  const [currentConversationId, setCurrentConversationId] = useState<string>("conv-default");
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);

  // Load state from localStorage on initial client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.calendarEvents) setCalendarEvents(parsed.calendarEvents);
        if (parsed.followUps) setFollowUps(parsed.followUps);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.habitLogs) setHabitLogs(parsed.habitLogs);
        if (parsed.focusSessions) setFocusSessions(parsed.focusSessions);
        if (parsed.journalEntries) setJournalEntries(parsed.journalEntries);
        if (parsed.ideas) setIdeas(parsed.ideas);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.conversations) setConversations(parsed.conversations);
        if (parsed.messages) setMessages(parsed.messages);
      }
    } catch (e) {
      console.error("Error reading executive store from storage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const payload = {
        profile,
        tasks,
        projects,
        calendarEvents,
        followUps,
        goals,
        habits,
        habitLogs,
        focusSessions,
        journalEntries,
        ideas,
        notifications,
        conversations,
        messages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Error persisting executive store:", e);
    }
  }, [
    isInitialized,
    profile,
    tasks,
    projects,
    calendarEvents,
    followUps,
    goals,
    habits,
    habitLogs,
    focusSessions,
    journalEntries,
    ideas,
    notifications,
    conversations,
    messages,
  ]);

  const resetToDemoData = useCallback(() => {
    setProfile(initialProfile);
    setTasks(initialTasks);
    setProjects(initialProjects);
    setCalendarEvents(initialCalendarEvents);
    setFollowUps(initialFollowUps);
    setGoals(initialGoals);
    setHabits(initialHabits);
    setHabitLogs(initialHabitLogs);
    setFocusSessions(initialFocusSessions);
    setJournalEntries(initialJournalEntries);
    setIdeas(initialIdeas);
    setNotifications(initialNotifications);
    setConversations([initialConversation]);
    setMessages(initialMessages);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Profile operations
  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
  }, []);

  // Task operations
  const addTask = useCallback((taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newTask: Task = {
      ...taskData,
      id: generateUUID(),
      user_id: profile.id,
      labels: taskData.labels || [],
      subtasks: taskData.subtasks || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, [profile.id]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isDone = t.status === "completed";
        const newStatus: TaskStatus = isDone ? "planned" : "completed";
        return {
          ...t,
          status: newStatus,
          completed_at: isDone ? null : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      })
    );
  }, []);

  const toggleFocusToday = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_focus_today: !t.is_focus_today, updated_at: new Date().toISOString() } : t))
    );
  }, []);

  const rescheduleTask = useCallback((id: string, date: string, startTime?: string, endTime?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              planned_date: date,
              due_date: date,
              planned_start_time: startTime || t.planned_start_time,
              planned_end_time: endTime || t.planned_end_time,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentSubtasks = t.subtasks || [];
        const newSubtask = {
          id: generateUUID(),
          task_id: taskId,
          title,
          is_completed: false,
          order_index: currentSubtasks.length,
        };
        return {
          ...t,
          subtasks: [...currentSubtasks, newSubtask],
          updated_at: new Date().toISOString(),
        };
      })
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, is_completed: !st.is_completed } : st
        );
        return { ...t, subtasks: updated, updated_at: new Date().toISOString() };
      })
    );
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = (t.subtasks || []).filter((st) => st.id !== subtaskId);
        return { ...t, subtasks: updated, updated_at: new Date().toISOString() };
      })
    );
  }, []);

  // Project operations
  const addProject = useCallback((projData: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newProj: Project = {
      ...projData,
      id: generateUUID(),
      user_id: profile.id,
      milestones: projData.milestones || [],
      progress_percentage: projData.progress_percentage || 0,
      delay_risk: projData.delay_risk || "low",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  }, [profile.id]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addProjectMilestone = useCallback((projectId: string, title: string, targetDate: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newM = {
          id: generateUUID(),
          project_id: projectId,
          title,
          target_date: targetDate,
          is_completed: false,
        };
        return { ...p, milestones: [...(p.milestones || []), newM], updated_at: new Date().toISOString() };
      })
    );
  }, []);

  const toggleProjectMilestone = useCallback((projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedM = (p.milestones || []).map((m) =>
          m.id === milestoneId ? { ...m, is_completed: !m.is_completed } : m
        );
        const total = updatedM.length;
        const completed = updatedM.filter((m) => m.is_completed).length;
        const newProgress = total > 0 ? Math.round((completed / total) * 100) : p.progress_percentage;
        return {
          ...p,
          milestones: updatedM,
          progress_percentage: newProgress,
          updated_at: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Calendar Event & Conflict operations
  const checkEventConflict = useCallback((date: string, startTime: string, endTime: string, excludeId?: string) => {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };
    const reqStart = toMinutes(startTime);
    const reqEnd = toMinutes(endTime);

    for (const ev of calendarEvents) {
      if (ev.id === excludeId) continue;
      if (ev.date !== date) continue;

      const evStart = toMinutes(ev.start_time);
      const evEnd = toMinutes(ev.end_time);

      // Conflict if time intervals overlap: max(reqStart, evStart) < min(reqEnd, evEnd)
      if (Math.max(reqStart, evStart) < Math.min(reqEnd, evEnd)) {
        return ev;
      }
    }
    return null;
  }, [calendarEvents]);

  const addCalendarEvent = useCallback((eventData: Omit<CalendarEvent, "id" | "user_id" | "created_at" | "updated_at">) => {
    const conflict = checkEventConflict(eventData.date, eventData.start_time, eventData.end_time);
    if (conflict) {
      return { success: false, conflict };
    }
    const newEvent: CalendarEvent = {
      ...eventData,
      id: generateUUID(),
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
    return { success: true, event: newEvent };
  }, [profile.id, checkEventConflict]);

  const updateCalendarEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e))
    );
  }, []);

  const deleteCalendarEvent = useCallback((id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Follow-up operations
  const addFollowUp = useCallback((itemData: Omit<FollowUp, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newItem: FollowUp = {
      ...itemData,
      id: generateUUID(),
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setFollowUps((prev) => [newItem, ...prev]);
    return newItem;
  }, [profile.id]);

  const updateFollowUp = useCallback((id: string, updates: Partial<FollowUp>) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, updated_at: new Date().toISOString() } : f))
    );
  }, []);

  const deleteFollowUp = useCallback((id: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const markFollowUpDone = useCallback((id: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "done", updated_at: new Date().toISOString() } : f
      )
    );
  }, []);

  // Goals operations
  const addGoal = useCallback((goalData: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateUUID(),
      user_id: profile.id,
      key_results: goalData.key_results || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  }, [profile.id]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateKeyResult = useCallback((goalId: string, krId: string, currentValue: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedKrs = (g.key_results || []).map((kr) => {
          if (kr.id !== krId) return kr;
          const isDone = currentValue >= kr.target_value;
          return { ...kr, current_value: currentValue, is_completed: isDone };
        });
        const total = updatedKrs.length;
        const completed = updatedKrs.filter((k) => k.is_completed).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : g.progress_percentage;
        return {
          ...g,
          key_results: updatedKrs,
          progress_percentage: progress,
          updated_at: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Habits operations
  const addHabit = useCallback((habitData: Omit<Habit, "id" | "user_id" | "created_at">) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateUUID(),
      user_id: profile.id,
      streak_current: 0,
      streak_longest: 0,
      created_at: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  }, [profile.id]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleHabitLog = useCallback((habitId: string, date: string) => {
    setHabitLogs((prev) => {
      const existing = prev.find((l) => l.habit_id === habitId && l.date === date);
      if (existing) {
        return prev.filter((l) => !(l.habit_id === habitId && l.date === date));
      } else {
        const newLog: HabitLog = {
          id: generateUUID(),
          habit_id: habitId,
          user_id: profile.id,
          date,
          is_completed: true,
          created_at: new Date().toISOString(),
        };
        return [...prev, newLog];
      }
    });

    // Update streak for habit
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const curStreak = (h.streak_current || 0) + 1;
        const longest = Math.max(h.streak_longest || 0, curStreak);
        return { ...h, streak_current: curStreak, streak_longest: longest };
      })
    );
  }, [profile.id]);

  const isHabitCompleted = useCallback((habitId: string, date: string) => {
    return habitLogs.some((l) => l.habit_id === habitId && l.date === date && l.is_completed);
  }, [habitLogs]);

  // Focus sessions
  const recordFocusSession = useCallback((sessionData: Omit<FocusSession, "id" | "user_id" | "created_at">) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: generateUUID(),
      user_id: profile.id,
      created_at: new Date().toISOString(),
    };
    setFocusSessions((prev) => [newSession, ...prev]);
  }, [profile.id]);

  // Journal entries
  const saveJournalEntry = useCallback((entryData: Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">) => {
    setJournalEntries((prev) => {
      const idx = prev.findIndex((e) => e.date === entryData.date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ...entryData,
          updated_at: new Date().toISOString(),
        };
        return updated;
      } else {
        const newEntry: JournalEntry = {
          ...entryData,
          id: generateUUID(),
          user_id: profile.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return [newEntry, ...prev];
      }
    });
  }, [profile.id]);

  const getJournalForDate = useCallback((date: string) => {
    return journalEntries.find((e) => e.date === date);
  }, [journalEntries]);

  // Ideas & Inbox operations
  const addIdea = useCallback((ideaData: Omit<Idea, "id" | "user_id" | "created_at" | "updated_at">) => {
    const newIdea: Idea = {
      ...ideaData,
      id: generateUUID(),
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setIdeas((prev) => [newIdea, ...prev]);
    return newIdea;
  }, [profile.id]);

  const updateIdea = useCallback((id: string, updates: Partial<Idea>) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i))
    );
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const convertIdeaToTask = useCallback((ideaId: string): Task => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) throw new Error("Idea not found");
    const today = new Date().toISOString().split("T")[0];
    const createdTask = addTask({
      title: idea.title,
      description: idea.description,
      priority: "medium",
      status: "inbox",
      estimated_duration_minutes: 30,
      due_date: today,
      labels: ["Converted Idea", idea.category],
      notes: idea.follow_up_notes,
    });
    updateIdea(ideaId, {
      status: "planned",
      converted_to_type: "task",
      converted_to_id: createdTask.id,
    });
    return createdTask;
  }, [ideas, addTask, updateIdea]);

  const convertIdeaToProject = useCallback((ideaId: string): Project => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) throw new Error("Idea not found");
    const today = new Date().toISOString().split("T")[0];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    const createdProject = addProject({
      name: idea.title,
      description: idea.description,
      category: "internal",
      status: "planning",
      start_date: today,
      deadline: targetDate.toISOString().split("T")[0],
      progress_percentage: 0,
      delay_risk: "low",
      notes: `Dikonversi dari Ide: ${idea.follow_up_notes || ""}`,
    });
    updateIdea(ideaId, {
      status: "planned",
      converted_to_type: "project",
      converted_to_id: createdProject.id,
    });
    return createdProject;
  }, [ideas, addProject, updateIdea]);

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Assistant messaging & Actions
  const applyProposedAction = useCallback((messageId: string, actionId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg || !msg.proposed_actions) return;
    const action = msg.proposed_actions.find((a) => a.id === actionId);
    if (!action || action.status !== "pending") return;

    if (action.type === "create_task") {
      addTask(action.payload);
    } else if (action.type === "schedule_event") {
      addCalendarEvent(action.payload);
    } else if (action.type === "create_followup") {
      addFollowUp(action.payload);
    } else if (action.type === "plan_my_day") {
      const { targetDate, slots } = action.payload;
      applyPlanMyDay(targetDate, slots);
    }

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const updatedActions = (m.proposed_actions || []).map((a) =>
          a.id === actionId ? { ...a, status: "confirmed" as const } : a
        );
        return { ...m, proposed_actions: updatedActions };
      })
    );

    // Notify user of successful action
    setNotifications((prev) => [
      {
        id: generateUUID(),
        user_id: profile.id,
        title: "Tindakan AI Berhasil Diterapkan",
        message: action.summary,
        type: "system",
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [messages, addTask, addCalendarEvent, addFollowUp, profile.id]);

  const rejectProposedAction = useCallback((messageId: string, actionId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const updatedActions = (m.proposed_actions || []).map((a) =>
          a.id === actionId ? { ...a, status: "rejected" as const } : a
        );
        return { ...m, proposed_actions: updatedActions };
      })
    );
  }, []);

  // Plan My Day Engine (Rule-based & Conflict-free)
  const generatePlanMyDay = useCallback((targetDate: string) => {
    const warnings: string[] = [];
    const slots: PlannedSlot[] = [];

    // Working hours & break times from profile
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };
    const toTimeStr = (totalMinutes: number) => {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const workStart = toMinutes(profile.work_start_time || "08:30");
    const workEnd = toMinutes(profile.work_end_time || "17:30");
    const breakStart = toMinutes(profile.break_start_time || "12:00");
    const breakEnd = toMinutes(profile.break_end_time || "13:00");

    // Existing calendar events for targetDate
    const existingEvents = calendarEvents.filter((e) => e.date === targetDate);
    const busyIntervals: [number, number][] = [
      [breakStart, breakEnd],
      ...existingEvents.map((e): [number, number] => [toMinutes(e.start_time), toMinutes(e.end_time)]),
    ];
    busyIntervals.sort((a, b) => a[0] - b[0]);

    // Candidate tasks for targetDate (focus today first, then critical, high, medium)
    const priorityWeight: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const candidateTasks = tasks
      .filter((t) => t.status !== "completed" && t.status !== "cancelled")
      .filter((t) => t.planned_date === targetDate || t.due_date === targetDate || t.is_focus_today)
      .sort((a, b) => {
        if (a.is_focus_today && !b.is_focus_today) return -1;
        if (!a.is_focus_today && b.is_focus_today) return 1;
        return (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      });

    let currentPointer = workStart;

    for (const task of candidateTasks) {
      const duration = task.estimated_duration_minutes || 30;
      let scheduled = false;

      while (currentPointer + duration <= workEnd) {
        const proposedStart = currentPointer;
        const proposedEnd = currentPointer + duration;

        // Check if overlaps with any busy interval
        const hasOverlap = busyIntervals.some(
          ([start, end]) => Math.max(proposedStart, start) < Math.min(proposedEnd, end)
        );

        if (!hasOverlap) {
          slots.push({
            taskId: task.id,
            taskTitle: task.title,
            startTime: toTimeStr(proposedStart),
            endTime: toTimeStr(proposedEnd),
            durationMinutes: duration,
          });
          busyIntervals.push([proposedStart, proposedEnd]);
          busyIntervals.sort((a, b) => a[0] - b[0]);
          currentPointer = proposedEnd + 10; // 10 min buffer between executive tasks
          scheduled = true;
          break;
        } else {
          // Jump pointer past the overlapping interval
          const overlapping = busyIntervals.find(
            ([start, end]) => Math.max(proposedStart, start) < Math.min(proposedEnd, end)
          );
          if (overlapping) {
            currentPointer = Math.max(currentPointer + 15, overlapping[1]);
          } else {
            currentPointer += 15;
          }
        }
      }

      if (!scheduled) {
        warnings.push(`Tugas "${task.title}" tidak muat dalam jam kerja normal tanpa melebihi batas waktu.`);
      }
    }

    return { slots, warnings };
  }, [profile, calendarEvents, tasks]);

  const applyPlanMyDay = useCallback((targetDate: string, slots: PlannedSlot[]) => {
    setTasks((prev) =>
      prev.map((t) => {
        const slot = slots.find((s) => s.taskId === t.id);
        if (slot) {
          return {
            ...t,
            planned_date: targetDate,
            planned_start_time: slot.startTime,
            planned_end_time: slot.endTime,
            status: t.status === "inbox" ? "planned" : t.status,
            updated_at: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, []);

  // Send message to AI Assistant
  const sendAssistantMessage = useCallback(async (text: string) => {
    const userMsg: AssistantMessage = {
      id: generateUUID(),
      conversation_id: currentConversationId,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          aiConfig: {
            ai_provider: profile.ai_provider,
            ai_api_key: profile.ai_api_key,
            ai_model: profile.ai_model,
            ai_base_url: profile.ai_base_url,
          },
          context: {
            profile,
            tasksSummary: tasks.filter((t) => t.status !== "completed").slice(0, 10),
            projectsSummary: projects.map((p) => ({ name: p.name, status: p.status, risk: p.delay_risk })),
            calendarEventsToday: calendarEvents.filter((c) => c.date === new Date().toISOString().split("T")[0]),
            followUpsPending: followUps.filter((f) => f.status === "pending"),
            goalsSummary: goals.map((g) => ({ title: g.title, progress: g.progress_percentage })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Assistant response not ok");
      }

      const data = await response.json();
      const assistantMsg: AssistantMessage = {
        id: generateUUID(),
        conversation_id: currentConversationId,
        role: "assistant",
        content: data.reply || "Saya telah memproses instruksi Anda.",
        proposed_actions: data.proposed_actions || [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback Executive Rule-Based Response Engine
      const lower = text.toLowerCase();
      let reply = "Saya telah mencatat permintaan Anda, Pak CEO.";
      const proposed_actions: ProposedAction[] = [];

      if (lower.includes("prioritas") || lower.includes("terpenting")) {
        const topTasks = tasks
          .filter((t) => t.is_focus_today || t.priority === "critical")
          .slice(0, 3);
        reply = `Berdasarkan analisis dampak bisnis, berikut 3 prioritas terpenting Anda hari ini:\n\n` +
          topTasks.map((t, idx) => `${idx + 1}. **${t.title}** (${t.priority.toUpperCase()} - estimasi ${t.estimated_duration_minutes} mnt)`).join("\n") +
          `\n\nFokuskan energi pagi pada tugas-tugas kritis ini sebelum terdistraksi hal administratif.`;
      } else if (lower.includes("atur jadwal") || lower.includes("plan my day") || lower.includes("besok")) {
        const today = new Date().toISOString().split("T")[0];
        const plan = generatePlanMyDay(today);
        reply = `Saya telah menyusun rancangan blok waktu bebas bentrokan untuk hari ini. Agenda pertemuan Anda tetap terlindungi, serta waktu istirahat tengah hari tetap aman. Silakan tinjau dan konfirmasi jadwal di bawah ini:`;
        proposed_actions.push({
          id: generateUUID(),
          type: "plan_my_day",
          summary: `Terapkan jadwal kerja terstruktur untuk ${plan.slots.length} tugas hari ini`,
          payload: { targetDate: today, slots: plan.slots },
          status: "pending",
        });
      } else if (lower.includes("tugas") || lower.includes("buatkan tugas")) {
        const today = new Date().toISOString().split("T")[0];
        proposed_actions.push({
          id: generateUUID(),
          type: "create_task",
          summary: `Buat tugas baru: "${text.replace(/buatkan tugas|tambah tugas/gi, "").trim() || "Tugas Strategis CEO"}"`,
          payload: {
            title: text.replace(/buatkan tugas|tambah tugas/gi, "").trim() || "Tugas Strategis CEO",
            description: "Diusulkan oleh AI Executive Assistant",
            priority: "high",
            status: "planned",
            estimated_duration_minutes: 45,
            due_date: today,
            planned_date: today,
            labels: ["Executive", "AI Suggested"],
          },
          status: "pending",
        });
        reply = `Saya telah menyiapkan draft tugas eksekutif untuk Anda. Apakah Anda ingin saya menyimpannya ke daftar tugas?`;
      } else {
        reply = `Siap, Bapak CEO. Terkait "${text}", seluruh data operasional, pipeline proyek, dan komitmen jadwal telah saya pantau. Apakah ada tugas spesifik yang ingin dijadwalkan ulang atau didelegasikan?`;
      }

      const assistantMsg: AssistantMessage = {
        id: generateUUID(),
        conversation_id: currentConversationId,
        role: "assistant",
        content: reply,
        proposed_actions,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
  }, [currentConversationId, profile, tasks, projects, calendarEvents, followUps, goals, generatePlanMyDay]);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      toggleFocusToday,
      rescheduleTask,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      projects,
      addProject,
      updateProject,
      deleteProject,
      addProjectMilestone,
      toggleProjectMilestone,
      calendarEvents,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent,
      checkEventConflict,
      followUps,
      addFollowUp,
      updateFollowUp,
      deleteFollowUp,
      markFollowUpDone,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      updateKeyResult,
      habits,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitLog,
      isHabitCompleted,
      habitLogs,
      focusSessions,
      recordFocusSession,
      journalEntries,
      saveJournalEntry,
      getJournalForDate,
      ideas,
      addIdea,
      updateIdea,
      deleteIdea,
      convertIdeaToTask,
      convertIdeaToProject,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      conversations,
      currentConversationId,
      setCurrentConversationId,
      messages,
      sendAssistantMessage,
      applyProposedAction,
      rejectProposedAction,
      generatePlanMyDay,
      applyPlanMyDay,
      isInitialized,
      resetToDemoData,
    }),
    [
      profile,
      updateProfile,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      toggleFocusToday,
      rescheduleTask,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      projects,
      addProject,
      updateProject,
      deleteProject,
      addProjectMilestone,
      toggleProjectMilestone,
      calendarEvents,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent,
      checkEventConflict,
      followUps,
      addFollowUp,
      updateFollowUp,
      deleteFollowUp,
      markFollowUpDone,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      updateKeyResult,
      habits,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitLog,
      isHabitCompleted,
      habitLogs,
      focusSessions,
      recordFocusSession,
      journalEntries,
      saveJournalEntry,
      getJournalForDate,
      ideas,
      addIdea,
      updateIdea,
      deleteIdea,
      convertIdeaToTask,
      convertIdeaToProject,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      conversations,
      currentConversationId,
      messages,
      sendAssistantMessage,
      applyProposedAction,
      rejectProposedAction,
      generatePlanMyDay,
      applyPlanMyDay,
      isInitialized,
      resetToDemoData,
    ]
  );

  return <ExecutiveStoreContext.Provider value={value}>{children}</ExecutiveStoreContext.Provider>;
}

export function useExecutiveStore() {
  const ctx = useContext(ExecutiveStoreContext);
  if (!ctx) {
    throw new Error("useExecutiveStore must be used within ExecutiveStoreProvider");
  }
  return ctx;
}
