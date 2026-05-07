"use client";

import { motion } from "framer-motion";
import type { Chapter } from "@/types";
import { personalise } from "@/lib/utils";

interface Props { chapter: Chapter; kName: string; }

export function LiliSlide({ chapter, kName }: Props) {
  return (
    <motion.div
      key="lili"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col justify-center items-center text-center px-6 py-8 relative overflow-y-auto"
      style={{ background: "linear-gradient(160deg,#0A2015,#250810)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 80% 80% at 50% 100%,rgba(201,168,76,.16),transparent 60%)" }} />

      <div className="relative z-10">
        <div className="text-[2.6rem] mb-3 drop-shadow-[0_0_18px_rgba(201,168,76,.5)]">👑</div>
        <p className="font-display text-[.6rem] tracking-[.3em] uppercase text-gold mb-5">
          Maman Lili te dit
        </p>
        <p className="font-serif italic text-[1.3rem] leading-[1.7] text-ivory"
           dangerouslySetInnerHTML={{ __html: personalise(chapter.lili, kName).replace(
             new RegExp(kName, "g"),
             `<em style="color:#E8C96A;font-style:italic">${kName}</em>`
           )}} />
        <div className="w-12 h-px mx-auto mt-5"
             style={{ background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />
      </div>
    </motion.div>
  );
}
