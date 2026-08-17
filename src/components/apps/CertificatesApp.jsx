import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CertificatesSkeleton } from '../SkeletonLoader';
import { GlowCard } from '../MotionPrimitives';

const academicHonors = [
  {
    id: 'academic-topper-6th-sem',
    sem: 'Semester VI',
    title: '6th Semester Academic Topper (2025–26)',
    institution: 'Department of Computer Science & Engineering',
    college: 'Canara Engineering College (An Autonomous Institution)',
    cgpa: '9.44 CGPA',
    usn: 'USN: 4CB23CS009',
    name: 'Mr. AGNEESH A NAYAK',
    posterUrl: '/topper_poster.jpg',
    photos: [
      { id: 'p1', title: 'Department Poster', url: '/topper_poster.jpg', caption: 'Official 6th Sem Toppers Poster' }
    ],
    quote: '"Excellence deserves to be celebrated! Congratulations for outstanding academic performance. Your dedication, consistency and commitment to learning have truly paid off. Keep learning. Keep striving. Keep inspiring! 🚀"',
    badge: '🏆 9.44 CGPA • SEM VI TOPPER',
    color: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderColor: '#ffd700',
    icon: '🏆'
  },
  {
    id: 'academic-topper-3rd-sem',
    sem: 'Semester III',
    title: '3rd Semester Academic Topper (2024–25)',
    institution: 'Department of Computer Science & Engineering',
    college: 'Canara Engineering College (An Autonomous Institution)',
    cgpa: '9.0 SGPA',
    usn: 'USN: 4CB23CS009',
    name: 'Mr. AGNEESH A NAYAK',
    posterUrl: '/sem3_certificate.png',
    photos: [
      { id: 'sem3-cert', title: 'Official Certificate', url: '/sem3_certificate.png', caption: 'Signed Certificate of Achievement' },
      { id: 'sem3-felicitation', title: 'Felicitation Ceremony', url: '/sem3_felicitation.jpg', caption: 'Receiving certificate from Department Faculty' },
      { id: 'sem3-group', title: 'Achievers & Faculty', url: '/sem3_group.jpg', caption: 'Group photo of 9.0+ SGPA toppers with professors' }
    ],
    quote: '"This is to certify that Mr. AGNEESH A NAYAK of Computer Science & Engineering has been recognised as the Topper in the III semester for the year 2024-25 for scoring above 9 SGPA. We wish you luck for more milestones!"',
    badge: '🎖️ 9.0 SGPA • SEM III TOPPER',
    color: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderColor: '#00d4ff',
    icon: '📜'
  }
];

const certificates = [
  {
    id: 1,
    title: 'MongoDB Basics for Students',
    issuer: 'MongoDB',
    year: 'Jul 2026',
    color: 'from-emerald-500/20 to-green-500/10',
    icon: '🍃',
    credentialUrl: 'https://www.credly.com/badges/9b81805e-e8a0-49a7-add4-ebe483f13914'
  },
  {
    id: 2,
    title: 'JavaScript Programming Course - Self Paced',
    issuer: 'GeeksforGeeks',
    year: '2026',
    color: 'from-green-500/20 to-teal-500/10',
    icon: '💻',
    credentialUrl: 'https://media.geeksforgeeks.org/courses/certificates/3a608a2700249ec5869074262aaa59cf.pdf'
  },
  {
    id: 3,
    title: 'JavaScript (Basic)',
    issuer: 'HackerRank',
    year: 'Jul 2026',
    color: 'from-purple-500/20 to-pink-500/10',
    icon: '📜',
    credentialUrl: 'https://www.hackerrank.com/certificates/A95177019C11'
  },
];

