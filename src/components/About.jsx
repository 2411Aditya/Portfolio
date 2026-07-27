import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="relative px-[1.5rem] md:px-[4rem] py-24 bg-[#141414]/85">
      <div className="max-w-[1600px] mx-auto w-full grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-12 mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span className="h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">About</h2>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-7 space-y-6 text-[#a3a3a3] text-lg md:text-xl leading-relaxed font-sans"
        >
          <p>
            I am an <strong className="text-white">Artificial Intelligence & Data Science engineer</strong> pursuing a B.E. at Dr. D. Y. Patil Institute of Technology with a focus on building dependable, full-stack applications.
          </p>
          <p>
            I specialize in bridging the gap between standalone machine learning models and production-ready systems by integrating robust backend architectures with automated cloud pipelines, ensuring innovation translates into stable, enterprise-grade solutions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-5 bg-[#181818]/85 border border-white/5 p-8 rounded-lg shadow-xl"
        >
          <h3 className="text-sm font-extrabold text-[#e50914] tracking-widest uppercase mb-6 pb-2 border-b border-white/5">Core Competencies</h3>
          <div className="flex flex-wrap gap-3">
            {[
              "AI-Native Engineering",
              "RAG & Agentic AI",
              "Machine Learning & LLMs",
              "PyTorch & TensorFlow",
              "Full-Stack React & FastAPI",
              "Backend & REST APIs",
              "Automated Cloud Pipelines",
              "Git & GitHub Actions"
            ].map((area, i) => (
              <span key={i} className="px-3.5 py-1.5 bg-[#2f2f2f]/85 text-white rounded-full text-xs font-semibold hover:bg-[#e50914] hover:text-white transition-colors duration-300 cursor-default">
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

