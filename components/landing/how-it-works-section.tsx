"use client";

import { motion, Variants } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Crea tu Nido",
    description: "Regístrate y crea tu grupo familiar en segundos.",
  },
  {
    number: "2",
    title: "Invita a tu familia",
    description: "Comparte el código de invitación con tus familiares para que se unan al nido.",
  },
  {
    number: "3",
    title: "Organízate y colabora",
    description: "Asigna tareas, comparte listas y mantén a toda la familia sincronizada.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function HowItWorksSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-card/80 backdrop-blur-sm border border-card overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-primary mb-3 sm:mb-4">
              Cómo funciona
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground">
              En pocos minutos, tu hogar empieza a funcionar de manera más organizada.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px", amount: 0.2 }}
          className="relative space-y-8 sm:space-y-12"
        >
          {/* Timeline Connector Line */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-[1.25rem] sm:left-[1.5rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20 -z-10 hidden sm:block origin-top" 
          />

          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="flex gap-4 sm:gap-8 items-start relative">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-base sm:text-lg shadow-lg shadow-primary/30 z-10 relative">
                  {step.number}
                </div>
                {/* Mobile connector line for individual items if needed, or keeping it simple */}
              </div>
              
              <div className="pt-1">
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground text-base sm:text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
