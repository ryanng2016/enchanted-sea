"use client";

import { useEffect, useRef, useState } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function SoftRippleCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 }); // smoothed ring position
  const raf = useRef<number | null>(null);

  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Detect desktop mouse-like pointers
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onDown = (e: MouseEvent) => {
      setIsDown(true);
      // Add ripple
      const id = Date.now() + Math.random();
      const x = e.clientX;
      const y = e.clientY;
      setRipples((prev) => [...prev, { id: id as number, x, y }]);

      // Auto-remove ripple after animation duration
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
    };

    const onUp = () => setIsDown(false);

    // Hover detection for interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, summary, [data-cursor="interactive"]'
      );
      setIsHoveringInteractive(!!interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    // Smooth follow loop for the ring
    const tick = () => {
      // Ease factor: lower = more floaty
      const ease = 0.16;

      pos.current.x += (mouse.current.x - pos.current.x) * ease;
      pos.current.y += (mouse.current.y - pos.current.y) * ease;

      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    // Start centered so it doesn't jump from (0,0)
    mouse.current.x = window.innerWidth / 2;
    mouse.current.y = window.innerHeight / 2;
    pos.current.x = mouse.current.x;
    pos.current.y = mouse.current.y;

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

// Size / feel tuning
const ringSize = 18; // fixed size
const ringScale = isDown ? 0.92 : 1; // optional subtle press effect

  return (
    <>
      {/* Ring (smooth follow) */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: ringSize,
          height: ringSize,
          borderRadius: 9999,
          border: "1px solid rgba(236, 72, 153, 0.5)",
          transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${ringScale})`,
          transition: "width 160ms ease, height 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
        }}
      />

      {/* Center dot (snappy) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 5,
          height: 5,
          borderRadius: 9999,
background: "rgba(236, 72, 153, 0.95)",
        }}
      />

      {/* Click ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: r.x,
            top: r.y,
            width: 10,
            height: 10,
            borderRadius: 9999,
border: "1px solid rgba(236, 72, 153, 0.55)",
boxShadow: "0 0 18px rgba(236, 72, 153, 0.25)",
            animation: "softRipple 650ms ease-out forwards",
          }}
        />
      ))}

      
    </>
  );
}