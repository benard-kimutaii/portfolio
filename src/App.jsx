import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ArrowUpRight, Copy, Check, ExternalLink, Send } from 'lucide-react';

// Custom 3D Wireframe Canvas Component
const NetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Mouse interaction
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX - width / 2) * 0.001;
      mouse.targetY = (e.clientY - height / 2) * 0.001;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Nodes setup
    const numNodes = 120;
    const nodes = [];
    const radius = Math.min(width, height) * 0.4;
    
    for (let i = 0; i < numNodes; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        baseX: radius * Math.sin(phi) * Math.cos(theta),
        baseY: radius * Math.sin(phi) * Math.sin(theta),
        baseZ: radius * Math.cos(phi),
      });
    }

    let rotationX = 0;
    let rotationY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Base auto-rotation + mouse influence
      rotationX += 0.002 + (mouse.y * 0.05);
      rotationY += 0.003 + (mouse.x * 0.05);

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      const projectedNodes = [];

      // Rotate and project
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        
        // Rotate Y
        let x1 = node.baseX * cosY - node.baseZ * sinY;
        let z1 = node.baseZ * cosY + node.baseX * sinY;
        
        // Rotate X
        let y2 = node.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.baseY * sinX;

        // Perspective projection
        const fov = 400;
        const scale = fov / (fov + z2);
        
        const projX = x1 * scale + width / 2;
        const projY = y2 * scale + height / 2;
        
        projectedNodes.push({ x: projX, y: projY, z: z2, scale });
      }

      const colorBase = '255, 255, 255';

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const dx = projectedNodes[i].x - projectedNodes[j].x;
          const dy = projectedNodes[i].y - projectedNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            // Opacity based on distance and Z-depth
            const opacity = (1 - dist / 80) * 0.3;
            ctx.strokeStyle = `rgba(${colorBase}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(projectedNodes[i].x, projectedNodes[i].y);
            ctx.lineTo(projectedNodes[j].x, projectedNodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        const node = projectedNodes[i];
        const opacity = Math.min(1, Math.max(0.1, (400 - node.z) / 800));
        ctx.fillStyle = `rgba(${colorBase}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5 * node.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-screen"
    />
  );
};

