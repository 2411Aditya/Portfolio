import { motion } from 'framer-motion';

const Certifications = () => {
  const certifications = [
    { name: "Supervised Machine Learning", status: "Certification", desc: "Certified by DeepLearning.AI" },
    { name: "Data Analytics Program", status: "Program", desc: "Completed program by Godrej" },
    { name: "Devclash 24 Hour Hackathon", status: "Co-Curricular", desc: "Participated in 24-hour intensive development hackathon." }
  ];

  return (
    <section id="certifications" className="py-24 relative px-[1.5rem] md:px-[4rem] bg-[#141414] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 pb-6 flex items-end justify-between border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">Leadership & Certs</h2>
          </div>
          <span className="text-xs tracking-wider text-white/40 uppercase font-sans font-bold hidden md:block">Accolades</span>
        </motion.div>

        {/* Positions of Responsibility */}
        <div className="mb-24">
          <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-wider mb-8">Positions of Responsibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="bg-[#181818] border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300">
              <h4 className="text-lg font-display font-extrabold text-white mb-2 uppercase tracking-tight">Treasurer</h4>
              <div className="text-xs font-bold text-blue-400 mb-4 tracking-wider">TEAM SANSKRITI</div>
              <p className="text-[#a3a3a3] font-sans text-sm leading-relaxed">
                Oversaw financial planning and budget management for college cultural initiatives.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-[#181818] border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300">
              <h4 className="text-lg font-display font-extrabold text-white mb-2 uppercase tracking-tight">Management Team</h4>
              <div className="text-xs font-bold text-green-400 mb-4 tracking-wider">TEAM DEVKRAFT</div>
              <p className="text-[#a3a3a3] font-sans text-sm leading-relaxed">
                Organized large-scale technical events, focusing on logistics and team coordination.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-[#181818] border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300">
              <h4 className="text-lg font-display font-extrabold text-white mb-2 uppercase tracking-tight">Coding Member</h4>
              <div className="text-xs font-bold text-purple-400 mb-4 tracking-wider">TEAM AIRAWAT</div>
              <p className="text-[#a3a3a3] font-sans text-sm leading-relaxed">
                Collaborated on technical development for an E-Bike manufacturing project.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Certifications List */}
        <div>
          <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-wider mb-8">Certifications & Awards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group border border-white/5 p-8 bg-[#181818] rounded-md hover:border-[#e50914]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#e50914] uppercase tracking-wider mb-3">{cert.status}</div>
                  <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight mb-4 group-hover:text-[#e50914] transition-colors duration-200">
                    {cert.name}
                  </h3>
                </div>
                <p className="text-[#a3a3a3] font-sans text-sm">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Certifications;
