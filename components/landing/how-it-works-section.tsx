'use client';

import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';

const steps = [{ number: '1' }, { number: '2' }, { number: '3' }];

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
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export function HowItWorksSection() {
  const t = useTranslations('Landing.how_it_works');

  return (
    <section className="w-full py-12 sm:py-20 bg-card/80 backdrop-blur-sm border-y border-card/10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 px-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-primary mb-3 sm:mb-4">
                {t('title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-foreground">{t('description')}</p>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px', amount: 0.2 }}
            className="relative space-y-12 sm:space-y-20 px-2"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start relative group"
              >
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary border-organic-2 flex items-center justify-center flex-shrink-0 text-primary-foreground font-serif-custom italic font-bold text-3xl sm:text-4xl shadow-organic z-10 relative group-hover:rotate-6 transition-transform">
                    {step.number}
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-4 leading-tight">
                    {t(`steps.${step.number}.title`)}
                  </h3>
                  <p className="text-foreground/90 text-lg sm:text-xl leading-relaxed font-medium balance">
                    {t(`steps.${step.number}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
