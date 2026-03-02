'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function AnimatedHeroText() {
  const t = useTranslations('Landing.hero');
  const words = t.raw('words') as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <h1 className="flex flex-col text-center font-bold font-heading leading-[1.1] mb-12 tracking-tight px-2 relative z-20">
      <span className="text-primary text-[clamp(2.5rem,8vw,5rem)]">{t('title_start')}</span>
      <div className="h-[1.5em] text-[clamp(2.5rem,8vw,5rem)] relative w-full flex justify-center items-center -my-3 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={words[index]}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}
            className="absolute whitespace-nowrap"
            style={{ color: '#a93838' }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-primary text-[clamp(2.5rem,8vw,5rem)]">{t('title_end')}</span>
    </h1>
  );
}
