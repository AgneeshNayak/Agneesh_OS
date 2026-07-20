import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // In production, replace with actual frontend URL or keep '*' for open portfolio API
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
let dbConnected = false;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('>>> MongoDB Connected Successfully');
      dbConnected = true;
      seedProjects();
    })
    .catch(err => {
      console.error('>>> MongoDB Connection Error:', err.message);
      console.log('>>> Falling back to local in-memory store for projects.');
    });
} else {
  console.log('>>> MONGODB_URI not found in env. Falling back to local in-memory store.');
}

// Mongoose Schemas & Models
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: [String],
  features: [String],
  github: String,
  color: String,
  order: Number
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// Static Seed Data
const defaultProjects = [
  {
    title: 'CargoGo',
    description: 'On-demand cargo booking platform with real-time tracking, driver matching, and automated logistics management.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io'],
    features: ['Real-time cargo tracking', 'Driver-shipper matching', 'Automated pricing engine', 'Route optimization'],
    github: 'https://github.com/AgneeshNayak',
    color: '#00ff41',
    order: 1
  },
  {
    title: 'ArthaTantra',
    description: 'Multi-agent AI financial digital twin built at VoidHack 2026. Simulates financial scenarios using autonomous AI agents.',
    tech: ['Python', 'LangChain', 'React', 'FastAPI', 'OpenAI'],
    features: ['Multi-agent AI system', 'Financial scenario simulation', 'Real-time market analysis', 'Risk assessment engine'],
    github: 'https://github.com/AgneeshNayak',
    color: '#b400ff',
    order: 2
  },
  {
    title: 'Decentralized Task Manager',
    description: 'Blockchain-based task management system with smart contracts for task verification and decentralized collaboration.',
    tech: ['Solidity', 'React', 'Ethereum', 'Web3.js', 'IPFS'],
    features: ['Smart contract tasks', 'Decentralized verification', 'Token rewards', 'IPFS file storage'],
    github: 'https://github.com/AgneeshNayak',
    color: '#00d4ff',
    order: 3
  },
  {
    title: 'Placement Pro',
    description: 'Campus placement preparation platform with mock interviews, company-specific preparation, and performance analytics.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Chart.js'],
    features: ['Mock interview system', 'Company prep tracks', 'Performance analytics', 'Question bank with solutions'],
    github: 'https://github.com/AgneeshNayak',
    color: '#ff0080',
    order: 4
  },
  {
    title: 'Real-Time Disaster Alert System',
    description: 'IoT-integrated disaster monitoring system with real-time alerts, evacuation routing, and community reporting.',
    tech: ['React', 'Node.js', 'WebSocket', 'Google Maps API', 'IoT'],
    features: ['Real-time monitoring', 'Push notifications', 'Evacuation routing', 'Community reports'],
    github: 'https://github.com/AgneeshNayak',
    color: '#ff6b00',
    order: 5
  },
  {
    title: 'Smart Warehouse Management',
    description: 'Intelligent warehouse management system with inventory tracking, automated restocking, and analytics dashboard.',
    tech: ['React', 'Python', 'PostgreSQL', 'Docker', 'Redis'],
    features: ['Inventory tracking', 'Automated restocking', 'Analytics dashboard', 'Barcode/QR scanning'],
    github: 'https://github.com/AgneeshNayak',
    color: '#ffd700',
    order: 6
  }
];

// Seeding function
async function seedProjects() {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(defaultProjects);
      console.log('>>> Database seeded with default projects.');
    } else {
      console.log(`>>> Found ${count} projects in database. Skipping seed.`);
    }
  } catch (err) {
    console.error('>>> Error seeding projects:', err.message);
  }
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    uptime: process.uptime(),
    dbConnected,
    timestamp: new Date()
  });
});

// GET /api/projects
app.get('/api/projects', async (req, res) => {
  try {
    if (dbConnected) {
      const projects = await Project.find().sort({ order: 1 });
      return res.status(200).json(projects);
    } else {
      // In-memory fallback
      return res.status(200).json(defaultProjects);
    }
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    // Return default fallback on database fetch errors to keep frontend working
    return res.status(200).json(defaultProjects);
  }
});

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
  }

  try {
    if (dbConnected) {
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      console.log(`>>> Saved new message from: ${name} (${email})`);
    } else {
      console.log(`>>> Simulated message from: ${name} (${email}): ${message}`);
    }

    return res.status(201).json({
      success: true,
      message: 'Transmission successfully received by AgneeshOS relay server.'
    });
  } catch (err) {
    console.error('Error saving message:', err.message);
    return res.status(500).json({ error: 'Failed to process message transmission.' });
  }
});

// POST /api/assistant
app.post('/api/assistant', (req, res) => {
  const { query } = req.body;
  if (query) {
    console.log(`>>> AI assistant query: "${query}"`);
  }
  return res.status(200).json({ success: true, processed: true });
});

// Root Route
app.get('/', (req, res) => {
  res.send('AgneeshOS Mainframe Server Online.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`>>> Mainframe Server humming on port ${PORT}`);
});
