import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const Contact = () => {
  const { currentPortfolio } = usePortfolio();
  const contact = currentPortfolio?.contact || {};
  const personalInfo = currentPortfolio?.personalInfo || {};

  return (
    <section id="contact" className="relative px-4 sm:px-6 md:px-16 py-20 sm:py-32 bg-[#141414]/85 border-t border-white/5 flex flex-col justify-center items-center">
      <div className="max-w-[1600px] mx-auto w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center max-w-3xl w-full"
        >
          <span className="text-[#e50914] font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 bg-[#e50914]/10 border border-[#e50914]/30 px-3 py-1 rounded-full">
            {contact.subtitle}
          </span>
          
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight mb-6 sm:mb-8 leading-tight">
            {contact.title}
          </h2>
          
          <p className="text-xs sm:text-base md:text-xl text-[#a3a3a3] max-w-2xl mb-8 sm:mb-12 leading-relaxed font-sans px-2">
            {contact.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center w-full max-w-md items-center">
            <a 
              href={personalInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#e50914] hover:bg-[#b81d24] text-white font-sans font-bold text-sm sm:text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg cursor-pointer"
            >
              Say Hello
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a 
              href={`tel:${(personalInfo.phone || '').replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 hover:border-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center font-sans font-bold text-sm sm:text-base text-white rounded-lg whitespace-nowrap"
            >
              {personalInfo.phone}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
