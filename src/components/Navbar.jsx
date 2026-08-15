/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const links = ['About', 'Projects', 'Skills', 'Experience', 'Contact'];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 px-[1.5rem] md:px-[4rem] ${isScrolled ? 'bg-[#141414]/85 shadow-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-[1600px] mx-auto py-5 flex justify-end items-center text-text-main">
        <div className="hidden md:flex gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-xs tracking-wider text-[#e5e5e5] hover:text-white transition-colors duration-200 uppercase font-sans font-semibold"
            >
              {link}
            </motion.a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
