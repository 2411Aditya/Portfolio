import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const greetings = ["HELLO", "NAMASTE", "HOLA", "BONJOUR", "CIAO"];

const Preloader = () => {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === greetings.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isLoading ? 0 : '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-bg-dark flex items-center justify-center pointer-events-none transition-colors duration-300"
    >
      <div className="text-text-main font-display text-4xl tracking-widest uppercase flex items-center gap-4 relative w-[250px] justify-center h-[50px]">
        <span className="w-2 h-2 bg-text-main rounded-full absolute left-4"></span>
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="absolute text-center ml-4"
          >
            {greetings[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Preloader;
