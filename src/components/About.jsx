import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { cleanText } from '../utils/textCleaner';

const About = () => {
  const { currentPortfolio } = usePortfolio();
  const about = currentPortfolio?.about || { paragraphs: [], coreCompetencies: [] };

  return (
    <section id="about" className="relative px-4 sm:px-6 md:px-16 py-16 sm:py-24 bg-[#141414]/85 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="col-span-1 md:col-span-12 mb-2 sm:mb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span className="h-6 sm:h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">About</h2>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-7 space-y-4 sm:space-y-6 text-[#a3a3a3] text-sm sm:text-base md:text-lg leading-relaxed font-sans"
        >
          {about.paragraphs?.map((para, i) => (
            <p key={i}>{cleanText(para)}</p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-5 bg-[#181818]/85 border border-white/5 p-5 sm:p-8 rounded-lg shadow-xl"
        >
          <h3 className="text-xs sm:text-sm font-extrabold text-[#e50914] tracking-widest uppercase mb-4 sm:mb-6 pb-2 border-b border-white/5">
            Core Competencies
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {about.coreCompetencies?.map((area, i) => (
              <span key={i} className="px-3 py-1.5 bg-[#2f2f2f]/85 text-white rounded-full text-xs font-semibold hover:bg-[#e50914] hover:text-white transition-colors duration-300 cursor-default">
                {area}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
