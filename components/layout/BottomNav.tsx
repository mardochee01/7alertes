"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard",    icon: "🏠", label: "Accueil"    },
  { href: "/community",    icon: "👥", label: "Communauté" },
  { href: "/maman-lili",   icon: "👑", label: "Maman Lili" },
  { href: "/spiritual",    icon: "🙏", label: "Spirituel"  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-black/[.06]
                    shadow-[0_-4px_18px_rgba(13,31,21,.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around px-2 py-1.5">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors
                         ${active ? "text-forest" : "text-tl hover:bg-cream"}`}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span className={`text-[.58rem] tracking-wide ${active ? "font-semibold" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
