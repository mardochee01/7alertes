"use client";

import { motion } from "framer-motion";
import type { Chapter } from "@/types";
import { personalise } from "@/lib/utils";

interface Props { chapter: Chapter; kName: string; }

export function KeysSlide({ chapter, kName }: Props) {
  return (
    <motion.div
      key="keys"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col justify-center px-6 py-8 relative bg-ivory overflow-y-auto"
    >
      <p className="font-display text-[.6rem] tracking-[.3em] uppercase text-gold mb-5">
        ✦ Les {chapter.keys.length} clés de ce chapitre
      </p>

      <div className="flex flex-col divide-y divide-black/7">
        {chapter.keys.map((key, i) => (
          <div key={i} className="flex gap-3.5 py-4">
            <div className="w-[25px] h-[25px] flex-shrink-0 rounded-full flex items-center justify-center
                            font-display text-[.62rem] font-bold text-dark mt-0.5"
                 style={{ background: "linear-gradient(135deg,#C9A84C,#E8C96A)" }}>
              {i + 1}
            </div>
            <div>
              <p className="font-serif text-[1.06rem] font-medium text-td leading-[1.35] mb-1">
                {personalise(key.t, kName)}
              </p>
              <p className="text-[.82rem] text-tl leading-[1.45]">
                {personalise(key.s, kName)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
