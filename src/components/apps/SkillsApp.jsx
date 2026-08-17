import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { SkillsSkeleton } from '../SkeletonLoader';

const skillCategories = [
  {
    name: 'Frontend',
    color: '#00ff41',
    icon: '🎨',
    skills: ['React.js', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'Tailwind CSS', 'TypeScript', 'Next.js', 'Framer Motion']
  },
  {
    name: 'Backend',
    color: '#00d4ff',
    icon: '⚙️',
    skills: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'REST APIs', 'GraphQL', 'WebSockets']
  },
  {
    name: 'Database',
    color: '#b400ff',
    icon: '🗄️',
    skills: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase']
  },
  {
    name: 'Tools & DevOps',
    color: '#ff6b00',
    icon: '🛠️',
    skills: ['Git / GitHub', 'Docker', 'VS Code', 'Linux / Bash', 'Postman', 'CI/CD Pipelines']
  },
  {
    name: 'Cloud & AI',
    color: '#ff0080',
    icon: '☁️',
    skills: ['AWS', 'Vercel', 'OpenAI API', 'LangChain', 'Multi-Agent AI']
  },
];

const radarData = [
  { subject: 'Frontend', A: 90 },
  { subject: 'Backend', A: 85 },
  { subject: 'Database', A: 80 },
  { subject: 'DevOps', A: 75 },
  { subject: 'AI/ML', A: 75 },
  { subject: 'Mobile', A: 65 },
];

const SkillTag = memo(function SkillTag({ name, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all duration-200 group cursor-pointer"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}25`,
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 0 15px ${color}25`,
        borderColor: `${color}60`
      }}
    >
      <span style={{ color }}>▸</span>
      <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">{name}</span>
    </motion.div>
  );
});

const SkillsApp = memo(function SkillsApp() {
  const [openCategories, setOpenCategories] = useState({
    Frontend: true,
    Backend: true,
    Database: true,
    'Tools & DevOps': true,
    'Cloud & AI': true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  const toggleCategory = (name) => {
    setOpenCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6">
        <h2 className="font-display text-xl text-neon-green tracking-wider mb-1">// SKILL MATRIX</h2>
        <p className="text-xs font-mono text-gray-500">Core technical stack & competencies</p>
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          <SkillsSkeleton />
          <SkillsSkeleton />
        </div>
      ) : (
        <>
          {/* Competency Radar Chart */}
          <motion.div
            className="mb-6 p-2 sm:p-4 rounded-xl"
            style={{ background: 'rgba(0,255,65,0.02)', border: '1px solid rgba(0,255,65,0.1)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xs font-display text-neon-blue tracking-wider mb-2">COMPETENCY RADAR</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,255,65,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
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
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${cat.color}20` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + ci * 0.08 }}
              >
                <button
                  className="w-full flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => toggleCategory(cat.name)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-display text-sm tracking-wider font-semibold" style={{ color: cat.color }}>{cat.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">({cat.skills.length} skills)</span>
                  </div>
                  <motion.span
                    className="text-gray-500 text-sm"
                    animate={{ rotate: openCategories[cat.name] ? 180 : 0 }}
                  >
                    ▾
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openCategories[cat.name] ? 'auto' : 0,
                    opacity: openCategories[cat.name] ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-3.5 pb-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {cat.skills.map((skillName, si) => (
                      <SkillTag
                        key={skillName}
                        name={skillName}
                        color={cat.color}
                        delay={0.03 * si}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export default SkillsApp;
