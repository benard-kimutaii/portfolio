import React, { useState, useEffect, useRef } from "react";
import { Mail, ArrowUpRight, Copy, Check, ExternalLink, Send } from "lucide-react";

// Inline SVG for GitHub
const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

// Inline SVG for LinkedIn
const LinkedinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function App() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const canvasRef = useRef(null);

  const email = "benkim739@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 3D Rotating Neural Network Wireframe Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate 3D nodes
    const nodes = [];
    const numNodes = 45;
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 350,
        z: (Math.random() - 0.5) * 350,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleX += 0.003;
      angleY += 0.005;

      const cx = width / 2;
      const cy = height / 2;
      const projectedNodes = [];

      // Rotate and project nodes
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        // Rotation around Y axis
        let x1 = node.x * Math.cos(angleY) - node.z * Math.sin(angleY);
        let z1 = node.z * Math.cos(angleY) + node.x * Math.sin(angleY);
        let y1 = node.y;

        // Rotation around X axis
        let y2 = y1 * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + y1 * Math.sin(angleX);
        let x2 = x1;

        // Perspective projection
        let fov = 400;
        let scale = fov / (fov + z2 + 200);
        let px = cx + x2 * scale;
        let py = cy + y2 * scale;

        projectedNodes.push({ x: px, y: py, z: z2, scale });
      }

      // Draw connections
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          let dx = projectedNodes[i].x - projectedNodes[j].x;
          let dy = projectedNodes[i].y - projectedNodes[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(projectedNodes[i].x, projectedNodes[i].y);
            ctx.lineTo(projectedNodes[j].x, projectedNodes[j].y);
            let alpha = (1 - dist / 90) * 0.35;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        let p = projectedNodes[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const projects = [
    {
      title: "NeuroScan AI",
      category: "Medical AI",
      desc: "Open-source 3D deep learning system for medical imaging that automates brain tumor detection and segmentation from volumetric MRI scans using PyTorch, MONAI, 3D U-Net, and Swin UNETR architectures.",
      tags: ["PyTorch", "MONAI", "3D U-Net", "Swin UNETR", "Medical Imaging"],
      link: "https://github.com/benard-kimutaii"
    },
    {
      title: "VectorWatch",
      category: "Surveillance",
      desc: "AI-driven epidemiological surveillance platform that ingests multimodal field reports via WhatsApp webhooks to predict disease outbreaks across Sub-Saharan Africa.",
      tags: ["FastAPI", "Python", "Twilio Webhooks", "PostgreSQL", "PostGIS"],
      link: "https://github.com/benard-kimutaii"
    },
    {
      title: "XOM",
      category: "Data Science",
      desc: "Advanced algorithmic data engine engineered for systematic trend detection, predictive modeling, and real-time operational risk assessment pipelines.",
      tags: ["Python", "TensorFlow", "PostgreSQL", "Docker", "REST APIs"],
      link: "https://github.com/benard-kimutaii"
    }
  ];

  const filteredProjects = activeTab === "All" ? projects : projects.filter(p => p.category === activeTab);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-mono selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <span className="text-sm font-bold tracking-widest uppercase">Benard Kimutai Rotich</span>
        <div className="hidden md:flex space-x-8 text-xs tracking-wider text-neutral-400">
          <a href="#about" className="hover:text-white transition">ABOUT</a>
          <a href="#experience" className="hover:text-white transition">EXPERIENCE</a>
          <a href="#projects" className="hover:text-white transition">PROJECTS</a>
          <a href="#contact" className="hover:text-white transition">CONTACT</a>
        </div>
        <div className="flex items-center space-x-3">
          <a 
            href="https://github.com/benard-kimutaii" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 border border-neutral-700 bg-black hover:bg-white hover:text-black transition rounded"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a 
            href="https://www.linkedin.com/in/benard-kimutai-rotich/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 border border-neutral-700 bg-black hover:bg-white hover:text-black transition rounded"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* Hero Section with 3D Wireframe Canvas */}
      <section className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden border-b border-neutral-900">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />
        
        <div className="relative z-10 max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center space-x-2 border border-neutral-800 bg-neutral-900/50 px-3 py-1 rounded-full text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>AI Developer & Data Scientist</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
            Benard Kimutai Rotich
          </h1>
          
          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Building rigorous machine learning pipelines, 3D medical computer vision models, and large-scale predictive data frameworks in Nairobi, Kenya.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="https://github.com/benard-kimutaii" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center space-x-2 px-6 py-3 border border-white bg-black text-white hover:bg-white hover:text-black transition text-xs font-bold uppercase tracking-wider rounded"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </a>

            <a 
              href="https://www.linkedin.com/in/benard-kimutai-rotich/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center space-x-2 px-6 py-3 border border-neutral-700 bg-black text-white hover:bg-white hover:text-black transition text-xs font-bold uppercase tracking-wider rounded"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn Profile</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </a>

            <button 
              onClick={copyEmail}
              className="group inline-flex items-center space-x-2 px-6 py-3 border border-neutral-700 bg-black text-white hover:bg-white hover:text-black transition text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Email Copied!" : "Copy Email"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 max-w-5xl mx-auto border-b border-neutral-900">
        <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-8">// 01. About Me</h2>
        <div className="grid md:grid-cols-2 gap-12 text-neutral-300 text-sm leading-relaxed">
          <p>
            I am a Data Scientist and AI Systems Developer with a Bachelor of Science in Computer Science from Kabarak University. My work centers on engineering robust machine learning architectures, high-performance data processing pipelines, and scalable predictive models.
          </p>
          <p>
            From building 3D deep learning medical vision systems (NeuroScan AI) to epidemiological forecasting platforms (VectorWatch) and tax compliance models at the Kenya Revenue Authority, I leverage advanced Python frameworks, PyTorch, MONAI, and PostgreSQL with PostGIS to solve complex real-world challenges.
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 max-w-5xl mx-auto border-b border-neutral-900">
        <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-12">// 02. Professional Experience</h2>
        
        <div className="space-y-12">
          <div className="border-l border-neutral-800 pl-6 relative">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-white rounded-full"></div>
            <span className="text-xs text-neutral-500">Data Science Department</span>
            <h3 className="text-lg font-bold mt-1">Data Scientist @ Kenya Revenue Authority (KRA)</h3>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Engineered predictive data models for fraud detection and tax compliance, focusing on Missing Trader VAT models and property owner predictive risk engines within the BSTEM branch.
            </p>
          </div>

          <div className="border-l border-neutral-800 pl-6 relative">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-neutral-600 rounded-full"></div>
            <span className="text-xs text-neutral-500">Open Source Initiative</span>
            <h3 className="text-lg font-bold mt-1">Founder & Lead Developer @ NeuroScan AI</h3>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Developing an open-source 3D deep learning medical imaging framework using PyTorch, MONAI, 3D U-Net, and Swin UNETR architectures to automate brain tumor detection from volumetric MRI scans.
            </p>
          </div>

          <div className="border-l border-neutral-800 pl-6 relative">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-neutral-600 rounded-full"></div>
            <span className="text-xs text-neutral-500">Health Tech Surveillance</span>
            <h3 className="text-lg font-bold mt-1">Founder & Lead Developer @ VectorWatch</h3>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Building an AI-driven epidemiological surveillance platform that ingests multimodal field reports via WhatsApp webhooks to predict disease outbreaks across Sub-Saharan Africa.
            </p>
          </div>

          <div className="border-l border-neutral-800 pl-6 relative">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-neutral-600 rounded-full"></div>
            <span className="text-xs text-neutral-500">Leadership & Community</span>
            <h3 className="text-lg font-bold mt-1">Technical Lead @ Google Developer Groups On Campus — Kabarak</h3>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Organized technical workshops, developer bootcamps, and hackathons, concluding a successful leadership term in October 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 max-w-5xl mx-auto border-b border-neutral-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">// 03. Selected Work</h2>
            <h3 className="text-2xl font-bold">Featured Projects</h3>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            {["All", "Medical AI", "Surveillance", "Data Science"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs border rounded transition ${
                  activeTab === tab 
                    ? "bg-white text-black border-white font-bold" 
                    : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div key={idx} className="border border-neutral-800 bg-black p-6 flex flex-col justify-between rounded hover:border-neutral-600 transition group">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">{project.category}</span>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 border border-neutral-800 group-hover:border-white transition rounded"
                    aria-label="View Project on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                  </a>
                </div>
                <h4 className="text-lg font-bold mb-2">{project.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">{project.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-900">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-8">// 04. Get In Touch</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-4">Let's build something impactful.</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-8">
              Whether you want to discuss AI research in medical vision, data science infrastructure, or collaborative engineering initiatives, my inbox is always open.
            </p>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3 text-neutral-300">
                <Mail className="w-4 h-4 text-neutral-500" />
                <a href="mailto:benkim739@gmail.com" className="hover:text-white underline">benkim739@gmail.com</a>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <GithubIcon className="w-4 h-4 text-neutral-500" />
                <a href="https://github.com/benard-kimutaii" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">github.com/benard-kimutaii</a>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <LinkedinIcon className="w-4 h-4 text-neutral-500" />
                <a href="https://www.linkedin.com/in/benard-kimutai-rotich/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">linkedin.com/in/benard-kimutai-rotich</a>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:benkim739@gmail.com?subject=Inquiry from Portfolio&body=${encodeURIComponent(e.target.message.value)}`; }} className="border border-neutral-800 bg-black p-6 rounded space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Your Name</label>
              <input type="text" required className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition" placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Your Email</label>
              <input type="email" required className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition" placeholder="john@example.com" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Message</label>
              <textarea name="message" rows="4" required className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition" placeholder="Let's collaborate on..."></textarea>
            </div>

            <button type="submit" className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-200 transition flex items-center justify-center space-x-2">
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900 text-center text-xs text-neutral-600">
        <p>© {new Date().getFullYear()} Benard Kimutai Rotich. All rights reserved.</p>
      </footer>
    </div>
  );
}
