"use client";

import React from "react";
import { motion } from "framer-motion";

export const TechBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 bg-black overflow-hidden pointer-events-none">
      {/* 1. Main Static Library Image - High-End Warm Treatment */}
      <div 
        className="absolute inset-0 opacity-[0.45] bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/images/hero-bg.png")',
          filter: 'brightness(0.5) blur(3px) contrast(1.1) saturate(1.1)'
        }}
      />
      
      {/* 2. Premium Amber & Blue Glows (Atmospheric depth) */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-1/4 w-[70vw] h-[70vw] bg-amber-500/10 rounded-full blur-[120px]"
      />
      
      <motion.div
        animate={{
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[120px]"
      />

      {/* 3. Professional Grade Overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black" />
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 20%, black 100%) opacity-70" />

      {/* 4. Luxury Grain Texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
};
