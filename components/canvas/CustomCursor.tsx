'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CustomCursorProps {
  isHoveringPhoto: boolean;
  isFocused: boolean;
}

export default function CustomCursor({ isHoveringPhoto, isFocused }: CustomCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible || isFocused) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: isHoveringPhoto ? 1.6 : 0,
          opacity: isHoveringPhoto ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-16 h-16 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-white/90 font-medium pl-0.5">
          View
        </span>
      </motion.div>
    </motion.div>
  );
}
