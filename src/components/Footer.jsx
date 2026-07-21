import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="py-16 px-[1.5rem] md:px-[4rem] border-t border-white/5 bg-[#141414] relative z-10">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xs text-white/40 font-semibold font-sans">
          © {new Date().getFullYear()} Aditya Kulkarni. All rights reserved.
        </div>
        
        <div className="flex gap-6">
          <a href="https://github.com/2411Aditya" target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#e50914] transition-colors duration-200 p-3 bg-white/5 hover:bg-white/10 rounded-full">
            <FaGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/aditya-kulkarni-887474302?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#e50914] transition-colors duration-200 p-3 bg-white/5 hover:bg-white/10 rounded-full">
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
