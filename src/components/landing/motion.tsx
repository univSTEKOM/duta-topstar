"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

// Alir — the Topstar curve for movement (formation changes, reveals, card lifts).
const easing = [0.45, 0, 0.2, 1] as const;

interface MotionProviderProps {
  children: React.ReactNode;
}

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function FadeInUp({
  children,
  className,
  delay = 0,
  distance = 16,
}: FadeInUpProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.9, ease: easing, delay }}
    >
      {children}
    </m.div>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.06,
  delay = 0,
}: StaggerGroupProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: easing },
        },
      }}
    >
      {children}
    </m.div>
  );
}

