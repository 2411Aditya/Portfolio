/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const links = ['About', 'Projects', 'Skills', 'Experience', 'Contact'];
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-6 md:px-16 ${
      isScrolled || mobileMenuOpen ? 'bg-[#141414]/95 backdrop-blur-md shadow-md border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-[1600px] mx-auto py-4 sm:py-5 flex justify-between items-center text-text-main">
        {/* Mobile Logo / Brand dot */}
        <a href="#about" className="flex items-center gap-2 text-white font-extrabold text-sm tracking-wider uppercase md:hidden">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e50914] animate-pulse"></span>
          <span>Portfolio</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 ml-auto">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-xs tracking-wider text-[#e5e5e5] hover:text-[#e50914] transition-colors duration-200 uppercase font-sans font-semibold"
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[#e50914] transition focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/5 py-4 px-2 space-y-2 bg-[#141414]/95 backdrop-blur-lg"
          >
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
