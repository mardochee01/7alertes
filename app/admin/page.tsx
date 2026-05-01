"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/lib/supabase/admin";

interface Stats {
  totalUsers: number;
  totalPosts: number;
  pendingQuestions: number;
  chapCounts: Record<number, number>;
}

function StatCard({ icon, label, value, sub }: {
  icon: string; label: string; value: number | string; sub?: string;
}) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
      <div className="text-2xl mb-3">{icon}</div>
      <p className="font-display text-[.58rem] tracking-[.22em] uppercase text-gold/60 mb-1">{label}</p>
      <p className="font-serif text-ivory text-[2rem] font-light leading-none">{value}</p>
      {sub && <p className="text-[.72rem] text-ivory/35 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchAdminStats().then(setStats);
  }, []);

  const CHAPTERS = [1,2,3,4,5,6,7];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif font-light text-ivory text-[2rem]">Vue globale</h1>
        <p className="text-ivory/40 text-sm mt-1">Tableau de bord Maman Lili</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="👑" label="Reines inscrites"    value={stats?.totalUsers ?? "—"} />
        <StatCard icon="💬" label="Publications"        value={stats?.totalPosts ?? "—"} />
        <StatCard icon="📬" label="Questions en attente" value={stats?.pendingQuestions ?? "—"} sub="Non répondues" />
        <StatCard icon="✅" label="Chapitres complétés"
          value={Object.values(stats?.chapCounts ?? {}).reduce((a, b) => a + b, 0)} />
      </div>

      {/* Progression par chapitre */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
        <p className="font-display text-[.6rem] tracking-[.25em] uppercase text-gold/60 mb-5">
          Progression · Chapitres complétés
        </p>
        <div className="flex flex-col gap-3">
          {CHAPTERS.map((num) => {
            const count = stats?.chapCounts[num] ?? 0;
            const max   = stats?.totalUsers || 1;
            const pct   = Math.round((count / max) * 100);
            const labels = ["La Fidélité","Les Acquis","La Critique","L'Orgueil",
                            "La Perte du Bonheur","L'Intervention Divine","Le Point de Rupture"];
            return (
              <div key={num}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[.78rem] text-ivory/60 font-sans">
                    Ch. {num} · {labels[num-1]}
                  </span>
                  <span className="text-[.72rem] text-gold/70 font-display">
                    {count} · {pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width: `${pct}%`, background: "linear-gradient(90deg,#C9A84C,#E8C96A)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
