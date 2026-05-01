"use client";

import { motion } from "framer-motion";

interface StoryProgressProps {
  total: number;
  current: number;
}

export function StoryProgress({ total, current }: StoryProgressProps) {
  return (
    <div className="flex gap-1 px-3 pt-2.5 pb-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
          {i < current && (
            <div className="h-full w-full bg-white" />
          )}
          {i === current && (
            <motion.div
              className="h-full bg-white origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 30, ease: "linear" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
