"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { checkIsAdmin, fetchNotifCounts } from "@/lib/supabase/admin";

type Counts = { questions: number; moderation: number; users: number };

const LS_MODERATION = "admin_seen_moderation";
const LS_USERS      = "admin_seen_users";

const NAV = [
  { href: "/admin",           icon: "📊", label: "Vue globale",    badge: null          },
  { href: "/admin/users",     icon: "👥", label: "Utilisateurs",   badge: "users"       },
  { href: "/admin/community", icon: "💬", label: "Modération",     badge: "moderation"  },
  { href: "/admin/questions", icon: "📬", label: "Messages",       badge: "questions"   },
  { href: "/admin/daily",     icon: "🎙", label: "Message du jour",badge: null          },
] as const;

function Badge({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full text-[.6rem] font-bold
                     flex items-center justify-center bg-gold text-dark">
      {n > 99 ? "99+" : n}
    </span>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [auth,   setAuth]   = useState<"loading" | "ok" | "denied">("loading");
  const [counts, setCounts] = useState<Counts>({ questions: 0, moderation: 0, users: 0 });

  // Lit localStorage directement pour éviter la race condition
  const refreshCounts = useCallback(async () => {
    const modSince   = localStorage.getItem(LS_MODERATION) ?? "";
    const usersSince = localStorage.getItem(LS_USERS)      ?? "";
    const c = await fetchNotifCounts({
      moderationSince: modSince   || undefined,
      usersSince:      usersSince || undefined,
    });
    setCounts(c);
  }, []);

  // Init : auth uniquement (refreshCounts lit localStorage directement)
  useEffect(() => {
    checkIsAdmin().then((ok) => {
      if (!ok) { setAuth("denied"); router.replace("/dashboard"); return; }
      setAuth("ok");
    });
  }, [router]);

  // Rafraîchit toutes les 30s
  useEffect(() => {
    if (auth !== "ok") return;
    const id = setInterval(refreshCounts, 30_000);
    return () => clearInterval(id);
  }, [auth, refreshCounts]);

  // Quand l'admin visite une section → marque comme "vu" → badge disparaît
  useEffect(() => {
    if (auth !== "ok") return;
    const now = new Date().toISOString();

    if (pathname === "/admin/community") {
      localStorage.setItem(LS_MODERATION, now);
      setCounts((prev) => ({ ...prev, moderation: 0 }));
    }
    if (pathname === "/admin/users") {
      localStorage.setItem(LS_USERS, now);
      setCounts((prev) => ({ ...prev, users: 0 }));
    }
  }, [pathname, auth]);

  if (auth === "loading") return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-gold/60 font-display text-[.7rem] tracking-[.3em] uppercase animate-pulse">
        Vérification des accès…
      </div>
    </div>
  );
  if (auth === "denied") return null;

  return (
    <div className="min-h-screen flex bg-[#0F1A14]">
      <aside className="w-56 flex-shrink-0 border-r border-white/6 flex flex-col"
             style={{ background: "linear-gradient(180deg,#0D1F15,#0A1810)" }}>
        <div className="px-5 py-5 border-b border-white/6">
          <p className="font-display text-[.6rem] tracking-[.3em] uppercase text-gold/70 mb-0.5">
            Admin Panel
          </p>
          <p className="font-serif text-ivory text-[1.1rem] font-light">Maman Lili</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map(({ href, icon, label, badge }) => {
            const active     = pathname === href;
            const badgeCount = badge ? counts[badge] : 0;
            return (
              <Link key={href} href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[.85rem]
                                font-sans transition-all
                                ${active
                                  ? "bg-gold/15 text-gold"
                                  : "text-ivory/50 hover:bg-white/5 hover:text-ivory/80"}`}>
                <span className="text-lg">{icon}</span>
                <span className="flex-1">{label}</span>
                {badgeCount > 0 && <Badge n={badgeCount} />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/6">
          <Link href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-[.78rem] text-ivory/35
                           hover:text-ivory/60 transition-colors font-sans rounded-lg hover:bg-white/4">
            ← Retour à l'app
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
