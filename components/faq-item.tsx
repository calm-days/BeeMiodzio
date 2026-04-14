"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export function FaqItem({ q, a }: { q: string; a: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-muted/50 backdrop-blur-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left font-heading text-lg tracking-tight"
      >
        {q}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="size-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-muted-foreground">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