const CertificatesApp = memo(() => {
  const [loading, setLoading] = useState(true);
  const [activePosterModal, setActivePosterModal] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto text-white space-y-6 font-mono select-none">
      <div>
        <h2 className="text-xl font-bold font-display text-neon-green tracking-wider">// ACADEMIC EXCELLENCE & CERTIFICATIONS</h2>
        <p className="text-xs text-gray-500">Official honors, departmental awards, and verified skill badges</p>
      </div>

      {/* Featured Academic Achievements Showcase with Photo Galleries */}
      {academicHonors.map((honor) => (
        <motion.div
          key={honor.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 sm:p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${honor.borderColor}12 0%, rgba(12, 12, 20, 0.95) 100%)`,
            border: `1px solid ${honor.borderColor}40`,
            boxShadow: `0 0 30px ${honor.borderColor}15`,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span 
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 font-mono"
                  style={{
                    color: honor.borderColor,
                    background: `${honor.borderColor}15`,
                    border: `1px solid ${honor.borderColor}40`,
                    boxShadow: `0 0 10px ${honor.borderColor}20`
                  }}
                >
                  <span>{honor.icon}</span>
                  <span>{honor.badge}</span>
                </span>
                <span className="text-xs text-neon-green bg-neon-green/10 border border-neon-green/30 px-2.5 py-1 rounded-full font-mono">
                  {honor.usn}
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg sm:text-2xl font-bold text-white tracking-wide">{honor.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-mono mt-1">{honor.institution} • {honor.college}</p>
              </div>

              <div 
                className="p-4 rounded-xl backdrop-blur-sm relative"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: `1px solid ${honor.borderColor}25`
                }}
              >
                <span className="text-3xl font-serif absolute top-1 left-2 opacity-30" style={{ color: honor.borderColor }}>“</span>
                <p className="text-xs sm:text-sm text-gray-200 italic font-body leading-relaxed pl-4">
                  {honor.quote}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-gray-500">Achiever: </span>
                  <span className="text-white font-bold">{honor.name}</span>
                </div>
                <button
                  onClick={() => setActivePosterModal({ url: honor.photos[0].url, title: honor.title, caption: honor.photos[0].caption })}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
                  style={{
                    color: honor.borderColor,
                    background: `${honor.borderColor}15`,
                    border: `1px solid ${honor.borderColor}40`,
                    boxShadow: `0 0 15px ${honor.borderColor}15`
                  }}
                >
                  <span>🔍 ENLARGE CERTIFICATE / PHOTO</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* Right Photo Gallery Preview Column */}
            <div className="lg:col-span-5 flex flex-col items-center gap-3">
              <motion.div
                onClick={() => setActivePosterModal({ url: honor.photos[0].url, title: honor.title, caption: honor.photos[0].caption })}
                className="relative group cursor-pointer rounded-xl overflow-hidden max-w-sm w-full shadow-2xl"
                style={{ border: `2px solid ${honor.borderColor}50` }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={honor.photos[0].url}
                  alt={honor.title}
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity flex flex-col justify-end p-3">
                  <span className="text-[11px] font-mono text-gray-300 font-bold mb-1">{honor.photos[0].title}</span>
                  <span 
                    className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md flex items-center gap-1.5 self-start"
                    style={{ color: honor.borderColor, border: `1px solid ${honor.borderColor}40` }}
                  >
                    <span>🔍</span>
                    <span>CLICK TO VIEW FULL RESOLUTION</span>
                  </span>
                </div>
              </motion.div>

              {/* Gallery Thumbnails (if multiple photos exist like 3rd Sem) */}
              {honor.photos.length > 1 && (
                <div className="flex items-center gap-2.5 w-full max-w-sm overflow-x-auto pb-1">
                  {honor.photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setActivePosterModal({ url: photo.url, title: `${honor.title} - ${photo.title}`, caption: photo.caption })}
                      className="relative rounded-lg overflow-hidden border hover:scale-105 transition-all shrink-0 w-20 h-14 cursor-pointer group"
                      style={{ border: `1px solid ${honor.borderColor}40` }}
                    >
                      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <span className="text-[8px] font-mono font-bold text-white bg-black/70 px-1 py-0.5 rounded truncate max-w-[70px]">
                          {photo.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Verified Skill Certifications */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-display text-neon-blue tracking-wider uppercase">// VERIFIED COURSE CERTIFICATES</h3>
        {loading ? (
          <CertificatesSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {certificates.map((cert) => (
              <GlowCard
                key={cert.id}
                accentColor="#00ff41"
                className="p-4 sm:p-5 group relative flex flex-col justify-between min-h-[170px] bg-dark-surface/80 border border-white/10 hover:border-neon-green/40 transition-all rounded-2xl"
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${cert.color} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="relative z-10 flex items-start gap-3.5 min-w-0 mb-3">
                  <div className="text-3xl sm:text-4xl shrink-0 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">{cert.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base leading-snug text-white group-hover:text-neon-green transition-colors">{cert.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{cert.issuer}</p>
                    <span className="text-[10px] text-neon-green font-bold mt-2 inline-block bg-neon-green/10 border border-neon-green/30 px-2.5 py-0.5 rounded-full font-mono">{cert.year}</span>
                  </div>
                </div>

                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider">OFFICIAL CREDENTIAL</span>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/[0.06] hover:bg-neon-green/20 border border-white/15 hover:border-neon-green/50 text-gray-200 hover:text-neon-green transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>VIEW</span>
                    <span>↗</span>
                  </a>
                </div>
              </GlowCard>
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Interactive Lightbox Modal for Certificates & Photos */}
      <AnimatePresence>
        {activePosterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePosterModal(null)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[92vh] bg-gray-950 border-2 border-neon-green/50 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,255,65,0.2)]"
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10 font-mono">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="text-neon-green">🏆</span>
                  <span className="text-xs font-bold text-white tracking-wider truncate">
                    {typeof activePosterModal === 'object' ? activePosterModal.title : 'CANARA ENGINEERING COLLEGE — ACADEMIC TOPPER CERTIFICATE'}
                  </span>
                </div>
                <button
                  onClick={() => setActivePosterModal(null)}
                  className="px-2.5 py-1 rounded text-xs font-mono text-gray-400 hover:text-white bg-white/10 hover:bg-red-500/40 transition-all cursor-pointer shrink-0"
                >
                  [× CLOSE]
                </button>
              </div>

              {/* Poster / Photo Content */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/90">
                <img
                  src={typeof activePosterModal === 'object' ? activePosterModal.url : activePosterModal}
                  alt="Canara Engineering College Academic Certificate High Resolution"
                  className="max-w-full max-h-[72vh] object-contain rounded-lg border border-white/15 shadow-2xl"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-black/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-gray-400">
                <span className="text-gray-300 font-mono">
                  {typeof activePosterModal === 'object' ? (activePosterModal.caption || 'Mr. Agneesh A Nayak • USN: 4CB23CS009') : 'Mr. Agneesh A Nayak • USN: 4CB23CS009'}
                </span>
                <a
                  href={typeof activePosterModal === 'object' ? activePosterModal.url : activePosterModal}
                  download="Agneesh_Nayak_Academic_Certificate.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-neon-green bg-neon-green/10 border border-neon-green/30 hover:bg-neon-green/20 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>📥 DOWNLOAD ORIGINAL PHOTO</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default CertificatesApp;
