"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Chapter } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { CrownSvg } from "@/components/ui/CrownSvg";
import { chapColor } from "@/lib/utils";
import type { Post } from "@/types";

interface Props { chapter: Chapter; }

function uid() {
  return Math.random().toString(36).slice(2);
}

export function ShareSlide({ chapter }: Props) {
  const router = useRouter();
  const { qName, profilePhoto, completeChap, addPost, addXP, chapsDone, setCurrentChap, setSlideIndex } =
    useAppStore();
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  function doShare(t: string) {
    if (!t.trim()) { setError(true); return; }

    const post: Post = {
      id: uid(),
      name: qName,
      col: chapColor(chapter.num),
      init: qName.charAt(0).toUpperCase(),
      photo: profilePhoto,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      chap: `Chapitre ${chapter.num}`,
      text: t.trim(),
      likes: 0,
      likedByMe: false,
      comments: [],
    };

    addPost(post);
    if (!chapsDone.includes(chapter.num)) {
      completeChap(chapter.num);
      addXP(50);
    }

    const nextNum = chapter.num + 1;
    if (nextNum <= 7) {
      setCurrentChap(nextNum);
      setSlideIndex(0);
    }

    router.push("/dashboard");
  }

  return (
    <motion.div
      key="share"
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto relative"
      style={{ background: "linear-gradient(160deg,#250810,#0D2518)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 70% 70% at 50% 100%,rgba(201,168,76,.18),transparent 55%)" }} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          animate={{ filter: ["drop-shadow(0 0 16px rgba(201,168,76,.58))", "drop-shadow(0 0 40px rgba(201,168,76,.9))", "drop-shadow(0 0 16px rgba(201,168,76,.58))"] }}
          transition={{ duration: 1.2, repeat: 0 }}
          className="mb-4"
        >
          <CrownSvg id="share" width={70} height={52} />
        </motion.div>

        <h2 className="font-serif font-light text-ivory text-[2rem] leading-[1.2] text-center mb-2">
          Chapitre {chapter.num}<br />accompli !
        </h2>
        <p className="font-serif italic text-ivory/55 text-[.98rem] text-center mb-6">
          Partage ta progression dans la communauté pour valider et déverrouiller la suite
        </p>

        <p className="font-display text-[.6rem] tracking-[.22em] uppercase text-gold mb-3">
          ✦ Partage requis pour continuer
        </p>

        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setError(false); }}
          placeholder="Partage une victoire, une réflexion, ce que ce chapitre a changé pour toi… 💛"
          rows={4}
          className={`w-full px-3 py-3 rounded-xl resize-none font-sans text-[.86rem] text-td
                      bg-white/92 outline-none border transition-all mb-3
                      ${error ? "border-danger" : "border-gold/30 focus:border-gold"}`}
        />
        {error && (
          <p className="text-[#E8A090] text-[.78rem] text-center mb-3">
            Écris un message pour valider ton chapitre
          </p>
        )}

        <button
          onClick={() => doShare(text)}
          className="w-full font-display text-[.7rem] tracking-[.18em] uppercase
                     bg-gradient-to-br from-gold to-gold-l text-dark
                     py-3.5 rounded-full mb-3 transition-all hover:-translate-y-0.5"
        >
          Publier et continuer →
        </button>
        <button
          onClick={() => doShare(`${qName} a terminé le Chapitre ${chapter.num} — ${chapter.title} ! 💛✨`)}
          className="w-full text-[.82rem] text-gold-l border border-gold/40 bg-transparent
                     py-3 rounded-full font-sans transition-all hover:bg-gold/10"
        >
          Partager automatiquement que j'ai terminé ce chapitre
        </button>
      </div>
    </motion.div>
  );
}
