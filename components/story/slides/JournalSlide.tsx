"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Chapter } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { personalise } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

interface Props { chapter: Chapter; kName: string; onNext: () => void; }

export function JournalSlide({ chapter, kName, onNext }: Props) {
  const { journalData, saveJournalEntry, addXP } = useAppStore();
  const [errors, setErrors] = useState<boolean[]>([]);

  const keys = chapter.journalQs.map((_, i) => `${chapter.num}_${i}`);
  const [answers, setAnswers] = useState<string[]>(
    chapter.journalQs.map((_, i) => journalData[keys[i]] || "")
  );

  function handleSave() {
    const errs = answers.map((a) => !a.trim());
    setErrors(errs);
    if (errs.some(Boolean)) return;

    answers.forEach((a, i) => saveJournalEntry(chapter.num, i, a));
    addXP(15);
    toast("Réflexions sauvegardées dans ton cahier ✦");
    setTimeout(onNext, 800);
  }

  return (
    <motion.div
      key="journal"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col px-6 py-6 overflow-y-auto"
      style={{ background: "#F2E4D0" }}
    >
      <p className="font-display text-[.6rem] tracking-[.28em] uppercase text-gold mb-1">
        📓 Ton cahier de reine
      </p>
      <p className="text-[.72rem] text-tl italic mb-5">
        (Réponses confidentielles, non partagées)
      </p>

      {chapter.journalQs.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-serif italic text-[1.02rem] text-td leading-[1.5] mb-2">
            ✦ {personalise(q, kName)}
          </p>
          <textarea
            value={answers[i]}
            onChange={(e) => {
              const next = [...answers];
              next[i] = e.target.value;
              setAnswers(next);
              if (errors[i]) {
                const ne = [...errors]; ne[i] = false; setErrors(ne);
              }
            }}
            placeholder="En toute sincérité…"
            rows={3}
            className={`w-full px-3 py-2.5 rounded-lg resize-none font-sans text-[.84rem] text-td
                        bg-white outline-none transition-all border
                        ${errors[i]
                          ? "border-danger"
                          : "border-black/12 focus:border-gold"}`}
          />
        </div>
      ))}

      {errors.some(Boolean) && (
        <p className="text-danger text-[.78rem] text-center mb-3">
          Réponds à toutes les questions pour continuer
        </p>
      )}

      <button
        onClick={handleSave}
        className="w-full font-display text-[.7rem] tracking-[.18em] uppercase
                   bg-gradient-to-br from-gold to-gold-l text-dark
                   py-3.5 rounded-full mt-auto transition-all
                   hover:-translate-y-0.5"
      >
        Sauvegarder et continuer →
      </button>
    </motion.div>
  );
}
