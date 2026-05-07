"use client";

import { motion } from "framer-motion";
import type { Chapter } from "@/types";
import { personalise } from "@/lib/utils";

interface Props { chapter: Chapter; kName: string; }

export function WhySlide({ chapter, kName }: Props) {
  return (
    <motion.div
      key="why"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col justify-center px-6 py-8 relative overflow-y-auto"
      style={{ background: "linear-gradient(160deg,#0F0205,#250810)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 70% 60% at 30% 80%,rgba(201,168,76,.1),transparent 60%)" }} />

      <div className="relative z-10">
        <span className="inline-block font-display text-[.58rem] tracking-[.35em] uppercase
                         text-gold border border-gold/38 px-3 py-1 rounded-full mb-6">
          Chapitre {chapter.num} · {chapter.eunuque}
        </span>
        <h2 className="font-serif font-light text-ivory text-[2.1rem] leading-[1.15] mb-5">
          Pourquoi ce chapitre<br /><em className="italic text-gold-l">te concerne</em>
        </h2>
        <p className="font-serif text-[1.15rem] leading-[1.75] text-ivory/80"
           dangerouslySetInnerHTML={{ __html: personalise(chapter.why, kName).replace(
             new RegExp(kName, "g"),
             `<em style="color:#E8C96A;font-style:italic">${kName}</em>`
           )}} />
      </div>

    </motion.div>
  );
}
