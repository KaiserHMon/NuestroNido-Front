"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, ShoppingCart, StickyNote, Trophy } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Calendario de Tareas",
    description: "Organiza las tareas del hogar y visualízalas en un calendario intuitivo.",
  },
  {
    icon: ShoppingCart,
    title: "Listas Compartidas",
    description: "Crea listas de compras por categorías para mantener la casa abastecida.",
  },
  {
    icon: StickyNote,
    title: "Notas Familiares",
    description: "Comparte recordatorios y mensajes importantes para que todos estén alineados.",
  },
  {
    icon: Trophy,
    title: "Gamificación",
    description: "Motiva la colaboración en las tareas del hogar con puntos y rankings.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Retraso entre cada tarjeta
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-primary mb-3 sm:mb-4">
              Todo lo que tu familia necesita
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground max-w-2xl mx-auto">
              Herramientas diseñadas para hacer la vida familiar más fácil y organizada
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-card bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-heading text-primary">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
