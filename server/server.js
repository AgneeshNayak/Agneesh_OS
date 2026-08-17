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
    title: 'Laptop Rental Management System',
    category: 'Full Stack',
    description: 'Full-stack rental & inventory management platform for tracking laptop allocations, customer reservations, rental durations, and automated billing invoices.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    features: ['Laptop inventory & allocation logs', 'Rental duration tracking & renewals', 'Automated billing & invoice generator', 'Customer reservation dashboard'],
    github: 'https://github.com/AgneeshNayak/laptop-rental-management-system',
    color: '#00ff41',
    order: 1
  },
  {
    title: 'FEFO Smart Warehouse Management',
    category: 'Backend / Systems',
    description: 'First-Expired-First-Out (FEFO) smart inventory management system for automated stock rotation, perishable batch tracking, and warehouse analytics.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'HTML5', 'CSS3', 'JavaScript'],
    features: ['FEFO batch priority algorithm', 'Perishable stock expiration alerts', 'Automated inventory restocking triggers', 'Warehouse stock analytics dashboard'],
    github: 'https://github.com/AgneeshNayak/warehouse',
    color: '#ffd700',
    order: 2
  },
  {
    title: 'CarGaragePro',
    category: 'Full Stack',
    description: 'Automobile garage management system for vehicle intake, digital job card creation, repair workflow tracking, and customer invoicing.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST API'],
    features: ['Digital job card management', 'Vehicle repair status history', 'Spare parts inventory logging', 'Automated billing & PDF invoices'],
    github: 'https://github.com/AgneeshNayak/CarGaragePro',
    color: '#00d4ff',
    order: 3
  },
  {
    title: 'PlacementPro',
    category: 'Full Stack',
    description: 'Comprehensive campus placement and recruitment portal connecting students, coordinators, and corporate recruiters with analytics and application tracking.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    features: ['Campus recruitment portal', 'Company application prep tracks', 'Student resume & skill profiling', 'Placement statistics dashboard'],
    github: 'https://github.com/AgneeshNayak/placementPro',
    color: '#ff0080',
    order: 4
  },
  {
    title: 'Real-Time Disaster Alert System',
    category: 'Real-Time Web',
    description: 'Emergency response and hazard monitoring platform delivering real-time calamity alerts, live danger zone mapping, and safety coordination.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Leaflet.js', 'OpenStreetMap API'],
    features: ['Real-time hazard notifications', 'Interactive live map markers', 'Community emergency broadcasts', 'Evacuation & shelter routes'],
    github: 'https://github.com/AgneeshNayak/hackthon',
    color: '#ff6b00',
    order: 5
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
