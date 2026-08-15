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
    <section className="relative h-screen w-full flex items-center overflow-hidden px-[1.5rem] md:px-[4rem] bg-gradient-to-t from-[#141414] via-black/40 to-black/10">
      
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_30%,rgba(229,9,20,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[#141414] to-transparent z-10 pointer-events-none" />


      {/* Main Left-Aligned Info Panel */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col items-start gap-4 md:gap-6 mt-[4rem]">
        
        {/* Top left style tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-xs tracking-widest text-[#e50914] font-extrabold uppercase"
        >
          {personalInfo.titleTag}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] text-white">
            {personalInfo.firstName}<br />{personalInfo.lastName}
          </h1>
        </motion.div>

        {/* Badges/Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-[#e5e5e5] font-semibold"
        >
          {personalInfo.roles.map((role, idx) => (
            <span key={idx}>
              {idx > 0 && '•  '}
              {role}
            </span>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm md:text-lg text-[#e5e5e5] leading-relaxed font-sans font-medium text-shadow-md">
            {personalInfo.bio}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-wrap gap-4 mt-2"
        >
          <a href={personalInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-play uppercase">
            Say Hello
          </a>
          <a href="#about" className="btn-info uppercase">
            About
          </a>
          <a href={personalInfo.pdfDataUrl || `${import.meta.env.BASE_URL}${personalInfo.pdfFile}`} target="_blank" rel="noreferrer" download={personalInfo.pdfDownloadName || personalInfo.pdfFile || "Aditya_Kulkarni_Resume.pdf"} className="btn-info bg-white/10 hover:bg-white/20 border border-white/15 uppercase">
            Download Resume
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
