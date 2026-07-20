import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useSettings } from '../contexts/SettingsContext';

function CameraController() {
  useFrame((state) => {
    // Parallax camera movement drift from mouse pointer coords (-1 to +1)
    const targetX = state.pointer.x * 0.25;
    const targetY = state.pointer.y * 0.25;
    
    // Smooth interpolative ease
    state.camera.position.x += (targetX - state.camera.position.x) * 0.08;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.08;
    state.camera.lookAt(0, 0, -2);
  });
  return null;
}

function StarField(props) {
  const ref = useRef();
  
  // Generate random points in a sphere natively
  const sphere = useMemo(() => {
    const pts = new Float32Array(2000);
    for (let i = 0; i < 2000; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.0 + Math.cbrt(Math.random()) * 2.0;
      pts[i] = r * Math.sin(phi) * Math.cos(theta);
      pts[i+1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i+2] = r * Math.cos(phi) - 2; // shift deep
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 25;
      ref.current.rotation.y -= delta / 35;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
      <PointMaterial
        transparent
        color={props.color || "#00ff41"}
        size={0.006}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function EarthGlobe({ color }) {
  const globeRef = useRef();

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08;
      globeRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <mesh ref={globeRef} position={[0, 0, -2]}>
      <sphereGeometry args={[0.9, 18, 18]} />
      <meshBasicMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.08} 
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbitingSatellite({ radius, speed, inclination, color }) {
  const satelliteRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed;
    if (satelliteRef.current) {
      // Calculate circular coordinates relative to Earth globe position
      const x = radius * Math.cos(time);
      const y = radius * Math.sin(time) * Math.sin(inclination);
      const z = -2 + radius * Math.sin(time) * Math.cos(inclination);
      satelliteRef.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={satelliteRef}>
      <boxGeometry args={[0.04, 0.04, 0.04]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function CyberGrid({ color }) {
  const gridRef = useRef();

  useFrame((state, delta) => {
    if (gridRef.current) {
      gridRef.current.rotation.z += delta / 30;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 24, color, color]}
      position={[0, -2, -5]}
      rotation={[Math.PI / 2.3, 0, 0]}
      opacity={0.05}
      transparent
    />
  );
}

export default function ThreeBackground() {
  const { settings, getAccentColor } = useSettings();

  // If performance mode is enabled or particles/animations are off, fallback to solid CSS
  if (settings.performanceMode || !settings.particlesEnabled || !settings.animationsEnabled) {
    return (
      <div 
        className="absolute inset-0 bg-dark-bg"
        style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0c14 100%)'
        }}
      />
    );
  }

  const accentColor = getAccentColor();

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#0a0a0f']} />
        
        {/* Mouse parallax controller */}
        <CameraController />
        
        <ambientLight intensity={0.6} />
        
        {/* Main 3D Space Elements */}
        <StarField color={accentColor} />
        <EarthGlobe color={accentColor} />
        
        {/* Satellite orbits */}
        <OrbitingSatellite radius={1.4} speed={0.4} inclination={Math.PI / 6} color={accentColor} />
        <OrbitingSatellite radius={1.7} speed={0.25} inclination={-Math.PI / 4} color={accentColor} />
        
        <CyberGrid color={accentColor} />
      </Canvas>
    </div>
  );
}
