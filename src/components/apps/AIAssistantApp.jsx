import React, { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const rules = [
  { pattern: /who.*are.*you/i, response: "I am JARVIS, the AgneeshOS AI assistant. I'm here to help you navigate and learn about Agneesh." },
  { pattern: /hello|hi|hey/i, response: "Hello! How can I assist you today?" },
  { pattern: /skills/i, response: "Agneesh is skilled in React, Tailwind CSS, JavaScript, and Node.js. He also loves building futuristic interfaces." },
  { pattern: /projects/i, response: "You can check out the Projects app to see what Agneesh has been working on. This OS portfolio is one of them!" },
  { pattern: /education/i, response: "Agneesh has a strong background in computer science and constantly learns new technologies." },
  { pattern: /contact/i, response: "You can reach out via the Contact app, or send an email to the provided address." },
  { pattern: /hackathon/i, response: "Agneesh loves participating in hackathons to build cool stuff under pressure." },
  { pattern: /experience/i, response: "Agneesh has experience building web applications, UI/UX design, and AI integrations." },
  { pattern: /resume/i, response: "You can view the resume in the Terminal app or find a download link in the About section." },
  { pattern: /thanks|thank you/i, response: "You're welcome! Let me know if you need anything else." },
  { pattern: /bye|goodbye/i, response: "Goodbye! Have a great day!" }
];

const AIAssistantApp = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am JARVIS. How can I help you today?", sender: 'jarvis' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const delay = Math.floor(Math.random() * 800) + 600; // 600-1400ms

    setTimeout(() => {
      let matchedResponse = "I'm not sure about that. Try asking about skills, projects, or experience.";
      for (const rule of rules) {
        if (rule.pattern.test(userText)) {
          matchedResponse = rule.response;
          break;
        }
      }
      setMessages(prev => [...prev, { id: Date.now(), text: matchedResponse, sender: 'jarvis' }]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-gray-900 text-gray-200">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#00ff41] animate-pulse"></div>
          <span className="font-bold text-green-400">JARVIS Assistant</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-700 text-green-300 border border-green-500/30 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-green-300 border border-green-500/30 rounded-tl-none flex space-x-1">
              <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-gray-800 border-t border-gray-700 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
        />
        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition-colors font-semibold">
          Send
        </button>
      </form>
    </motion.div>
  );
};

export default memo(AIAssistantApp);
