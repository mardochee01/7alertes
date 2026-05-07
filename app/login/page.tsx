"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadProfile } from "@/lib/supabase/profile";
import { useAppStore } from "@/store/useAppStore";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function LoginPage() {
  const router = useRouter();
  const store = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) { setError("Remplis tous les champs"); return; }
    setError(""); setLoading(true);

    const sb = createClient();
    const { data, error: authErr } = await sb.auth.signInWithPassword({ email, password });

    if (authErr || !data.user) {
      setError("E-mail ou mot de passe incorrect");
      setLoading(false); return;
    }

    // Charge le profil depuis Supabase
    const profile = await loadProfile(data.user.id);
    if (profile) {
      store.setQName(profile.qName ?? "");
      store.setKName(profile.kName ?? "mon roi");
      store.setKingdomName(profile.kingdomName ?? "Le Royaume");
      store.setProfilePhoto(profile.profilePhoto ?? "");
      store.setStartDate(profile.startDate ?? "");
      if (profile.chapsDone?.length) {
        profile.chapsDone.forEach((n) => store.completeChap(n));
      }
      useAppStore.setState({
        crownHP: profile.crownHP ?? 7,
        xp: profile.xp ?? 0,
        streak: profile.streak ?? 1,
      });
      store.updateStreak();
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-ivory grid md:grid-cols-2">
      {/* ── Côté visuel ───────────────────────────────────────── */}
      <div className="hidden md:flex relative flex-col items-center justify-center p-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#250810,#0F0205)" }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 110%,rgba(201,168,76,.18),transparent 60%)" }} />
        <button onClick={() => router.push("/")}
          className="absolute top-6 left-6 z-20 font-display text-[.68rem] tracking-[.18em] uppercase
                     transition-all duration-300"
          style={{ padding: "7px 16px", borderRadius: 100,
                   border: "1px solid rgba(201,168,76,.25)", background: "transparent",
                   color: "rgba(255,255,255,.45)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,.12)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,.65)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,.92)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,.25)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,.45)";
          }}>
          ← Accueil
        </button>
        <video autoPlay loop muted playsInline className="pointer-events-none"
          style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                   width:"100%", height:"100%", objectFit:"cover", opacity:0.22,
                   mixBlendMode:"screen", zIndex:0 }}>
          <source src="/videos/courone.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0" style={{ zIndex:0,
          background:[
            "radial-gradient(ellipse 78% 78% at 50% 50%,transparent 38%,#0F0205 86%)",
            "linear-gradient(to bottom,#0F0205 0%,transparent 16%,transparent 84%,#0F0205 100%)",
            "linear-gradient(to right,#0F0205 0%,transparent 13%,transparent 87%,#0F0205 100%)",
          ].join(",") }} />
      </div>

      {/* ── Formulaire ────────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 py-14 md:px-12 bg-ivory">
        {/* Retour accueil — mobile uniquement */}
        <button onClick={() => router.push("/")}
          className="md:hidden self-start mb-6 font-display text-[.68rem] tracking-[.18em] uppercase
                     transition-all duration-300"
          style={{ padding: "7px 16px", borderRadius: 100,
                   border: "1px solid rgba(44,26,14,.18)", background: "transparent",
                   color: "rgba(44,26,14,.45)" }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(201,168,76,.10)"; b.style.borderColor = "rgba(201,168,76,.5)"; b.style.color = "#1A1008"; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.borderColor = "rgba(44,26,14,.18)"; b.style.color = "rgba(44,26,14,.45)"; }}>
          ← Accueil
        </button>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <p className="font-display text-[.62rem] tracking-[.35em] uppercase text-gold mb-6">
            Reprendre mon parcours
          </p>
          <h2 className="font-serif text-[2.3rem] font-normal text-td leading-[1.2] mb-2">
            Ton royaume<br /><em className="text-forest italic">t'attendait !</em>
          </h2>
          <p className="text-sm text-tl leading-relaxed mb-8">
            Je suis heureuse de te revoir ma Reine
          </p>

          <label className="font-display text-[.62rem] tracking-[.2em] uppercase text-tm mb-2 block">
            Adresse e-mail
          </label>
          <input
            type="email" autoFocus value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("login-pwd")?.focus()}
            placeholder="ton@email.com"
            className="w-full px-4 py-3.5 border border-black/10 rounded-lg bg-white font-sans text-[1rem]
                       text-td outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,.11)] mb-4"
          />

          <label className="font-display text-[.62rem] tracking-[.2em] uppercase text-tm mb-2 block">
            Mot de passe
          </label>
          <input
            id="login-pwd" type="password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Ton mot de passe"
            className="w-full px-4 py-3.5 border border-black/10 rounded-lg bg-white font-sans text-[1rem]
                       text-td outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,.11)] mb-1"
          />

          {error && <p className="text-danger text-sm mt-3 mb-1">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 font-display text-[.76rem] tracking-[.2em] uppercase
                       bg-gradient-to-br from-gold to-gold-l text-dark
                       py-4 rounded-full transition-all
                       shadow-[0_4px_24px_rgba(201,168,76,.3)]
                       hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,.45)]
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion en cours…" : "Accéder à mon royaume →"}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-black/8" />
            <span className="text-[.72rem] text-tl">ou</span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          <button
            onClick={() => router.push("/onboarding")}
            className="w-full text-sm text-center text-tl hover:text-td transition-colors font-sans"
          >
            Pas encore de compte ? <span className="text-gold font-medium">Commencer mon parcours →</span>
          </button>

        </motion.div>
      </div>
    </div>
  );
}
