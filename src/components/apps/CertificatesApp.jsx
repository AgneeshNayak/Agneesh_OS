import React, { memo } from 'react';
import { motion } from 'framer-motion';

const certificates = [
  { id: 1, title: 'Full Stack Web Dev', issuer: 'Online Course', year: '2024', color: 'from-blue-500/20 to-cyan-500/10', icon: '🌐' },
  { id: 2, title: 'React.js Advanced', issuer: 'Udemy', year: '2024', color: 'from-cyan-500/20 to-blue-500/10', icon: '⚛️' },
  { id: 3, title: 'DSA', issuer: 'GeeksforGeeks', year: '2024', color: 'from-green-500/20 to-emerald-500/10', icon: '🌳' },
  { id: 4, title: 'Python Data Science', issuer: 'Coursera', year: '2025', color: 'from-yellow-500/20 to-orange-500/10', icon: '🐍' },
  { id: 5, title: 'Cloud Computing', issuer: 'AWS Training', year: '2025', color: 'from-orange-500/20 to-red-500/10', icon: '☁️' },
  { id: 6, title: 'VoidHack 2026 Participant', issuer: 'VoidHack', year: '2026', color: 'from-purple-500/20 to-pink-500/10', icon: '👾' },
];

const CertificatesApp = memo(() => {
  return (
    <div className="p-4 h-full overflow-y-auto text-white space-y-4">
      <h2 className="text-xl font-bold mb-4 font-mono">Certifications & Awards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-700/50 p-4 group"
          >
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${cert.color} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="text-4xl">{cert.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{cert.title}</h3>
                <p className="text-sm text-gray-400">{cert.issuer}</p>
                <span className="text-xs text-gray-500 mt-1 inline-block bg-gray-800 px-2 py-0.5 rounded">{cert.year}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default CertificatesApp;
