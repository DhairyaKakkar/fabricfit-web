'use client';

import { motion } from 'framer-motion';

interface Props {
  icon: string;
  label: string;
  delay: number;
  inView: boolean;
}

export default function WorkflowCard({ icon, label, delay, inView }: Props) {
  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-3 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(251,191,36,0.2)',
        fontFamily: 'var(--font-inter)',
        fontSize: 13,
        color: '#fef3c7',
        whiteSpace: 'nowrap',
      }}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}
