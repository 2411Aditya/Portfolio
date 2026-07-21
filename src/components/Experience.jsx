import { motion } from 'framer-motion';

const Experience = () => {
  return (
    <section id="experience" className="py-24 px-[1.5rem] md:px-[4rem] bg-[#141414] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 pb-6 flex items-end justify-between border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">Experience</h2>
          </div>
          <span className="text-xs tracking-wider text-white/40 uppercase font-sans font-bold hidden md:block">Career</span>
        </motion.div>

        <div className="flex flex-col gap-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#181818] border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
          >
            <div className="md:col-span-3">
              <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">Parallel Learning</h3>
              <p className="text-white/40 text-sm font-mono mt-1">22 Sep, 2025 - 15 Jan, 2026</p>
            </div>
            <div className="md:col-span-9">
              <h4 className="text-lg font-sans font-bold text-white mb-4">Software Intern</h4>
              <ul className="space-y-3 text-[#a3a3a3] text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3"><span className="mt-2.5 w-1.5 h-1.5 bg-[#e50914] rounded-full flex-shrink-0"></span> <span><strong>AI-First Workflows:</strong> Spearheaded the integration of AI solutions to automate internal processes, significantly increasing efficiency and reducing manual error rates.</span></li>
                <li className="flex items-start gap-3"><span className="mt-2.5 w-1.5 h-1.5 bg-[#e50914] rounded-full flex-shrink-0"></span> <span><strong>System Optimization:</strong> Refactored complex MySQL queries and managed backend performance to ensure seamless data flow and application stability.</span></li>
                <li className="flex items-start gap-3"><span className="mt-2.5 w-1.5 h-1.5 bg-[#e50914] rounded-full flex-shrink-0"></span> <span><strong>Stakeholder Collaboration:</strong> Partnered with non-technical teams to transform abstract business requirements into high-performing, functional software tools.</span></li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 pb-6 flex items-end justify-between border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">Education</h2>
          </div>
          <span className="text-xs tracking-wider text-white/40 uppercase font-sans font-bold hidden md:block">Academics</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#181818] border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-display font-extrabold text-white uppercase mb-4 tracking-tight">B.E. in AI & DS</h3>
              <p className="text-sm text-[#a3a3a3] font-sans leading-relaxed mb-6">
                Dr. D. Y. Patil Institute of Technology
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs font-semibold">
              <span className="text-[#46d369]">CGPA: 7.1 / 10</span>
              <span className="text-white/40">2026</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#181818] border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-display font-extrabold text-white uppercase mb-4 tracking-tight">12th Grade</h3>
              <p className="text-sm text-[#a3a3a3] font-sans leading-relaxed mb-6">
                Late B G Kabra Jr College, Malegaon (MSBSHSE)
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs font-semibold">
              <span className="text-[#46d369]">Percentage: 63.67%</span>
              <span className="text-white/40">2022</span>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#181818] border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-display font-extrabold text-white uppercase mb-4 tracking-tight">10th Grade</h3>
              <p className="text-sm text-[#a3a3a3] font-sans leading-relaxed mb-6">
                Vidya Vikas International School, Malegaon (CBSE)
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs font-semibold">
              <span className="text-[#46d369]">Percentage: 87.20%</span>
              <span className="text-white/40">2020</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