// Scroll Reveal Component
const Reveal = ({ children, width = "w-full" }) => {
  const [isVisible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${width}`}>
      <div
        className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const emailAddress = "benkim739@gmail.com";
  const githubUrl = "https://github.com/benard-kimutaii";
  const linkedinUrl = "https://www.linkedin.com/in/benard-kimutai-rotich/";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${emailAddress}?subject=Portfolio Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoUrl;
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  const projects = [
    {
      title: "XOM",
      category: "Quantitative Finance",
      github: "https://github.com/benard-kimutaii",
      description: "Quantitative financial modeling and systematic trading strategy backtesting system that analyzes equity market trends and news sentiment dynamics.",
      tags: ['Python', 'Quantitative Modeling', 'Backtesting', 'NLP']
    },
    {
      title: "NeuroScan AI",
      category: "Medical AI",
      github: "https://github.com/benard-kimutaii",
      description: "Open-source 3D deep learning system designed for precise medical imaging analysis. Engineered to automate brain tumor detection and 3D segmentation utilizing PyTorch, MONAI, 3D U-Net, and Swin UNETR.",
      tags: ['PyTorch', 'MONAI', '3D U-Net', 'Swin UNETR']
    },
    {
      title: "VectorWatch",
      category: "Surveillance",
      github: "https://github.com/benard-kimutaii",
      description: "AI-driven epidemiological surveillance platform. Ingests multimodal field reports via WhatsApp webhooks and processes real-time telemetry to forecast and track disease outbreak metrics.",
      tags: ['Multimodal AI', 'WhatsApp API', 'FastAPI', 'Predictive Systems']
    },
    {
      title: "KRA Tax Fraud Detection Engine",
      category: "Data Science",
      github: "https://github.com/benard-kimutaii",
      description: "Predictive analytics framework engineered to identify missing traders, anomalous tax filings, and tax evasion risks across enterprise datasets.",
      tags: ['Python', 'XGBoost', 'PostgreSQL', 'Risk Modeling']
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
        
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="#" className="font-mono text-sm tracking-widest uppercase hover:opacity-50 transition-opacity">
            B.K. Rotich
          </a>
          <div className="flex gap-6 text-sm font-mono tracking-widest uppercase hidden md:flex items-center">
            <a href="#about" className="text-white/60 hover:text-white transition-colors">About</a>
            <a href="#experience" className="text-white/60 hover:text-white transition-colors">Experience</a>
            <a href="#projects" className="text-white/60 hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="text-white/60 hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Github size={18} />
            </a>
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative h-screen flex flex-col justify-center items-center overflow-hidden border-b border-white/10">
        <NetworkCanvas />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
          <Reveal>
            <p className="font-mono text-white/60 tracking-widest uppercase text-xs md:text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Nairobi, Kenya — Open to Opportunities
            </p>
          </Reveal>
          <Reveal>
            <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-light tracking-tighter leading-none mb-4">
              Benard<br />
              Kimutai<br />
              Rotich.
            </h1>
          </Reveal>
          <Reveal>
            <h2 className="text-xl md:text-3xl font-light text-white/60 tracking-tight max-w-2xl mt-8">
              AI Developer & Data Scientist engineering robust predictive models, medical AI, and scalable intelligence systems.
            </h2>
          </Reveal>
          <Reveal>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a 
                href={`mailto:${emailAddress}`}
                className="flex items-center justify-center gap-3 px-6 py-3.5 border border-white bg-transparent text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                <span>Email Me</span>
              </a>
              <a 
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-3.5 border border-white bg-transparent text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Github size={16} className="group-hover:scale-110 transition-transform" />
                <span>GitHub</span>
              </a>
              <a 
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-3.5 border border-white bg-transparent text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                <span>LinkedIn</span>
              </a>
              <button 
                onClick={handleCopyEmail}
                className="flex items-center justify-center gap-3 px-6 py-3.5 border border-white/20 bg-transparent text-white/60 font-mono text-xs uppercase tracking-widest hover:text-white hover:border-white transition-all duration-300"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6">
        
        {/* Experience Section */}
        <section id="experience" className="py-32 border-b border-white/10">
          <Reveal>
            <h3 className="font-mono text-sm tracking-widest uppercase text-white/40 mb-16">
              [ 01 ] Professional Experience
            </h3>
          </Reveal>

          <div className="space-y-12">
            {[
                {
                  role: "Data Scientist",
                  company: "Kenya Revenue Authority (KRA) — Data Science Department",
                  period: "",
                  desc: "Engineering predictive data models for tax compliance and fraud detection. Developed Missing Trader models to pinpoint illicit VAT schemes and created property owner predictive risk engines for institutional revenue optimization."
                },
                {
                  role: "Founder & Lead Developer",
                  company: "NeuroScan AI",
                  period: "Open-Source Project",
                  desc: "Architected a 3D deep learning system for medical computer vision. Implemented PyTorch, MONAI, 3D U-Net, and Swin UNETR pipelines for brain tumor detection and automated volumetric MRI segmentation."
                },
                {
                  role: "Founder & Lead Developer",
                  company: "VectorWatch",
                  period: "Open-Source Project",
                  desc: "Engineered an AI-driven epidemiological surveillance platform. Built scalable data ingestion pipelines that process multimodal field reports via WhatsApp webhooks for early-warning outbreak tracking."
                },
                {
                role: "Technical Lead",
                company: "Google Developer Groups (GDG) On Campus — Kabarak University",
                period: "Community Leadership",
                desc: "Spearheaded technical development and developer workshops. Mentored student engineers in modern software architecture, open-source contribution, and machine learning fundamentals."
              }
            ].map((exp, i) => (
              <Reveal key={i}>
                <div className="group border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-start hover:bg-white/5 transition-colors p-4 -mx-4 rounded-sm">
                  <div className="mb-4 md:mb-0 max-w-md">
                    <h4 className="text-2xl md:text-3xl font-light tracking-tight mb-1 group-hover:pl-2 transition-all duration-300">
                      {exp.role}
                    </h4>
                    <div className="font-mono text-white/60 text-xs md:text-sm">{exp.company}</div>
                    <div className="font-mono text-white/40 text-xs mt-1">{exp.period}</div>
                  </div>
                  <p className="text-white/60 text-sm md:text-base max-w-xl font-light leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 border-b border-white/10">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
              <h3 className="font-mono text-sm tracking-widest uppercase text-white/40">
                [ 02 ] Selected Projects
              </h3>
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wider">
                {['All', 'Medical AI', 'Surveillance', 'Data Science', 'Quantitative Finance'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 border transition-all ${
                      activeFilter === filter 
                        ? 'border-white bg-white text-black' 
                        : 'border-white/20 text-white/60 hover:border-white/60'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => (
              <Reveal key={idx}>
                <div className="group border border-white/10 p-8 h-full hover:border-white transition-all bg-neutral-950/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-mono text-xs uppercase tracking-widest text-white/50 border border-white/20 px-2 py-0.5">
                        {project.category}
                      </span>
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/40 group-hover:text-white transition-colors"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <ArrowUpRight size={20} />
                      </a>
                    </div>
                    <h4 className="text-3xl font-light tracking-tight mb-4">{project.title}</h4>
                    <p className="text-white/60 font-light text-sm md:text-base leading-relaxed mb-8">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    {project.tags.map(tech => (
                      <span key={tech} className="font-mono text-xs uppercase tracking-widest px-2.5 py-1 border border-white/20 text-white/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Stack Section */}
        <section className="py-32 border-b border-white/10">
          <Reveal>
            <h3 className="font-mono text-sm tracking-widest uppercase text-white/40 mb-16">
              [ 03 ] Core Technologies & Frameworks
            </h3>
          </Reveal>
          
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {['Python', 'PyTorch', 'MONAI', 'Swin UNETR', 'TensorFlow', 'FastAPI', 'PostgreSQL', 'Scikit-Learn', 'XGBoost', 'Docker', 'Linux'].map((tech) => (
              <Reveal key={tech}>
                <div className="text-4xl md:text-5xl font-light tracking-tighter text-white/40 hover:text-white cursor-default transition-colors">
                  {tech}.
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      {/* Footer / Interactive Contact Section */}
      <footer id="contact" className="py-32 max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
                Initiate<br />Contact.
              </h2>
              <p className="text-white/60 font-light text-lg mb-8 max-w-md">
                Interested in collaboration, research, or technical advisory? Reach out directly via email or connect through professional networks.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <a 
                  href={`mailto:${emailAddress}`}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-white bg-transparent text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 group"
                >
                  <Mail size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Email</span>
                </a>
                <a 
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-white bg-transparent text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 group"
                >
                  <Github size={16} className="group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </a>
                <a 
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-white bg-transparent text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 group"
                >
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="border border-white/10 p-8 bg-neutral-950/40">
              <h3 className="font-mono text-xs tracking-widest uppercase text-white/60 mb-6">
                Direct Inquiry Form
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-white/50 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your Name"
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase text-white/50 mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your.email@example.com"
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase text-white/50 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Brief description of project or inquiry..."
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-mono text-xs tracking-widest uppercase hover:bg-white/80 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Send Message via Email Client
                </button>
                {formSubmitted && (
                  <p className="font-mono text-xs text-emerald-400 mt-2 text-center">
                    Launching default email client with message prefilled...
                  </p>
                )}
              </form>
            </div>
          </div>
        </Reveal>

        <div className="mt-32 pt-8 border-t border-white/10 text-center font-mono text-xs text-white/40 tracking-widest uppercase">
          © {new Date().getFullYear()} Benard Kimutai Rotich — Built with React & Tailwind
        </div>
      </footer>

    </div>
  );
};

export default App;
