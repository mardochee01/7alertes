"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadProfile } from "@/lib/supabase/profile";
import { useAppStore } from "@/store/useAppStore";
import { QueenAvatar } from "@/components/ui/QueenAvatar";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function LoginPage() {
  const router  = useRouter();
  const store   = useAppStore();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleLogin() {
    if (!email.trim() || !password)  { setError("Remplis tous les champs"); return; }
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
      // Hydrate Zustand avec les données du serveur
      store.setQName(profile.qName           ?? "");
      store.setKName(profile.kName           ?? "mon roi");
      store.setKingdomName(profile.kingdomName ?? "Le Royaume");
      store.setProfilePhoto(profile.profilePhoto ?? "");
      store.setStartDate(profile.startDate    ?? "");
      if (profile.chapsDone?.length) {
        profile.chapsDone.forEach((n) => store.completeChap(n));
      }
      // XP, HP et streak depuis le profil DB
      useAppStore.setState({
        crownHP: profile.crownHP   ?? 7,
        xp:      profile.xp        ?? 0,
        streak:  profile.streak    ?? 1,
      });
      store.updateStreak();
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-ivory grid md:grid-cols-2">
      {/* ── Côté visuel ───────────────────────────────────────── */}
      <div className="hidden md:flex relative flex-col items-center justify-center p-12 overflow-hidden"
           style={{ background: "linear-gradient(160deg,#1A3A2A,#0D1F15)" }}>
        <div className="absolute inset-0"
             style={{ background: "radial-gradient(ellipse 100% 100% at 50% 110%,rgba(201,168,76,.18),transparent 60%)" }} />
        <div className="relative z-10 text-center max-w-xs">
          {/* Avatar couronne */}
          <div className="mx-auto mb-5 drop-shadow-[0_0_30px_rgba(201,168,76,.5)]">
            <QueenAvatar size={100} />
          </div>
          <h2 className="font-serif font-light text-ivory text-[2rem] leading-[1.2] mb-4">
            Bienvenue dans<br /><em className="italic text-gold-l">ton Royaume</em>
          </h2>
          {/* Message d'accueil */}
          <div className="bg-white/5 border border-gold/20 rounded-2xl p-4 text-left">
            <p className="font-serif italic text-ivory/85 text-[.95rem] leading-[1.7]">
              Bienvenue dans le parcours de ton royaume. Protège ta couronne jusqu'au bout.
            </p>
            <div className="w-8 h-px my-3" style={{ background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />
            <p className="font-serif italic text-ivory/60 text-[.88rem] leading-[1.6]">
              Si tu réponds incorrectement, un eunuque apparaîtra pour éteindre une des lumières de ta couronne.
            </p>
          </div>
        </div>
      </div>

      {/* ── Formulaire ────────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 py-14 md:px-12 bg-ivory">
        {/* Message d'accueil mobile (caché sur desktop) */}
        <div className="md:hidden mb-8 flex flex-col items-center text-center">
          <div className="mb-4 drop-shadow-[0_0_20px_rgba(201,168,76,.4)]">
            <QueenAvatar size={84} />
          </div>
          <p className="font-serif italic text-[.9rem] text-tl leading-[1.65] max-w-xs">
            Bienvenue dans le parcours de ton royaume. Protège ta couronne jusqu'au bout. Si tu réponds incorrectement, un eunuque apparaîtra pour éteindre une des lumières de ta couronne.
          </p>
          <div className="w-12 h-px mt-4" style={{ background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <p className="font-display text-[.62rem] tracking-[.35em] uppercase text-gold mb-6">
            Reprendre mon parcours
          </p>
          <h2 className="font-serif text-[2.3rem] font-normal text-td leading-[1.2] mb-2">
            Bienvenue<br /><em className="text-forest italic">de retour, Reine</em>
          </h2>
          <p className="text-sm text-tl leading-relaxed mb-8">
            Ta progression t'attend là où tu l'as laissée.
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

          <button
            onClick={() => router.push("/")}
            className="w-full mt-3 text-sm text-tl hover:text-td transition-colors text-center block"
          >
            ← Retour à l'accueil
          </button>
        </motion.div>
      </div>
    </div>
  );
}
