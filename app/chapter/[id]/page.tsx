"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { getChapterByNum } from "@/lib/utils";
import { StoryProgress } from "@/components/story/StoryProgress";
import { WhySlide }     from "@/components/story/slides/WhySlide";
import { LiliSlide }    from "@/components/story/slides/LiliSlide";
import { KeysSlide }    from "@/components/story/slides/KeysSlide";
import { JournalSlide } from "@/components/story/slides/JournalSlide";
import { ActionsSlide } from "@/components/story/slides/ActionsSlide";
import { GameSlide }    from "@/components/story/slides/GameSlide";
import { ShareSlide }   from "@/components/story/slides/ShareSlide";
import { ToastProvider } from "@/components/ui/Toast";

const TOTAL = 7;

// Slides with reading content that show the nav arrows
const READING_SLIDES = [0, 1, 2];

interface Props {
  params: Promise<{ id: string }>;
}

export default function ChapterPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { kName, crownHP, slideIndex, setCurrentChap, setSlideIndex, chapsDone } = useAppStore();

  const num     = parseInt(id, 10);
  const chapter = getChapterByNum(num);

  const [current, setCurrent] = useState(
    chapsDone.includes(num) ? 0 : slideIndex
  );

  useEffect(() => {
    if (!chapter) { router.replace("/dashboard"); return; }
    setCurrentChap(num);
  }, [chapter, num, router, setCurrentChap]);

  const goTo = useCallback((idx: number) => {
    const next = Math.max(0, Math.min(TOTAL - 1, idx));
    setCurrent(next);
    setSlideIndex(next);
  }, [setSlideIndex]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => {
    if (current === 0) { router.push("/dashboard"); return; }
    goTo(current - 1);
  }, [current, goTo, router]);

  if (!chapter) return null;

  const isReading = READING_SLIDES.includes(current);
  const readProps = { chapter, kName: kName || "mon roi" };
  const interactProps = { chapter, kName: kName || "mon roi", onNext: next };

  return (
    <div className="flex flex-col min-h-screen bg-dark">
      {/* Barre de progression */}
      <StoryProgress total={TOTAL} current={current} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={prev}
          className="flex items-center gap-1.5 bg-white/9 border-none text-ivory
                     px-3.5 py-1.5 rounded-full text-[.82rem] font-sans transition-colors
                     hover:bg-white/16"
        >
          {current === 0 ? "✕ Quitter" : "← Retour"}
        </button>
        <span className="font-display text-[.6rem] tracking-[.18em] uppercase text-white/50">
          {chapter.eunuque} · Alerte {num}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-3.5 h-[3px] rounded-sm transition-colors"
                 style={{ background: i < crownHP ? "#C9A84C" : "rgba(255,255,255,.2)" }} />
          ))}
        </div>
      </div>

      {/* Zone slide */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {current === 0 && <WhySlide     key="why"     {...readProps} />}
          {current === 1 && <LiliSlide    key="lili"    {...readProps} />}
          {current === 2 && <KeysSlide    key="keys"    {...readProps} />}
          {current === 3 && <JournalSlide key="journal" {...interactProps} />}
          {current === 4 && <ActionsSlide key="actions" {...interactProps} />}
          {current === 5 && <GameSlide    key="game"    {...interactProps} />}
          {current === 6 && <ShareSlide   key="share"   chapter={chapter} />}
        </AnimatePresence>

        {/* ── Boutons de navigation (slides de lecture uniquement) ── */}
        {isReading && (
          <>
            {/* Bouton gauche */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30
                         w-10 h-10 rounded-full flex items-center justify-center
                         text-white text-2xl select-none
                         bg-white/10 border border-white/20
                         hover:bg-white/25 hover:border-white/40 hover:scale-110
                         active:scale-95 transition-all duration-200"
            >
              ‹
            </button>

            {/* Bouton droit */}
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30
                         w-10 h-10 rounded-full flex items-center justify-center
                         text-dark text-2xl select-none
                         border border-gold/40
                         hover:brightness-110 hover:scale-110
                         active:scale-95 transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#C9A84C,#E8C96A)" }}
            >
              ›
            </button>
          </>
        )}
      </div>

      <ToastProvider />
    </div>
  );
}
