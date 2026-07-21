import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    { title: "Languages & Fwks", skills: "Python, SQL, Javascript, React, FastAPI, REST APIs" },
    { title: "AI-Native Eng.", skills: "Prompt Engineering, RAG Pipelines, LangChain, Agentic AI" },
    { title: "Machine Learning", skills: "LLM, PyTorch, LSTM Neural Networks, Scikit-learn, TensorFlow" },
    { title: "Software Tools", skills: "Github Actions, Git, Agile Methodology, Scrum Model" },
    { title: "Visualization", skills: "Power BI, Tableau, Looker Studio, Zoho Analytics" },
    { title: "Soft Skills", skills: "Team Work, Critical Thinking, Adaptability, Problem Solving, Communication" }
  ];

  return (
    <section id="skills" className="py-24 relative px-[1.5rem] md:px-[4rem] bg-[#141414] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 pb-6 flex items-end justify-between border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 bg-[#e50914] rounded-full"></span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white uppercase tracking-tight">Skills</h2>
          </div>
          <span className="text-xs tracking-wider text-white/40 uppercase font-sans font-bold hidden md:block">Toolkit</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#181818] border border-white/5 p-8 rounded hover:border-[#e50914]/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(229,9,20,0.08)] group"
            >
              <h3 className="text-lg font-display font-extrabold text-white uppercase mb-4 tracking-tight group-hover:text-[#e50914] transition-colors duration-200">
                {category.title}
              </h3>
              <p className="text-[#a3a3a3] font-sans text-sm md:text-base leading-relaxed">
                {category.skills}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
