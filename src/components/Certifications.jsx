import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const Certifications = () => {
  const { currentPortfolio } = usePortfolio();
  const positionsOfResponsibility = currentPortfolio?.positionsOfResponsibility || [];
  const certifications = currentPortfolio?.certifications || [];

  return (
    <section id="certifications" className="py-16 sm:py-24 relative px-4 sm:px-6 md:px-16 bg-[#141414]/85 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-16 pb-4 sm:pb-6 flex items-end justify-between border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="h-6 sm:h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">Leadership & Certs</h2>
          </div>
          <span className="text-[11px] sm:text-xs tracking-wider text-white/40 uppercase font-sans font-bold hidden sm:block">Accolades</span>
        </motion.div>

        {/* Positions of Responsibility */}
        <div className="mb-16 sm:mb-24">
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-white uppercase tracking-wider mb-6 sm:mb-8">Positions of Responsibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {positionsOfResponsibility.map((pos, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }} className="bg-[#181818]/85 border border-white/5 p-5 sm:p-8 rounded-lg hover:border-[#e50914]/40 transition-all duration-300">
                <h4 className="text-base sm:text-lg font-display font-extrabold text-white mb-2 uppercase tracking-tight">{pos.title}</h4>
                <div className={`text-xs font-bold ${pos.colorClass} mb-3 sm:mb-4 tracking-wider`}>{pos.organization}</div>
                <p className="text-[#a3a3a3] font-sans text-xs sm:text-sm leading-relaxed">
                  {pos.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications List */}
        <div>
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-white uppercase tracking-wider mb-6 sm:mb-8">Certifications & Awards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group border border-white/5 p-5 sm:p-8 bg-[#181818]/85 rounded-lg hover:border-[#e50914]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-[#e50914] uppercase tracking-wider mb-2 sm:mb-3">{cert.status}</div>
                  <h3 className="text-base sm:text-lg md:text-xl font-display font-extrabold text-white uppercase tracking-tight mb-3 sm:mb-4 group-hover:text-[#e50914] transition-colors duration-200">
                    {cert.name}
                  </h3>
                </div>
                <p className="text-[#a3a3a3] font-sans text-xs sm:text-sm">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Certifications;
