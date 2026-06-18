"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkle: number;
};

type ParticleFieldProps = {
  density?: number;
};

export default function ParticleField({ density = 1 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const createParticles = () => {
      const mobileFactor = width < 768 ? 0.45 : 1;
      const count =
        Math.floor((width * height) / 18000) * density * mobileFactor;
      particles = Array.from({ length: Math.min(count, 80) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -(Math.random() * 0.35 + 0.08),
        opacity: Math.random() * 0.55 + 0.15,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
      createParticles();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.twinkle += 0.015;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const flicker = 0.55 + Math.sin(p.twinkle + time * 0.001) * 0.45;
        const alpha = p.opacity * flicker;

        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 2.5,
        );
        gradient.addColorStop(0, `rgba(255, 220, 130, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 180, 60, ${alpha * 0.5})`);
        gradient.addColorStop(1, "rgba(255, 180, 60, 0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
