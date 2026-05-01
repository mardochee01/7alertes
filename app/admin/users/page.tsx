"use client";

import { useEffect, useState } from "react";
import { fetchUsers, toggleUserDisabled, toggleUserAdmin } from "@/lib/supabase/admin";

interface User {
  id: string;
  queen_name: string;
  king_name: string;
  kingdom_name: string;
  xp: number;
  crown_hp: number;
  streak: number;
  start_date: string | null;
  last_active: string | null;
  created_at: string;
  is_disabled: boolean;
  is_admin: boolean;
  chapsDone: number[];
}

function HPDots({ hp }: { hp: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full"
             style={{ background: i < hp ? "#C9A84C" : "rgba(255,255,255,.12)" }} />
      ))}
    </div>
  );
}

function ChapBadges({ done }: { done: number[] }) {
  return (
    <div className="flex gap-0.5 flex-wrap">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i}
             className={`w-5 h-5 rounded text-[.58rem] font-display flex items-center justify-center
                         ${done.includes(i+1) ? "bg-forest/70 text-ivory" : "bg-white/8 text-ivory/25"}`}>
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export default function AdminUsers() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers().then((u) => { setUsers(u as User[]); setLoading(false); });
  }, []);

  async function handleDisable(id: string, disabled: boolean) {
    await toggleUserDisabled(id, !disabled);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_disabled: !disabled } : u));
  }

  async function handleAdmin(id: string, isAdmin: boolean) {
    if (!confirm(isAdmin ? "Révoquer les droits admin ?" : "Donner les droits admin ?")) return;
    await toggleUserAdmin(id, !isAdmin);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_admin: !isAdmin } : u));
  }

  const filtered = users.filter((u) =>
    u.queen_name.toLowerCase().includes(search.toLowerCase()) ||
    u.kingdom_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.king_name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = users.filter((u) => !u.is_disabled).length;
  const disabledCount = users.filter((u) => u.is_disabled).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif font-light text-ivory text-[2rem]">Utilisateurs</h1>
          <p className="text-ivory/40 text-sm mt-1">
            <span className="text-gold/70">{activeCount} actif{activeCount > 1 ? "s" : ""}</span>
            {disabledCount > 0 && (
              <span className="text-danger/60 ml-2">· {disabledCount} désactivé{disabledCount > 1 ? "s" : ""}</span>
            )}
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher reine, roi, royaume…"
          className="px-4 py-2 rounded-xl bg-white/6 border border-white/10 text-ivory/80
                     text-sm font-sans outline-none focus:border-gold/40 w-64 placeholder:text-ivory/25"
        />
      </div>

      {loading ? (
        <div className="text-ivory/30 text-sm animate-pulse">Chargement des utilisateurs…</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="bg-white/4 border border-white/8 rounded-2xl px-5 py-8 text-center text-ivory/30 text-sm">
              Aucun résultat
            </div>
          )}

          {filtered.map((u) => (
            <div key={u.id}
                 className={`bg-white/4 border rounded-2xl overflow-hidden transition-all
                             ${u.is_disabled ? "border-danger/15 opacity-60" : "border-white/8"}`}>
              {/* Row principal */}
              <div className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                   onClick={() => setExpanded(expanded === u.id ? null : u.id)}>

                {/* Identité */}
                <div className="flex-1 min-w-[160px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-ivory text-[.95rem]">{u.queen_name}</span>
                    {u.is_admin && (
                      <span className="text-[.55rem] px-1.5 py-0.5 rounded bg-danger/20 text-danger/80 font-display tracking-wider">
                        ADMIN
                      </span>
                    )}
                    {u.is_disabled && (
                      <span className="text-[.55rem] px-1.5 py-0.5 rounded bg-danger/20 text-danger/70 font-display">
                        DÉSACTIVÉ
                      </span>
                    )}
                  </div>
                  <p className="text-[.7rem] text-gold/50 mt-0.5">{u.kingdom_name}</p>
                  <p className="text-[.65rem] text-ivory/25 italic">& {u.king_name}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-[.78rem] text-ivory/50">
                  <div className="text-center">
                    <p className="text-gold/70 text-[.9rem] font-serif">{u.xp}</p>
                    <p className="text-[.6rem] text-ivory/30 uppercase tracking-wider">XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-ivory/70 text-[.9rem] font-serif">{u.chapsDone.length}/7</p>
                    <p className="text-[.6rem] text-ivory/30 uppercase tracking-wider">Chapitres</p>
                  </div>
                  <div className="text-center">
                    <p className="text-ivory/70 text-[.9rem] font-serif">🔥 {u.streak}</p>
                    <p className="text-[.6rem] text-ivory/30 uppercase tracking-wider">Streak</p>
                  </div>
                </div>

                {/* Couronne */}
                <HPDots hp={u.crown_hp} />

                {/* Chevron */}
                <span className="text-ivory/30 text-sm ml-auto">
                  {expanded === u.id ? "▲" : "▼"}
                </span>
              </div>

              {/* Détail expandé */}
              {expanded === u.id && (
                <div className="border-t border-white/6 px-5 py-4 bg-black/10 flex flex-wrap gap-6">

                  {/* Chapitres complétés */}
                  <div>
                    <p className="font-display text-[.55rem] tracking-[.2em] uppercase text-ivory/30 mb-2">
                      Progression
                    </p>
                    <ChapBadges done={u.chapsDone} />
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="font-display text-[.55rem] tracking-[.2em] uppercase text-ivory/30 mb-2">
                      Activité
                    </p>
                    <p className="text-[.75rem] text-ivory/50">
                      Inscrit le {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}
                    </p>
                    <p className="text-[.75rem] text-ivory/40 mt-0.5">
                      Dernière activité : {u.last_active
                        ? new Date(u.last_active).toLocaleDateString("fr-FR") : "—"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="ml-auto flex flex-col gap-2">
                    <button
                      onClick={() => handleDisable(u.id, u.is_disabled)}
                      className={`text-[.72rem] px-4 py-2 rounded-xl border font-sans transition-all
                                  ${u.is_disabled
                                    ? "border-forest/30 text-[#7ECFA0] hover:bg-forest/15"
                                    : "border-orange-500/30 text-orange-400/80 hover:bg-orange-500/10"}`}
                    >
                      {u.is_disabled ? "✓ Réactiver le compte" : "⚠ Désactiver le compte"}
                    </button>
                    <button
                      onClick={() => handleAdmin(u.id, u.is_admin)}
                      className={`text-[.72rem] px-4 py-2 rounded-xl border font-sans transition-all
                                  ${u.is_admin
                                    ? "border-danger/30 text-danger/70 hover:bg-danger/10"
                                    : "border-white/15 text-ivory/40 hover:border-gold/30 hover:text-gold/60"}`}
                    >
                      {u.is_admin ? "Révoquer admin" : "Donner accès admin"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
