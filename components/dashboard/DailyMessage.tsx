"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type DailyMsg = {
  id: string;
  text: string;
  audio_url: string | null;
};

type State = "loading" | "disabled" | "no_message" | "ready";

export function DailyMessage() {
  const [state,   setState]   = useState<State>("loading");
  const [msg,     setMsg]     = useState<DailyMsg | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const sb = createClient();

    async function load() {
      // 1. Vérifie si la section est activée
      const { data: setting } = await sb
        .from("app_settings")
        .select("value")
        .eq("key", "daily_message_enabled")
        .single();

      // Si la clé n'existe pas ou vaut "false" → section désactivée
      if (!setting || setting.value === "false") {
        setState("disabled");
        return;
      }

      // 2. Cherche le message publié le plus récent
      // (published = true est la source de vérité, pas publish_at)
      const { data: messages } = await sb
        .from("daily_messages")
        .select("id, text, audio_url")
        .eq("published", true)
        .order("publish_at", { ascending: false })
        .limit(1);

      if (!messages || messages.length === 0) {
        setState("no_message");
        return;
      }

      setMsg(messages[0] as DailyMsg);
      setState("ready");
    }

    load();
  }, []);

  // N'affiche rien si désactivé, en chargement, ou pas de message
  if (state !== "ready" || !msg) return null;

  function toggleAudio() {
    if (!msg?.audio_url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(msg.audio_url);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else          { audioRef.current.play();  setPlaying(true);  }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative rounded-[14px] p-5 overflow-hidden mb-3"
      style={{ background: "linear-gradient(135deg,#1A3A2A 0%,#243D2E 100%)" }}
    >
      {/* Guillemet décoratif */}
      <span className="absolute top-[-1.1rem] left-1 font-serif text-[6.5rem] leading-none
                       text-gold/[.13] font-bold select-none pointer-events-none">
        "
      </span>

      <p className="font-display text-[.58rem] tracking-[.3em] uppercase text-gold/70 mb-3 relative z-10">
        🎙 Message du jour
      </p>

      <p className="relative z-10 font-serif italic text-[1.1rem] leading-[1.75] text-ivory/88 mb-4">
        {msg.text}
      </p>

      <div className="relative z-10 flex items-center justify-between">
        <span className="font-display text-[.62rem] tracking-[.2em] uppercase text-gold/60">
          Maman Lili
        </span>
        {msg.audio_url && (
          <button onClick={toggleAudio}
                  className={`text-[.8rem] px-3 py-1 rounded-full border transition-all font-sans
                              ${playing
                                ? "bg-gold/35 border-gold/60 text-gold-l"
                                : "bg-gold/15 border-gold/30 text-gold-l hover:bg-gold/28"}`}>
            {playing ? "⏸ Pause" : "▶ Écouter"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
