import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      {/* Small dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-text-main rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      {/* Large circle outline */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-text-main/30 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        animate={{ x: mousePosition.x - 20, y: mousePosition.y - 20 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
      />
    </>
  );
};

export default CustomCursor;
