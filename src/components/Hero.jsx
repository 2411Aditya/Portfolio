import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Hero = () => {
  const [theme, setTheme] = useState('dark');
  const { currentPortfolio } = usePortfolio();
  const personalInfo = currentPortfolio?.personalInfo || {};

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <section className="relative min-h-screen w-full flex items-center px-4 sm:px-6 md:px-16 py-24 sm:py-32 md:py-0 bg-gradient-to-t from-[#141414] via-black/40 to-black/10 overflow-hidden">
      
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_30%,rgba(229,9,20,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[120px] sm:h-[150px] bg-gradient-to-t from-[#141414] to-transparent z-10 pointer-events-none" />

      {/* Main Left-Aligned Info Panel */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col items-start gap-4 sm:gap-6 mt-4 md:mt-[4rem]">
        
        {/* Top left style tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[11px] sm:text-xs tracking-widest text-[#e50914] font-extrabold uppercase bg-[#e50914]/10 border border-[#e50914]/30 px-3 py-1 rounded-full"
        >
          {personalInfo.titleTag}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold tracking-tighter leading-[1.05] sm:leading-[0.95] text-white">
            {personalInfo.firstName}<br />{personalInfo.lastName}
          </h1>
        </motion.div>



        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-2xl"
        >
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#d4d4d4] leading-relaxed font-sans font-medium">
            {personalInfo.bio}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto"
        >
          <a
            href={personalInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-play uppercase w-full sm:w-auto text-center justify-center text-xs sm:text-sm py-3 sm:py-3.5 px-6 font-bold"
          >
            Say Hello
          </a>
          <a
            href="#about"
            className="btn-info uppercase w-full sm:w-auto text-center justify-center text-xs sm:text-sm py-3 sm:py-3.5 px-6 font-bold"
          >
            About
          </a>
          <a
            href={personalInfo.pdfDataUrl || `${import.meta.env.BASE_URL}${personalInfo.pdfFile}`}
            target="_blank"
            rel="noreferrer"
            download={personalInfo.pdfDownloadName || personalInfo.pdfFile || "Aditya_Kulkarni_Resume.pdf"}
            className="btn-info bg-white/10 hover:bg-white/20 border border-white/15 uppercase w-full sm:w-auto text-center justify-center text-xs sm:text-sm py-3 sm:py-3.5 px-6 font-bold"
          >
            Download Resume
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
