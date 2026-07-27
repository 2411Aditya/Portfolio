import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: "AI-Powered Legal Document Translation",
      description: "Engineered a solution by fine-tuning the Sarvam LLM locally over a large-scale legal corpus to ensure high-domain accuracy. Utilized PyMuPDF for document parsing and implemented structured outputs to maintain intricate legal formatting. Conducted rigorous validation of legal terminology to ensure strict structural accuracy standards.",
      techStack: ["Sarvam LLM", "PyMuPDF", "LLM Fine-Tuning", "Structured Outputs"],
      github: "https://github.com/Akshada2411/AI-Powered-legal-translator"
    },
    {
      title: "Automated Candlestick Predictor (Predictive Engine)",
      description: "Developed an end-to-end predictive system harvesting real-time market data from Angel One SmartAPI via WebSockets. Built a PyTorch-based LSTM model analyzing the rhythm of 60+ previous candles to forecast price returns. Implemented GitHub Actions to automate inference & ingestion, pushing live data to Google Sheets and updating a React dashboard with FastAPI backend rendering Ghost Candle forecasts.",
      techStack: ["PyTorch (LSTM)", "FastAPI", "WebSockets", "GitHub Actions", "React"],
      github: "https://github.com/2411Aditya/Candlestick-predictor"
    },
    {
      title: "Intelligent Knowledge Assistant (RAG Pipeline)",
      description: "Built a Retrieval-Augmented Generation (RAG) system using LangChain and Vector Databases to query private datasets. Integrated AI evaluation metrics to flag hallucinations and ensure response relevance, following secure-by-design AI practices.",
      techStack: ["LangChain", "Vector Databases", "RAG Pipeline", "AI Evaluation"],
      github: "https://github.com/2411Aditya/Intelligent-Knowledge-Assistant-RAG"
    }
  ];

  return (
    <section id="projects" className="py-24 relative px-[1.5rem] md:px-[4rem] bg-[#141414]/85 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 pb-6 flex items-end justify-between border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">Projects</h2>
          </div>
          <span className="text-xs tracking-wider text-white/40 uppercase font-sans font-bold hidden md:block">Selected Works</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-[#181818]/85 border border-white/5 rounded-md overflow-hidden flex flex-col justify-between h-full hover:shadow-[0_12px_40px_rgba(229,9,20,0.1)] transition-all duration-300 group cursor-default"
            >
              {/* Fake Video Thumbnail placeholder with tech icons */}
              <div className="h-[180px] w-full bg-gradient-to-br from-[#2f2f2f] to-[#1f1f1f] relative flex items-center justify-center p-6 border-b border-white/5 overflow-hidden">
                {/* Red top border highlight */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#e50914]" />
                <div className="z-10 text-center flex flex-col gap-2 items-center">
                  <h4 className="text-base font-display font-extrabold text-white uppercase tracking-wide leading-snug max-w-[240px]">
                    {project.title}
                  </h4>
                </div>
              </div>

              {/* Metadata Panel */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-white/40">Repository Showcase</span>
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-[#e50914] hover:border-[#e50914] transition-colors duration-200"
                    >
                      <FaGithub size={16} />
                    </a>
                  </div>
                  <p className="text-sm text-[#a3a3a3] leading-relaxed mb-6 font-sans">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] text-white/50 uppercase font-sans font-bold pt-4 border-t border-white/5">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="after:content-['â€¢'] after:ml-2 last:after:content-none">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

