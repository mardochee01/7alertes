"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import { CrownSvg } from "@/components/ui/CrownSvg";
import { xpPercent } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

// ── Dropdown rendu via Portal (échappe à tout overflow/z-index parent) ────────
function AvatarMenu({
  pos, qName, onPhoto, onLogout, onClose,
}: {
  pos: { top: number; right: number };
  qName: string;
  onPhoto: () => void;
  onLogout: () => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Léger délai pour ne pas capturer le mousedown qui a ouvert le menu
    const t = setTimeout(() => document.addEventListener("mousedown", handle), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handle); };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 99999 }}
      className="w-48 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,.22)] overflow-hidden
                 border border-black/6"
    >
      {/* Nom */}
      <div className="px-4 py-3 border-b border-black/6 bg-cream/60">
        <p className="font-serif text-[.98rem] font-medium text-td">{qName}</p>
        <p className="text-[.7rem] text-tl">Reine du Royaume</p>
      </div>

      {/* Changer photo */}
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onPhoto}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-[.85rem]
                   text-td hover:bg-cream active:bg-cream/70 transition-colors text-left font-sans"
      >
        <span className="text-lg">📷</span>
        <span>Changer la photo</span>
      </button>

      <div className="h-px bg-black/6 mx-3" />

      {/* Déconnexion */}
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-[.85rem]
                   text-danger hover:bg-red-50 active:bg-red-100 transition-colors text-left font-sans"
      >
        <span className="text-lg">🚪</span>
        <span>Se déconnecter</span>
      </button>
    </div>,
    document.body
  );
}

// ── CrownHeader ───────────────────────────────────────────────────────────────
export function CrownHeader() {
  const { qName, kingdomName, crownHP, xp, streak, profilePhoto, adminMode, toggleAdmin, reset } =
    useAppStore();
  const setProfilePhoto = useAppStore((s) => s.setProfilePhoto);

  const avatarRef = useRef<HTMLButtonElement>(null);
  const photoRef  = useRef<HTMLInputElement>(null);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [menuPos,   setMenuPos]   = useState({ top: 0, right: 0 });
  const [mounted,   setMounted]   = useState(false);
  const [isRealAdmin, setIsRealAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Vérifie si l'utilisateur est vraiment admin en DB
    async function checkAdmin() {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { data } = await sb.from("profiles").select("is_admin").eq("id", user.id).single();
      setIsRealAdmin(!!data?.is_admin);
    }
    checkAdmin();
  }, []);

  const xp_       = xpPercent(xp);
  const tilt      = crownHP <= 2;
  const crownLabel =
    crownHP <= 2 ? "Ta couronne est en danger ⚠" :
    crownHP <= 4 ? "Ta couronne vacille…" :
    "Ta couronne est stable";

  function openMenu() {
    if (avatarRef.current) {
      const r = avatarRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setMenuOpen(true);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePhoto(ev.target?.result as string);
      toast("Photo de profil mise à jour ✦");
    };
    reader.readAsDataURL(file);
  }

  async function handleLogout() {
    setMenuOpen(false);
    try {
      const sb = createClient();
      await sb.auth.signOut();
    } catch { /* session déjà expirée */ }
    reset();
    window.location.replace("/"); // full-page nav — décharge le dashboard avant tout useEffect
  }

  return (
    <div className="relative overflow-hidden pb-10"
         style={{ background: "linear-gradient(160deg,#0F0205,#250810)" }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 80% 100% at 85% 100%,rgba(201,168,76,.11),transparent 60%)" }} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 mb-6">
        {/* Logo + streak */}
        <div className="flex items-center gap-3">
          <span
            className="font-display text-[.66rem] tracking-[.25em] uppercase text-gold"
            onDoubleClick={isRealAdmin ? toggleAdmin : undefined}
            style={{ cursor: isRealAdmin ? "pointer" : "default" }}
          >
            {kingdomName || "Le Royaume"}
          </span>
          <div className="flex items-center gap-1 bg-gold/12 border border-gold/25 rounded-full px-2.5 py-0.5">
            <span>🔥</span>
            <span className="font-display text-[.65rem] text-gold-l font-semibold">{streak}</span>
          </div>
          {adminMode && (
            <a href="/admin"
               className="text-[.58rem] font-display tracking-[.2em] uppercase bg-danger
                          text-white px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity">
              ⚙ Admin
            </a>
          )}
        </div>

        {/* Avatar */}
        <button ref={avatarRef} onClick={openMenu} className="focus:outline-none group">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-base
                       font-semibold text-white overflow-hidden bg-gradient-to-br from-gold to-forest
                       bg-cover bg-center ring-2 ring-transparent group-hover:ring-gold/50 transition-all"
            style={profilePhoto ? { backgroundImage: `url(${profilePhoto})` } : undefined}
          >
            {!profilePhoto && qName.charAt(0).toUpperCase()}
          </div>
        </button>

        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      {/* Menu via Portal */}
      {mounted && menuOpen && (
        <AvatarMenu
          pos={menuPos}
          qName={qName}
          onPhoto={() => { setMenuOpen(false); photoRef.current?.click(); }}
          onLogout={handleLogout}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* Couronne + nom */}
      <div className="relative z-10 flex flex-col items-center text-center px-5">
        <motion.div animate={{ rotate: tilt ? -13 : 0 }} transition={{ duration: 0.5 }}>
          <CrownSvg id="dash" width={80}
            className={`drop-shadow-[0_0_16px_rgba(201,168,76,.58)]
                        ${tilt ? "drop-shadow-[0_0_16px_rgba(192,57,43,.5)]" : ""}`} />
        </motion.div>

        <p className="font-display text-[.6rem] tracking-[.3em] uppercase text-gold mt-2 mb-1">
          {crownLabel}
        </p>
        <p className="font-serif font-light text-ivory text-[1.85rem] leading-[1.1]">
          Bienvenue, <strong className="font-semibold">{qName || "Reine"}</strong>
        </p>

        {/* HP pips */}
        <div className="flex gap-1.5 mt-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-6 h-1.5 rounded-sm transition-colors duration-300"
                 style={{ background: i < crownHP ? "#C9A84C" : "#E8A090" }} />
          ))}
        </div>

        {/* XP bar */}
        <div className="mt-4 w-full max-w-[200px]">
          <p className="font-display text-[.58rem] tracking-[.25em] uppercase text-ivory/40 mb-1 text-center">
            Progression royale
          </p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#C9A84C,#E8C96A)" }}
              initial={{ width: 0 }}
              animate={{ width: `${xp_}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
