"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { isChapAvailable } from "@/lib/utils";
import { CHAP_MAP } from "@/lib/data/chapters";

export function ContinueBanner() {
  const { currentChap, slideIndex, chapsDone, startDate, adminMode } = useAppStore();
  const router = useRouter();

  const isStarted =
    slideIndex > 0 &&
    !chapsDone.includes(currentChap) &&
    isChapAvailable(currentChap, startDate, chapsDone, adminMode);

  if (!isStarted) return null;

  const c = CHAP_MAP[currentChap];
  if (!c) return null;

  return (
    <div
      onClick={() => router.push(`/chapter/${currentChap}`)}
      className="flex items-center justify-between rounded-[14px] px-5 py-4 mb-3 cursor-pointer
                 transition-all hover:-translate-y-0.5"
      style={{ background: "linear-gradient(135deg,#4A0F1A,#7A1828)" }}
    >
      <div>
        <p className="font-display text-[.58rem] tracking-[.2em] uppercase text-gold-p mb-1">
          Reprendre
        </p>
        <p className="font-serif text-white text-[1.05rem]">
          Chapitre {c.num} · {c.title}
        </p>
      </div>
      <span className="text-[1.3rem] text-gold-l">→</span>
    </div>
  );
}
