import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [theme, setTheme] = useState('dark');

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
          B.E. AI & DS '26
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] text-white">
            ADITYA<br />KULKARNI
          </h1>
        </motion.div>

        {/* Badges/Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-[#e5e5e5] font-semibold"
        >
          <span>AI Engineer</span>
          <span>•  ML Specialist</span>
          <span>•  Full-Stack Developer</span>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm md:text-lg text-[#e5e5e5] leading-relaxed font-sans font-medium text-shadow-md">
            Artificial Intelligence & Data Science Engineer specializing in AI-native tools, RAG pipelines, LLM fine-tuning, and production-ready systems. Driven by creating robust architectures that translate machine learning into enterprise-grade applications.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-wrap gap-4 mt-2"
        >
          <a href="https://wa.me/917775815981" target="_blank" rel="noopener noreferrer" className="btn-play uppercase">
            Say Hello
          </a>
          <a href="#about" className="btn-info uppercase">
            About
          </a>
          <a href={`${import.meta.env.BASE_URL}RESUME11.pdf`} target="_blank" rel="noreferrer" download="Aditya_Kulkarni_Resume.pdf" className="btn-info bg-white/10 hover:bg-white/20 border border-white/15 uppercase">
            Download Resume
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
