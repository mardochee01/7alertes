"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

let toastCallback: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  toastCallback?.(msg);
}

export function ToastProvider() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2800);
  }, []);

  useEffect(() => {
    toastCallback = show;
    return () => { toastCallback = null; };
  }, [show]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 14, x: "-50%" }}
          animate={{ opacity: 1, y: 0,  x: "-50%" }}
          exit={{   opacity: 0, y: 14,  x: "-50%" }}
          className="fixed bottom-20 left-1/2 z-[300] whitespace-nowrap max-w-[88vw] text-center
                     bg-forest text-ivory text-sm px-5 py-2.5 rounded-full font-sans shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
