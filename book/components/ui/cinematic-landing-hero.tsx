"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS (Restored 3D Depth)
  ---------------------------------------------------------------------- */
  
  /* OUTSIDE THE CARD: Theme-aware text (Shadow in Light Mode, Glow in Dark Mode) */
  .text-3d-matte {
      color: #FFFFFF;
      text-shadow: 
          0 10px 40px rgba(255, 255, 255, 0.15), 
          0 2px 4px rgba(255, 255, 255, 0.1);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #D1D1D6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 10px 30px rgba(255, 255, 255, 0.2));
  }

  /* INSIDE THE CARD: Hardcoded Silver/White for the dark background, deep rich shadows */
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) 
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  /* Deep Physical Card with Dynamic Mouse Lighting - Now Pitch Black */
  .premium-depth-card {
      background: linear-gradient(145deg, #0A0A0A 0%, #000000 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 1),
          0 20px 40px -20px rgba(0, 0, 0, 0.9),
          inset 0 1px 2px rgba(255, 255, 255, 0.05),
          inset 0 -2px 4px rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Realistic iPhone Mockup Hardware */
  .iphone-bezel {
      background-color: #111;
      box-shadow: 
          inset 0 0 0 2px #52525B, 
          inset 0 0 0 7px #000, 
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: 
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%);
      color: #000000;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,1);
      position: relative; overflow: hidden;
  }
  .btn-modern-light::after {
      content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
      transform: translateX(-100%); transition: transform 0.6s ease;
  }
  .btn-modern-light:hover::after { transform: translateX(100%); }
  
  .btn-modern-light:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.2), 0 8px 20px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,1);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #1A1A1A 0%, #000000 100%);
      color: #FFFFFF;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05);
  }
  .btn-modern-dark:hover {
      transform: translateY(-2px);
      background: #222222;
      box-shadow: 0 8px 20px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.1);
  }

  .scroll-indicator {
      animation: bounce 2s infinite;
  }
  @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-10px);}
      60% {transform: translateY(-5px);}
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeadingLeft?: string;
  cardDescriptionLeft?: React.ReactNode;
  cardHeadingRight?: string;
  cardDescriptionRight?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({
  brandName = "BookBuddy",
  tagline1 = "Local Readers,",
  tagline2 = "Centralized Platform.",
  cardHeadingLeft = "Secure Infrastructure",
  cardDescriptionLeft = "Built on AWS EC2 and DynamoDB with IAM-secured cloud endpoints.",
  cardHeadingRight = "Smart Management",
  cardDescriptionRight = "Real-time order tracking and SNS-powered community notifications.",
  metricValue = 12500,
  metricLabel = "Books Cataloged",
  ctaHeading = "E-commerce Platform",
  ctaDescription = "Join thousands of students and local readers. Browse, manage, and order your favorite books through our secure AWS-hosted platform.",
  className,
  ...props
}: CinematicHeroProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // 1. High-Performance Mouse Interaction Logic (Using requestAnimationFrame)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Complex Cinematic Scroll Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 4.0 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        .to({}, { duration: 2.0 })
        // Responsive card pullback sizing
        .to(".main-card", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          ease: "expo.inOut",
          duration: 1.8
        }, "pullback")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center text-white font-inter antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-20" aria-hidden="true" />

      {/* BACKGROUND LAYER: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d">
        <h1 className="text-track gsap-reveal text-3d-matte text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-4">
          {tagline1}
        </h1>
        <p className="text-days gsap-reveal text-white/70 text-xl md:text-2xl lg:text-3xl font-medium tracking-tight max-w-2xl">
          {tagline2}
        </p>
        {/* Scroll Down Indicator */}
        <div className="scroll-indicator mt-12 text-white/30 flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* BACKGROUND LAYER 2: Tactile CTA Buttons */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform pt-24 md:pt-32">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {ctaHeading}
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/browse" className="btn-modern-light flex items-center justify-center gap-3 px-10 py-5 rounded-[1.25rem] group focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2">
            <span className="text-xl font-black uppercase tracking-widest">Start Browsing</span>
            <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link href="/orders" className="btn-modern-dark flex items-center justify-center gap-3 px-10 py-5 rounded-[1.25rem] group focus:outline-none border border-white/10">
            <span className="text-xl font-black uppercase tracking-widest">View Orders</span>
          </Link>
        </div>
      </div>

      {/* FOREGROUND LAYER: The Physical Deep Blue Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* DYNAMIC RESPONSIVE GRID: Refined for better organization and spacing */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 items-center z-10 py-12 lg:py-0 gap-y-12 lg:gap-y-0">

            {/* 1. LEFT: FEATURE TEXT - Positioned at Bottom Left of phone */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="card-left-text gsap-reveal col-span-1 lg:col-span-3 flex flex-col justify-end pb-20 text-center lg:text-left z-20 order-2 lg:order-1 lg:translate-x-[22rem] lg:translate-y-32"
            >
              <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-black mb-4 lg:mb-6 tracking-tighter leading-tight font-mono">
                {cardHeadingLeft}
              </h3>
              <p className="hidden md:block text-neutral-400 text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 font-mono opacity-80">
                {cardDescriptionLeft}
              </p>
            </motion.div>

            {/* 2. CENTER: IPHONE MOCKUP */}
            <div className="mockup-scroll-wrapper col-span-1 lg:col-span-6 relative h-[400px] lg:h-[650px] flex items-center justify-center z-10 order-1 lg:order-2 mb-8 lg:mb-0 lg:-translate-x-16" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.75] md:scale-90 lg:scale-100">
                {/* iPhone Bezel Content remains same as previous but cleaner positioning */}
                <motion.div
                  ref={mockupRef}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  {/* Internal Phone UI - keeping it the same as before */}
                  <div className="absolute top-[120px] left-[-3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] left-[-3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] left-[-3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] right-[-3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  <div className="absolute inset-[7px] bg-black rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)] text-white z-10 border border-white/5">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

                    <div className="relative w-full h-full pt-16 px-6 pb-8 flex flex-col">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-black mb-1">Explore</span>
                        <span className="text-2xl font-black tracking-tighter text-white">Library</span>
                      </div>

                      <div className="phone-widget relative w-40 h-40 mx-auto flex items-center justify-center mb-6">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-28 h-36 bg-linear-to-br from-neutral-800 to-black rounded-lg shadow-2xl border border-white/10 flex flex-col items-center justify-center p-4 group overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 to-transparent opacity-50" />
                            <svg className="w-10 h-10 text-white/50 mb-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-auto relative z-10">
                              <div className="w-[85%] h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                            </div>
                            <span className="text-[8px] text-white/40 font-black mt-1 uppercase tracking-[0.15em] relative z-10">85% Complete</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="phone-widget widget-depth rounded-2xl p-4 flex items-center border border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4 border border-white/10">
                            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                            <div className="h-1.5 w-16 bg-white/5 rounded-full" />
                          </div>
                        </div>

                        <div className="phone-widget widget-depth rounded-2xl p-4 flex items-center border border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4 border border-white/10">
                            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-20 bg-white/20 rounded-full mb-2" />
                            <div className="h-1.5 w-24 bg-white/5 rounded-full" />
                          </div>
                        </div>

                        <div className="phone-widget widget-depth rounded-2xl p-4 flex items-center border border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4 border border-white/10">
                            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-16 bg-white/20 rounded-full mb-2" />
                            <div className="h-1.5 w-12 bg-white/5 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Glass Badges - Closer to phone */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="floating-badge absolute top-12 -left-8 md:-left-12 floating-ui-badge rounded-2xl p-4 flex items-center gap-4 z-30 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-black tracking-tight">Shipped</p>
                    <p className="text-white/40 text-xs font-bold">Arriving Today</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="floating-badge absolute bottom-24 md:bottom-32 -right-4 md:-right-6 floating-ui-badge rounded-2xl p-4 flex items-center gap-4 z-30 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-black tracking-tight">Bestseller</p>
                    <p className="text-white/40 text-xs font-bold">Cloud Computing</p>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* 3. RIGHT: FEATURE TEXT - Positioned at Top Right of phone */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="card-right-text gsap-reveal col-span-1 lg:col-span-3 flex flex-col justify-start pt-20 text-center lg:text-left z-20 order-3 lg:pl-0 lg:-translate-x-[46rem] lg:-translate-y-16"
            >
              <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-black mb-4 lg:mb-6 tracking-tighter leading-tight font-mono">
                {cardHeadingRight}
              </h3>
              <p className="hidden md:block text-neutral-400 text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 font-mono opacity-80">
                {cardDescriptionRight}
              </p>

              {/* INTERACTIVE GIFT: App Version Status */}
              <div className="group relative w-fit mx-auto lg:mx-0 mt-12">
                <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div className="max-w-0 overflow-hidden group-hover:max-w-[350px] transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                    <div className="pl-2 pr-6 whitespace-nowrap">
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Surprise!</p>
                      <p className="text-white text-sm font-bold">App Version Under Development</p>
                    </div>
                  </div>
                </div>
                {/* Subtle indicator for the invisible gift */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping group-hover:hidden" />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}