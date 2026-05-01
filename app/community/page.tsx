"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastProvider, toast } from "@/components/ui/Toast";

// ── Types ─────────────────────────────────────────────────────────────────────

type FeedComment = {
  id: string;
  name: string;
  photo: string | null;
  text: string;
  time: string;
};

type FeedPost = {
  id: string;
  authorId: string;   // pour savoir si l'utilisateur peut supprimer
  name: string;
  photo: string | null;
  col: string;
  chap: string;
  text: string;
  time: string;
  likes: number;
  likedByMe: boolean;
  comments: FeedComment[];
};

const COLORS = ["#2D5A3D", "#A8882A", "#4A7A5A", "#1A3A2A"];

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ photo, name, col, size = 36 }: {
  photo: string | null; name: string; col: string; size?: number;
}) {
  return (
    <div className="rounded-full flex-shrink-0 flex items-center justify-center
                    font-serif font-semibold text-white overflow-hidden bg-cover bg-center"
         style={{
           width: size, height: size, fontSize: size * 0.42,
           backgroundColor: photo ? "transparent" : col,
           backgroundImage: photo ? `url(${photo})` : undefined,
         }}>
      {!photo && name.charAt(0)}
    </div>
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────

function PostCard({
  post, currentUserId, isAdmin,
  onLike, onComment, onDelete,
}: {
  post: FeedPost;
  currentUserId: string | null;
  isAdmin: boolean;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const isOwner = currentUserId === post.authorId;
  const canDelete = isOwner || isAdmin;

  function handleComment() {
    const t = commentText.trim();
    if (!t) return;
    onComment(post.id, t);
    setCommentText("");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[13px] p-4 shadow-[0_2px_14px_rgba(13,31,21,.07)]">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar photo={post.photo} name={post.name} col={post.col} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-[.98rem] font-medium text-td">{post.name}</span>
            <span className="font-display text-[.58rem] tracking-[.1em] px-2 py-0.5 rounded-full bg-gold/11 text-gold">
              {post.chap}
            </span>
          </div>
          <p className="text-[.7rem] text-tl">{post.time}</p>
        </div>
        {/* Bouton supprimer (auteur ou admin) */}
        {canDelete && (
          <button onClick={() => onDelete(post.id)}
                  className="text-[.72rem] text-tl hover:text-danger transition-colors font-sans px-2 py-1 rounded-lg hover:bg-danger/5"
                  title={isAdmin && !isOwner ? "Supprimer (admin)" : "Supprimer mon post"}>
            🗑
          </button>
        )}
      </div>

      <p className="font-serif text-[1.02rem] leading-[1.65] text-tm mb-3">{post.text}</p>

      {/* Actions */}
      <div className="flex gap-4 items-center border-t border-black/5 pt-2.5">
        <button
          onClick={() => currentUserId && onLike(post.id)}
          className={`text-[.78rem] font-sans transition-colors hover:text-gold
                      ${post.likedByMe ? "text-gold" : "text-tl"}`}>
          ♡ {post.likes}
        </button>
        <button onClick={() => setShowComments(!showComments)}
                className="text-[.78rem] text-tl hover:text-gold transition-colors font-sans">
          💬 {post.comments.length} commentaire{post.comments.length !== 1 ? "s" : ""}
        </button>
      </div>

      {/* Commentaires */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-3 border-t border-black/5 mt-2 flex flex-col gap-3">
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <Avatar photo={c.photo} name={c.name} col="#2D5A3D" size={26} />
                  <div className="flex-1 bg-cream rounded-xl rounded-tl-sm px-3 py-2">
                    <p className="text-[.68rem] font-semibold text-tm mb-0.5">{c.name}</p>
                    <p className="font-serif text-[.93rem] text-td leading-[1.4]">{c.text}</p>
                    <p className="text-[.62rem] text-tl mt-1">{c.time}</p>
                  </div>
                </div>
              ))}

              {/* Zone de commentaire */}
              {currentUserId && (
                <div className="flex gap-2 items-center">
                  <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                         onKeyDown={(e) => e.key === "Enter" && handleComment()}
                         placeholder="Ajouter un commentaire…"
                         className="flex-1 px-3.5 py-2 rounded-full border border-black/10 bg-ivory
                                    font-sans text-[.84rem] text-td outline-none focus:border-gold transition-colors" />
                  <button onClick={handleComment}
                          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                                     text-[.82rem] transition-transform hover:scale-110"
                          style={{ background: "linear-gradient(135deg,#C9A84C,#E8C96A)" }}>
                    →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function CommunityPage() {
  const router = useRouter();
  const { qName, profilePhoto, chapsDone } = useAppStore();

  const [posts,    setPosts]    = useState<FeedPost[]>([]);
  const [postText, setPostText] = useState("");
  const [loading,  setLoading]  = useState(true);
  const [userId,   setUserId]   = useState<string | null>(null);
  const [isAdmin,  setIsAdmin]  = useState(false);

  // ── Chargement depuis Supabase (sans joins — RLS-safe) ───────────────────

  const loadPosts = useCallback(async () => {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    setUserId(user?.id ?? null);

    // Vérifie si admin
    if (user) {
      const { data: profile } = await sb.from("profiles").select("is_admin").eq("id", user.id).single();
      setIsAdmin(!!profile?.is_admin);
    }

    // 1. Posts non masqués
    const { data: rawPosts } = await sb
      .from("posts")
      .select("id, text, chapter_num, created_at, likes_count, user_id")
      .eq("hidden", false)
      .order("created_at", { ascending: false });

    if (!rawPosts?.length) { setLoading(false); return; }

    // 2. Profils des auteurs
    const authorIds = [...new Set(rawPosts.map((p: { user_id: string }) => p.user_id))];
    const { data: profiles } = await sb
      .from("profiles").select("id, queen_name, profile_photo").in("id", authorIds);

    const profileMap: Record<string, { queen_name: string; profile_photo: string | null }> = {};
    (profiles ?? []).forEach((p: { id: string; queen_name: string; profile_photo: string | null }) => {
      profileMap[p.id] = p;
    });

    // 3. Likes de l'utilisateur courant
    // Likes de l'utilisateur courant
    const myLikes = new Set<string>();
    if (user) {
      const { data: likes } = await sb
        .from("post_likes").select("post_id").eq("user_id", user.id);
      (likes ?? []).forEach((l: { post_id: string }) => myLikes.add(l.post_id));
    }

    // 4. Commentaires de tous ces posts
    const postIds = rawPosts.map((p: { id: string }) => p.id);
    const { data: rawComments } = await sb
      .from("comments")
      .select("id, post_id, text, created_at, user_id")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    // 5. Profils des commentateurs
    const commentUids = [...new Set((rawComments ?? []).map((c: { user_id: string }) => c.user_id))];
    let cProfileMap: Record<string, { queen_name: string; profile_photo: string | null }> = {};
    if (commentUids.length) {
      const { data: cProfiles } = await sb
        .from("profiles").select("id, queen_name, profile_photo").in("id", commentUids);
      (cProfiles ?? []).forEach((p: { id: string; queen_name: string; profile_photo: string | null }) => {
        cProfileMap[p.id] = p;
      });
    }

    // 6. Grouper commentaires par post
    const commentsByPost: Record<string, FeedComment[]> = {};
    (rawComments ?? []).forEach((c: { id: string; post_id: string; text: string; created_at: string; user_id: string }) => {
      if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
      commentsByPost[c.post_id].push({
        id: c.id,
        name: cProfileMap[c.user_id]?.queen_name ?? "Reine",
        photo: cProfileMap[c.user_id]?.profile_photo ?? null,
        text: c.text,
        time: new Date(c.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      });
    });

    // 7. Assembler le feed
    const feed: FeedPost[] = rawPosts.map((p: {
      id: string; user_id: string; text: string;
      chapter_num: number; created_at: string; likes_count: number;
    }, i: number) => ({
      id:       p.id,
      authorId: p.user_id,
      name:     profileMap[p.user_id]?.queen_name   ?? "Reine",
      photo:    profileMap[p.user_id]?.profile_photo ?? null,
      col:      COLORS[i % COLORS.length],
      chap:     `Chapitre ${p.chapter_num ?? 1}`,
      text:     p.text,
      time:     new Date(p.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      likes:    p.likes_count ?? 0,
      likedByMe: myLikes.has(p.id),
      comments:  commentsByPost[p.id] ?? [],
    }));

    setPosts(feed);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  // ── Like ──────────────────────────────────────────────────────────────────

  async function handleLike(postId: string) {
    if (!userId) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Source de vérité unique : post.likedByMe (pas un état séparé)
    const liked = post.likedByMe;

    // Mise à jour optimiste
    setPosts((prev) => prev.map((p) =>
      p.id !== postId ? p : { ...p, likes: p.likes + (liked ? -1 : 1), likedByMe: !liked }
    ));

    try {
      const sb = createClient();
      // Le trigger Supabase sync_post_likes_count met à jour likes_count automatiquement
      if (liked) {
        await sb.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
      } else {
        await sb.from("post_likes").insert({ post_id: postId, user_id: userId });
      }
    } catch {
      // Rollback de l'optimistic update si erreur
      loadPosts();
    }
  }

  // ── Commentaire ───────────────────────────────────────────────────────────

  async function handleComment(postId: string, text: string) {
    if (!userId) return;
    const sb    = createClient();
    const tempId = `tmp-${Date.now()}`;
    setPosts((prev) => prev.map((p) =>
      p.id !== postId ? p : {
        ...p,
        comments: [...p.comments, { id: tempId, name: qName, photo: profilePhoto || null, text, time: "À l'instant" }],
      }
    ));

    try {
      const { data } = await sb
        .from("comments")
        .insert({ post_id: postId, user_id: userId, text })
        .select("id")
        .single();
      if (data?.id) {
        setPosts((prev) => prev.map((p) =>
          p.id !== postId ? p : {
            ...p,
            comments: p.comments.map((c) => c.id === tempId ? { ...c, id: data.id } : c),
          }
        ));
      }
    } catch { loadPosts(); }
  }

  // ── Supprimer un post ─────────────────────────────────────────────────────

  async function handleDelete(postId: string) {
    if (!confirm("Supprimer ce post définitivement ?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      const sb = createClient();
      await sb.from("posts").delete().eq("id", postId);
    } catch { loadPosts(); }
  }

  // ── Publication ───────────────────────────────────────────────────────────

  async function publishPost() {
    const t = postText.trim();
    if (!t || !userId) { toast("Écris quelque chose d'abord"); return; }
    const chapNum = Math.min(chapsDone.length + 1, 7);
    const tempId  = `tmp-${Date.now()}`;
    setPostText("");

    setPosts((prev) => [{
      id: tempId, authorId: userId,
      name: qName, photo: profilePhoto || null,
      col: "#2D5A3D", chap: `Chapitre ${chapNum}`, text: t,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      likes: 0, likedByMe: false, comments: [],
    }, ...prev]);
    toast("Publié dans la communauté 💛");

    try {
      const sb = createClient();
      const { data, error } = await sb
        .from("posts")
        .insert({ user_id: userId, chapter_num: chapNum, text: t })
        .select("id")
        .single();
      if (error) throw error;
      if (data?.id) {
        setPosts((prev) => prev.map((p) => p.id === tempId ? { ...p, id: data.id } : p));
      }
    } catch {
      setPosts((prev) => prev.filter((p) => p.id !== tempId));
      toast("Erreur de publication. Réessaie.");
    }
  }

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <div className="relative overflow-hidden pb-10"
           style={{ background: "linear-gradient(160deg,#0D1F15,#1A3A2A)" }}>
        <div className="absolute inset-0"
             style={{ background: "radial-gradient(ellipse 70% 80% at 80% 100%,rgba(201,168,76,.11),transparent 60%)" }} />
        <div className="relative z-10 px-5 pt-5 mb-5">
          <button onClick={() => router.push("/dashboard")}
                  className="text-ivory/70 text-sm hover:text-ivory transition-colors font-sans">
            ← Retour
          </button>
        </div>
        <div className="relative z-10 text-center px-5">
          <div className="text-[1.7rem] mb-2">👑</div>
          <h1 className="font-serif font-light text-ivory text-[2rem] leading-[1.15] mb-1">
            L'espace des Reines
          </h1>
          <p className="font-serif italic text-ivory/48 text-[.95rem]">
            Une communauté de femmes qui choisissent leur royaume
          </p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10">
        {/* Input publication */}
        <div className="bg-white rounded-[13px] shadow-[0_2px_14px_rgba(13,31,21,.07)] p-4 mb-3">
          <textarea value={postText} onChange={(e) => setPostText(e.target.value)}
                    placeholder="Partage une victoire, une réflexion, un encouragement… 💛"
                    rows={3}
                    className="w-full border border-black/10 rounded-xl px-4 py-3 mb-3 resize-none
                               font-serif text-[1rem] text-td outline-none focus:border-gold transition-colors bg-white" />
          <button onClick={publishPost}
                  className="font-display text-[.7rem] tracking-[.18em] uppercase
                             bg-gradient-to-br from-gold to-gold-l text-dark
                             px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5">
            Publier
          </button>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="text-center py-10 text-tl font-serif italic animate-pulse">
            Chargement de la communauté…
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-[2.4rem] mb-3">💛</div>
            <p className="font-serif italic text-tl text-[1.1rem]">
              Sois la première à partager dans la communauté
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post}
                        currentUserId={userId} isAdmin={isAdmin}
                        onLike={handleLike} onComment={handleComment} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      <ToastProvider />
    </div>
  );
}
