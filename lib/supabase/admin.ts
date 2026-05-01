"use client";

import { createClient } from "@/lib/supabase/client";

// ── Compteurs pour les badges de notification ─────────────────────────────────
// moderationSince / usersSince = dernière visite de la section (ISO string)
export async function fetchNotifCounts(opts?: {
  moderationSince?: string;
  usersSince?: string;
}) {
  const sb = createClient();
  const epoch = new Date(0).toISOString();  // date minimale = "jamais vu"

  const modSince   = opts?.moderationSince ?? epoch;
  const usersSince = opts?.usersSince      ?? epoch;

  const [
    { count: pendingMsgs },
    { count: newPosts },
    { count: newComments },
    { count: newUsers },
  ] = await Promise.all([
    sb.from("pending_questions")
      .select("*", { count: "exact", head: true }).eq("answered", false),
    sb.from("posts")
      .select("*", { count: "exact", head: true })
      .eq("hidden", false).gte("created_at", modSince),
    sb.from("comments")
      .select("*", { count: "exact", head: true })
      .eq("hidden", false).gte("created_at", modSince),
    sb.from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", usersSince),
  ]);

  return {
    questions:  pendingMsgs  ?? 0,
    moderation: (newPosts ?? 0) + (newComments ?? 0),
    users:      newUsers ?? 0,
  };
}

// ── Modifier la réponse admin ────────────────────────────────────────────────
export async function updateReply(id: string, reply: string) {
  const sb = createClient();
  await sb.from("pending_questions").update({
    reply,
    replied_at: new Date().toISOString(),
    answered: true,
  }).eq("id", id);
}

// ── Supprimer la réponse admin (garde la question) ───────────────────────────
export async function clearReply(id: string) {
  const sb = createClient();
  await sb.from("pending_questions").update({
    reply: null,
    replied_at: null,
    answered: false,
  }).eq("id", id);
}

// ── Vérifie que l'utilisateur connecté est admin ──────────────────────────────
export async function checkIsAdmin(): Promise<boolean> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return false;
  const { data } = await sb.from("profiles").select("is_admin").eq("id", user.id).single();
  return !!data?.is_admin;
}

// ── Stats globales ────────────────────────────────────────────────────────────
export async function fetchAdminStats() {
  const sb = createClient();

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: totalQuestions },
    { data: progressRows },
  ] = await Promise.all([
    sb.from("profiles").select("*", { count: "exact", head: true }),
    sb.from("posts").select("*",    { count: "exact", head: true }),
    sb.from("pending_questions").select("*", { count: "exact", head: true }).eq("answered", false),
    sb.from("chapter_progress").select("chapter_num").eq("completed", true),
  ]);

  const chapCounts: Record<number, number> = {};
  (progressRows ?? []).forEach((r: { chapter_num: number }) => {
    chapCounts[r.chapter_num] = (chapCounts[r.chapter_num] ?? 0) + 1;
  });

  return {
    totalUsers:     totalUsers ?? 0,
    totalPosts:     totalPosts ?? 0,
    pendingQuestions: totalQuestions ?? 0,
    chapCounts,
  };
}

// ── Désactiver / réactiver un utilisateur ─────────────────────────────────────
export async function toggleUserDisabled(id: string, disabled: boolean) {
  const sb = createClient();
  await sb.from("profiles").update({ is_disabled: disabled }).eq("id", id);
}

// ── Promouvoir / révoquer admin ───────────────────────────────────────────────
export async function toggleUserAdmin(id: string, isAdmin: boolean) {
  const sb = createClient();
  await sb.from("profiles").update({ is_admin: isAdmin }).eq("id", id);
}

// ── Liste des utilisateurs avec progression ────────────────────────────────────
export async function fetchUsers() {
  const sb = createClient();
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, queen_name, king_name, kingdom_name, xp, crown_hp, streak, start_date, last_active, created_at, is_disabled, is_admin")
    .order("created_at", { ascending: false });

  const { data: progress } = await sb
    .from("chapter_progress")
    .select("user_id, chapter_num")
    .eq("completed", true);

  const chapsByUser: Record<string, number[]> = {};
  (progress ?? []).forEach((r: { user_id: string; chapter_num: number }) => {
    if (!chapsByUser[r.user_id]) chapsByUser[r.user_id] = [];
    chapsByUser[r.user_id].push(r.chapter_num);
  });

  return (profiles ?? []).map((p) => ({
    ...p,
    chapsDone: chapsByUser[p.id] ?? [],
  }));
}

