"use client";

import { createClient } from "@/lib/supabase/client";
import type { AppState } from "@/types";

// ── Sauvegarde le profil + la progression dans Supabase ───────────────────────
export async function saveProfile(userId: string, state: AppState) {
  const sb = createClient();

  await sb.from("profiles").upsert({
    id:            userId,
    queen_name:    state.qName       || "Reine",
    king_name:     state.kName       || "mon roi",
    kingdom_name:  state.kingdomName || "Le Royaume",
    profile_photo: state.profilePhoto || null,
    crown_hp:      state.crownHP,
    xp:            state.xp,
    streak:        state.streak,
    last_active:   state.lastActive  || null,
    start_date:    state.startDate   || null,
  });

  // Progression des chapitres
  if (state.chapsDone.length) {
    const rows = state.chapsDone.map((num) => ({
      user_id:     userId,
      chapter_num: num,
      completed:   true,
      slide_index: 0,
      completed_at: new Date().toISOString(),
    }));
    await sb.from("chapter_progress").upsert(rows, { onConflict: "user_id,chapter_num" });
  }
}

// ── Charge le profil depuis Supabase → objet partiel AppState ─────────────────
export async function loadProfile(userId: string): Promise<Partial<AppState> | null> {
  const sb = createClient();

  const [{ data: profile }, { data: progress }] = await Promise.all([
    sb.from("profiles").select("*").eq("id", userId).single(),
    sb.from("chapter_progress").select("chapter_num").eq("user_id", userId).eq("completed", true),
  ]);

  if (!profile) return null;

  return {
    qName:        profile.queen_name,
    kName:        profile.king_name,
    kingdomName:  profile.kingdom_name  ?? "Le Royaume",
    profilePhoto: profile.profile_photo ?? "",
    crownHP:      profile.crown_hp,
    xp:           profile.xp,
    streak:       profile.streak,
    lastActive:   profile.last_active   ?? "",
    startDate:    profile.start_date    ?? "",
    chapsDone:    (progress ?? []).map((r: { chapter_num: number }) => r.chapter_num),
  };
}
