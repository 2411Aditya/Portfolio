import { motion } from 'framer-motion';
import resumeData from '../data/resumeData.json';

const Experience = () => {
  const { experience, education } = resumeData;

  return (
    <section id="experience" className="py-24 px-[1.5rem] md:px-[4rem] bg-[#141414]/85 border-t border-white/5">
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
          {experience.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#181818]/85 border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-3">
                <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">{exp.company}</h3>
                <p className="text-white/40 text-sm font-mono mt-1">{exp.period}</p>
              </div>
              <div className="md:col-span-9">
                <h4 className="text-lg font-sans font-bold text-white mb-4">{exp.role}</h4>
                <ul className="space-y-3 text-[#a3a3a3] text-sm md:text-base leading-relaxed">
                  {exp.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 bg-[#e50914] rounded-full flex-shrink-0"></span> 
                      <span><strong>{item.label}</strong> {item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
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
          {education.map((edu, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-[#181818]/85 border border-white/5 p-8 rounded-md hover:border-[#e50914]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-display font-extrabold text-white uppercase mb-4 tracking-tight">{edu.degree}</h3>
                <p className="text-sm text-[#a3a3a3] font-sans leading-relaxed mb-6">
                  {edu.institution}
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs font-semibold">
                <span className="text-[#46d369]">{edu.score}</span>
                <span className="text-white/40">{edu.year}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;

