"use client";

import { motion } from "framer-motion";
import type { Chapter } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { personalise } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

interface Props { chapter: Chapter; kName: string; onNext: () => void; }

export function ActionsSlide({ chapter, kName, onNext }: Props) {
  const { actionsData, toggleAction, addXP } = useAppStore();

  function handleToggle(idx: number) {
    const key = `${chapter.num}_${idx}`;
    const wasDone = actionsData[key];
    toggleAction(chapter.num, idx);
    if (!wasDone) { addXP(5); toast("Action accomplie ✦"); }
  }

  return (
    <motion.div
      key="actions"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col px-6 py-6 overflow-y-auto bg-cream"
    >
      <p className="font-display text-[.6rem] tracking-[.28em] uppercase text-gold mb-5">
        🎡 Actions pour cette semaine
      </p>

      <div className="flex flex-col gap-2 flex-1">
        {chapter.actions.map((action, i) => {
          const done = !!actionsData[`${chapter.num}_${i}`];
          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggle(i)}
              className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border
                          ${done
                            ? "bg-forest/8 border-forest/18"
                            : "bg-white border-transparent hover:translate-x-0.5"}`}
            >
              <div className={`w-[21px] h-[21px] flex-shrink-0 rounded-md border-2 flex items-center
                              justify-center transition-all mt-0.5
                              ${done ? "bg-forest border-forest" : "border-black/16"}`}>
                {done && <span className="text-white text-[.65rem]">✓</span>}
              </div>
              <p className={`font-serif text-[1.02rem] leading-[1.4] transition-all
                             ${done ? "line-through text-tl" : "text-td"}`}>
                {personalise(action, kName)}
              </p>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="w-full font-display text-[.7rem] tracking-[.18em] uppercase
                   bg-gradient-to-br from-gold to-gold-l text-dark
                   py-3.5 rounded-full mt-6 transition-all hover:-translate-y-0.5"
      >
        Continuer →
      </button>
    </motion.div>
  );
}
