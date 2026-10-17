export type Priority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "inbox" | "planned" | "in_progress" | "waiting" | "completed" | "cancelled";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";
export type ProjectCategory = "internal" | "client";
export type EventCategory = "deep_work" | "meeting" | "client_work" | "administration" | "personal" | "rest";
export type GoalTimeframe = "annual" | "quarterly" | "monthly" | "weekly";
export type GoalStatus = "not_started" | "on_track" | "at_risk" | "behind" | "completed";
export type IdeaStatus = "inbox" | "reviewing" | "planned" | "archived";
export type IdeaCategory = "business" | "product" | "technology" | "personal" | "other";
export type FollowUpStatus = "pending" | "done" | "rescheduled" | "cancelled";

export interface Profile {
  id: string;
  name: string;
  title: string;
  company_name: string;
  email: string;
  timezone: string; // e.g. "Asia/Makassar"
  work_start_time: string; // e.g. "08:30"
  work_end_time: string; // e.g. "17:30"
  working_days: number[]; // e.g. [1, 2, 3, 4, 5]
  break_start_time: string; // e.g. "12:00"
  break_end_time: string; // e.g. "13:00"
  default_focus_duration: number; // e.g. 25 or 50 minutes
  ai_provider?: "openrouter" | "gemini" | "openai" | "rule-based";
  ai_api_key?: string;
  ai_model?: string;
  ai_base_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  order_index: number;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  project_id?: string | null;
  priority: Priority;
  status: TaskStatus;
  estimated_duration_minutes: number;
  due_date: string; // YYYY-MM-DD
  due_time?: string | null; // HH:mm
  planned_date?: string | null; // YYYY-MM-DD for My Day
  planned_start_time?: string | null; // HH:mm
  planned_end_time?: string | null; // HH:mm
  labels: string[];
  notes?: string;
  is_focus_today?: boolean; // top 3 focus marker
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
  project_name?: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  target_date: string;
  is_completed: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: ProjectCategory;
  client_name?: string;
  status: ProjectStatus;
  start_date: string;
  deadline: string;
  progress_percentage: number;
  budget?: number;
  delay_risk: "low" | "medium" | "high";
  notes?: string;
  milestones?: ProjectMilestone[];
  tasks_count?: number;
  completed_tasks_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  location?: string;
  meeting_url?: string;
  notes?: string;
  is_recurring?: boolean;
  recurrence_rule?: string;
  task_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: string;
  user_id: string;
  name: string;
  organization?: string;
  communication_context: string;
  last_contacted_date: string;
  follow_up_date: string;
  status: FollowUpStatus;
  notes?: string;
  next_action?: string;
  created_at: string;
  updated_at: string;
}

export interface KeyResult {
  id: string;
  goal_id: string;
  title: string;
  current_value: number;
  target_value: number;
  unit: string; // e.g. "%", "klien", "IDR", "fitur"
  is_completed: boolean;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  timeframe: GoalTimeframe;
  period: string; // e.g. "Q4 2026", "2026", "Oktober 2026"
  status: GoalStatus;
  progress_percentage: number;
  deadline: string;
  linked_project_id?: string | null;
  key_results?: KeyResult[];
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekdays" | "weekly";
  time_of_day: "morning" | "afternoon" | "evening" | "anytime";
  target_days_per_week: number;
  is_active: boolean;
  created_at: string;
  streak_current?: number;
  streak_longest?: number;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  is_completed: boolean;
  created_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  task_id?: string | null;
  task_title?: string;
  duration_minutes: number;
  target_duration_minutes: number;
  notes?: string;
  started_at: string;
  ended_at: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  wins: string[]; // pencapaian hari ini
  blockers: string[]; // hambatan
  lessons_learned: string; // pelajaran didapat
  tomorrow_priorities: string[]; // rencana perbaikan/prioritas besok
  energy_level?: "high" | "normal" | "low";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  status: IdeaStatus;
  follow_up_notes?: string;
  converted_to_type?: "task" | "project" | null;
  converted_to_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "deadline" | "overdue" | "agenda" | "followup" | "goal" | "routine" | "system";
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface ProposedAction {
  id: string;
  type: "create_task" | "schedule_event" | "create_followup" | "reschedule_tasks" | "plan_my_day";
  summary: string;
  payload: any;
  status: "pending" | "confirmed" | "rejected";
}

export interface AssistantMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  proposed_actions?: ProposedAction[];
  created_at: string;
}

export interface AssistantConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}
