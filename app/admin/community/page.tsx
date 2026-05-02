"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  togglePostVisibility, toggleCommentVisibility,
  deletePost, deleteComment,
} from "@/lib/supabase/admin";

type Comment = {
  id: string;
  text: string;
  hidden: boolean;
  created_at: string;
  user_id: string;
  author: string;
};

type Post = {
  id: string;
  text: string;
  chapter_num: number | null;
  hidden: boolean;
  created_at: string;
  likes_count: number;
  user_id: string;
  author: string;
  comments: Comment[];
  expanded: boolean;
};

function timeLabel(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ hidden }: { hidden: boolean }) {
  if (!hidden) return null;
  return (
    <span className="text-[.58rem] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-display tracking-wider">
      MASQUÉ
    </span>
  );
}

export default function AdminCommunity() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all" | "hidden" | "visible">("all");

  async function load() {
    const sb = createClient();

    // 1. Posts
    const { data: rawPosts } = await sb
      .from("posts")
      .select("id, text, chapter_num, hidden, created_at, likes_count, user_id")
      .order("created_at", { ascending: false });

    if (!rawPosts?.length) { setLoading(false); return; }

    // 2. Auteurs des posts
    const postAuthorIds = [...new Set(rawPosts.map((p: { user_id: string }) => p.user_id))];
    const { data: postProfiles } = await sb
      .from("profiles").select("id, queen_name").in("id", postAuthorIds);
    const postNameMap: Record<string, string> = {};
    (postProfiles ?? []).forEach((p: { id: string; queen_name: string }) => { postNameMap[p.id] = p.queen_name; });

    // 3. Commentaires de tous les posts
    const postIds = rawPosts.map((p: { id: string }) => p.id);
    const { data: rawComments } = await sb
      .from("comments")
      .select("id, post_id, text, hidden, created_at, user_id")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    // 4. Auteurs des commentaires
    const cmtAuthorIds = [...new Set((rawComments ?? []).map((c: { user_id: string }) => c.user_id))];
    const cmtNameMap: Record<string, string> = {};
    if (cmtAuthorIds.length) {
      const { data: cmtProfiles } = await sb
        .from("profiles").select("id, queen_name").in("id", cmtAuthorIds);
      (cmtProfiles ?? []).forEach((p: { id: string; queen_name: string }) => { cmtNameMap[p.id] = p.queen_name; });
    }

    // 5. Grouper commentaires par post
    const cmtByPost: Record<string, Comment[]> = {};
    (rawComments ?? []).forEach((c: { id: string; post_id: string; text: string; hidden: boolean; created_at: string; user_id: string }) => {
      if (!cmtByPost[c.post_id]) cmtByPost[c.post_id] = [];
      cmtByPost[c.post_id].push({ ...c, author: cmtNameMap[c.user_id] ?? "Reine" });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feed: Post[] = (rawPosts as any[]).map((p) => ({
      ...p,
      author:   postNameMap[p.user_id] ?? "Reine",
      comments: cmtByPost[p.id] ?? [],
      expanded: false,
    }));

    setPosts(feed);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  // ── Actions posts ────────────────────────────────────────────────────────

  async function handleTogglePost(id: string, hidden: boolean) {
    await togglePostVisibility(id, !hidden);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, hidden: !hidden } : p));
  }

  async function handleDeletePost(id: string) {
    if (!confirm("Supprimer ce post et tous ses commentaires ?")) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  // ── Actions commentaires ──────────────────────────────────────────────────

  async function handleToggleComment(postId: string, commentId: string, hidden: boolean) {
    await toggleCommentVisibility(commentId, !hidden);
    setPosts((prev) => prev.map((p) =>
      p.id !== postId ? p : {
        ...p,
        comments: p.comments.map((c) => c.id === commentId ? { ...c, hidden: !hidden } : c),
      }
    ));
  }

  async function handleDeleteComment(postId: string, commentId: string) {
    if (!confirm("Supprimer ce commentaire ?")) return;
    await deleteComment(commentId);
    setPosts((prev) => prev.map((p) =>
      p.id !== postId ? p : { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
    ));
  }

  // ── Filtrage ──────────────────────────────────────────────────────────────

  const filtered = posts
    .filter((p) => {
      if (filter === "hidden")  return p.hidden;
      if (filter === "visible") return !p.hidden;
      return true;
    })
    .filter((p) =>
      !search || p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.text.toLowerCase().includes(search.toLowerCase())
    );

  const hiddenCount  = posts.filter((p) => p.hidden).length;
  const totalCmts    = posts.reduce((s, p) => s + p.comments.length, 0);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-light text-ivory text-[2rem]">Modération</h1>
          <p className="text-ivory/40 text-sm mt-1">
            <span className="text-gold/70">{posts.length} publication{posts.length > 1 ? "s" : ""}</span>
            <span className="text-ivory/25 mx-2">·</span>
            <span className="text-ivory/50">{totalCmts} commentaire{totalCmts > 1 ? "s" : ""}</span>
            {hiddenCount > 0 && (
              <>
                <span className="text-ivory/25 mx-2">·</span>
                <span className="text-orange-400">{hiddenCount} masqué{hiddenCount > 1 ? "s" : ""}</span>
              </>
            )}
          </p>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
               placeholder="Rechercher auteur ou texte…"
               className="px-4 py-2 rounded-xl bg-white/6 border border-white/10 text-ivory/80
                          text-sm font-sans outline-none focus:border-gold/40 w-56 placeholder:text-ivory/25" />
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "all",     label: `Tout (${posts.length})`       },
          { key: "visible", label: `Visibles (${posts.length - hiddenCount})` },
          { key: "hidden",  label: `Masqués (${hiddenCount})`     },
        ] as { key: typeof filter; label: string }[]).map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-[.78rem] font-sans transition-all
                              ${filter === key
                                ? "bg-gold/15 text-gold border border-gold/30"
                                : "bg-white/4 text-ivory/50 border border-white/8 hover:text-ivory/70"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Feed de modération */}
      {loading ? (
        <p className="text-ivory/30 text-sm animate-pulse">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-ivory/25 font-serif italic">
          Aucun contenu à afficher
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((post) => (
            <div key={post.id}
                 className={`rounded-2xl overflow-hidden border transition-all
                             ${post.hidden ? "border-orange-500/20 opacity-70" : "border-white/8"}`}
                 style={{ background: "rgba(255,255,255,0.04)" }}>

              {/* ── Post ─────────────────────────────────────────────── */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar initial */}
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                                  text-dark text-[.75rem] font-serif font-bold"
                       style={{ background: "linear-gradient(135deg,#C9A84C,#E8C96A)" }}>
                    {post.author.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-display text-[.65rem] tracking-wider text-gold/70">
                        {post.author}
                      </span>
                      <span className="text-[.62rem] text-ivory/25">{timeLabel(post.created_at)}</span>
                      {post.chapter_num && (
                        <span className="text-[.58rem] px-1.5 py-0.5 rounded bg-gold/10 text-gold/70">
                          Ch. {post.chapter_num}
                        </span>
                      )}
                      <StatusBadge hidden={post.hidden} />
                      <span className="text-[.62rem] text-ivory/25 ml-auto">
                        ♡ {post.likes_count}
                        {post.comments.length > 0 && (
                          <span className="ml-2">💬 {post.comments.length}</span>
                        )}
                      </span>
                    </div>

                    {/* Texte */}
                    <p className="font-serif text-[.95rem] text-ivory/80 leading-relaxed">{post.text}</p>
                  </div>
                </div>

                {/* Actions post */}
                <div className="flex gap-2 mt-3 ml-11 flex-wrap">
                  <button onClick={() => handleTogglePost(post.id, post.hidden)}
                          className={`text-[.7rem] px-3 py-1.5 rounded-lg border font-sans transition-all
                                      ${post.hidden
                                        ? "border-forest/30 text-[#7ECFA0] hover:bg-forest/15"
                                        : "border-orange-500/30 text-orange-400/70 hover:bg-orange-500/10"}`}>
                    {post.hidden ? "👁 Afficher" : "🚫 Masquer"}
                  </button>
                  <button onClick={() => handleDeletePost(post.id)}
                          className="text-[.7rem] px-3 py-1.5 rounded-lg border border-danger/20
                                     text-danger/60 hover:bg-danger/10 font-sans transition-all">
                    🗑 Supprimer
                  </button>
                  {post.comments.length > 0 && (
                    <button
                      onClick={() => setPosts((prev) => prev.map((p) =>
                        p.id === post.id ? { ...p, expanded: !p.expanded } : p
                      ))}
                      className="text-[.7rem] px-3 py-1.5 rounded-lg border border-white/10
                                 text-ivory/40 hover:text-ivory/60 font-sans transition-all ml-auto">
                      {post.expanded ? "▲ Masquer commentaires" : `▼ Voir ${post.comments.length} commentaire${post.comments.length > 1 ? "s" : ""}`}
                    </button>
                  )}
                </div>
              </div>

              {/* ── Commentaires (expandable) ─────────────────────────── */}
              {post.expanded && post.comments.length > 0 && (
                <div className="border-t border-white/6 bg-black/10">
                  {post.comments.map((c, ci) => (
                    <div key={c.id}
                         className={`flex items-start gap-3 px-4 py-3 transition-all
                                     ${ci < post.comments.length - 1 ? "border-b border-white/4" : ""}
                                     ${c.hidden ? "opacity-50" : ""}`}>
                      {/* Avatar commentateur */}
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center
                                      text-ivory text-[.6rem] font-serif font-bold mt-0.5"
                           style={{ background: "linear-gradient(135deg,#2D5A3D,#4A7A5A)" }}>
                        {c.author.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-display text-[.6rem] tracking-wider text-ivory/50">
                            {c.author}
                          </span>
                          <span className="text-[.58rem] text-ivory/25">{timeLabel(c.created_at)}</span>
                          <StatusBadge hidden={c.hidden} />
                        </div>
                        <p className="font-serif text-[.88rem] text-ivory/70 leading-relaxed">{c.text}</p>
                      </div>

                      {/* Actions commentaire */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleToggleComment(post.id, c.id, c.hidden)}
                                className={`text-[.62rem] px-2 py-1 rounded border font-sans transition-all
                                            ${c.hidden
                                              ? "border-forest/25 text-[#7ECFA0]/70 hover:bg-forest/10"
                                              : "border-orange-500/25 text-orange-400/60 hover:bg-orange-500/8"}`}>
                          {c.hidden ? "👁" : "🚫"}
                        </button>
                        <button onClick={() => handleDeleteComment(post.id, c.id)}
                                className="text-[.62rem] px-2 py-1 rounded border border-danger/20
                                           text-danger/50 hover:bg-danger/10 font-sans transition-all">
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
