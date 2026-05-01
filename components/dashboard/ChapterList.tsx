"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { CHAPTERS } from "@/lib/data/chapters";
import { isChapAvailable, getChapDate, daysSince, chapDay } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

export function ChapterList() {
  const { startDate, chapsDone, adminMode } = useAppStore();
  const router = useRouter();
  const done = chapsDone.length;
  const d = daysSince(startDate);

  function tryOpen(num: number) {
    if (!isChapAvailable(num, startDate, chapsDone, adminMode)) {
      if (d < chapDay(num)) toast(`Ce chapitre sera disponible le ${getChapDate(num, startDate)}`);
      else toast("Termine le chapitre précédent pour débloquer celui-ci");
      return;
    }
    router.push(`/chapter/${num}`);
  }

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
        <span className="font-display text-[.6rem] tracking-[.22em] uppercase text-tl">
          Ton parcours · 7 alertes
        </span>
        <span className="text-[.76rem] text-gold font-semibold">{done}/7</span>
      </div>

      {/* Chapter rows */}
      <div className="flex flex-col gap-1 p-2">
        {CHAPTERS.map((c) => {
          const isDone = chapsDone.includes(c.num);
          const avail = isChapAvailable(c.num, startDate, chapsDone, adminMode);
          const isToday = d === chapDay(c.num);

          let rowClass =
            "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all border ";
          if (isDone)       rowClass += "border-forest/20 bg-forest/[.04] hover:bg-forest/[.08]";
          else if (avail)   rowClass += "border-gold bg-gold/[.06] hover:bg-gold/[.1]";
          else              rowClass += "border-transparent opacity-40 cursor-not-allowed";

          let numBg = "bg-blush text-tm";
          if (isDone) numBg = "bg-forest text-white";
          else if (avail) numBg = "bg-gold text-dark";

          return (
            <div key={c.num} className={rowClass} onClick={() => tryOpen(c.num)}>
              {/* Number bubble */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                              font-display text-[.72rem] font-semibold transition-all ${numBg}`}>
                {c.num}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-[.6rem] tracking-[.17em] uppercase text-tl mb-0.5">
                  {c.eunuque}
                </p>
                <p className="font-serif text-[1.02rem] font-medium text-td truncate">{c.title}</p>
              </div>

              {/* Date + badge */}
              <div className="text-right flex-shrink-0">
                <p className="text-[.6rem] text-tl mb-1">{getChapDate(c.num, startDate)}</p>
                {isDone ? (
                  <span className="text-[.6rem] px-2 py-0.5 rounded-full bg-forest/10 text-forest font-medium">
                    ✓ Complété
                  </span>
                ) : avail ? (
                  <span className="text-[.6rem] px-2 py-0.5 rounded-full bg-gold/13 text-gold font-medium">
                    {isToday ? "Aujourd'hui" : "Disponible"}
                  </span>
                ) : (
                  <span className="text-[.6rem] px-2 py-0.5 rounded-full bg-black/5 text-tl">
                    🔒
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
