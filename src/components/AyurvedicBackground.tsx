import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Floating Leaves Component
const FloatingLeaves = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 50;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle rotation and floating motion
      ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(time * 0.15) * 0.1;
      
      // Mouse interaction - subtle movement towards cursor
      const mouseInfluence = 0.1;
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.current[0] * mouseInfluence, 0.02);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -mouse.current[1] * mouseInfluence, 0.02);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#4ade80"
        size={0.15}
        transparent
        opacity={0.6}
        alphaTest={0.01}
        sizeAttenuation
      />
    </points>
  );
};

// Pollen Particles Component
const PollenParticles = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 100;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Warm golden colors for pollen
      const color = new THREE.Color();
      color.setHSL(0.12 + Math.random() * 0.1, 0.8, 0.7);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle floating motion
      ref.current.position.y = Math.sin(time * 0.2) * 0.5;
      
      // Very subtle mouse interaction
      const mouseInfluence = 0.05;
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.current[0] * mouseInfluence, 0.01);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.4}
        alphaTest={0.01}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
};

// Herb Essence Waves Component
const HerbEssenceWaves = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle wave motion
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
      meshRef.current.position.y = Math.sin(time * 0.3) * 0.2;
      
      // Mouse interaction - gentle response
      const mouseInfluence = 0.03;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.current[1] * mouseInfluence,
        0.02
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.current[0] * mouseInfluence,
        0.02
      );
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <torusGeometry args={[8, 0.5, 16, 100]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </Float>
  );
};

// Main Scene Component
const AyurvedicScene = () => {
  const mouse = useRef<[number, number]>([0, 0]);
  const { viewport } = useThree();
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      ];
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Environment preset="dawn" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.2} color="#4ade80" />
      
      <FloatingLeaves mouse={mouse} />
      <PollenParticles mouse={mouse} />
      <HerbEssenceWaves mouse={mouse} />
    </>
  );
};

// Fallback component for mobile/low-performance devices
const StaticFallback = () => (
  <div className="absolute inset-0 opacity-30">
    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30" />
    <div className="absolute inset-0">
      {/* Animated CSS particles for fallback */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-green-400/60 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// Performance detection hook
const usePerformanceDetection = () => {
  const [shouldUse3D, setShouldUse3D] = useState(true);
  
  useEffect(() => {
    // Simple performance detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    const hasSlowConnection = (navigator as any).connection && (navigator as any).connection.effectiveType === 'slow-2g';
    
    if (isMobile || hasLowMemory || hasSlowConnection) {
      setShouldUse3D(false);
    }
  }, []);
  
  return shouldUse3D;
};

// Main Background Component
const AyurvedicBackground: React.FC = () => {
  const shouldUse3D = usePerformanceDetection();
  
  if (!shouldUse3D) {
    return <StaticFallback />;
  }
  
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ 
          antialias: false, 
          powerPreference: "low-power",
          alpha: true,
          premultipliedAlpha: false
        }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Auto-adjust quality
      >
        <AyurvedicScene />
      </Canvas>
    </div>
  );
};

export default AyurvedicBackground;