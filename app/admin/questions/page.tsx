"use client";

import { useEffect, useState, useRef } from "react";
import {
  fetchPendingQuestions, replyToQuestion, updateReply, clearReply,
  deleteQuestion, deleteConversation,
} from "@/lib/supabase/admin";

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  user_id: string;
  queen_name: string;
  question: string;
  answered: boolean;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
};

type Conversation = {
  userId: string;
  queenName: string;
  messages: Message[];
  unanswered: number;
  lastAt: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function dateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function groupByUser(messages: Message[]): Conversation[] {
  const map: Record<string, Conversation> = {};
  messages.forEach((m) => {
    if (!map[m.user_id]) {
      map[m.user_id] = { userId: m.user_id, queenName: m.queen_name, messages: [], unanswered: 0, lastAt: m.created_at };
    }
    map[m.user_id].messages.push(m);
    if (!m.answered) map[m.user_id].unanswered++;
    if (m.created_at > map[m.user_id].lastAt) map[m.user_id].lastAt = m.created_at;
  });
  return Object.values(map).sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminQuestions() {
  const [allMessages,    setAllMessages]    = useState<Message[]>([]);
  const [selectedUser,   setSelectedUser]   = useState<string | null>(null);
  const [reply,          setReply]          = useState("");
  const [sending,        setSending]        = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [editDraft,      setEditDraft]      = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPendingQuestions().then((q) => {
      setAllMessages(q as Message[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Scroll to bottom of thread
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [selectedUser, allMessages]);

  const conversations = groupByUser(allMessages);
  const activeConv    = conversations.find((c) => c.userId === selectedUser);
  const totalPending  = conversations.reduce((s, c) => s + c.unanswered, 0);

  // ── Répondre ────────────────────────────────────────────────────────────────

  async function handleReply(messageId: string) {
    const r = reply.trim();
    if (!r || sending) return;
    setSending(true);
    await replyToQuestion(messageId, r);
    setAllMessages((prev) => prev.map((m) =>
      m.id === messageId ? { ...m, answered: true, reply: r, replied_at: new Date().toISOString() } : m
    ));
    setReply("");
    setSending(false);
  }

  // ── Modifier la réponse admin ────────────────────────────────────────────────

  function startEdit(id: string, currentReply: string) {
    setEditingId(id);
    setEditDraft(currentReply);
  }

  async function saveEdit(id: string) {
    const r = editDraft.trim();
    if (!r) return;
    await updateReply(id, r);
    setAllMessages((prev) => prev.map((m) =>
      m.id === id ? { ...m, reply: r, replied_at: new Date().toISOString() } : m
    ));
    setEditingId(null);
    setEditDraft("");
  }

  async function handleClearReply(id: string) {
    if (!confirm("Supprimer cette réponse ? La question redeviendra sans réponse.")) return;
    await clearReply(id);
    setAllMessages((prev) => prev.map((m) =>
      m.id === id ? { ...m, reply: null, replied_at: null, answered: false } : m
    ));
    setEditingId(null);
  }

  // ── Supprimer un message ─────────────────────────────────────────────────────

  async function handleDeleteMessage(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    await deleteQuestion(id);
    setAllMessages((prev) => prev.filter((m) => m.id !== id));
  }

  // ── Supprimer toute la conversation ──────────────────────────────────────────

  async function handleDeleteConversation(userId: string) {
    if (!confirm("Supprimer toute cette conversation ?")) return;
    await deleteConversation(userId);
    setAllMessages((prev) => prev.filter((m) => m.user_id !== userId));
    setSelectedUser(null);
  }

  // ── Premier message sans réponse dans la conv active ─────────────────────────
  const pendingMessage = activeConv?.messages.find((m) => !m.answered) ?? null;

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Liste des conversations ──────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 border-r border-white/6 flex flex-col bg-black/10">
        <div className="px-5 py-4 border-b border-white/6">
          <h1 className="font-serif text-ivory text-[1.3rem] font-light">Messages</h1>
          {totalPending > 0 && (
            <p className="text-[.72rem] text-gold mt-0.5">{totalPending} en attente</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-ivory/30 text-sm px-5 py-6 animate-pulse">Chargement…</p>
          ) : conversations.length === 0 ? (
            <p className="text-ivory/30 text-sm px-5 py-6 italic">Aucun message</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => setSelectedUser(conv.userId)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-white/4
                            transition-colors text-left
                            ${selectedUser === conv.userId ? "bg-gold/10" : "hover:bg-white/4"}`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center
                                font-serif font-semibold text-dark text-base flex-shrink-0"
                     style={{ background: "linear-gradient(135deg,#C9A84C,#E8C96A)" }}>
                  {conv.queenName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-serif text-ivory text-[.9rem] truncate">{conv.queenName}</span>
                    <span className="text-[.62rem] text-ivory/30 flex-shrink-0">{dateLabel(conv.lastAt)}</span>
                  </div>
                  <p className="text-[.72rem] text-ivory/40 truncate mt-0.5">
                    {conv.messages[conv.messages.length - 1]?.question}
                  </p>
                  {conv.unanswered > 0 && (
                    <span className="inline-block mt-1 text-[.58rem] px-1.5 py-0.5 rounded-full
                                     bg-gold/20 text-gold font-display tracking-wider">
                      {conv.unanswered} sans réponse
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Thread de conversation ───────────────────────────────────────── */}
      {!activeConv ? (
        <div className="flex-1 flex items-center justify-center text-ivory/20 font-serif italic text-lg">
          Sélectionne une conversation
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 flex-shrink-0">
            <div>
              <p className="font-serif text-ivory text-[1.1rem]">{activeConv.queenName}</p>
              <p className="text-[.72rem] text-ivory/35">
                {activeConv.messages.length} message{activeConv.messages.length > 1 ? "s" : ""}
                {activeConv.unanswered > 0 && (
                  <span className="text-gold ml-2">· {activeConv.unanswered} en attente</span>
                )}
              </p>
            </div>
            <button
              onClick={() => handleDeleteConversation(activeConv.userId)}
              className="text-[.72rem] text-danger/60 hover:text-danger border border-danger/20
                         hover:border-danger/40 px-3 py-1.5 rounded-lg font-sans transition-all"
            >
              🗑 Supprimer la conversation
            </button>
          </div>

          {/* Messages */}
          <div ref={threadRef} className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {activeConv.messages.map((m) => (
              <div key={m.id} className="flex flex-col gap-2">

                {/* Message de l'utilisatrice */}
                <div className="flex items-start gap-2 group">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
                                  text-dark text-[.7rem] font-serif font-bold"
                       style={{ background: "linear-gradient(135deg,#C9A84C,#E8C96A)" }}>
                    {m.queen_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[.6rem] font-display tracking-wider text-gold/60">{m.queen_name}</span>
                      <span className="text-[.6rem] text-ivory/25">{timeLabel(m.created_at)}</span>
                    </div>
                    <div className="inline-block max-w-[80%] bg-white/8 border border-white/10
                                    rounded-2xl rounded-tl-sm px-4 py-2.5">
                      <p className="font-serif text-[.95rem] text-ivory/85 leading-relaxed">{m.question}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[.72rem]
                               text-danger/50 hover:text-danger px-1.5 py-1 rounded"
                    title="Supprimer ce message"
                  >
                    🗑
                  </button>
                </div>

                {/* Réponse admin */}
                {m.reply && (
                  <div className="flex items-start gap-2 flex-row-reverse group">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
                                    text-ivory text-[.7rem] font-serif font-bold"
                         style={{ background: "linear-gradient(135deg,#1A3A2A,#2D5A3D)" }}>
                      L
                    </div>
                    <div className="flex-1 flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[.6rem] text-ivory/25">
                          {m.replied_at ? timeLabel(m.replied_at) : ""}
                        </span>
                        <span className="text-[.6rem] font-display tracking-wider text-gold/60">Maman Lili</span>
                      </div>

                      {/* Mode édition inline */}
                      {editingId === m.id ? (
                        <div className="w-full max-w-[85%] flex flex-col gap-2">
                          <textarea
                            autoFocus
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(m.id); }
                              if (e.key === "Escape") { setEditingId(null); }
                            }}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-white/6
                                       text-ivory/85 font-serif text-[.95rem] outline-none
                                       focus:border-gold/50 resize-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingId(null)}
                                    className="text-[.7rem] px-3 py-1.5 rounded-lg text-ivory/40
                                               hover:text-ivory/70 font-sans transition-colors">
                              Annuler
                            </button>
                            <button onClick={() => saveEdit(m.id)}
                                    className="text-[.7rem] px-3 py-1.5 rounded-lg font-sans
                                               bg-gold/15 text-gold border border-gold/30
                                               hover:bg-gold/25 transition-all">
                              Sauvegarder
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5"
                             style={{ background: "linear-gradient(135deg,#1A3A2A,#2D5A3D)" }}>
                          <p className="font-serif italic text-[.95rem] text-ivory/90 leading-relaxed">{m.reply}</p>
                          {/* Actions modifier / supprimer réponse */}
                          <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(m.id, m.reply!)}
                                    className="text-[.62rem] text-gold/60 hover:text-gold font-sans transition-colors">
                              ✏ Modifier
                            </button>
                            <button onClick={() => handleClearReply(m.id)}
                                    className="text-[.62rem] text-danger/50 hover:text-danger font-sans transition-colors">
                              🗑 Supprimer la réponse
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Zone de réponse */}
          <div className="flex-shrink-0 border-t border-white/6 px-6 py-4">
            {pendingMessage ? (
              <>
                <p className="text-[.65rem] text-gold/60 font-display tracking-wider mb-2 uppercase">
                  Répondre à : "{pendingMessage.question}"
                </p>
                <div className="flex gap-3 items-end">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply(pendingMessage.id);
                      }
                    }}
                    placeholder="Ta réponse personnalisée… (Entrée pour envoyer)"
                    rows={2}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gold/20 bg-white/5
                               text-ivory/80 font-serif text-[.95rem] outline-none
                               focus:border-gold/40 resize-none placeholder:text-ivory/25"
                  />
                  <button
                    onClick={() => handleReply(pendingMessage.id)}
                    disabled={!reply.trim() || sending}
                    className="flex-shrink-0 font-display text-[.68rem] tracking-[.18em] uppercase
                               px-4 py-3 rounded-xl transition-all disabled:opacity-40
                               bg-gradient-to-br from-gold to-gold-l text-dark hover:-translate-y-0.5"
                  >
                    {sending ? "…" : "Envoyer →"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-ivory/25 text-sm italic font-serif">
                ✓ Tous les messages ont une réponse
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
