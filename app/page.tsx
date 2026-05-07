"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ToastProvider } from "@/components/ui/Toast";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */

/* FEATURES décommentées avec la section 4
const FEATURES = [
  { Icon: BookOpen, label: "7 Chapitres",          desc: "Un parcours structuré, chapitre par chapitre" },
  { Icon: Crown,    label: "Système de couronnes", desc: "Progresse et gagne des couronnes royales"     },
  { Icon: Sparkles, label: "Maman Lili IA",        desc: "Une IA inspirée des enseignements de Lilliane Sanogo" },
  { Icon: Users,    label: "Communauté",           desc: "Partage et avance avec d'autres reines"       },
]; */

/* ─────────────────────────────────────────
   Book cover 3D
───────────────────────────────────────── */
function BookPresentation() {
  const COVER_W = 460;
  const SPINE_W = 36;
  return (
    <div style={{ perspective: "1100px", perspectiveOrigin: "60% 50%" }}>
      <motion.div
        initial={{ opacity: 0, rotateY: -55, x: 60, scale: 0.88 }}
        animate={{ opacity: 1, rotateY: -18, x: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative", display: "inline-block" }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
          style={{ transformStyle: "preserve-3d", position: "relative" }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: SPINE_W, borderRadius: "3px 0 0 3px", background: "linear-gradient(to right,#2A0508,#6A0F18,#8B1520)", transform: "rotateY(90deg)", transformOrigin: "left center", backfaceVisibility: "hidden" }} />
          <div style={{ position: "absolute", top: 0, left: 1, right: 0, height: 18, borderRadius: "0 2px 0 0", background: "linear-gradient(160deg,#F8F2EC,#DDD4CA)", transform: "rotateX(90deg)", transformOrigin: "top center", backfaceVisibility: "hidden" }} />
          <img src="/images/book-cover.png" alt="7 Alertes" style={{ width: COVER_W, display: "block", borderRadius: "0 4px 4px 0", position: "relative", zIndex: 1 }} draggable={false} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "0 4px 4px 0", background: "linear-gradient(128deg,rgba(255,255,255,.20) 0%,rgba(255,255,255,.06) 25%,transparent 55%,rgba(0,0,0,.06) 100%)", pointerEvents: "none", zIndex: 2 }} />
        </motion.div>
        <motion.div
          animate={{ scaleX: [1, 0.88, 1], opacity: [0.28, 0.16, 0.28], y: [0, 12, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
          style={{ position: "absolute", bottom: -22, left: "8%", right: "-2%", height: 28, background: "rgba(0,0,0,.3)", filter: "blur(14px)", borderRadius: "50%", transformOrigin: "center" }}
        />
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.18 }}
          transition={{ delay: 1.2, duration: 1 }}
          style={{ position: "absolute", inset: "-20px -40px", background: "radial-gradient(ellipse 60% 70% at 70% 50%,rgba(192,57,43,.55),transparent)", filter: "blur(24px)", pointerEvents: "none", zIndex: -1 }}
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Reveal (sections 1 et 5)
───────────────────────────────────────── */
function Reveal({
  children, delay = 0, fromLeft = false,
}: {
  children: React.ReactNode; delay?: number; fromLeft?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -28 : 0, y: fromLeft ? 0 : 22 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();

  /* Refs gallery */
  const galleryRef    = useRef<HTMLDivElement>(null);
  const frameOuterRef = useRef<HTMLDivElement>(null);
  const photo2Ref     = useRef<HTMLDivElement>(null);
  const photo3Ref     = useRef<HTMLDivElement>(null);

  /* Refs triggers scroll (les headings de chaque section) */
  const s3TriggerRef  = useRef<HTMLDivElement>(null);
  const s4TriggerRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Lenis smooth scroll ────────────────────── */
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", () => ScrollTrigger.update());

    /* ── GSAP ──────────────────────────────────── */
    const ctx = gsap.context(() => {

      /* Photos 2 et 3 : masquées par clipPath (révèle depuis le bas) */
      gsap.set([photo2Ref.current, photo3Ref.current], {
        clipPath: "inset(100% 0% 0% 0%)",
        autoAlpha: 1,
      });

      /* ══ Révèle photo 2 quand le heading section 3 entre dans l'écran ══ */
      gsap.to(photo2Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        scrollTrigger: {
          trigger: s3TriggerRef.current,
          start: "top 120%",   /* commence avant que le titre soit visible */
          end:   "top 60%",    /* termine quand le titre est au centre */
          scrub: true,
        },
      });

      /* ══ Révèle photo 3 quand le heading section 4 entre dans l'écran ══ */
      gsap.to(photo3Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        scrollTrigger: {
          trigger: s4TriggerRef.current,
          start: "top 120%",
          end:   "top 60%",
          scrub: true,
        },
      });

      /* ══ Navy → Bronze (section 3) ══ */
      ScrollTrigger.create({
        trigger: s3TriggerRef.current,
        start: "top 80%",
        onEnter:     () => {
          gsap.to(galleryRef.current,    { backgroundColor: "#856546", duration: 0.6, ease: "power2.out" });
          gsap.to(frameOuterRef.current, { backgroundColor: "#5A3A1A", duration: 0.6, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(galleryRef.current,    { backgroundColor: "#05625C", duration: 0.6, ease: "power2.out" });
          gsap.to(frameOuterRef.current, { backgroundColor: "#034038", duration: 0.6, ease: "power2.out" });
        },
      });

      /* ══ Bronze → Teal (section 4) ══ */
      ScrollTrigger.create({
        trigger: s4TriggerRef.current,
        start: "top 80%",
        onEnter:     () => {
          gsap.to(galleryRef.current,    { backgroundColor: "#05625C", duration: 0.6, ease: "power2.out" });
          gsap.to(frameOuterRef.current, { backgroundColor: "#034038", duration: 0.6, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(galleryRef.current,    { backgroundColor: "#856546", duration: 0.6, ease: "power2.out" });
          gsap.to(frameOuterRef.current, { backgroundColor: "#5A3A1A", duration: 0.6, ease: "power2.out" });
        },
      });

    });

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(tickerCb);
    };
  }, []);

  return (
    <div>
      <style>{`.font-bold-display{font-family:var(--font-bold)}`}</style>
      <ToastProvider />

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section
        style={{ height: "100dvh", background: "#FFFFFF", position: "relative", overflow: "hidden" }}
        className="flex items-center"
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "#C0392B" }} />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14
                        flex flex-col md:flex-row items-center gap-8 md:gap-12 justify-between">
          <div className="flex flex-col flex-1 min-w-0">
            <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="font-bold-display uppercase tracking-[.28em] mb-5"
              style={{ fontSize: "0.63rem", color: "#C9A84C" }}>
              Le Mystère des Sept Eunuques
            </motion.span>
            <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold-display leading-[0.88] mb-5"
              style={{ fontSize: "clamp(3.8rem,8vw,7rem)", fontWeight: 700 }}>
              <span style={{ color: "#C0392B" }}>7</span>
              <span style={{ color: "#1A1008" }}>ALERTES</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold-display leading-[1.15] mb-5"
              style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 300, color: "#1A1008", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Avant que ton couple<br />ne se brise
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.38 }}
              className="font-bold-display uppercase tracking-[.3em] mb-7"
              style={{ fontSize: "0.67rem", color: "#C9A84C", fontWeight: 500 }}>
              Lilliane Sanogo
            </motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              className="origin-left mb-8"
              style={{ height: "3px", width: "48px", background: "#C0392B" }} />
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => router.push("/onboarding")}
                className="font-bold-display uppercase tracking-[.18em] transition-all duration-300
                           hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(192,57,43,.38)]"
                style={{ fontSize: "0.77rem", fontWeight: 600, background: "#C0392B", color: "#FFFFFF", padding: "14px 34px", borderRadius: "4px" }}>
                Commencer mon parcours
              </button>
              <button onClick={() => router.push("/login")}
                className="font-bold-display uppercase tracking-[.18em] transition-all duration-300 hover:bg-gray-50"
                style={{ fontSize: "0.7rem", fontWeight: 400, color: "#7A6A5A", border: "1px solid #D5CCC0", padding: "14px 26px", borderRadius: "4px" }}>
                Reprendre mon parcours
              </button>
            </motion.div>
          </div>
          <div className="hidden md:flex justify-center items-center py-8 flex-shrink-0">
            <BookPresentation />
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.32 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          style={{ animation: "float 2.6s ease-in-out infinite" } as React.CSSProperties}>
          <span className="font-bold-display uppercase tracking-[.28em]"
                style={{ fontSize: "0.54rem", color: "#B0A090" }}>Découvrir</span>
          <ChevronDown size={13} style={{ color: "#B0A090" }} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          GALLERY — sections 2 · 3 · 4

          Architecture lifeonablock :
          ┌──────────────────────┬──────────────┐
          │ Colonne gauche        │ Cadre sticky │
          │ (scroll normal)       │ (position:   │
          │ 3 × 100dvh sections   │  sticky top) │
          │                       │              │
          │ S2: texte blanc       │ ┌──────────┐ │
          │ S3: texte blanc/somb  │ │ Photo 1  │ │
          │ S4: texte sombre/crème│ │ Photo 2  │ │ ← clipPath reveal scrubbed
          │                       │ │ Photo 3  │ │ ← idem
          └──────────────────────┴──────────────┘

          Le fond de la galerie passe de blanc → sombre → crème
          Le cadre change en même temps.
      ══════════════════════════════════════════ */}
      <div ref={galleryRef} style={{ background: "#05625C" }}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-14
                        flex flex-row items-start gap-10 md:gap-16">

          {/* ── Colonne gauche : texte (scroll normal) ── */}
          <div className="flex-1 min-w-0">

            {/* ── Section 2 ── */}
            <div style={{ height: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Reveal fromLeft>
                <span className="font-bold-display uppercase tracking-[.28em] block mb-3"
                      style={{ fontSize: "0.62rem", color: "#C9A84C" }}>
                  — La Communauté Royale
                </span>
              </Reveal>
              <Reveal delay={0.08} fromLeft>
                <h2 className="font-bold-display leading-[1.0] mb-5"
                    style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase" }}>
                  Rejoins une<br />communauté de<br />
                  <span style={{ color: "#C9A84C" }}>femmes sages&nbsp;!</span>
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <div style={{ width: 40, height: 3, background: "#C9A84C", marginBottom: 18 }} />
              </Reveal>
              <Reveal delay={0.18}>
                <p className="font-serif font-light leading-relaxed mb-7"
                   style={{ fontSize: "clamp(.95rem,1.6vw,1.1rem)", color: "rgba(255,255,255,.65)", maxWidth: 460 }}>
                  Ma reine, conserver un royaume, c'est une affaire de sagesse.
                  Ce parcours autour de mon livre <em>« Les 7 alertes »</em> a été conçu
                  pour toi, afin que ton couple ne soit pas un royaume divisé
                  mais plutôt un havre de paix.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                {/* Avatars — remplacer par de vraies photos dans public/images/ */}
                <div className="flex items-center gap-3 mb-7">
                  {/* Pour ajouter de vraies photos : place femme1.webp … femme5.webp dans public/images/ */}
                  <div className="flex -space-x-2.5">
                    {["femme1","femme2","femme3","femme4","femme5"].map((name, i) => (
                      <div key={i}
                           style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
                                    border: "2px solid #05625C",
                                    background: `hsl(${20 + i * 18}, 38%, ${32 + i * 7}%)` }}>
                        <img src={`/images/${name}.webp`} alt=""
                             draggable={false}
                             style={{ width: "100%", height: "100%", objectFit: "cover" }}
                             onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    ))}
                  </div>
                  <p className="font-serif italic"
                     style={{ fontSize: "0.78rem", color: "rgba(255,255,255,.50)" }}>
                    + 2 000 reines dans la communauté
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <button onClick={() => router.push("/onboarding")}
                  className="font-bold-display uppercase tracking-[.18em] transition-all duration-300
                             hover:-translate-y-0.5 self-start"
                  style={{ fontSize: "0.72rem", fontWeight: 600, background: "linear-gradient(135deg,#C9A84C,#E8C96A)", color: "#1A0C03", padding: "13px 30px", borderRadius: "100px" }}>
                  Rejoindre →
                </button>
              </Reveal>
            </div>

            {/* ── Section 3 ── */}
            <div style={{ height: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="font-bold-display uppercase tracking-[.28em] block mb-3"
                    style={{ fontSize: "0.62rem", color: "rgba(201,168,76,.65)" }}>
                — 02 · Le Programme
              </span>
              {/* ref sur le heading = trigger GSAP clipPath */}
              <div ref={s3TriggerRef}>
                <h2 className="font-bold-display leading-[0.92] mb-4"
                    style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase" }}>
                  Ce qui t'attend dans<br /><span style={{ color: "#C9A84C" }}>la communauté</span>
                </h2>
              </div>
              <div style={{ width: 40, height: 3, background: "#C9A84C", marginBottom: 22 }} />

              {/* 3 cartes */}
              <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>

                {/* Carte 1 : Le programme / le livre */}
                <div style={{ flex: 1, borderRadius: 14, overflow: "hidden",
                              background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)",
                              display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 138, overflow: "hidden", position: "relative",
                                background: "#1A0C10" }}>
                    <img src="/images/book-cover.png" alt="Les 7 Alertes"
                         style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                         draggable={false} />
                    <div style={{ position: "absolute", inset: 0,
                                  background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.5))" }} />
                  </div>
                  <div style={{ padding: "13px 13px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p className="font-bold-display uppercase"
                       style={{ fontSize: "0.74rem", fontWeight: 700, color: "#FFFFFF",
                                letterSpacing: "0.04em", marginBottom: 6, lineHeight: 1.35 }}>
                      Un programme pour terminer et appliquer ton livre
                    </p>
                    <p className="font-serif"
                       style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.50)", lineHeight: 1.6 }}>
                      Un parcours structuré, chapitre par chapitre, pour vivre les enseignements au quotidien.
                    </p>
                  </div>
                </div>

                {/* Carte 2 : Communauté */}
                <div style={{ flex: 1, borderRadius: 14, overflow: "hidden",
                              background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)",
                              display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 138, overflow: "hidden", position: "relative",
                                background: "linear-gradient(135deg,#3A1A08,#6B3010)",
                                display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* Grille de 4 avatars — remplacer par photo "Maman Lili avec des femmes" */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 12 }}>
                      {["#8B5E3C","#5A3020","#7A4A30","#9A6A48"].map((bg, i) => (
                        <div key={i} style={{ width: 44, height: 44, borderRadius: "50%", background: bg,
                                              display: "flex", alignItems: "center", justifyContent: "center",
                                              border: "1.5px solid rgba(201,168,76,.25)" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,.55)">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                    <div style={{ position: "absolute", inset: 0,
                                  background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.45))" }} />
                  </div>
                  <div style={{ padding: "13px 13px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p className="font-bold-display uppercase"
                       style={{ fontSize: "0.74rem", fontWeight: 700, color: "#FFFFFF",
                                letterSpacing: "0.04em", marginBottom: 6, lineHeight: 1.35 }}>
                      Une communauté ayant le même objectif que toi
                    </p>
                    <p className="font-serif"
                       style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.50)", lineHeight: 1.6 }}>
                      Avance avec d'autres reines, partage tes victoires et reste motivée.
                    </p>
                  </div>
                </div>

                {/* Carte 3 : Maman Lili */}
                <div style={{ flex: 1, borderRadius: 14, overflow: "hidden",
                              background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)",
                              display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 138, overflow: "hidden", position: "relative",
                                background: "#1A0C10" }}>
                    <img src="/images/Liliane-Sanogo.webp" alt="Lilliane Sanogo"
                         style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                         draggable={false} />
                    <div style={{ position: "absolute", inset: 0,
                                  background: "linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.55))" }} />
                  </div>
                  <div style={{ padding: "13px 13px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p className="font-bold-display uppercase"
                       style={{ fontSize: "0.74rem", fontWeight: 700, color: "#FFFFFF",
                                letterSpacing: "0.04em", marginBottom: 6, lineHeight: 1.35 }}>
                      Un accès privilégié aux conseils de Maman Lili
                    </p>
                    <p className="font-serif"
                       style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.50)", lineHeight: 1.6 }}>
                      Bénéficie des enseignements exclusifs de Lilliane Sanogo directement dans l'app.
                    </p>
                  </div>
                </div>

              </div>

              <button onClick={() => router.push("/onboarding")}
                className="font-bold-display uppercase tracking-[.18em] transition-all duration-300
                           hover:-translate-y-0.5 self-start mt-6"
                style={{ fontSize: "0.72rem", fontWeight: 600, background: "#C0392B", color: "#FFFFFF", padding: "13px 30px", borderRadius: "100px" }}>
                Rejoindre →
              </button>
            </div>

            {/* ── Section 4 masquée temporairement ──
            <div style={{ height: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span>— 03 · Ton parcours</span>
              <div ref={s4TriggerRef}>
                <h2>Ton parcours Royal</h2>
              </div>
            </div>
            ── fin section 4 masquée ── */}

          </div>

          {/* ── Colonne droite : cadre STICKY ── */}
          <div
            className="hidden md:flex items-center flex-shrink-0"
            style={{ position: "sticky", top: 0, height: "100dvh", alignSelf: "flex-start" }}
          >
            {/* Outer frame — fond change via GSAP */}
            <div ref={frameOuterRef}
                 className="rounded-[28px] p-[14px]"
                 style={{ background: "#034038", width: 400, maxWidth: "40vw" }}>

              {/* Inner frame — photos empilées, clipPath reveals */}
              <div className="rounded-[18px] overflow-hidden"
                   style={{ width: "100%", aspectRatio: "3/4", position: "relative" }}>

                {/* Photo 1 — section 2 (toujours visible en base) : Lilliane Sanogo */}
                <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "#1A0C10" }}>
                  <img src="/images/Liliane-Sanogo.webp" alt="Lilliane Sanogo" draggable={false}
                       style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                  {/* Dégradé bas pour transition douce */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,12,16,.75) 0%, transparent 55%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: 22, left: 22, right: 22 }}>
                    <p className="font-bold-display uppercase tracking-[.18em]"
                       style={{ fontSize: "0.68rem", color: "#C9A84C", fontWeight: 600 }}>
                      Lilliane Sanogo
                    </p>
                    <p className="font-serif italic"
                       style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.55)", marginTop: 3 }}>
                      Auteure · Coach conjugale
                    </p>
                  </div>
                </div>

                {/* Photo 2 — section 3 (révélée par clipPath) : communauté */}
                <div ref={photo2Ref}
                     style={{ position: "absolute", inset: 0, zIndex: 2, background: "#1A0E06" }}>
                  <img src="/images/communaité.jpg" alt="Communauté" draggable={false}
                       style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                  <div style={{ position: "absolute", inset: 0,
                                background: "linear-gradient(to top, rgba(26,8,6,.72) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: 22, left: 22, right: 22 }}>
                    <p className="font-bold-display uppercase tracking-[.18em]"
                       style={{ fontSize: "0.68rem", color: "#C9A84C", fontWeight: 600 }}>
                      La Communauté Royale
                    </p>
                    <p className="font-serif italic"
                       style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.55)", marginTop: 3 }}>
                      Des femmes sages qui avancent ensemble
                    </p>
                  </div>
                </div>

                {/* Photo 3 — section 4 masquée temporairement
                <div ref={photo3Ref} style={{ position: "absolute", inset: 0, zIndex: 3 }} />
                ── fin photo 3 masquée ── */}

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 5 — CTA FINALE
      ══════════════════════════════════════════ */}
      <section
        style={{
          height: "100dvh",
          background: "linear-gradient(158deg,#0F0205,#250810 50%,#0F0205)",
          position: "relative",
          overflow: "hidden",
        }}
        className="flex items-center justify-center"
      >
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse 55% 55% at 50% 62%,rgba(192,57,43,.14),transparent),radial-gradient(ellipse 35% 35% at 50% 0%,rgba(201,168,76,.07),transparent)",
        }} />

        {/* ── Filigrane royal ──────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>

          {/* Fond : motif répété couronne + losange */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.028 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="s5royal" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 12 L48 30 L60 20 L54 35 L26 35 L20 20 L32 30 Z" fill="none" stroke="#C9A84C" strokeWidth="0.7"/>
                <circle cx="32" cy="30" r="1" fill="#C9A84C"/>
                <circle cx="48" cy="30" r="1" fill="#C9A84C"/>
                <circle cx="40" cy="12" r="1" fill="#C9A84C"/>
                <path d="M40 44 L46 50 L40 56 L34 50 Z" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#s5royal)"/>
          </svg>

          {/* Grande couronne centrale */}
          <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg"
               style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                        width:"clamp(400px,58vw,680px)", opacity:0.055, stroke:"#C9A84C" }}>
            <path d="M60 170 L60 196 L260 196 L260 170" strokeWidth="1.2"/>
            <circle cx="84"  cy="183" r="4" strokeWidth="1"/><circle cx="114" cy="183" r="4" strokeWidth="1"/>
            <circle cx="144" cy="183" r="4" strokeWidth="1"/><circle cx="160" cy="183" r="4" strokeWidth="1"/>
            <circle cx="176" cy="183" r="4" strokeWidth="1"/><circle cx="206" cy="183" r="4" strokeWidth="1"/>
            <circle cx="236" cy="183" r="4" strokeWidth="1"/>
            <path d="M60 170 L82 88 L120 128 L160 46 L200 128 L238 88 L260 170" strokeWidth="1.4"/>
            <path d="M82 88 Q120 102 120 128" strokeWidth="0.8" strokeDasharray="3,4"/>
            <path d="M238 88 Q200 102 200 128" strokeWidth="0.8" strokeDasharray="3,4"/>
            <circle cx="82"  cy="88" r="8"  strokeWidth="1"/><circle cx="238" cy="88" r="8"  strokeWidth="1"/>
            <circle cx="160" cy="46" r="11" strokeWidth="1.2"/>
            <path d="M160 30 L160 62 M144 46 L176 46" strokeWidth="1"/>
            <circle cx="160" cy="30" r="3.5" strokeWidth="0.9"/>
          </svg>

          {/* Fleur-de-lis haut-gauche */}
          <svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg"
               style={{ position:"absolute", top:0, left:0, width:155, opacity:0.11, stroke:"#C9A84C", strokeWidth:"0.9" }}>
            <path d="M20 5 Q27 18 24 30 Q20 37 16 30 Q13 18 20 5"/>
            <path d="M2 22 Q10 15 20 22 Q22 31 14 35 Q4 30 2 22"/>
            <path d="M38 22 Q30 15 20 22 Q18 31 26 35 Q36 30 38 22"/>
            <path d="M14 35 Q20 32 26 35 L27 44 Q20 40 13 44 Z"/>
            <line x1="20" y1="44" x2="20" y2="62"/>
            <path d="M0 74 L0 90 M0 74 L26 90" strokeWidth="0.7"/>
            <path d="M0 82 L13 90" strokeWidth="0.7"/>
          </svg>

          {/* Fleur-de-lis haut-droit */}
          <svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg"
               style={{ position:"absolute", top:0, right:0, width:155, opacity:0.11, stroke:"#C9A84C", strokeWidth:"0.9", transform:"scaleX(-1)" }}>
            <path d="M20 5 Q27 18 24 30 Q20 37 16 30 Q13 18 20 5"/>
            <path d="M2 22 Q10 15 20 22 Q22 31 14 35 Q4 30 2 22"/>
            <path d="M38 22 Q30 15 20 22 Q18 31 26 35 Q36 30 38 22"/>
            <path d="M14 35 Q20 32 26 35 L27 44 Q20 40 13 44 Z"/>
            <line x1="20" y1="44" x2="20" y2="62"/>
            <path d="M0 74 L0 90 M0 74 L26 90" strokeWidth="0.7"/>
            <path d="M0 82 L13 90" strokeWidth="0.7"/>
          </svg>

          {/* Fleur-de-lis bas-gauche */}
          <svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg"
               style={{ position:"absolute", bottom:0, left:0, width:155, opacity:0.11, stroke:"#C9A84C", strokeWidth:"0.9", transform:"scaleY(-1)" }}>
            <path d="M20 5 Q27 18 24 30 Q20 37 16 30 Q13 18 20 5"/>
            <path d="M2 22 Q10 15 20 22 Q22 31 14 35 Q4 30 2 22"/>
            <path d="M38 22 Q30 15 20 22 Q18 31 26 35 Q36 30 38 22"/>
            <path d="M14 35 Q20 32 26 35 L27 44 Q20 40 13 44 Z"/>
            <line x1="20" y1="44" x2="20" y2="62"/>
            <path d="M0 74 L0 90 M0 74 L26 90" strokeWidth="0.7"/>
            <path d="M0 82 L13 90" strokeWidth="0.7"/>
          </svg>

          {/* Fleur-de-lis bas-droit */}
          <svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg"
               style={{ position:"absolute", bottom:0, right:0, width:155, opacity:0.11, stroke:"#C9A84C", strokeWidth:"0.9", transform:"scale(-1,-1)" }}>
            <path d="M20 5 Q27 18 24 30 Q20 37 16 30 Q13 18 20 5"/>
            <path d="M2 22 Q10 15 20 22 Q22 31 14 35 Q4 30 2 22"/>
            <path d="M38 22 Q30 15 20 22 Q18 31 26 35 Q36 30 38 22"/>
            <path d="M14 35 Q20 32 26 35 L27 44 Q20 40 13 44 Z"/>
            <line x1="20" y1="44" x2="20" y2="62"/>
            <path d="M0 74 L0 90 M0 74 L26 90" strokeWidth="0.7"/>
            <path d="M0 82 L13 90" strokeWidth="0.7"/>
          </svg>

          {/* Sceptre gauche */}
          <svg viewBox="0 0 20 340" fill="none" xmlns="http://www.w3.org/2000/svg"
               style={{ position:"absolute", left:"6%", top:"50%", transform:"translateY(-50%)",
                        width:18, height:"62%", opacity:0.12, stroke:"#C9A84C", strokeWidth:"0.8" }}>
            <circle cx="10" cy="14" r="9" strokeWidth="0.9"/>
            <path d="M10 5 L10 0 M10 23 L10 316"/>
            <path d="M10 9 L10 19 M5 14 L15 14" strokeWidth="0.6"/>
            <circle cx="10" cy="90"  r="3.5" strokeWidth="0.7"/>
            <circle cx="10" cy="170" r="5"   strokeWidth="0.8"/>
            <circle cx="10" cy="250" r="3.5" strokeWidth="0.7"/>
            <path d="M5 316 L10 332 L15 316" strokeWidth="0.8"/>
          </svg>

          {/* Sceptre droit */}
          <svg viewBox="0 0 20 340" fill="none" xmlns="http://www.w3.org/2000/svg"
               style={{ position:"absolute", right:"6%", top:"50%", transform:"translateY(-50%)",
                        width:18, height:"62%", opacity:0.12, stroke:"#C9A84C", strokeWidth:"0.8" }}>
            <circle cx="10" cy="14" r="9" strokeWidth="0.9"/>
            <path d="M10 5 L10 0 M10 23 L10 316"/>
            <path d="M10 9 L10 19 M5 14 L15 14" strokeWidth="0.6"/>
            <circle cx="10" cy="90"  r="3.5" strokeWidth="0.7"/>
            <circle cx="10" cy="170" r="5"   strokeWidth="0.8"/>
            <circle cx="10" cy="250" r="3.5" strokeWidth="0.7"/>
            <path d="M5 316 L10 332 L15 316" strokeWidth="0.8"/>
          </svg>

          {/* "VII" en arrière-plan */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.036 }} xmlns="http://www.w3.org/2000/svg">
            <text x="13%" y="26%" fontFamily="Georgia,serif" fontSize="54" fill="#C9A84C" letterSpacing="6" transform="rotate(-9,13%,26%)">VII</text>
            <text x="60%" y="74%" fontFamily="Georgia,serif" fontSize="54" fill="#C9A84C" letterSpacing="6" transform="rotate(7,60%,74%)">VII</text>
          </svg>

        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <Reveal delay={0.1}>
            <h2 className="font-bold-display leading-[0.9] mb-6"
                style={{ fontSize: "clamp(2rem,5.5vw,4rem)", fontWeight: 700, textTransform: "uppercase", color: "#FFFFFF" }}>
              Commence<br /><span style={{ color: "#C9A84C" }}>ton règne</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mx-auto mb-8"
                 style={{ width: 48, height: 2, background: "linear-gradient(to right,transparent,#C9A84C,transparent)" }} />
          </Reveal>
          <Reveal delay={0.3}>
            <p className="font-serif font-light italic mb-10 max-w-xs"
               style={{ fontSize: "1rem", color: "rgba(250,247,239,.44)", lineHeight: 1.75 }}>
              Plus qu'un livre, une stratégie conçue pour régner.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button onClick={() => router.push("/onboarding")}
                className="font-bold-display uppercase tracking-[.2em] transition-all duration-300
                           hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,.5)]"
                style={{ fontSize: "0.76rem", fontWeight: 600, background: "linear-gradient(135deg,#C9A84C,#E8C96A)", color: "#0F0205", padding: "14px 38px", borderRadius: "4px" }}>
                Bâtir mon royaume
              </button>
              <button onClick={() => router.push("/login")}
                className="font-bold-display uppercase tracking-[.18em] transition-all duration-300"
                style={{ fontSize: "0.7rem", fontWeight: 300, color: "rgba(250,247,239,.48)", border: "1px solid rgba(250,247,239,.17)", padding: "14px 28px", borderRadius: "4px" }}>
                J'ai déjà mon royaume
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
