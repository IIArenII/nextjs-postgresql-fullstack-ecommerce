'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

interface MotionSectionProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode;
  delay?: number;
}

export function MotionSection({ children, delay = 0, ...props }: MotionSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function MotionDiv({ children, delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
