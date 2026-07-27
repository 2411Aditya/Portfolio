import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import LiquidEther from './components/LiquidEther';

function App() {
  return (
    <div className="bg-bg-dark text-text-main selection:bg-[#e50914]/30 font-sans antialiased overflow-x-hidden cursor-none">
      {/* Fixed full-screen LiquidEther background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous={true}
          viscous={30}
          colors={["#5227FF", "#F43F5E", "#EF4444"]}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
        />
      </div>

      {/* All content rendered above the background */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CustomCursor />
        <Preloader />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
