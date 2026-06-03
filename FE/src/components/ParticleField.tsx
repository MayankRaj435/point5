import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  count?: number;
  color?: string;
  className?: string;
}

export const ParticleField = ({ count = 40, color = '#C4EF17', className = '' }: ParticleFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frameCount = 0;
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
    const finalCount = count || (isMobile ? 15 : 40);

    // Init particles
    particles.current = Array.from({ length: finalCount }, () => createParticle(canvas.width, canvas.height));

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      
      // On mobile, skip every other frame to halve the frame rate
      if (isMobile) {
        frameCount++;
        if (frameCount % 2 === 0) return;
      }

      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0 || p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
          particles.current[i] = createParticle(canvas.width, canvas.height);
          return;
        }

        const lifeRatio = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity * lifeRatio;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

function createParticle(w: number, h: number): Particle {
  const maxLife = 200 + Math.random() * 300;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
    life: maxLife,
    maxLife,
  };
}
