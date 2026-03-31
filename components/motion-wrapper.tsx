"use client";

import { motion } from "motion/react";
import { flags } from "@/lib/flags";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: Props) {
  if (!flags.animations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", damping: 25, stiffness: 200, delay }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStagger({ children, className }: Omit<Props, "delay">) {
  if (!flags.animations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children, className }: Omit<Props, "delay">) {
  if (!flags.animations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0 }: Props) {
  if (!flags.animations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", damping: 25, stiffness: 200, delay }}
    >
      {children}
    </motion.div>
  );
}
