import { memo } from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Full Stack Developer',
    type: 'Project-Based',
    period: '2024 - Present',
    description: 'Building end-to-end web applications with React, Node.js, and MongoDB. Focused on scalable architectures and modern UI/UX.',
    highlights: ['Built 6+ production-ready projects', 'Implemented real-time features with WebSocket', 'Designed RESTful APIs'],
    color: '#00ff41',
  },
  {
    role: 'Hackathon Participant',
    type: 'VoidHack 2026 & Others',
    period: '2025 - 2026',
    description: 'Competed in multiple hackathons, building innovative solutions under time constraints. Created ArthaTantra at VoidHack 2026.',
    highlights: ['Multi-agent AI systems', 'Rapid prototyping', 'Team collaboration'],
    color: '#b400ff',
  },
  {
    role: 'Open Source Contributor',
    type: 'Community',
    period: '2024 - Present',
    description: 'Contributing to open source projects and building tools for the developer community.',
    highlights: ['GitHub contributions', 'Code reviews', 'Documentation'],
    color: '#00d4ff',
  },
];

const ExperienceApp = memo(function ExperienceApp() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="font-display text-xl text-neon-green tracking-wider mb-1">// EXPERIENCE</h2>
        <p className="text-xs font-mono text-gray-500">Professional journey & contributions</p>
      </motion.div>

      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.role}
            className="rounded-xl p-5"
            style={{
              background: `${exp.color}05`,
              border: `1px solid ${exp.color}15`,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-display text-base tracking-wider" style={{ color: exp.color }}>{exp.role}</h3>
                <p className="text-xs font-mono text-gray-500">{exp.type}</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded" style={{ color: exp.color, background: `${exp.color}10` }}>
                {exp.period}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-body mb-3">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.highlights.map((h) => (
                <span key={h} className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ color: exp.color, border: `1px solid ${exp.color}20` }}>
                  ▸ {h}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default ExperienceApp;
