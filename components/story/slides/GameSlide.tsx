"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { personalise } from "@/lib/utils";

interface Props { chapter: Chapter; kName: string; onNext: () => void; }

const LETTERS = ["A", "B", "C"];

export function GameSlide({ chapter, kName, onNext }: Props) {
  const { damageHP, addXP } = useAppStore();
  const [chosen, setChosen] = useState<number | null>(null);

  const q = chapter.question;

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    const choice = q.c[i];
    if (choice.ok === false) damageHP();
    if (choice.ok === true) addXP(30);
  }

  const result = chosen !== null ? q.c[chosen] : null;
  const resultClass =
    result?.ok === true ? "bg-ok/30 border-ok/28" :
    result?.ok === false ? "bg-danger/18 border-danger/28" :
    "bg-warn/18 border-warn/30";
  const resultLabel =
    result?.ok === true ? "✦ Félicitations !" :
    result?.ok === false ? "⚠ L'eunuque suivant approche…" :
    "Ta couronne vacille…";
  const resultLabelColor =
    result?.ok === true ? "text-[#7ECFA0]" :
    result?.ok === false ? "text-[#E8A090]" : "text-[#F0C070]";

  return (
    <motion.div
      key="game"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col px-6 py-6 overflow-y-auto relative"
      style={{ background: "linear-gradient(160deg,#050F08,#0D1F15)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 60% 60% at 80% 20%,rgba(201,168,76,.08),transparent 60%)" }} />

      <div className="relative z-10 flex flex-col flex-1">
        <p className="font-display text-[.58rem] tracking-[.32em] uppercase text-gold mb-3">
          ⚔️ Défi de {chapter.eunuque}
        </p>

        <p className="font-display text-[.63rem] uppercase tracking-[.15em] text-gold/70 mb-2">
          ✦ Scénario
        </p>
        <p className="font-serif italic text-[1.12rem] leading-[1.7] text-ivory mb-5"
           dangerouslySetInnerHTML={{ __html: personalise(q.s, kName).replace(
             new RegExp(kName, "g"),
             `<strong style="font-style:normal;color:#E8C96A;font-weight:500">${kName}</strong>`
           )}} />

        {/* Choices */}
        <div className="flex flex-col gap-2 mb-4">
          {q.c.map((choice, i) => {
            const isChosen = chosen === i;
            const choiceClass =
              !isChosen ? "bg-white/5 border-white/10 hover:border-gold/45 hover:bg-gold/6" :
              choice.ok === true ? "bg-ok/16 border-ok" :
              choice.ok === false ? "bg-danger/13 border-danger" :
              "bg-warn/12 border-warn";
            return (
              <motion.div
                key={i}
                whileTap={{ scale: chosen === null ? 0.98 : 1 }}
                onClick={() => pick(i)}
                className={`rounded-xl px-4 py-3.5 border cursor-pointer transition-all ${choiceClass}
                            ${chosen !== null ? "cursor-default" : ""}`}
              >
                <p className="font-display text-[.6rem] text-gold tracking-[.14em] mb-1">
                  {LETTERS[i]}
                </p>
                <p className="font-serif text-ivory text-[1rem] leading-[1.4]">{choice.t}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border mb-4 ${resultClass}`}
            >
              <p className={`font-display text-[.63rem] tracking-[.2em] uppercase mb-2 ${resultLabelColor}`}>
                {resultLabel}
              </p>
              <p className="font-serif text-ivory text-[1rem] leading-[1.5]">{result.f}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {chosen !== null && (
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            className="w-full font-display text-[.7rem] tracking-[.18em] uppercase
                       bg-gradient-to-br from-gold to-gold-l text-dark
                       py-3.5 rounded-full mt-auto transition-all hover:-translate-y-0.5"
          >
            Continuer →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
