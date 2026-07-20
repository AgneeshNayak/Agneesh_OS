import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const skillCategories = [
  {
    name: 'Frontend',
    color: '#00ff41',
    icon: '🎨',
    skills: [
      { name: 'React', level: 90 },
      { name: 'JavaScript', level: 88 },
      { name: 'HTML/CSS', level: 92 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'Next.js', level: 70 },
    ]
  },
  {
    name: 'Backend',
    color: '#00d4ff',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 82 },
      { name: 'Python', level: 80 },
      { name: 'FastAPI', level: 70 },
      { name: 'REST APIs', level: 88 },
      { name: 'GraphQL', level: 65 },
    ]
  },
  {
    name: 'Database',
    color: '#b400ff',
    icon: '🗄️',
    skills: [
      { name: 'MongoDB', level: 82 },
      { name: 'PostgreSQL', level: 75 },
      { name: 'Redis', level: 65 },
      { name: 'Firebase', level: 70 },
    ]
  },
  {
    name: 'Tools & DevOps',
    color: '#ff6b00',
    icon: '🛠️',
    skills: [
      { name: 'Git/GitHub', level: 90 },
      { name: 'Docker', level: 70 },
      { name: 'VS Code', level: 92 },
      { name: 'Linux', level: 75 },
      { name: 'Postman', level: 85 },
    ]
  },
  {
    name: 'Cloud & AI',
    color: '#ff0080',
    icon: '☁️',
    skills: [
      { name: 'AWS', level: 60 },
      { name: 'Vercel', level: 85 },
      { name: 'OpenAI API', level: 75 },
      { name: 'LangChain', level: 65 },
    ]
  },
];

const radarData = [
  { subject: 'Frontend', A: 88 },
  { subject: 'Backend', A: 80 },
  { subject: 'Database', A: 73 },
  { subject: 'DevOps', A: 72 },
  { subject: 'AI/ML', A: 68 },
  { subject: 'Mobile', A: 55 },
];

const SkillBar = memo(function SkillBar({ name, level, color, delay }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-mono text-gray-300">{name}</span>
        <span className="font-mono" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
});

const SkillsApp = memo(function SkillsApp() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="font-display text-xl text-neon-green tracking-wider mb-1">// SKILL MATRIX</h2>
        <p className="text-xs font-mono text-gray-500">Technical proficiency overview</p>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        className="mb-6 p-4 rounded-xl"
        style={{ background: 'rgba(0,255,65,0.02)', border: '1px solid rgba(0,255,65,0.1)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xs font-display text-neon-blue tracking-wider mb-3">COMPETENCY RADAR</h3>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(0,255,65,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <Radar
              dataKey="A"
              stroke="#00ff41"
              fill="#00ff41"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Skill Categories */}
      <div className="space-y-4">
        {skillCategories.map((cat, ci) => (
          <motion.div
            key={cat.name}
            className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${cat.color}15` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + ci * 0.1 }}
          >
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon}</span>
                <span className="font-display text-sm tracking-wider" style={{ color: cat.color }}>{cat.name}</span>
                <span className="text-[10px] font-mono text-gray-600">{cat.skills.length} skills</span>
              </div>
              <motion.span
                className="text-gray-500 text-sm"
                animate={{ rotate: activeCategory === cat.name ? 180 : 0 }}
              >
                ▾
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{
                height: activeCategory === cat.name ? 'auto' : 0,
                opacity: activeCategory === cat.name ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                {cat.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={cat.color}
                    delay={0.1 * si}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default SkillsApp;
