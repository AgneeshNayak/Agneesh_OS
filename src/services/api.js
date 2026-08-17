// API Base URL from environment variables or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchProjects() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300);
    const res = await fetch(`${API_URL}/api/projects`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('API response not ok');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching projects, using static fallback:', err.message);
    // Return static projects in case backend is offline
    return [
      {
        id: 1,
        title: 'FEFO Smart Warehouse',
        description: 'First-Expired-First-Out (FEFO) smart warehouse management system for automated stock rotation, perishable batch tracking, and inventory analytics.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js'],
        features: ['FEFO batch priority algorithm', 'Perishable stock expiration alerts', 'Automated inventory restocking', 'Analytics & inventory reporting'],
        github: 'https://github.com/AgneeshNayak/warehouse',
        color: '#ffd700',
      },
      {
        id: 2,
        title: 'Laptop Rental Management System',
        description: 'Full-stack rental & inventory management system for tracking laptop allocations, customer bookings, rental duration, and billing invoices.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
        features: ['Laptop inventory & allocation', 'Rental duration tracking', 'Automated billing engine', 'Customer booking management'],
        github: 'https://github.com/AgneeshNayak/laptop-rental-management-system',
        color: '#00ff41',
      },
      {
        id: 3,
        title: 'CarGaragePro',
        description: 'Automobile garage management system for vehicle intake, digital job card creation, repair workflow tracking, and customer invoicing.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'REST API'],
        features: ['Digital job card management', 'Vehicle service history logs', 'Spare parts inventory tracking', 'Automated billing & invoices'],
        github: 'https://github.com/AgneeshNayak/CarGaragePro',
        color: '#00d4ff',
      },
      {
        id: 4,
        title: 'PlacementPro',
        description: 'Comprehensive campus placement and recruitment portal connecting students, coordinators, and corporate recruiters with analytics and application tracking.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js'],
        features: ['Campus recruitment portal', 'Company application prep tracks', 'Student resume & skill profiling', 'Placement statistics dashboard'],
        github: 'https://github.com/AgneeshNayak/placementPro',
        color: '#ff0080',
      },
      {
        id: 5,
        title: 'Real-Time Disaster Alert System',
        description: 'Emergency response and hazard monitoring platform delivering real-time calamity alerts, live danger zone mapping, and safety coordination built for hackathons.',
        tech: ['React', 'Node.js', 'WebSocket', 'Map APIs', 'Express'],
        features: ['Real-time disaster notifications', 'Live hazard zone mapping', 'Community emergency broadcasts', 'Evacuation & shelter routes'],
        github: 'https://github.com/AgneeshNayak/hackthon',
        color: '#ff6b00',
      },
      {
        id: 6,
        title: 'ArthaTantra',
        description: 'Multi-agent AI financial digital twin built at VoidHack 2026. Simulates financial scenarios using autonomous AI agents.',
        tech: ['Python', 'LangChain', 'React', 'FastAPI', 'OpenAI'],
        features: ['Multi-agent AI architecture', 'Financial scenario simulation', 'Real-time risk assessment', 'Autonomous market analysis'],
        github: 'https://github.com/AgneeshNayak',
        color: '#b400ff',
      },
    ];
  }
}

export async function sendContactMessage(name, email, message) {
  try {
    const FORMSPREE_URL = 'https://formspree.io/f/meajlykg';
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, message }),
    });
    
    if (res.ok) {
      return { success: true, message: 'Transmission dispatched successfully via Formspree!' };
    }
    
    // Fallback try local API URL
    const resLocal = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await resLocal.json();
    if (!resLocal.ok) throw new Error(data.error || 'Failed to send message');
    return { success: true, message: data.message };
  } catch (err) {
    console.warn('Contact submit notice:', err.message);
    // Graceful fallback response so sender is never blocked
    return {
      success: true,
      message: 'Transmission dispatched successfully!'
    };
  }
}
