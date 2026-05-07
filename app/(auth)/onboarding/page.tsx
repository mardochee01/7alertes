"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import { saveProfile } from "@/lib/supabase/profile";
import { today } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STEPS = [
  { label: "Étape 1 · Ton identité royale" },
  { label: "Étape 2 · Ton roi"             },
  { label: "Étape 3 · Nom de ton royaume"  },
  { label: "Étape 4 · Ton compte royal"    },
];

export default function OnboardingPage() {
  const router = useRouter();
  const store  = useAppStore();
  const { setQName, setKName, setKingdomName, setStartDate, updateStreak } = store;

  const [step,          setStep]         = useState(0);
  const [qInput,        setQInput]       = useState("");
  const [kInput,        setKInput]       = useState("");
  const [kingdomInput,  setKingdomInput] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // ── Étape 0 → 1 ─────────────────────────────────────────────
  function handleStep0() {
    if (!qInput.trim()) { setError("Entre ton prénom pour continuer"); return; }
    setError(""); setStep(1);
  }

  // ── Étape 1 → 2 ─────────────────────────────────────────────
  function handleStep1() {
    setError(""); setStep(2);
  }

  // ── Étape 2 → 3 ─────────────────────────────────────────────
  function handleStep2() {
    setError(""); setStep(3);
  }

  // ── Étape 3 : création du compte Supabase ───────────────────
  async function handleDone() {
    if (!email.trim())       { setError("Ton adresse e-mail est requise");               return; }
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères"); return; }
    setError(""); setLoading(true);

    const sb = createClient();
    const { data, error: authErr } = await sb.auth.signUp({ email, password });

    if (authErr) {
      const msg = authErr.message ?? "";
      setError(
        msg.includes("already registered") || msg.includes("already been registered")
          ? "Ce compte existe déjà — clique sur Reprendre mon parcours."
        : msg.includes("email_address_invalid") || msg.includes("Email address") || msg.includes("invalid")
          ? "Adresse e-mail non acceptée. Vérifie l'orthographe ou utilise une autre adresse."
        : msg
      );
      setLoading(false); return;
    }

    const userId  = data.user?.id;
    const startD  = today();
    const hasSession = !!data.session; // false si email confirmation requise

    const kn = kingdomInput.trim() || "Le Royaume";

    // Hydrate Zustand (fonctionne même sans session Supabase)
    setQName(qInput.trim());
    setKName(kInput.trim() || "mon roi");
    setKingdomName(kn);
    setStartDate(startD);
    updateStreak();

    // Sauvegarde en DB seulement si session active (email confirmation OFF)
    if (userId && hasSession) {
      try {
        await saveProfile(userId, {
          ...useAppStore.getState(),
          qName:       qInput.trim(),
          kName:       kInput.trim() || "mon roi",
          kingdomName: kn,
          startDate:   startD,
        });
      } catch (e) {
        console.error("saveProfile error:", e);
      }
    }

    if (!hasSession) {
      setStep(4); // écran confirmation email
      setLoading(false); return;
    }

    router.push("/dashboard");
  }

  const handleKey = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fn();
  };

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
        <div className="relative z-10 text-center">
          <h2 className="font-serif font-light text-ivory text-[2.5rem] leading-[1.2]">
            {step === 0 ? <>Chaque reine<br />porte un nom</>
           : step === 1 ? <>Désigne<br />ton roi</>
           : step === 2 ? <>Nomme<br />ton royaume</>
           : <>{kingdomInput.trim() || "Ton royaume"}<br />t'attend</>}
          </h2>
          <p className="font-serif italic text-ivory/50 mt-3 leading-relaxed">
            {step === 0 ? "Ton parcours sera entièrement personnalisé"
           : step === 1 ? "Son prénom rendra chaque scénario unique"
           : step === 2 ? "Un nom qui vous appartient, rien qu'à vous deux"
           : "Sauvegarde ta progression sur tous tes appareils"}
          </p>
        </div>
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
        {/* Dots */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="w-[7px] h-[7px] rounded-full transition-colors duration-300"
                 style={{ background: i < step ? "#4A0F1A" : i === step ? "#C9A84C" : "rgba(44,26,14,.11)" }} />
          ))}
        </div>

        <div style={{ overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          {/* ── Step 0 : prénom reine ── */}
          {step === 0 && (
            <motion.div key="s0"
              initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -56 }}
              transition={{ duration: 0.35, ease: EASE }}>
              <p className="font-display text-[.62rem] tracking-[.35em] uppercase text-gold mb-6">{STEPS[0].label}</p>
              <h2 className="font-serif text-[2.3rem] font-normal text-td leading-[1.2] mb-3">
                Chère Reine, quel est<br /><em className="text-forest italic">ton prénom ?</em>
              </h2>
              <label className="font-display text-[.62rem] tracking-[.2em] uppercase text-tm mb-2 block">Ton prénom</label>
              <input autoFocus value={qInput}
                onChange={(e) => { setQInput(e.target.value); setError(""); }}
                onKeyDown={handleKey(handleStep0)}
                placeholder="Sarah, Nadia, Grace…"
                className="w-full px-4 py-3.5 border border-black/10 rounded-lg bg-white font-serif text-[1.2rem]
                           text-td outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,.11)] mb-1" />
              {error && <p className="text-danger text-sm mb-3">{error}</p>}
              <button onClick={handleStep0} className={btnPrimary}>Continuer →</button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-black/8" />
                <span className="text-[.72rem] text-tl">ou</span>
                <div className="flex-1 h-px bg-black/8" />
              </div>

              <button onClick={() => router.push("/login")}
                className="w-full text-sm text-center text-tl hover:text-td transition-colors font-sans">
                Déjà un compte ?{" "}
                <span className="text-gold font-medium">Reprendre mon parcours →</span>
              </button>
            </motion.div>
          )}

          {/* ── Step 1 : prénom roi ── */}
          {step === 1 && (
            <motion.div key="s1"
              initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -56 }}
              transition={{ duration: 0.35, ease: EASE }}>
              <p className="font-display text-[.62rem] tracking-[.35em] uppercase text-gold mb-6">{STEPS[1].label}</p>
              <h2 className="font-serif text-[2.3rem] font-normal text-td leading-[1.2] mb-3">
                Et ton <em className="text-forest italic">Roi</em>,<br />comment s'appelle-t-il ?
              </h2>
              <p className="text-sm text-tl leading-relaxed mb-8">Son prénom rendra chaque scénario unique.</p>
              <label className="font-display text-[.62rem] tracking-[.2em] uppercase text-tm mb-2 block">Prénom de ton roi</label>
              <input autoFocus value={kInput}
                onChange={(e) => setKInput(e.target.value)}
                onKeyDown={handleKey(handleStep1)}
                placeholder="David, Samuel, Élie…"
                className="w-full px-4 py-3.5 border border-black/10 rounded-lg bg-white font-serif text-[1.2rem]
                           text-td outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,.11)] mb-1" />
              <button onClick={handleStep1} className={btnPrimary}>Continuer →</button>
              <button onClick={() => setStep(0)} className={btnBack}>← Retour</button>
            </motion.div>
          )}

          {/* ── Step 2 : nom du royaume ── */}
          {step === 2 && (
            <motion.div key="s2"
              initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -56 }}
              transition={{ duration: 0.35, ease: EASE }}>
              <p className="font-display text-[.62rem] tracking-[.35em] uppercase text-gold mb-6">{STEPS[2].label}</p>
              <h2 className="font-serif text-[2.3rem] font-normal text-td leading-[1.2] mb-3">
                Comment s'appelle<br /><em className="text-forest italic">ton royaume ?</em>
              </h2>
              <p className="text-sm text-tl leading-relaxed mb-8">
                Ce nom apparaîtra dans toute l'application à la place de "Le Royaume".
              </p>
              <label className="font-display text-[.62rem] tracking-[.2em] uppercase text-tm mb-2 block">
                Nom de ton royaume
              </label>
              <input autoFocus value={kingdomInput}
                onChange={(e) => setKingdomInput(e.target.value)}
                onKeyDown={handleKey(handleStep2)}
                placeholder="Le Palais d'Or, Notre Eden…"
                className="w-full px-4 py-3.5 border border-black/10 rounded-lg bg-white font-serif text-[1.2rem]
                           text-td outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,.11)] mb-1" />
              <p className="text-[.76rem] text-tl mb-5">Laisse vide pour garder "Le Royaume"</p>
              <button onClick={handleStep2} className={btnPrimary}>Continuer →</button>
              <button onClick={() => setStep(1)} className={btnBack}>← Retour</button>
            </motion.div>
          )}

          {/* ── Step 3 : compte email/mdp ── */}
          {step === 3 && (
            <motion.div key="s3"
              initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -56 }}
              transition={{ duration: 0.35, ease: EASE }}>
              <p className="font-display text-[.62rem] tracking-[.35em] uppercase text-gold mb-6">{STEPS[3].label}</p>
              <h2 className="font-serif text-[2.3rem] font-normal text-td leading-[1.2] mb-2">
                Crée ton <em className="text-forest italic">compte</em>
              </h2>
              <p className="text-sm text-tl leading-relaxed mb-8">
                Pour sauvegarder ta progression et la retrouver sur n'importe quel appareil.
              </p>
              <label className="font-display text-[.62rem] tracking-[.2em] uppercase text-tm mb-2 block">
                Adresse e-mail
              </label>
              <input type="email" autoFocus value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={handleKey(() => document.getElementById("pwd-input")?.focus())}
                placeholder="ton@email.com"
                className="w-full px-4 py-3.5 border border-black/10 rounded-lg bg-white font-sans text-[1rem]
                           text-td outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,.11)] mb-4" />
              <label className="font-display text-[.62rem] tracking-[.2em] uppercase text-tm mb-2 block">
                Mot de passe
              </label>
              <input id="pwd-input" type="password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKey(handleDone)}
                placeholder="6 caractères minimum"
                className="w-full px-4 py-3.5 border border-black/10 rounded-lg bg-white font-sans text-[1rem]
                           text-td outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,.11)] mb-1" />
              <p className="text-[.76rem] text-tl mb-5">Ta progression sera synchronisée automatiquement</p>
              {error && (
                <>
                  <p className="text-danger text-sm mb-3">{error}</p>
                  {error.includes("Ce compte existe déjà") && (
                    <button onClick={() => router.push("/login")} className={btnPrimary} style={{ marginBottom: 12 }}>
                      Reprendre mon parcours →
                    </button>
                  )}
                </>
              )}
              <button onClick={handleDone} disabled={loading} className={btnPrimary}>
                {loading ? "Création du compte…" : "Accéder à mon royaume →"}
              </button>
              <button onClick={() => setStep(2)} className={btnBack}>← Retour</button>
            </motion.div>
          )}
          {/* ── Step 4 : confirmation email ── */}
          {step === 4 && (
            <motion.div key="s3"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-center"
            >
              <div className="text-[3rem] mb-4">📬</div>
              <h2 className="font-serif text-[2rem] font-normal text-td leading-[1.2] mb-3">
                Vérifie ta<br /><em className="text-forest italic">messagerie</em>
              </h2>
              <p className="text-sm text-tl leading-relaxed mb-6">
                Un lien de confirmation a été envoyé à<br />
                <strong className="text-td">{email}</strong>.<br /><br />
                Clique sur le lien pour activer ton compte, puis reviens te connecter.
              </p>
              <button
                onClick={() => router.push("/login")}
                className={btnPrimary}
              >
                Aller à la connexion →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const btnPrimary =
  "w-full font-display text-[.76rem] tracking-[.2em] uppercase bg-gradient-to-br from-gold to-gold-l " +
  "text-dark py-4 rounded-full transition-all shadow-[0_4px_24px_rgba(201,168,76,.3)] " +
  "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,.45)] disabled:opacity-60 disabled:cursor-not-allowed";

const btnBack =
  "w-full mt-3 text-sm text-tl hover:text-td transition-colors text-center block";
