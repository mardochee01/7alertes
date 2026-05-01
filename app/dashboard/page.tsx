"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import { saveProfile } from "@/lib/supabase/profile";
import { CrownHeader } from "@/components/dashboard/CrownHeader";
import { CalendarStrip } from "@/components/dashboard/CalendarStrip";
import { ChapterList } from "@/components/dashboard/ChapterList";
import { ContinueBanner } from "@/components/dashboard/ContinueBanner";
import { DailyMessage } from "@/components/dashboard/DailyMessage";

export default function DashboardPage() {
  const store   = useAppStore();
  const { qName, _hydrated, updateStreak } = store;
  const router  = useRouter();
  const synced  = useRef(false);

  useEffect(() => {
    if (!_hydrated) return;
    if (!qName) { router.replace("/onboarding"); return; }
    updateStreak();
  }, [_hydrated, qName, router, updateStreak]);

  useEffect(() => {
    if (!_hydrated || !qName || synced.current) return;
    synced.current = true;

    async function syncWithSupabase() {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;

      const { data: profile } = await sb
        .from("profiles").select("is_disabled").eq("id", user.id).single();

      if (profile?.is_disabled) {
        await sb.auth.signOut();
        store.reset();
        window.location.replace("/?disabled=1");
        return;
      }

      await saveProfile(user.id, useAppStore.getState());
    }

    syncWithSupabase();
  }, [_hydrated, qName, store]);

  if (!_hydrated || !qName) return null;

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <CrownHeader />

      <div className="px-3 -mt-6 relative z-10">
        <ContinueBanner />

        {/* Message du jour admin — remplace l'ancienne QuoteCard */}
        <DailyMessage />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 bg-white rounded-[14px] shadow-[0_2px_18px_rgba(13,31,21,.07)] overflow-hidden"
        >
          <CalendarStrip />
          <div className="border-t border-black/5">
            <ChapterList />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-3 bg-white rounded-[14px] shadow-[0_2px_18px_rgba(13,31,21,.07)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
            <span className="font-display text-[.6rem] tracking-[.22em] uppercase text-tl">
              L'espace des Reines
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="font-serif text-[1rem] text-tm leading-relaxed mb-4">
              Rejoins la communauté, partage tes victoires et encourage les autres reines dans leur parcours.
            </p>
            <button
              onClick={() => router.push("/community")}
              className="text-[.73rem] text-gold-p border border-gold/30 px-5 py-2
                         rounded-full hover:border-gold hover:bg-gold/10 transition-all font-sans"
            >
              Rejoindre →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
