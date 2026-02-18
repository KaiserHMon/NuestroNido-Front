"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, ShoppingCart, StickyNote, Trophy } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const features = [
  {
    id: 'calendar',
    icon: Calendar,
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
  },
  {
    id: 'notes',
    icon: StickyNote,
  },
  {
    id: 'gamification',
    icon: Trophy,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] },
  },
};

export function FeaturesSection() {
  const t = useTranslations('Landing.features');

  return (
    <section className="w-full py-12 sm:py-20 bg-card/30 backdrop-blur-sm border-y border-card/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-primary mb-3 sm:mb-4">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px", amount: 0.2 }}
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
                    {t(`items.${feature.id}.title`)}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-foreground">
                    {t(`items.${feature.id}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  );
}
