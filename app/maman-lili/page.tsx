"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastProvider, toast } from "@/components/ui/Toast";
import { FAQ_DATA } from "@/lib/data/schedule";

type Message = {
  id: string;
  role: "user" | "lili";
  content: string;
  pending?: boolean; // en attente de réponse admin
};

function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center py-2 px-3">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gold"
          animate={{ scale: [0.55, 1, 0.55], opacity: [0.38, 1, 0.38] }}
          transition={{ duration: 1, delay, repeat: Infinity }} />
      ))}
    </div>
  );
}

export default function MamanLiliPage() {
  const router = useRouter();
  const { qName } = useAppStore();

  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState("");
  const [sending,    setSending]    = useState(false);
  const [openFaq,    setOpenFaq]    = useState<number | null>(null);
  const [userId,     setUserId]     = useState<string | null>(null);
  const msgsRef = useRef<HTMLDivElement>(null);
  const taRef   = useRef<HTMLTextAreaElement>(null);

  // ── Scroll automatique ────────────────────────────────────────────────────
  useEffect(() => {
    msgsRef.current?.scrollTo(0, msgsRef.current.scrollHeight);
  }, [messages]);

  // ── Chargement de l'historique depuis Supabase ────────────────────────────
  const loadHistory = useCallback(async () => {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data } = await sb
      .from("pending_questions")
      .select("id, question, reply, replied_at, answered")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!data) return;

    const history: Message[] = [];
    data.forEach((q: { id: string; question: string; reply: string | null; answered: boolean }) => {
      history.push({ id: `q-${q.id}`, role: "user", content: q.question });
      if (q.reply) {
        history.push({ id: `r-${q.id}`, role: "lili", content: q.reply });
      } else {
        history.push({
          id: `p-${q.id}`, role: "lili", pending: true,
          content: "Ma reine, ta question a bien été reçue. Je te répondrai personnellement très prochainement. 💛",
        });
      }
    });

    setMessages(history);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // ── Envoi d'un message ────────────────────────────────────────────────────
  async function sendMsg() {
    const msg = input.trim();
    if (!msg || sending || !userId) return;
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    setSending(true);

    const tempId = `tmp-${Date.now()}`;
    // Ajout optimiste
    setMessages((prev) => [
      ...prev,
      { id: tempId,          role: "user",  content: msg },
      { id: `${tempId}-ack`, role: "lili",  pending: true,
        content: "Ma reine, ta question a bien été reçue. Je te répondrai personnellement très prochainement. 💛" },
    ]);

    try {
      const sb = createClient();
      await sb.from("pending_questions").insert({
        user_id:    userId,
        queen_name: qName,
        question:   msg,
        answered:   false,
      });
      toast("Message envoyé à Maman Lili 💛");
    } catch {
      toast("Erreur d'envoi. Réessaie.");
    } finally {
      setSending(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  }

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 108) + "px";
  }

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden pb-10"
           style={{ background: "linear-gradient(160deg,#250810,#0F0205)" }}>
        <div className="absolute inset-0"
             style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%,rgba(201,168,76,.17),transparent 55%)" }} />
        <div className="relative z-10 px-5 pt-5 mb-5">
          <button onClick={() => router.push("/dashboard")}
                  className="text-ivory/70 text-sm hover:text-ivory transition-colors font-sans">
            ← Retour
          </button>
        </div>
        <div className="relative z-10 text-center px-5">
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-[1.7rem]
                          shadow-[0_0_28px_rgba(201,168,76,.32)]"
               style={{ background: "linear-gradient(135deg,#C9A84C,#4A0F1A)" }}>
            👑
          </div>
          <h1 className="font-serif font-light text-ivory text-[1.9rem] leading-[1.2] mb-1">
            Demande à<br />Maman Lili
          </h1>
          <p className="font-serif italic text-ivory/48 text-[.92rem]">
            Réponse personnalisée de Maman Lili
          </p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10">
        {/* Zone de chat */}
        <div className="bg-white rounded-[13px] shadow-[0_2px_16px_rgba(15,2,5,.07)] mb-3 overflow-hidden">
          <div ref={msgsRef}
               className="flex flex-col gap-3.5 p-4 max-h-[420px] overflow-y-auto scroll-smooth">

            {/* Message de bienvenue */}
            <div className="max-w-[86%] self-start">
              <p className="font-display text-[.62rem] tracking-[.14em] uppercase text-gold mb-1">Maman Lili</p>
              <div className="px-4 py-3 rounded-[13px] rounded-tl-sm font-serif text-[1rem] leading-[1.6] text-ivory"
                   style={{ background: "linear-gradient(135deg,#250810,#4A0F1A)" }}>
                Ma reine, je suis là. Pose-moi ta question librement, pas de jugement ici, seulement de l'amour, de la sagesse et de la vérité. Ton cœur peut parler. 💛
              </div>
            </div>

            {/* Historique */}
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[86%] ${m.role === "user" ? "self-end" : "self-start"}`}>
                <p className={`font-display text-[.62rem] tracking-[.14em] uppercase mb-1
                               ${m.role === "user" ? "text-tl text-right" : "text-gold"}`}>
                  {m.role === "user" ? "Toi" : "Maman Lili"}
                </p>
                <div
                  className={`px-4 py-3 font-serif text-[1rem] leading-[1.6]
                               ${m.role === "user"
                                 ? "bg-cream text-td rounded-[13px] rounded-tr-sm"
                                 : m.pending
                                   ? "border border-gold/20 text-ivory/70 italic rounded-[13px] rounded-tl-sm"
                                   : "text-ivory rounded-[13px] rounded-tl-sm"}`}
                  style={m.role === "lili" && !m.pending
                    ? { background: "linear-gradient(135deg,#250810,#4A0F1A)" }
                    : m.role === "lili" && m.pending
                    ? { background: "rgba(201,168,76,.06)" }
                    : undefined}
                >
                  {m.pending && <span className="text-[.6rem] font-display tracking-wider text-gold/50 block mb-1">EN ATTENTE</span>}
                  {m.content}
                </div>
              </div>
            ))}

            <AnimatePresence>
              {sending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="self-start">
                  <TypingDots />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="border-t border-black/5 px-3 py-3">
            <div className="flex gap-2 items-end">
              <textarea ref={taRef} value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(e.target); }}
                onKeyDown={handleKey}
                placeholder="Ta question pour Maman Lili…"
                rows={1}
                className="flex-1 px-3.5 py-2.5 border border-black/10 rounded-xl resize-none
                           font-serif text-[1rem] text-td bg-cream outline-none
                           focus:border-gold transition-colors max-h-[108px]"
              />
              <button onClick={sendMsg} disabled={sending || !input.trim()}
                      className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center
                                 text-[.9rem] transition-all hover:scale-105 disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg,#C9A84C,#E8C96A)" }}>
                →
              </button>
            </div>
            <p className="text-[.7rem] text-tl text-center mt-2 italic">
              Maman Lili te répondra personnellement — espace confidentiel
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-[13px] shadow-[0_2px_14px_rgba(15,2,5,.07)] p-4">
          <p className="font-display text-[.58rem] tracking-[.22em] uppercase text-tl mb-3">
            Questions fréquentes
          </p>
          <div className="flex flex-col gap-2">
            {FAQ_DATA.map((item, i) => (
              <div key={i} className="border border-black/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3.5
                             font-serif text-[.98rem] text-td bg-white hover:bg-cream
                             transition-colors text-left"
                >
                  <span>{item.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 90 : 0 }}
                               className="text-gold text-[.75rem] flex-shrink-0">›</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                                className="overflow-hidden">
                      <div className="px-4 py-3 bg-dg/[.04] border-t border-black/6">
                        <p className="font-serif italic text-[.97rem] text-tm leading-[1.65]">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
      <ToastProvider />
    </div>
  );
}
