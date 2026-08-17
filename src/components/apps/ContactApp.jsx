import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { sendContactMessage } from '../../services/api';
import { MagneticButton } from '../MotionPrimitives';

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/AgneeshNayak', icon: '🐙', color: '#e0e0e0' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/AgneeshNayak', icon: '🔗', color: '#0077b5' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/Agneesh_A_Nayak/', icon: '📝', color: '#ffa116' },
  { name: 'Email', url: 'mailto:agneeshnayak88@gmail.com', icon: '📧', color: '#00ff41' },
];

const ContactApp = memo(function ContactApp() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const result = await sendContactMessage(form.name, form.email, form.message);
    if (result.success) {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } else {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6">
        <h2 className="font-display text-xl text-neon-green tracking-wider mb-1">// CONTACT</h2>
        <p className="text-xs font-mono text-gray-500">Establish communication link</p>
      </motion.div>

      {/* Social Links */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {socialLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
            style={{
              background: `${link.color}08`,
              border: `1px solid ${link.color}20`,
            }}
            whileHover={{ y: -3, boxShadow: `0 5px 20px ${link.color}20` }}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-xs font-mono" style={{ color: link.color }}>{link.name}</span>
          </motion.a>
        ))}
      </motion.div>

      {/* Contact Form */}
      <motion.form
        action="https://formspree.io/f/meajlykg"
        method="POST"
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <label className="block text-xs font-display text-neon-blue tracking-wider mb-2">IDENTIFIER</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-dark-bg/50 border border-dark-border focus:border-neon-green/50 text-white font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-display text-neon-blue tracking-wider mb-2">COMM CHANNEL</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full bg-dark-bg/50 border border-dark-border focus:border-neon-green/50 text-white font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-xs font-display text-neon-blue tracking-wider mb-2">TRANSMISSION</label>
          <textarea
            name="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={4}
            className="w-full bg-dark-bg/50 border border-dark-border focus:border-neon-green/50 text-white font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors resize-none"
            placeholder="Your message..."
          />
        </div>
        <MagneticButton className="w-full">
          <motion.button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 px-6 bg-neon-green/10 border border-neon-green/50 text-neon-green font-display tracking-wider rounded-lg hover:bg-neon-green/20 transition-all disabled:opacity-50 cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,255,65,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'sending' ? 'TRANSMITTING...' : status === 'success' ? '✓ TRANSMITTED' : status === 'error' ? '❌ FAILED' : 'SEND TRANSMISSION'}
          </motion.button>
        </MagneticButton>
      </motion.form>

      {/* Status message */}
      {status === 'success' && (
        <motion.div
          className="mt-4 p-4 rounded-xl text-center"
          style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-neon-green font-mono text-sm">Message transmitted successfully! 🚀</p>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          className="mt-4 p-4 rounded-xl text-center"
          style={{ background: 'rgba(255,0,64,0.05)', border: '1px solid rgba(255,0,64,0.2)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-neon-red font-mono text-sm">Relay offline. Transmission cached locally. ⚠️</p>
        </motion.div>
      )}
    </div>
  );
});

export default ContactApp;
