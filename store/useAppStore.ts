"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, Post, ChatMessage } from "@/types";

interface AppStore extends AppState {
  _hydrated: boolean;
  setHydrated: () => void;

  // Setters
  setQName: (name: string) => void;
  setKName: (name: string) => void;
  setKingdomName: (name: string) => void;
  setProfilePhoto: (url: string) => void;
  setStartDate: (date: string) => void;

  // Progress
  completeChap: (num: number) => void;
  setCurrentChap: (num: number) => void;
  setSlideIndex: (idx: number) => void;
  addXP: (n: number) => void;
  damageHP: () => void;

  // Journal & actions
  saveJournalEntry: (chapNum: number, questionIdx: number, text: string) => void;
  toggleAction: (chapNum: number, actionIdx: number) => void;

  // Community
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: import("@/types").Comment) => void;
  likeComment: (postId: string, commentId: string) => void;

  // Chat
  addChatMessage: (msg: ChatMessage) => void;
  clearChatHistory: () => void;

  // Streak
  updateStreak: () => void;

  // Admin
  toggleAdmin: () => void;

  // Reset
  reset: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const defaults: AppState = {
  adminMode: false,
  qName: "",
  kName: "mon roi",
  kingdomName: "Le Royaume",
  profilePhoto: "",
  crownHP: 7,
  xp: 0,
  streak: 1,
  lastActive: "",
  startDate: "",
  chapsDone: [],
  currentChap: 1,
  slideIndex: 0,
  chatHistory: [],
  posts: [],
  journalData: {},
  actionsData: {},
  pendingQuestions: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...defaults,

      // ── Hydration flag ──────────────────────────────────────
      _hydrated: false,
      setHydrated: () => set({ _hydrated: true }),

      // ── Setters ─────────────────────────────────────────────
      setQName: (name) => set({ qName: name }),
      setKName: (name) => set({ kName: name }),
      setKingdomName: (name) => set({ kingdomName: name }),
      setProfilePhoto: (url) => set({ profilePhoto: url }),
      setStartDate: (date) => set({ startDate: date }),

      // ── Progress ────────────────────────────────────────────
      completeChap: (num) =>
        set((s) => ({
          chapsDone: s.chapsDone.includes(num) ? s.chapsDone : [...s.chapsDone, num],
        })),

      setCurrentChap: (num) => set({ currentChap: num }),
      setSlideIndex: (idx) => set({ slideIndex: idx }),

      addXP: (n) => set((s) => ({ xp: Math.min(700, s.xp + n) })),
      damageHP: () => set((s) => ({ crownHP: Math.max(0, s.crownHP - 1) })),

      // ── Journal & actions ───────────────────────────────────
      saveJournalEntry: (chapNum, questionIdx, text) =>
        set((s) => ({
          journalData: { ...s.journalData, [`${chapNum}_${questionIdx}`]: text },
        })),

      toggleAction: (chapNum, actionIdx) =>
        set((s) => {
          const key = `${chapNum}_${actionIdx}`;
          return { actionsData: { ...s.actionsData, [key]: !s.actionsData[key] } };
        }),

      // ── Community ───────────────────────────────────────────
      addPost: (post) => set((s) => ({ posts: [...s.posts, post] })),

      likePost: (postId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id !== postId
              ? p
              : { ...p, likes: p.likes + (p.likedByMe ? -1 : 1), likedByMe: !p.likedByMe }
          ),
        })),

      addComment: (postId, comment) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id !== postId ? p : { ...p, comments: [...p.comments, comment] }
          ),
        })),

      likeComment: (postId, commentId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id !== postId
              ? p
              : {
                  ...p,
                  comments: p.comments.map((c) =>
                    c.id !== commentId
                      ? c
                      : { ...c, likes: c.likes + (c.likedByMe ? -1 : 1), likedByMe: !c.likedByMe }
                  ),
                }
          ),
        })),

      // ── Chat ────────────────────────────────────────────────
      addChatMessage: (msg) =>
        set((s) => ({ chatHistory: [...s.chatHistory, msg] })),

      clearChatHistory: () => set({ chatHistory: [] }),

      // ── Streak ──────────────────────────────────────────────
      updateStreak: () =>
        set((s) => {
          const t = today();
          if (!s.lastActive) return { streak: 1, lastActive: t };
          const diff =
            (new Date(t).getTime() - new Date(s.lastActive).getTime()) / 86_400_000;
          if (diff === 0) return {};
          if (diff === 1) return { streak: s.streak + 1, lastActive: t };
          return { streak: 1, lastActive: t };
        }),

      // ── Admin ───────────────────────────────────────────────
      toggleAdmin: () => set((s) => ({ adminMode: !s.adminMode })),

      // ── Reset ───────────────────────────────────────────────
      reset: () => set(defaults),
    }),
    {
      name: "royaume_v5",
      // Call setHydrated once localStorage has been read
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
