import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(18, 18, 26, 0.6)',
        border: `1px solid ${isHovered ? (project.color || '#00ff41') + '50' : 'rgba(42,42,62,0.5)'}`,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: isHovered ? mousePos.y : 0,
        rotateY: isHovered ? mousePos.x : 0,
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered
          ? `0 0 30px ${project.color || '#00ff41'}20, 0 10px 40px rgba(0,0,0,0.3)`
          : '0 2px 10px rgba(0,0,0,0.2)',
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
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${135 + mousePos.x * 5}deg, transparent 30%, ${(project.color || '#00ff41')}08 50%, transparent 70%)`,
          }}
        />
      )}

      {/* Top accent line */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${project.color || '#00ff41'}, transparent)` }} />

      <div className="p-5">
        {/* Title */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display text-lg tracking-wider" style={{ color: project.color || '#00ff41' }}>
            {project.title}
          </h3>
          <a
            href={project.github || 'https://github.com/AgneeshNayak'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white text-xs font-mono transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            [GitHub]
          </a>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm font-body leading-relaxed mb-4">{project.description}</p>

        {/* Features */}
        <div className="space-y-1.5 mb-4">
          {(project.features || []).map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono">
              <span style={{ color: project.color || '#00ff41' }}>▸</span>
              <span className="text-gray-400">{f}</span>
            </div>
          ))}
        </div>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5">
          {(project.tech || []).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-[10px] font-mono"
              style={{
                background: `${(project.color || '#00ff41')}10`,
                color: project.color || '#00ff41',
                border: `1px solid ${(project.color || '#00ff41')}20`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

const ProjectsApp = memo(function ProjectsApp() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchProjects();
      setProjectList(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6 flex justify-between items-end"
      >
        <div>
          <h2 className="font-display text-xl text-neon-green tracking-wider mb-1">// PROJECTS</h2>
          <p className="text-xs font-mono text-gray-500">Hover over cards for holographic effect</p>
        </div>
        {!loading && (
          <span className="text-[10px] font-mono text-neon-green/60">
            ● DB SYNCED
          </span>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projectList.length === 0 ? (
            <div className="col-span-2 text-center py-12 border border-dark-border border-dashed rounded-xl glass bg-black/25">
              <span className="text-3xl block mb-2">📂</span>
              <p className="text-xs font-mono text-gray-500">No project database entries matched query parameters.</p>
            </div>
          ) : (
            projectList.map((project, i) => (
              <motion.div
                key={project.id || project._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
});

export default ProjectsApp;
