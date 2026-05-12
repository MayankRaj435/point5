import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Environment, Float, MeshTransmissionMaterial, Preload } from '@react-three/drei';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Inner 3D scene — receives "activated" boolean from the DOM wrapper */
/* ------------------------------------------------------------------ */

const SphereWithRings = ({ activated }: { activated: boolean }) => {
  const ringsRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Track animation progress  (0 → idle,  0→1 → burst phase,  1→2 → reform phase)
  const progress = useRef(0);
  const wasActivated = useRef(false);
  const burstStart = useRef(0);

  // Store original ring rotations for reforming
  const ringOriginals = useRef([
    new THREE.Euler(Math.PI / 3, 0, 0),
    new THREE.Euler(-Math.PI / 4, Math.PI / 6, 0),
    new THREE.Euler(0, Math.PI / 2, Math.PI / 6),
  ]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    /* ---- Detect activation edge ---- */
    if (activated && !wasActivated.current) {
      wasActivated.current = true;
      burstStart.current = t;
      progress.current = 0;
    }

    const burstDuration = 1.2;   // seconds for the burst
    const reformDuration = 1.5;  // seconds to reform

    if (wasActivated.current) {
      const elapsed = t - burstStart.current;

      if (elapsed < burstDuration) {
        /* ---- BURST PHASE ---- */
        const p = elapsed / burstDuration;
        const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
        progress.current = ease;

        // Sphere pulses large then shrinks
        if (sphereRef.current) {
          const scaleUp = 1 + ease * 0.6;
          sphereRef.current.scale.setScalar(scaleUp);
          // Fast spin
          sphereRef.current.rotation.y = t * 0.1 + ease * Math.PI * 4;
          sphereRef.current.rotation.x = ease * Math.PI * 2;
        }

        // Rings scatter outward
        if (ringsRef.current) {
          ringsRef.current.children.forEach((child, i) => {
            const scatter = ease * (3 + i * 1.5);
            const dir = new THREE.Vector3(
              Math.sin(i * 2.1) * scatter,
              Math.cos(i * 1.7) * scatter,
              Math.sin(i * 3.3) * scatter * 0.5
            );
            child.position.copy(dir);
            child.rotation.x += 0.15;
            child.rotation.z += 0.1;
          });
          ringsRef.current.rotation.y = t * 0.2 + ease * Math.PI * 3;
          ringsRef.current.rotation.x = t * 0.1 + ease * Math.PI;
        }

        // Glow flash
        if (glowRef.current) {
          const flashScale = ease * 8;
          glowRef.current.scale.setScalar(flashScale);
          (glowRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - ease) * 0.6;
        }

      } else if (elapsed < burstDuration + reformDuration) {
        /* ---- REFORM PHASE ---- */
        const reformElapsed = elapsed - burstDuration;
        const p = reformElapsed / reformDuration;
        const ease = p * p * (3 - 2 * p); // smoothstep

        // Sphere shrinks back
        if (sphereRef.current) {
          const scale = 1.6 - ease * 0.6;
          sphereRef.current.scale.setScalar(scale);
          sphereRef.current.rotation.y = t * 0.1;
          sphereRef.current.rotation.x = (1 - ease) * Math.PI * 2;
        }

        // Rings return to origin
        if (ringsRef.current) {
          ringsRef.current.children.forEach((child, i) => {
            child.position.lerp(new THREE.Vector3(0, 0, 0), ease * 0.15);
            const orig = ringOriginals.current[i];
            if (orig) {
              child.rotation.x += (orig.x - child.rotation.x) * ease * 0.1;
              child.rotation.y += (orig.y - child.rotation.y) * ease * 0.1;
              child.rotation.z += (orig.z - child.rotation.z) * ease * 0.1;
            }
          });
          ringsRef.current.rotation.y = t * 0.2;
          ringsRef.current.rotation.x = t * 0.1;
          ringsRef.current.rotation.z = t * 0.05;
        }

        // Glow fades out
        if (glowRef.current) {
          glowRef.current.scale.setScalar((1 - ease) * 8);
          (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        }

      } else {
        /* ---- Animation complete ---- */
        wasActivated.current = false;
        progress.current = 0;

        // Reset ring positions
        if (ringsRef.current) {
          ringsRef.current.children.forEach((child) => {
            child.position.set(0, 0, 0);
          });
        }
      }

    } else {
      /* ---- Normal idle animation ---- */
      if (ringsRef.current) {
        ringsRef.current.rotation.y = t * 0.2;
        ringsRef.current.rotation.x = t * 0.1;
        ringsRef.current.rotation.z = t * 0.05;
      }
      if (sphereRef.current) {
        sphereRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
        sphereRef.current.rotation.y = t * 0.1;
      }
      if (glowRef.current) {
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        glowRef.current.scale.setScalar(0);
      }
    }
  });

  return (
    <group>
      {/* Central Glossy Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={sphereRef} args={[1.5, 64, 64]}>
          <MeshTransmissionMaterial 
            backside
            samples={4}
            resolution={512}
            thickness={2}
            chromaticAberration={0.025}
            anisotropy={0.1}
            distortion={0.3}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#C4EF17"
            transmission={0.9}
            roughness={0.1}
            metalness={0.2}
          />
        </Sphere>
      </Float>

      {/* Burst glow flash (invisible until activated) */}
      <Sphere ref={glowRef} args={[1, 32, 32]}>
        <meshBasicMaterial color="#C4EF17" transparent opacity={0} side={THREE.BackSide} />
      </Sphere>

      {/* Orbiting Rings */}
      <group ref={ringsRef}>
        <Torus args={[2.8, 0.05, 32, 100]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial color="#C4EF17" metalness={0.9} roughness={0.1} />
        </Torus>
        <Torus args={[3.4, 0.03, 32, 100]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <meshStandardMaterial color="#C4EF17" opacity={0.6} transparent metalness={0.8} roughness={0.2} />
        </Torus>
        <Torus args={[4.0, 0.08, 32, 100]} rotation={[0, Math.PI / 2, Math.PI / 6]}>
          <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.1} />
        </Torus>
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/*  Loading tracker & Fallback                                        */
/* ------------------------------------------------------------------ */

const SceneTracker = ({ onReady }: { onReady: () => void }) => {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
};

const SphereFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#C4EF17]/20 blur-[60px] animate-pulse" />
    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border border-[#C4EF17]/30 absolute animate-pulse shadow-[0_0_50px_rgba(196,239,23,0.2)]" />
    <div className="w-40 h-40 md:w-64 md:h-64 rounded-full border border-[#C4EF17]/10 absolute rotate-45" />
    <div className="w-48 h-48 md:w-80 md:h-80 rounded-full border border-white/5 absolute -rotate-12" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  DOM wrapper — handles hover dwell detection + shockwave overlay    */
/* ------------------------------------------------------------------ */

export const EmeraldSphere3D = () => {
  const [isReady, setIsReady] = useState(false);
  const [activated, setActivated] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    dwellTimer.current = setTimeout(() => {
      setActivated(true);
      setShockwave(true);
      // Reset activation flag after the full animation cycle
      setTimeout(() => setActivated(false), 2800);
      // Remove shockwave ring after it expands
      setTimeout(() => setShockwave(false), 1200);
    }, 3000); // 3-second dwell
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (dwellTimer.current) {
      clearTimeout(dwellTimer.current);
      dwellTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (dwellTimer.current) clearTimeout(dwellTimer.current);
    };
  }, []);

  return (
    <div
      className="w-full h-full absolute inset-0 z-0"
      style={{ pointerEvents: 'auto' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fallback visible while loading */}
      {!isReady && <SphereFallback />}

      {/* Shockwave ring overlay */}
      {shockwave && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="rounded-full border-2 border-accent/60"
            style={{
              animation: 'shockwave 1.2s ease-out forwards',
              width: 10,
              height: 10,
              boxShadow: '0 0 40px rgba(196, 239, 23, 0.5), 0 0 80px rgba(196, 239, 23, 0.2)',
            }}
          />
        </div>
      )}

      {/* Bright flash overlay */}
      {activated && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="rounded-full bg-accent/20"
            style={{
              animation: 'flashPulse 0.6s ease-out forwards',
              width: 100,
              height: 100,
              filter: 'blur(40px)',
            }}
          />
        </div>
      )}

      <div className={`w-full h-full transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 45 }}
          dpr={[1, 2]}
          gl={{ 
            powerPreference: 'high-performance', 
            antialias: true, 
            stencil: false, 
            depth: true, 
            alpha: true,
            preserveDrawingBuffer: false
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={3} color="#C4EF17" />
            <directionalLight position={[-10, -10, -5]} intensity={2} color="#ffffff" />
            <Environment preset="city" />
            <SphereWithRings activated={activated} />
            <SceneTracker onReady={() => setIsReady(true)} />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes shockwave {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
            border-width: 3px;
          }
          100% {
            width: 600px;
            height: 600px;
            opacity: 0;
            border-width: 1px;
          }
        }
        @keyframes flashPulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
