import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProjects } from '../../services/api';
import { ProjectSkeleton } from '../SkeletonLoader';

const ProjectCard = memo(function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -20,
    });
  };

  const accent = project.color || '#00ff41';

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between h-full group"
      style={{
        background: 'rgba(14, 14, 22, 0.85)',
        border: `1px solid ${isHovered ? accent + '60' : 'rgba(255,255,255,0.08)'}`,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: isHovered ? mousePos.y : 0,
        rotateY: isHovered ? mousePos.x : 0,
        scale: isHovered ? 1.015 : 1,
        boxShadow: isHovered
          ? `0 0 35px ${accent}25, 0 10px 40px rgba(0,0,0,0.5)`
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      layout
    >
      {/* Holographic shimmer effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `linear-gradient(${135 + mousePos.x * 5}deg, transparent 20%, ${accent}12 50%, transparent 80%)`,
          }}
        />
      )}

      {/* Top accent gradient bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 relative z-10 space-y-4">
        <div>
          {/* Category Pill & Github Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span 
              className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{
                color: accent,
                background: `${accent}15`,
                border: `1px solid ${accent}30`,
              }}
            >
              {project.category || 'Web Application'}
            </span>
            
            <a
              href={project.github || 'https://github.com/AgneeshNayak'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white/[0.05] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>

          {/* Title */}
          <h3 className="font-display text-base sm:text-xl font-bold tracking-wide group-hover:text-white transition-colors" style={{ color: accent }}>
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-xs sm:text-sm font-body leading-relaxed mt-2">{project.description}</p>
        </div>

        {/* Features Bullet List */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          {(project.features || []).map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-mono">
              <span style={{ color: accent }} className="shrink-0 mt-0.5">▸</span>
              <span className="text-gray-400 font-mono text-[11px] leading-tight">{f}</span>
            </div>
          ))}
        </div>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {(project.tech || []).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold"
              style={{
                background: `${accent}12`,
                color: accent,
                border: `1px solid ${accent}25`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer CTA Button */}
        <div className="pt-2">
          <a
            href={project.github || 'https://github.com/AgneeshNayak'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            style={{
              color: accent,
              background: `${accent}10`,
              border: `1px solid ${accent}30`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span>🚀 VISIT REPOSITORY</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
});

const ProjectsApp = memo(function ProjectsApp() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      const data = await fetchProjects();
      setProjectList(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = ['ALL', 'Full Stack', 'Backend / Systems', 'Real-Time Web'];

  const filteredProjects = useMemo(() => {
    return projectList.filter((proj) => {
      const matchesCategory = activeCategory === 'ALL' || proj.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.tech || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projectList, activeCategory, searchQuery]);

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto font-mono text-white select-none space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-neon-green tracking-wider mb-1">// PROJECT SHOWCASE</h2>
          <p className="text-xs text-gray-500 font-mono">Production repositories, full-stack systems, and web projects</p>
        </div>
        {!loading && (
          <span className="text-[10px] text-neon-green/80 font-mono bg-neon-green/10 border border-neon-green/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
            ● 5 REPOSITORIES SYNCED
          </span>
        )}
      </motion.div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                activeCategory === cat
                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/50 shadow-[0_0_12px_rgba(0,255,65,0.2)]'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech or project..."
            className="w-full bg-dark-bg/60 border border-white/10 focus:border-neon-green/50 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-600 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1.5 text-xs text-gray-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-1 lg:col-span-2 text-center py-12 border border-white/10 border-dashed rounded-2xl bg-black/30 p-6"
              >
                <span className="text-3xl block mb-2">🔍</span>
                <p className="text-xs font-mono text-gray-400">No projects found matching search query or category.</p>
                <button
                  onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); }}
                  className="mt-3 text-xs text-neon-green hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </motion.div>
            ) : (
              filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id || project.title || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});

export default ProjectsApp;
