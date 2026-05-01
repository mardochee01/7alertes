"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastProvider, toast } from "@/components/ui/Toast";
import { SPIRITUAL_DATA } from "@/lib/data/schedule";

export default function SpiritualPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ivory pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden pb-10"
           style={{ background: "linear-gradient(160deg,#0D1F15,#1A3A2A)" }}>
        <div className="absolute inset-0"
             style={{ background: "radial-gradient(ellipse 70% 80% at 50% 110%,rgba(201,168,76,.14),transparent 60%)" }} />
        <div className="relative z-10 px-5 pt-5 mb-5">
          <button onClick={() => router.push("/dashboard")}
                  className="text-ivory/70 text-sm hover:text-ivory transition-colors font-sans">
            ← Retour
          </button>
        </div>
        <div className="relative z-10 text-center px-5">
          <div className="text-[1.7rem] mb-2">🙏</div>
          <h1 className="font-serif font-light text-ivory text-[2rem] leading-[1.15] mb-1">
            Ressources <em className="italic text-gold-l">Spirituelles</em>
          </h1>
          <p className="font-serif italic text-ivory/48 text-[.92rem]">
            Nourriture pour ton âme et ton couple
          </p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10 flex flex-col gap-3">
        {SPIRITUAL_DATA.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => toast(`${s.title} — disponible dans la version complète ✦`)}
            className="bg-white rounded-[13px] p-4 shadow-[0_2px_12px_rgba(13,31,21,.07)]
                       cursor-pointer transition-all hover:-translate-y-0.5
                       hover:shadow-[0_8px_22px_rgba(13,31,21,.11)]"
          >
            <p className="font-display text-[.58rem] tracking-[.24em] uppercase text-gold mb-1.5">
              {s.type}
            </p>
            <p className="font-serif text-[1.12rem] font-medium text-td mb-1.5">{s.title}</p>
            <p className="text-[.82rem] text-tl leading-[1.5] mb-3">{s.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-[.72rem] text-tl">⏱ {s.time}</span>
              <span className="text-[.62rem] px-2 py-0.5 rounded-full bg-gold/9 text-gold">
                {s.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
      <ToastProvider />
    </div>
  );
}
