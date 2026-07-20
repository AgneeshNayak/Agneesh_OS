import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../contexts/AchievementContext';

export default function RecruiterDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { unlockAchievement } = useAchievements();

  // Bind Ctrl+H shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsOpen(prev => {
          const next = !prev;
          if (next) unlockAchievement('DASHBOARD_ACTIVATE');
          return next;
        });
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, unlockAchievement]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadResume = () => {
    unlockAchievement('RECRUIT_ACQUIRED');
    const link = document.createElement('a');
    link.href = '#'; // In production: '/resume.pdf'
    link.download = 'Agneesh_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] bg-white text-black overflow-y-auto recruiter-print-wrapper select-text">
          {/* Printable Layout CSS overrides */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .recruiter-print-wrapper, .recruiter-print-wrapper * {
                visibility: visible;
              }
              .recruiter-print-wrapper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
                color: black !important;
                box-shadow: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <div className="max-w-4xl mx-auto p-8 md:p-12 relative min-h-screen flex flex-col justify-between">
            {/* Header controls (no-print) */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-200 no-print mb-8">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">// Recruiter Dashboard (Print-Friendly One-Pager)</span>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 border border-gray-300 hover:border-gray-900 rounded font-mono text-xs transition-colors cursor-pointer"
                >
                  Print Profile
                </button>
                <button
                  onClick={handleDownloadResume}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded font-mono text-xs transition-colors cursor-pointer"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-black font-mono text-xs cursor-pointer"
                >
                  Exit [ESC]
                </button>
              </div>
            </div>

            {/* Resume Main Body */}
            <div>
              {/* Profile details */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-8 border-b border-gray-900">
                <div>
                  <h1 className="text-4xl font-sans font-bold tracking-tight text-gray-900">AGNEESH</h1>
                  <p className="text-lg font-mono text-gray-700 font-semibold mt-1">Software Development Engineer (SDE) Intern</p>
                  <p className="text-sm font-mono text-gray-500 mt-0.5">Expected Graduation: June 2027 • Canara Engineering College, Mangalore</p>
                </div>
                <div className="text-left md:text-right font-mono text-xs space-y-1 text-gray-600">
                  <p>Email: <a href="mailto:agneeshnayak88@gmail.com" className="underline">agneeshnayak88@gmail.com</a></p>
                  <p>LinkedIn: <a href="https://linkedin.com/in/AgneeshNayak" target="_blank" rel="noopener noreferrer" className="underline">linkedin.com/in/AgneeshNayak</a></p>
                  <p>GitHub: <a href="https://github.com/AgneeshNayak" target="_blank" rel="noopener noreferrer" className="underline">github.com/AgneeshNayak</a></p>
                  <p>LeetCode: <a href="https://leetcode.com/u/Agneesh_A_Nayak/" target="_blank" rel="noopener noreferrer" className="underline">leetcode.com/u/Agneesh_A_Nayak</a></p>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                
                {/* Left col: Skills, Links, Certifications */}
                <div className="space-y-6 md:border-r md:border-gray-200 md:pr-8">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-3">// Core Stacks</h3>
                    <ul className="space-y-1 text-sm font-sans font-medium text-gray-700">
                      <li>• JavaScript (ES6+), TypeScript</li>
                      <li>• React / Next.js / Vite</li>
                      <li>• Node.js / Express.js / REST APIs</li>
                      <li>• MongoDB / PostgreSQL / Redis</li>
                      <li>• Python / FastAPI / LangChain</li>
                      <li>• Solidity / Smart Contracts</li>
                      <li>• Docker / Git / CI/CD pipelines</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-3">// Certificates</h3>
                    <ul className="space-y-2 text-xs font-mono text-gray-600">
                      <li>
                        <strong className="text-gray-800 block">Google Cloud Associate SDE</strong>
                        Credential: GCP-839210
                      </li>
                      <li>
                        <strong className="text-gray-800 block">Full Stack Developer - Meta</strong>
                        Coursera Professional Cert
                      </li>
                      <li>
                        <strong className="text-gray-800 block">Blockchain Developer Nanodegree</strong>
                        Udacity Blockchain Foundations
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-3">// Contact Relay</h3>
                    <p className="text-xs text-gray-600 leading-normal font-sans">
                      Interested in interviewing or partnering on internships?
                    </p>
                    <a
                      href="mailto:agneeshnayak88@gmail.com?subject=SDE%20Internship%20Inquiry"
                      className="mt-3 block text-center py-2 border border-black hover:bg-black hover:text-white rounded text-xs font-mono transition-all no-print"
                    >
                      Schedule / Email Me
                    </a>
                  </div>
                </div>

                {/* Right col: Projects & Accomplishments (Spans 2 cols) */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-3">// Flagship Projects</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">CargoGo — On-Demand Logistics Platform</h4>
                        <p className="text-xs font-mono text-gray-500 mb-1">React, Node.js, Express, Socket.io, MongoDB</p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Developed an on-demand freight matching dashboard featuring real-time location tracking, route optimizations, and automated shipper pricing matrices, boosting logistics efficiency.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-gray-900">ArthaTantra — Multi-Agent Financial Twin</h4>
                        <p className="text-xs font-mono text-gray-500 mb-1">Python, FastAPI, LangChain, React, OpenAI API</p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Awarded first place at VoidHack 2026. Built interactive financial twin simulators using autonomous AI agent chains simulating personal cash-flow projections and investment risk tolerances.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-gray-900">Decentralized Task Manager</h4>
                        <p className="text-xs font-mono text-gray-500 mb-1">Solidity, Ethereum, Web3.js, React, IPFS</p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Engineered blockchain tasks collaboration suite using custom gas-optimized Solidity smart contracts for task assignments, approvals, and token-based rewards verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mb-3">// Achievements</h3>
                    <ul className="list-disc pl-4 text-xs font-sans text-gray-700 space-y-1.5">
                      <li>First Place Winner at VoidHack 2026 Hackathon (out of 120+ SDE teams).</li>
                      <li>Maintained 9.2 CGPA at Canara Engineering College throughout core CS curriculum.</li>
                      <li>Open-source contributor to major React/web utility tooling repositories.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-400 mt-8">
              <span>Agneesh SDE Portfolio</span>
              <span>Generated live in browser</span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
