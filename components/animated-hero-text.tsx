"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const words = [
  "organizado",
  "conectado",
  "armonioso"
];

export function AnimatedHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="flex flex-col text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-tight mb-6">
      <span className="text-primary">Un hogar más</span>
      <div className="h-[1.3em] relative overflow-hidden">
        <AnimatePresence mode="popLayout">
           <motion.span
            key={words[index]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute left-0 right-0 text-white drop-shadow-md"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-primary">todo en un solo lugar.</span>
    </h1>
  );
}
