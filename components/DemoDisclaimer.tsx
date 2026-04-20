'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export function DemoDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDemoDisclaimer');
    if (!hasSeenDisclaimer) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenDemoDisclaimer', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-500" />
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Demo Project Notice
              </h2>
              <p className="mt-4 text-balanced text-slate-600 dark:text-slate-400 leading-relaxed">
                Welcome to <span className="font-semibold text-slate-900 dark:text-slate-100">Storefront</span>. 
                Please note that this is a <strong>demonstration project</strong> built to showcase e-commerce functionality. 
                All data, products, and transactions are simulated. No real credit card information should be entered, and no actual products will be shipped.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={handleDismiss}
                  className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  I UNDERSTAND
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
