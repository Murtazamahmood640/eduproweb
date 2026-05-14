'use client';

import React, { useEffect, useRef } from 'react';

export const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktopRef = useRef(typeof window !== 'undefined' && window.innerWidth >= 768);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isDesktopRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 30;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    class Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      targetOpacity: number;

      constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.08;
        this.targetOpacity = Math.random() * 0.05 + 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;

        // Smooth opacity animation
        this.opacity += (this.targetOpacity - this.opacity) * 0.02;
        if (Math.abs(this.opacity - this.targetOpacity) < 0.01) {
          this.targetOpacity = Math.random() * 0.05 + 0.02;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = `rgba(100, 150, 220, ${this.opacity * 0.15})`;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      // Draw connecting lines - Much lighter
      particles.forEach((p1) => {
        particles.forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(0, 35, 102, ${(1 - distance / 150) * 0.03})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ background: 'transparent', zIndex: -50 }}
    />
  );
};
