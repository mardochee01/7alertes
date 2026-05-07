"use client";

import { useState, useRef } from "react";
import { QUOTES } from "@/lib/data/schedule";

interface QuoteCardProps {
  dayIndex: number;
}

export function QuoteCard({ dayIndex }: QuoteCardProps) {
  const quote = QUOTES[dayIndex % QUOTES.length];
  const [playing, setPlaying] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  function speakQuote() {
    if (!("speechSynthesis" in window)) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(quote);
    u.lang = "fr-FR";
    u.rate = 0.88;
    u.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const fv =
      voices.find((v) => v.lang.startsWith("fr") && v.name.toLowerCase().includes("female")) ||
      voices.find((v) => v.lang.startsWith("fr"));
    if (fv) u.voice = fv;
    u.onend = () => setPlaying(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }

  return (
    <div className="relative rounded-[14px] p-5 overflow-hidden"
         style={{ background: "linear-gradient(135deg,#250810 0%,#243D2E 100%)" }}>
      {/* decorative quote mark */}
      <span className="absolute top-[-1.1rem] left-1 font-serif text-[6.5rem] leading-none
                       text-gold/[.13] font-bold select-none pointer-events-none">
        "
      </span>
      <p className="relative z-10 font-serif italic text-[1.1rem] leading-relaxed text-ivory mb-5">
        {quote}
      </p>
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-display text-[.68rem] tracking-[.2em] uppercase text-gold/88">
          Maman Lili · Parole du jour
        </span>
        <button
          onClick={speakQuote}
          className={`text-[.8rem] px-3 py-1 rounded-full border transition-all font-sans
                      ${playing
                        ? "bg-gold/35 border-gold/60 text-gold-l animate-[pulse-gold_1.5s_infinite]"
                        : "bg-gold/15 border-gold/30 text-gold-l hover:bg-gold/28"}`}
        >
          {playing ? "⏸ Pause" : "▶ Écouter"}
        </button>
      </div>
    </div>
  );
}
