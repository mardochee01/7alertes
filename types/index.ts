// ── Domain ───────────────────────────────────────────────────────────────────

export interface ChapterKey {
  t: string; // title
  s: string; // subtitle/description
}

export interface GameChoice {
  t: string;
  ok: boolean | "partial";
  f: string; // feedback
}

export interface Chapter {
  num: number;
  eunuque: string;
  title: string;
  subtitle: string;
  why: string;
  lili: string;
  keys: ChapterKey[];
  journalQs: string[];
  actions: string[];
  question: {
    s: string; // scenario
    c: GameChoice[];
  };
}

export type ScheduleEntryType = "chapter" | "challenge" | "rest";

export interface ScheduleEntry {
  day: number;
  type: ScheduleEntryType;
  chap?: number;
  label: string;
  icon: string;
}

export interface SpiritualCard {
  type: string;
  title: string;
  desc: string;
  time: string;
  tag: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// ── App state ─────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  name: string;
  col: string;
  init: string;
  photo: string;
  time: string;
  chap: string;
  text: string;
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  name: string;
  photo: string;
  text: string;
  likes: number;
  likedByMe: boolean;
  time: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AppState {
  adminMode: boolean;
  qName: string;         // queen name
  kName: string;         // king name
  kingdomName: string;   // custom kingdom name
  profilePhoto: string;
  crownHP: number;       // 0-7
  xp: number;           // 0-700
  streak: number;
  lastActive: string;    // ISO date
  startDate: string;     // ISO date
  chapsDone: number[];
  currentChap: number;
  slideIndex: number;
  chatHistory: ChatMessage[];
  posts: Post[];
  journalData: Record<string, string>;  // `${chapNum}_${questionIdx}` → answer
  actionsData: Record<string, boolean>; // `${chapNum}_${actionIdx}` → done
  pendingQuestions: { q: string; date: string; name: string }[];
}

// ── Supabase DB types ─────────────────────────────────────────────────────────

export interface DbProfile {
  id: string;
  queen_name: string;
  king_name: string;
  profile_photo: string | null;
  crown_hp: number;
  xp: number;
  streak: number;
  last_active: string | null;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbChapterProgress {
  id: string;
  user_id: string;
  chapter_num: number;
  completed: boolean;
  slide_index: number;
  completed_at: string | null;
}

export interface DbJournalEntry {
  id: string;
  user_id: string;
  chapter_num: number;
  question_idx: number;
  response: string;
  created_at: string;
}

export interface DbAction {
  id: string;
  user_id: string;
  chapter_num: number;
  action_idx: number;
  completed: boolean;
}

export interface DbPost {
  id: string;
  user_id: string;
  chapter_num: number;
  text: string;
  likes_count: number;
  created_at: string;
  profiles: Pick<DbProfile, "queen_name" | "profile_photo">;
}

export interface DbComment {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  likes_count: number;
  created_at: string;
  profiles: Pick<DbProfile, "queen_name" | "profile_photo">;
}
