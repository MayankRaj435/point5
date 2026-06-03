"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
  automatic = false,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  // Auto-animate: slowly move the reveal mask in a loop
  useEffect(() => {
    if (!automatic) return;
    
    let frame: number;
    let t = 0;
    let isVisible = false;

    const animate = () => {
      if (!isVisible) return; // Skip updating if not visible
      t += 0.005;
      const cx = 50 + 30 * Math.cos(t);
      const cy = 50 + 30 * Math.sin(t * 0.7);
      setMaskPosition({ cx: `${cx}%`, cy: `${cy}%` });
      frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        isVisible = true;
        setHovered(true);
        frame = requestAnimationFrame(animate);
      } else {
        isVisible = false;
        if (frame) cancelAnimationFrame(frame);
      }
    });

    if (svgRef.current) observer.observe(svgRef.current);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [automatic]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${text.length * 90} 100`}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!automatic) setHovered(false); }}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#C4EF17" />
              <stop offset="25%" stopColor="#a3e635" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="75%" stopColor="#C4EF17" />
              <stop offset="100%" stopColor="#86efac" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Ghost outline text on hover */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        className="fill-transparent stroke-neutral-600 font-[helvetica] text-[72px] font-bold"
        style={{ opacity: hovered ? 1 : 0.4 }}
      >
        {text}
      </text>

      {/* Animated stroke draw */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        className="fill-transparent stroke-neutral-500 font-[helvetica] text-[72px] font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* Gradient reveal text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.8"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-[72px] font-bold"
      >
        {text}
      </text>
    </svg>
  );
};
