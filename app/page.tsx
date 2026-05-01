"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CrownSvg } from "@/components/ui/CrownSvg";
import { ToastProvider } from "@/components/ui/Toast";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const ORB_SIZES = [480, 730, 980];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark flex flex-col items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(201,168,76,.13),transparent 70%)," +
              "radial-gradient(ellipse 60% 80% at 85% 100%,rgba(45,90,61,.28),transparent 60%)," +
              "linear-gradient(160deg,#0D1F15,#1A3A2A 50%,#0D1F15)",
          }}
        />
        {ORB_SIZES.map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(201,168,76,${i === 0 ? 0.07 : i === 1 ? 0.04 : 0.025})`,
              animation: i === 2 ? "rotate-slow 45s linear infinite" : undefined,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 py-12">
        {/* Crown */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <CrownSvg
            id="hero"
            width={105}
            height={80}
            className="drop-shadow-[0_0_28px_rgba(201,168,76,.55)]"
            style={{ animation: "float 4s ease-in-out infinite" } as React.CSSProperties}
          />
        </motion.div>

        <motion.p
          {...fadeUp(0.1)}
          className="font-display text-[.68rem] tracking-[.35em] uppercase text-gold mb-6"
        >
          Un parcours royal · 7 chapitres · 7 alertes
        </motion.p>

        <motion.h1
          {...fadeUp(0.2)}
          className="font-serif font-light text-ivory leading-[1.1] mb-4"
          style={{ fontSize: "clamp(2.8rem,7vw,4.5rem)" }}
        >
          Bienvenue dans<br />
          <em className="italic text-gold-l">ton Royaume</em>
        </motion.h1>

        <motion.div
          {...fadeUp(0.3)}
          className="w-[70px] h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-6"
        />

        <motion.p
          {...fadeUp(0.3)}
          className="font-serif font-light italic text-ivory/60 leading-relaxed max-w-[450px] text-[1.15rem] mb-10"
        >
          "Les 7 alertes avant que ton couple ne se brise", plus qu'un livre, une stratégie conçue pour régner !
        </motion.p>

        <motion.div {...fadeUp(0.4)} className="flex flex-col items-center gap-3">
          <button
            onClick={() => router.push("/onboarding")}
            className="font-display text-[.76rem] tracking-[.2em] uppercase
                       bg-gradient-to-br from-gold to-gold-l text-dark
                       px-11 py-4 rounded-full transition-all duration-300
                       shadow-[0_4px_28px_rgba(201,168,76,.3)]
                       hover:-translate-y-0.5 hover:shadow-[0_8px_36px_rgba(201,168,76,.48)]"
          >
            Commencer mon parcours
          </button>
          <button
            onClick={() => router.push("/login")}
            className="font-sans text-[.83rem] text-gold-p
                       border border-gold/30 px-10 py-3.5 rounded-full
                       transition-all duration-300
                       hover:border-gold hover:bg-gold/10"
          >
            Reprendre mon parcours
          </button>
        </motion.div>

        {/* Features */}
        {/* <motion.div
          {...fadeUp(0.5)}
          className="flex gap-7 mt-14 flex-wrap justify-center"
        >
          {[
            { icon: "👑", label: "Ta couronne" },
            { icon: "📖", label: "7 chapitres" },
            { icon: "🎮", label: "Défis royaux" },
            { icon: "🤍", label: "Communauté" },
            { icon: "✨", label: "À ton écoute" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 opacity-60">
              <span className="text-[1.35rem]">{icon}</span>
              <span className="font-display text-[.65rem] tracking-[.15em] uppercase text-gold-p font-light">
                {label}
              </span>
            </div>
          ))}
        </motion.div> */}
      </div>

      <ToastProvider />
    </div>
  );
}
