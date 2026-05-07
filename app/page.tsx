"use client";

import { useRef, useEffect, useState } from "react";
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
   Curseur clignotant machine à écrire
───────────────────────────────────────── */
function TwCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.49, 0.5, 1], ease: "linear" }}
      style={{ color: "#C9A84C", fontWeight: 300 }}
    >|</motion.span>
  );
}

/* ─────────────────────────────────────────
   Book cover 3D
───────────────────────────────────────── */
function BookPresentation() {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      initial="rest" whileHover="hover"
      style={{ position: "relative", display: "inline-block" }}
    >
      <motion.div
        variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative" }}
      >
        {/* Image du livre */}
        <motion.img
          src="/images/book-cover.png"
          alt="7 Alertes"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
          style={{
            width: "clamp(300px,34vw,500px)",
            display: "block",
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 32px 64px rgba(192,57,43,.52)) drop-shadow(0 0 52px rgba(201,168,76,.24)) drop-shadow(0 8px 28px rgba(0,0,0,.75))",
          }}
          draggable={false}
        />
      </motion.div>

      {/* Ombre au sol */}
      <motion.div
        animate={{ scaleX: [1, 0.8, 1], opacity: [0.3, 0.12, 0.3], y: [0, 18, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
        style={{
          position: "absolute", bottom: -18, left: "6%", right: "6%", height: 24,
          background: "rgba(0,0,0,.5)", filter: "blur(16px)", borderRadius: "50%", transformOrigin: "center"
        }}
      />
    </motion.div>
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
  const galleryRef = useRef<HTMLDivElement>(null);
  const frameOuterRef = useRef<HTMLDivElement>(null);
  const photo2Ref = useRef<HTMLDivElement>(null);
  const photo3Ref = useRef<HTMLDivElement>(null);

  /* Refs triggers scroll (les headings de chaque section) */
  const s3TriggerRef = useRef<HTMLDivElement>(null);
  const s4TriggerRef = useRef<HTMLDivElement>(null);

  /* ── Machine à écrire (boucle 2 messages) ── */
  const TW_MSGS = [
    "Bienvenue,\nma Reine",
    "Ce parcours a été conçu avec",
    "amour pour toi et ton couple."
  ];
  const [twTyped, setTwTyped] = useState("");
  const [twMsg, setTwMsg] = useState(0);
  const [twErasing, setTwErasing] = useState(false);
  const [twStarted, setTwStarted] = useState(false);
  const [discoverReady, setDiscoverReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTwStarted(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!twStarted) return;
    const full = TW_MSGS[twMsg];
    if (!twErasing) {
      if (twTyped.length < full.length) {
        const t = setTimeout(() => setTwTyped(full.slice(0, twTyped.length + 1)), 85 + Math.random() * 55);
        return () => clearTimeout(t);
      }
      if (twMsg === 2 && !discoverReady) setDiscoverReady(true);
      const t = setTimeout(() => setTwErasing(true), 2200);
      return () => clearTimeout(t);
    } else {
      if (twTyped.length > 0) {
        const t = setTimeout(() => setTwTyped(full.slice(0, twTyped.length - 1)), 42 + Math.random() * 22);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => { setTwMsg((p) => (p + 1) % TW_MSGS.length); setTwErasing(false); }, 420);
      return () => clearTimeout(t);
    }
  }, [twTyped, twMsg, twErasing, twStarted]);

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
          end: "top 60%",    /* termine quand le titre est au centre */
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
          end: "top 60%",
          scrub: true,
        },
      });

      /* ══ Navy → Bronze (section 3) ══ */
      ScrollTrigger.create({
        trigger: s3TriggerRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(galleryRef.current, { backgroundColor: "#856546", duration: 0.6, ease: "power2.out" });
          gsap.to(frameOuterRef.current, { backgroundColor: "#5A3A1A", duration: 0.6, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(galleryRef.current, { backgroundColor: "#05625C", duration: 0.6, ease: "power2.out" });
          gsap.to(frameOuterRef.current, { backgroundColor: "#034038", duration: 0.6, ease: "power2.out" });
        },
      });

      /* ══ Bronze → Teal (section 4) ══ */
      ScrollTrigger.create({
        trigger: s4TriggerRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(galleryRef.current, { backgroundColor: "#05625C", duration: 0.6, ease: "power2.out" });
          gsap.to(frameOuterRef.current, { backgroundColor: "#034038", duration: 0.6, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(galleryRef.current, { backgroundColor: "#856546", duration: 0.6, ease: "power2.out" });
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
      <style>{`.font-poppins{font-family:var(--font-poppins)}`}</style>
      <ToastProvider />

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section
        style={{ height: "100dvh", background: "linear-gradient(158deg,#0F0205,#250810 50%,#0F0205)", position: "relative", overflow: "hidden" }}
        className="flex items-center"
      >
        {/* Halo central rouge/doré */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse 55% 55% at 50% 62%,rgba(192,57,43,.12),transparent),radial-gradient(ellipse 35% 35% at 50% 0%,rgba(201,168,76,.06),transparent)",
        }} />

        {/* Couronne animée */}
        <video autoPlay loop muted playsInline className="pointer-events-none"
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.22, mixBlendMode: "screen", zIndex: 0
          }}>
          <source src="/videos/courone.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0" style={{
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 78% 78% at 50% 50%,transparent 38%,#0F0205 86%)",
            "linear-gradient(to bottom,#0F0205 0%,transparent 16%,transparent 84%,#0F0205 100%)",
            "linear-gradient(to right,#0F0205 0%,transparent 13%,transparent 87%,#0F0205 100%)",
          ].join(",")
        }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14
                        flex flex-col md:flex-row items-center gap-10 md:gap-16 justify-between">
          {/* Message de bienvenue */}
          <div className="flex flex-col">
            <motion.p
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-poppins uppercase tracking-[.35em] mb-4"
              style={{ fontSize: "0.6rem", color: "rgba(201,168,76,.55)" }}>
              Un message de Lilliane Sanogo
            </motion.p>
            {/* Zone typewriter — 2 messages en boucle */}
            <div style={{ minHeight: 140, marginBottom: "1.5rem" }}>
              <h1 className="font-poppins leading-[1.1]"
                style={{ fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 700, textTransform: "uppercase", color: "#FFFFFF" }}>
                {(() => {
                  const full = TW_MSGS[twMsg];
                  const lines = full.split("\n");
                  /* find which line is currently being typed */
                  let remaining = twTyped;
                  const rendered: React.ReactNode[] = [];
                  for (let i = 0; i < lines.length; i++) {
                    const seg = lines[i];
                    if (remaining.length === 0) {
                      /* cursor sits here — nothing typed yet on this line */
                      if (i > 0) rendered.push(<br key={`br-${i}`} />);
                      rendered.push(<TwCursor key="cur" />);
                      break;
                    }
                    if (remaining.length <= seg.length) {
                      /* partially typed this segment */
                      const typed = remaining.slice(0, remaining.length);
                      if (i > 0) rendered.push(<br key={`br-${i}`} />);
                      /* blank line: render a hair-space so <br> has height */
                      if (seg === "") {
                        rendered.push(<span key={i} style={{ color: "#C9A84C" }}>&thinsp;<TwCursor /></span>);
                      } else {
                        rendered.push(
                          <span key={i} style={{ color: i === 0 ? "#FFFFFF" : "#C9A84C" }}>
                            {typed}<TwCursor />
                          </span>
                        );
                      }
                      break;
                    }
                    /* full line typed */
                    if (i > 0) rendered.push(<br key={`br-${i}`} />);
                    if (seg === "") {
                      rendered.push(<span key={i}>&thinsp;</span>);
                    } else {
                      rendered.push(
                        <span key={i} style={{ color: i === 0 ? "#FFFFFF" : "#C9A84C" }}>{seg}</span>
                      );
                    }
                    remaining = remaining.slice(seg.length + 1); /* +1 for \n */
                  }
                  /* if all lines fully typed, append cursor after last */
                  if (twTyped === full) {
                    rendered.push(<TwCursor key="cur-end" />);
                  }
                  return rendered;
                })()}
              </h1>
            </div>
            <div className="origin-left mb-6"
              style={{ height: 1, width: 52, background: "rgba(201,168,76,.4)" }} />
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="font-poppins uppercase tracking-[.28em] mt-8"
              style={{ fontSize: "0.6rem", color: "rgba(201,168,76,.6)" }}>
              — Lilliane Sanogo
            </motion.p>
          </div>

          {/* Livre flottant */}
          <div className="hidden md:flex justify-center items-center flex-shrink-0">
            <BookPresentation />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
          onClick={() => galleryRef.current?.scrollIntoView({ behavior: "smooth" })}
          style={{ position: "absolute" }}
        >
          {/* Halo pulsant — apparaît quand le 1er message est terminé */}
          {discoverReady && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 2.2, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 52, height: 52, borderRadius: "50%",
                border: "1px solid rgba(201,168,76,.5)",
                pointerEvents: "none",
              }}
            />
          )}
          <motion.span
            className="font-poppins uppercase"
            animate={discoverReady
              ? { opacity: [0.85, 1, 0.85], textShadow: ["0 0 0px transparent", "0 0 12px rgba(201,168,76,.6)", "0 0 0px transparent"] }
              : { opacity: 0.85 }
            }
            transition={discoverReady ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : {}}
            style={{ fontSize: "0.62rem", color: "rgba(201,168,76,1)", letterSpacing: "0.34em" }}
          >
            Découvrir
          </motion.span>
          <motion.div
            animate={{ y: discoverReady ? [0, 11, 0] : [0, 7, 0] }}
            transition={{
              duration: discoverReady ? 1.5 : 2.8,
              repeat: Infinity, ease: "easeInOut", delay: 0.3,
            }}
            className="flex flex-col items-center mt-2"
          >
            <div style={{ width: 1, height: 26, background: `linear-gradient(to bottom,rgba(201,168,76,${discoverReady ? ".8" : ".55"}),transparent)` }} />
            <ChevronDown size={discoverReady ? 15 : 13} style={{ color: `rgba(201,168,76,${discoverReady ? ".9" : ".55"})`, marginTop: -3 }} />
          </motion.div>
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
                <span className="font-poppins uppercase tracking-[.28em] block mb-3"
                  style={{ fontSize: "0.62rem", color: "#C9A84C" }}>
                  — La Communauté Royale
                </span>
              </Reveal>
              <Reveal delay={0.08} fromLeft>
                <h2 className="font-poppins leading-[1.0] mb-5"
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
                  <div className="flex -space-x-2.5">
                    {["femme1", "femme2", "femme3", "femme4", "femme5"].map((name, i) => (
                      <div key={i}
                        style={{
                          width: 38, height: 38, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
                          border: "2px solid #05625C",
                          background: `hsl(${20 + i * 18}, 38%, ${32 + i * 7}%)`
                        }}>
                        <img src={`/images/${name}.jpg`} alt=""
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
                  className="font-poppins uppercase tracking-[.18em] transition-all duration-300
                             hover:-translate-y-0.5 self-start"
                  style={{ fontSize: "0.72rem", fontWeight: 600, background: "linear-gradient(135deg,#C9A84C,#E8C96A)", color: "#1A0C03", padding: "13px 30px", borderRadius: "100px" }}>
                  Rejoindre →
                </button>
              </Reveal>
            </div>

            {/* ── Section 3 ── */}
            <div style={{ height: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="font-poppins uppercase tracking-[.28em] block mb-3"
                style={{ fontSize: "0.62rem", color: "rgba(201,168,76,.65)" }}>
                — 02 · Le Programme
              </span>
              {/* ref sur le heading = trigger GSAP clipPath */}
              <div ref={s3TriggerRef}>
                <h2 className="font-poppins leading-[0.92] mb-4"
                  style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase" }}>
                  Ce qui t'attend dans<br /><span style={{ color: "#C9A84C" }}>la communauté</span>
                </h2>
              </div>
              <div style={{ width: 40, height: 3, background: "#C9A84C", marginBottom: 22 }} />

              {/* 3 cartes */}
              <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>

                {/* Carte 1 : Le programme / le livre */}
                <div style={{
                  flex: 1, borderRadius: 14, overflow: "hidden",
                  background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)",
                  display: "flex", flexDirection: "column"
                }}>
                  <div style={{
                    height: 138, overflow: "hidden", position: "relative",
                    background: "#1A0C10"
                  }}>
                    <img src="/images/book-cover.png" alt="Les 7 Alertes"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                      draggable={false} />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.5))"
                    }} />
                  </div>
                  <div style={{ padding: "13px 13px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p className="font-poppins uppercase"
                      style={{
                        fontSize: "0.74rem", fontWeight: 700, color: "#FFFFFF",
                        letterSpacing: "0.04em", marginBottom: 6, lineHeight: 1.35
                      }}>
                      Un programme pour terminer et appliquer ton livre
                    </p>
                    <p className="font-serif"
                      style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.50)", lineHeight: 1.6 }}>
                      Un parcours structuré, chapitre par chapitre, pour vivre les enseignements au quotidien.
                    </p>
                  </div>
                </div>

                {/* Carte 2 : Communauté */}
                <div style={{
                  flex: 1, borderRadius: 14, overflow: "hidden",
                  background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)",
                  display: "flex", flexDirection: "column"
                }}>
                  <div style={{
                    height: 138, overflow: "hidden", position: "relative",
                    background: "linear-gradient(135deg,#3A1A08,#6B3010)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {/* Grille de 4 avatars — remplacer par photo "Maman Lili avec des femmes" */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 12 }}>
                      {["#8B5E3C", "#5A3020", "#7A4A30", "#9A6A48"].map((bg, i) => (
                        <div key={i} style={{
                          width: 44, height: 44, borderRadius: "50%", background: bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1.5px solid rgba(201,168,76,.25)"
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,.55)">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.45))"
                    }} />
                  </div>
                  <div style={{ padding: "13px 13px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p className="font-poppins uppercase"
                      style={{
                        fontSize: "0.74rem", fontWeight: 700, color: "#FFFFFF",
                        letterSpacing: "0.04em", marginBottom: 6, lineHeight: 1.35
                      }}>
                      Une communauté ayant le même objectif que toi
                    </p>
                    <p className="font-serif"
                      style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.50)", lineHeight: 1.6 }}>
                      Avance avec d'autres reines, partage tes victoires et reste motivée.
                    </p>
                  </div>
                </div>

                {/* Carte 3 : Maman Lili */}
                <div style={{
                  flex: 1, borderRadius: 14, overflow: "hidden",
                  background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)",
                  display: "flex", flexDirection: "column"
                }}>
                  <div style={{
                    height: 138, overflow: "hidden", position: "relative",
                    background: "#1A0C10"
                  }}>
                    <img src="/images/Liliane-Sanogo.webp" alt="Lilliane Sanogo"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                      draggable={false} />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.55))"
                    }} />
                  </div>
                  <div style={{ padding: "13px 13px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p className="font-poppins uppercase"
                      style={{
                        fontSize: "0.74rem", fontWeight: 700, color: "#FFFFFF",
                        letterSpacing: "0.04em", marginBottom: 6, lineHeight: 1.35
                      }}>
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
                className="font-poppins uppercase tracking-[.18em] transition-all duration-300
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
                    <p className="font-poppins uppercase tracking-[.18em]"
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
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(26,8,6,.72) 0%, transparent 55%)"
                  }} />
                  <div style={{ position: "absolute", bottom: 22, left: 22, right: 22 }}>
                    <p className="font-poppins uppercase tracking-[.18em]"
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
      <div style={{ position: "relative" }}>
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

          {/* Couronne animée — fond section 5 */}
          <video autoPlay loop muted playsInline className="pointer-events-none"
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)", width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.22, mixBlendMode: "screen", zIndex: 2
            }}>
            <source src="/videos/courone.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0" style={{
            zIndex: 2,
            background: [
              "radial-gradient(ellipse 78% 78% at 50% 50%,transparent 38%,#0F0205 86%)",
              "linear-gradient(to bottom,#0F0205 0%,transparent 16%,transparent 84%,#0F0205 100%)",
              "linear-gradient(to right,#0F0205 0%,transparent 13%,transparent 87%,#0F0205 100%)",
            ].join(",")
          }} />

          <div className="relative z-10 flex flex-col items-center text-center px-8">
            <Reveal delay={0.1}>
              <h2 className="font-poppins leading-[0.9] mb-6"
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
                  className="font-poppins uppercase tracking-[.2em] transition-all duration-300
                           hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,.5)]"
                  style={{ fontSize: "0.76rem", fontWeight: 600, background: "linear-gradient(135deg,#C9A84C,#E8C96A)", color: "#0F0205", padding: "14px 38px", borderRadius: "4px" }}>
                  Bâtir mon royaume
                </button>
                <button onClick={() => router.push("/login")}
                  className="font-poppins uppercase tracking-[.18em] transition-all duration-300
                           hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(201,168,76,.22)]"
                  style={{ fontSize: "0.7rem", fontWeight: 300, color: "rgba(250,247,239,.48)", border: "1px solid rgba(250,247,239,.17)", padding: "14px 28px", borderRadius: "4px" }}
                  onMouseEnter={e => { const b = e.currentTarget; b.style.color = "rgba(250,247,239,.88)"; b.style.borderColor = "rgba(250,247,239,.38)"; }}
                  onMouseLeave={e => { const b = e.currentTarget; b.style.color = "rgba(250,247,239,.48)"; b.style.borderColor = "rgba(250,247,239,.17)"; }}>
                  J'ai déjà mon royaume
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer superposé sur la section 5 ── */}
        <footer style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
          background: "rgba(10,1,4,0.14)", backdropFilter: "blur(2px)"
        }}>
          <div className="w-full max-w-7xl mx-auto px-6 md:px-14 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-poppins uppercase tracking-[.22em]"
              style={{ fontSize: "0.55rem", color: "rgba(250,247,239,.28)" }}>
              Copyright © 2026 · All rights reserved.
            </span>
            <nav className="flex items-center gap-5">
              <button className="font-poppins uppercase tracking-[.18em]"
                style={{ fontSize: "0.55rem", color: "rgba(250,247,239,.28)", background: "none", border: "none", cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(250,247,239,.28)")}>
                Politique de confidentialité
              </button>
              <span style={{ color: "rgba(201,168,76,.22)", fontSize: "0.7rem" }}>·</span>
              <button className="font-poppins uppercase tracking-[.18em]"
                style={{ fontSize: "0.55rem", color: "rgba(250,247,239,.28)", background: "none", border: "none", cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(250,247,239,.28)")}>
                Mentions légales
              </button>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