// ── Posts avec auteur (modération) ────────────────────────────────────────────
export async function fetchPostsAdmin() {
  const sb = createClient();

  // Étape 1 : posts bruts (sans join pour éviter les conflits RLS)
  const { data: posts } = await sb
    .from("posts")
    .select("id, text, chapter_num, hidden, created_at, likes_count, user_id")
    .order("created_at", { ascending: false });

  if (!posts?.length) return [];

  // Étape 2 : noms d'auteurs en une seule requête
  const userIds = [...new Set(posts.map((p: { user_id: string }) => p.user_id))];
  const { data: names } = await sb
    .from("profiles")
    .select("id, queen_name")
    .in("id", userIds);

  const nameMap: Record<string, string> = {};
  (names ?? []).forEach((n: { id: string; queen_name: string }) => { nameMap[n.id] = n.queen_name; });

  return posts.map((p: { user_id: string; [k: string]: unknown }) => ({
    ...p,
    profiles: { queen_name: nameMap[p.user_id] ?? "Reine" },
  }));
}

// ── Commentaires (modération) ─────────────────────────────────────────────────
export async function fetchCommentsAdmin() {
  const sb = createClient();

  const { data: comments } = await sb
    .from("comments")
    .select("id, text, hidden, created_at, likes_count, post_id, user_id")
    .order("created_at", { ascending: false });

  if (!comments?.length) return [];

  const userIds = [...new Set(comments.map((c: { user_id: string }) => c.user_id))];
  const { data: names } = await sb
    .from("profiles")
    .select("id, queen_name")
    .in("id", userIds);

  const nameMap: Record<string, string> = {};
  (names ?? []).forEach((n: { id: string; queen_name: string }) => { nameMap[n.id] = n.queen_name; });

  return comments.map((c: { user_id: string; [k: string]: unknown }) => ({
    ...c,
    profiles: { queen_name: nameMap[c.user_id] ?? "Reine" },
  }));
}

// ── Questions / conversations ─────────────────────────────────────────────────
export async function fetchPendingQuestions() {
  const sb = createClient();
  const { data } = await sb
    .from("pending_questions")
    .select("id, user_id, queen_name, question, answered, claude_answered, reply, replied_at, created_at")
    .order("created_at", { ascending: true }); // chronologique pour les threads
  return data ?? [];
}

// ── Répondre à un message ─────────────────────────────────────────────────────
export async function replyToQuestion(id: string, reply: string) {
  const sb = createClient();
  await sb.from("pending_questions").update({
    reply,
    replied_at: new Date().toISOString(),
    answered: true,
  }).eq("id", id);
}

// ── Supprimer un message ──────────────────────────────────────────────────────
export async function deleteQuestion(id: string) {
  const sb = createClient();
  await sb.from("pending_questions").delete().eq("id", id);
}

// ── Supprimer toute la conversation d'un utilisateur ─────────────────────────
export async function deleteConversation(userId: string) {
  const sb = createClient();
  await sb.from("pending_questions").delete().eq("user_id", userId);
}

// ── Masquer / afficher un post ────────────────────────────────────────────────
export async function togglePostVisibility(id: string, hidden: boolean) {
  const sb = createClient();
  await sb.from("posts").update({ hidden }).eq("id", id);
}

// ── Masquer / afficher un commentaire ─────────────────────────────────────────
export async function toggleCommentVisibility(id: string, hidden: boolean) {
  const sb = createClient();
  await sb.from("comments").update({ hidden }).eq("id", id);
}

// ── Marquer une question comme répondue ───────────────────────────────────────
export async function markQuestionAnswered(id: string) {
  const sb = createClient();
  await sb.from("pending_questions").update({ answered: true }).eq("id", id);
}

// ── Supprimer un post ─────────────────────────────────────────────────────────
export async function deletePost(id: string) {
  const sb = createClient();
  await sb.from("posts").delete().eq("id", id);
}

// ── Supprimer un commentaire ──────────────────────────────────────────────────
export async function deleteComment(id: string) {
  const sb = createClient();
  await sb.from("comments").delete().eq("id", id);
}
