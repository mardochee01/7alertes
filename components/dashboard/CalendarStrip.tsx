"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { SCHEDULE } from "@/lib/data/schedule";
import { daysSince, getSchedDate, isChapAvailable } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

export function CalendarStrip() {
  const { startDate, chapsDone, adminMode } = useAppStore();
  const router = useRouter();
  const todayRef = useRef<HTMLDivElement>(null);
  const d = daysSince(startDate);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  return (
    <div className="px-5 pt-4 pb-2">
      <p className="font-display text-[.58rem] tracking-[.22em] uppercase text-tl mb-3 text-center">
        Calendrier du challenge
      </p>
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none justify-center"
           style={{ WebkitOverflowScrolling: "touch" }}>
        {SCHEDULE.map((sch) => {
          const isDone = sch.type === "chapter" && chapsDone.includes(sch.chap!);
          const isToday = sch.day === d;
          const avail = sch.type === "chapter"
            ? isChapAvailable(sch.chap!, startDate, chapsDone, adminMode)
            : false;

          let bg = "transparent";
          let border = "transparent";
          let opacity = 1;
          let textColor = "#8C7A60";

          if (isToday) { bg = "rgba(201,168,76,.15)"; border = "#C9A84C"; textColor = "#C9A84C"; }
          else if (isDone) { bg = "rgba(45,90,61,.1)"; border = "rgba(45,90,61,.2)"; textColor = "#2D5A3D"; }
          else if (!avail && sch.type === "chapter" && sch.day > d) opacity = 0.38;

          function handleClick() {
            if (sch.type !== "chapter") return;
            if (!isChapAvailable(sch.chap!, startDate, chapsDone, adminMode)) {
              toast("Ce chapitre n'est pas encore disponible");
              return;
            }
            router.push(`/chapter/${sch.chap}`);
          }

          return (
            <div
              key={sch.day}
              ref={isToday ? todayRef : undefined}
              onClick={sch.type === "chapter" ? handleClick : undefined}
              style={{ opacity, background: bg, borderColor: border, color: textColor }}
              className="flex-shrink-0 w-[54px] text-center px-1 py-2 rounded-xl border transition-all
                         cursor-default hover:enabled:-translate-y-0.5"
            >
              <div className="font-display text-[.56rem] tracking-[.1em] uppercase mb-0.5">
                {sch.label}
              </div>
              <div className="text-[.65rem] font-semibold font-serif mb-0.5">
                {getSchedDate(sch.day, startDate)}
              </div>
              <div className="text-[.95rem]">{isDone ? "✓" : sch.icon}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
